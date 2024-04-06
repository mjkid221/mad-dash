import { Text, Flex, Image } from "@chakra-ui/react";
import { getCollectionInfoByUser } from "@mad-land/lib/helpers/server-side-props";
import { StandardPageContainer } from "@mad-land/ui";
import { JsonMetadata } from "@metaplex-foundation/js";
import { InferGetServerSidePropsType } from "next";
import { useEffect } from "react";

// TODO: Fix
const Staking = ({
  userNfts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    console.log("userNfts: ", userNfts);
  }, [userNfts]);
  return (
    <StandardPageContainer px="36px">
      <Flex gap="8px">
        {userNfts?.map((nft) => (
          <Flex
            justifyContent="center"
            padding="8px 12px"
            gap="12px"
            flexDir="column"
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s ease-in-out"
          >
            <Image
              key={nft.address.toString()}
              src={(nft as JsonMetadata).image}
              alt={nft.name}
              borderRadius="8px"
            />
            <Text width="100%" textAlign="center" fontWeight="700">
              {nft.name.split("#")[1]}
            </Text>
          </Flex>
        ))}
      </Flex>
    </StandardPageContainer>
  );
};
export const getServerSideProps = getCollectionInfoByUser;

export default Staking;
