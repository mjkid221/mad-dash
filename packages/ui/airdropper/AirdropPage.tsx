import { Flex } from "@chakra-ui/react";
import { GetCollectionHoldersQuery } from "@mad-dash/lib";
import { CollectionHolderSspType } from "@mad-dash/lib/helpers/server-side-props/";

import { AirdropTokenSelectorCard } from "./AirdropTokenSelectorCard";
import { HolderSnapshotCardComponent } from "./HolderSnapshotCard";

export const AirdropPage = (
  props: CollectionHolderSspType & GetCollectionHoldersQuery
) => (
  <Flex
    width="100%"
    height="100%"
    justifyContent="space-between"
    p="16px"
    gap="8px"
  >
    <AirdropTokenSelectorCard {...props} />
    <HolderSnapshotCardComponent {...props} />
  </Flex>
);
