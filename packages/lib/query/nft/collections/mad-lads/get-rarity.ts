import { baseApiInstance } from "../../../../api";
import { CollectionMintDocument } from "../../../../database";

/**
 * Get the rarity of a Mad Lads NFT from backend
 */
export const getMadLadsRarities = async (mintAddressList: string[]) =>
  baseApiInstance.get<{ collection: CollectionMintDocument[] }>(
    "/nft/collections/mad-lads/rarity",
    {
      params: {
        mint: mintAddressList,
      },
    }
  );
