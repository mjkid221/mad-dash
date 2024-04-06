import { FlexProps, Flex, Text } from "@chakra-ui/react";
import {
  GetCollectionHoldersQuery,
  exportData,
  formatDateForUI,
  generateBlockExplorerLink,
} from "@mad-land/lib";
import { CollectionHolderSspType } from "@mad-land/lib/helpers/server-side-props";
import { useCallback, useEffect, useRef, useState } from "react";

import { StandardSkeleton } from "../components";
import { useSessionAddress } from "../hooks/use-session-address";

import { StandardContainer, StandardHeader } from "./shared";

export const HolderSnapshotCardComponent = ({
  lastSnapshotDate,
  userTokens,
  data: holdersData,
  ...queryResponse
}: CollectionHolderSspType & GetCollectionHoldersQuery) => {
  const { isLoading } = queryResponse;
  const { address } = useSessionAddress();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [skeletonCount, setSkeletonCount] = useState(0);

  const exportHolders = useCallback(() => {
    if (!holdersData) return;
    const formattedData = holdersData.map((holder) => ({
      userAddress: holder.userAddress,
      quantity: holder.quantity,
    }));
    exportData(formattedData, "holders.csv");
  }, [holdersData]);

  const hoverProps: FlexProps = {
    _hover: {
      bg: "rgb(255 255 255/0.1)",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    if (!parentRef.current) return;
    const parentHeight = parentRef.current.offsetHeight;
    const skeletonHeight = 37;
    const count = Math.floor((parentHeight - 100) / skeletonHeight);
    setSkeletonCount(count);
  }, [parentRef]);

  return (
    <StandardContainer justifyContent="space-between" ref={parentRef}>
      <Flex gap="8px" flexDir="column" width="100%" overflow="hidden">
        <Flex justifyContent="space-between">
          <StandardHeader>Holders</StandardHeader>
          <StandardHeader>
            {lastSnapshotDate
              ? formatDateForUI(new Date(lastSnapshotDate))
              : "N/A"}{" "}
            | Snapshot
          </StandardHeader>
          <StandardHeader>Quantity</StandardHeader>
        </Flex>
        <Flex flexDir="column" gap="8px" overflow="auto">
          {isLoading
            ? [...new Array(skeletonCount)].map((index) => (
                <StandardSkeleton key={index} minHeight="37px" />
              ))
            : holdersData?.map((holder) => {
                const isUserHolder = holder.userAddress === address;
                return (
                  <Flex
                    key={holder.userAddress}
                    flexDir="row"
                    bgColor={isUserHolder ? "red.500" : "rgb(24 1 1 / 0.5)"}
                    p="8px"
                    borderRadius="8px"
                    justifyContent="space-between"
                    onClick={() =>
                      window.open(
                        generateBlockExplorerLink(holder.userAddress),
                        "_blank"
                      )
                    }
                    {...hoverProps}
                  >
                    <Text isTruncated>{holder.userAddress}</Text>
                    <Text>{holder.quantity}</Text>
                  </Flex>
                );
              })}
        </Flex>
      </Flex>

      <Flex justifyContent="space-between" alignItems="flex-end">
        <Text>The snapshot is updated every day.</Text>
        <Flex onClick={exportHolders}>
          <StandardHeader border="1px #4e3e3e solid" {...hoverProps}>
            Export
          </StandardHeader>
        </Flex>
      </Flex>
    </StandardContainer>
  );
};
