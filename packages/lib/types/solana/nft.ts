import { Metadata, Nft, Sft } from "@metaplex-foundation/js";

import { LadBadge } from "../collection";

export type StandardNftType = (Metadata | Nft | Sft) & {
  rank?: number;
  imageBlurhash?: string;
};

export type FindNftsByOwnerOutputV2 = StandardNftType[];

export type MadLadsNft = StandardNftType & {
  goldPoints?: number;
  isStaked?: boolean;
  badges?: LadBadge[];
};
