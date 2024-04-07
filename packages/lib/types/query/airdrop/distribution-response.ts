/**
 * Represents the result of calculating airdrop distribution for token holders.
 * Refer `lib/query/airdrop/compute-distribution.ts`
 * @typedef {Object} AirdropDistributionResult
 * @property {number} totalHolders - The total number of holders eligible for the airdrop.
 * @property {number} totalHeld - The total quantity of tokens held by all eligible holders.
 * @property {Object[]} distributionData - An array containing the distribution details for each holder.
 * @property {string} distributionData[].userAddress - The blockchain address of the token holder.
 * @property {number} distributionData[].quantity - The quantity of tokens held by the holder.
 * @property {number} distributionData[].distribution - The quantity of airdrop tokens to be distributed to the holder.
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
