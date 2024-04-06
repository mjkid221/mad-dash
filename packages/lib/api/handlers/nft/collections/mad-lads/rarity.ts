import { CollectionMintDocument } from "../../../../../database/classes/collection-mint-class";
import { CollectionMintModel } from "../../../../../database/models";
import { SupportedCollection } from "../../../../../types";
import { MadLadsCollectionRarityRequest } from "../../../../schema/nft/collection/mad-lads";

export const aggregateMadLadsCollectionData = async ({
  mint,
}: MadLadsCollectionRarityRequest) =>
  (await CollectionMintModel.find({
    mint,
  })
    .populate({
      path: "collectionRef",
      match: {
        collectionType: SupportedCollection.MadLads,
      },
    })
    .select({ collectionRef: 0 })
    .lean()) as CollectionMintDocument[];
