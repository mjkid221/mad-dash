import { Metadata, Nft, Sft } from "@metaplex-foundation/js";

export type StandardNftType = (Metadata | Nft | Sft) & { rank?: number };

export type FindNftsByOwnerOutputV2 = StandardNftType[];
