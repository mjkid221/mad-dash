/**
 * Airdrop distribution response
 * refer `lib/query/airdrop/compute-distribution.ts`
 */
export type AirdropDistributionResult = {
  totalHolders: number;
  totalHeld: number;
  distributionData: {
    userAddress: string;
    quantity: number;
    distribution: number;
  }[];
};
