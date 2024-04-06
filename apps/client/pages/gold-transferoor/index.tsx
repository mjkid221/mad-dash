import { Text } from "@chakra-ui/react";
import { getCollectionInfoByUser } from "@mad-land/lib/helpers/server-side-props";
import { StandardPageContainer, TransferCardSection } from "@mad-land/ui";
import { InferGetServerSidePropsType } from "next";
import { useEffect } from "react";

const GoldTransfer = ({
  userNfts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    console.log("userNfts: ", userNfts);
  }, [userNfts]);
  return (
    <StandardPageContainer px="36px">
      <Text>Transfer</Text>
      <TransferCardSection userNfts={userNfts} />
    </StandardPageContainer>
  );
};

export const getServerSideProps = getCollectionInfoByUser;

export default GoldTransfer;
