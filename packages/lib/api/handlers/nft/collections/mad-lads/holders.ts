import { PipelineStage } from "mongoose";

import {
  CollectionHolderDocument,
  NftCollectionClassName,
} from "../../../../../database";
import { CollectionHolderModel } from "../../../../../database/models";
import { SupportedCollection } from "../../../../../types";

/**
 * Aggregate Mad Lads holders data in descending order of quantity.
 */
export const aggregateMadLadsHoldersData = async ({
  userAddress,
}: {
  userAddress?: string;
}) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: NftCollectionClassName,
        localField: "collectionRef",
        foreignField: "_id",
        as: "collectionDetails",
      },
    },
    { $unwind: "$collectionDetails" },
    {
      $match: {
        "collectionDetails.collectionType": SupportedCollection.MadLads,
      },
    },
    {
      $addFields: {
        isUserHolder: {
          $cond: {
            if: { $eq: ["$userAddress", userAddress] },
            then: true,
            else: false,
          },
        },
      },
    },
    { $sort: { isUserHolder: -1, quantity: -1 } },
  ];

  return (
    ((await CollectionHolderModel.aggregate(
      pipeline
    )) as CollectionHolderDocument[]) ?? []
  );
};

/**
 * Get the snapshot date of the Mad Lads holders
 */
export const getSnapshotDate = async () => {
  const madLadsHolders = await CollectionHolderModel.findOne()
    .sort({
      updatedAt: -1,
    })
    .lean();
  return madLadsHolders?.updatedAt;
};
