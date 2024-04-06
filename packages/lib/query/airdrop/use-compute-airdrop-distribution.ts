import { useQuery } from "@tanstack/react-query";

import { AirdropDistributionQueryType } from "../../api";
import {
  AirdropDistributionResult,
  GetCollectionHoldersQuery,
} from "../../types";

type AirdropDistributionParams = Pick<GetCollectionHoldersQuery, "data"> &
  Omit<AirdropDistributionQueryType, "tokenMintAddress">;

export const computeAirdropDistribution = async ({
  data: holdersData,
  distributionAmount,
  isWeighted,
}: AirdropDistributionParams): Promise<AirdropDistributionResult> => {
  const totalHolders = holdersData.length;
  const totalHeld = holdersData.reduce(
    (acc, holder) => acc + holder.quantity,
    0
  );

  let distributionData;

  if (isWeighted) {
    // Weighted distribution: Distribution amount is scaled by the quantity of NFTs each holder owns
    distributionData = holdersData.map((holder) => {
      const holderProportion = holder.quantity / totalHeld;
      const holderDistribution = distributionAmount * holderProportion;
      return {
        ...holder,
        distribution: Math.floor(holderDistribution),
      };
    });
  } else {
    // Equal distribution: Each holder receives an equal share of the distribution amount
    const equalDistribution = distributionAmount / totalHolders;
    distributionData = holdersData.map((holder) => ({
      ...holder,
      distribution: Math.floor(equalDistribution),
    }));
  }

  return {
    totalHolders,
    totalHeld,
    distributionData,
  };
};

export const useComputeAirdropDistribution = (
  params: AirdropDistributionParams
) => {
  const { data, ...queryResponse } = useQuery({
    queryKey: [GetAirdropDistributionQueryKey, params],
    queryFn: () => computeAirdropDistribution(params),
  });

  return {
    data,
    ...queryResponse,
  };
};

export const GetAirdropDistributionQueryKey =
  "get-airdrop-distribution-query-key";
