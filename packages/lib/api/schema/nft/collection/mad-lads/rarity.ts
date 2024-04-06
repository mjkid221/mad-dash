import { z } from "zod";

export const madLadsCollectionRarityRequestSchema = z.object({
  /**
   * The mint address of tokens
   */
  mint: z.coerce.string().array(),
});

export type MadLadsCollectionRarityRequest = z.infer<
  typeof madLadsCollectionRarityRequestSchema
>;
