import { z } from "zod";

export const airdropDistributionQuerySchema = z.object({
  distributionAmount: z.coerce.number(),
  tokenMintAddress: z.string(),
  isWeighted: z.boolean().default(false),
});

export type AirdropDistributionQueryType = z.infer<
  typeof airdropDistributionQuerySchema
>;
