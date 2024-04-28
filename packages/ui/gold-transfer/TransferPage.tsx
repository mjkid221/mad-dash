import { Flex, IconButton } from "@chakra-ui/react";
import { MadLadsNft } from "@mad-land/lib";
import { AiOutlineSwapRight } from "react-icons/ai";

import { TransferCardSection } from "./TransferCardSection";

export const TransferPage = ({ userNfts }: { userNfts: MadLadsNft[] }) => (
  <Flex
    width="100%"
    height="100%"
    justifyContent="space-between"
    p="16px"
    gap="8px"
  >
    <TransferCardSection userNfts={userNfts} isInput />
    <IconButton
      icon={<AiOutlineSwapRight />}
      aria-label="transfer-gold"
      height="100%"
      borderRadius="8px"
    />
    <TransferCardSection userNfts={userNfts} />
  </Flex>
);
