import {
  MAD_LADS_COLLECTION_ADDRESS,
  ShyftService,
  NotFound,
  UnableToImportCollectionSnapshot,
  apiHandler,
  SupportedCollection,
} from "@mad-land/lib";
import {
  CollectionHolderModel,
  NftCollectionModel,
} from "@mad-land/lib/database/models";
import { database, cors, secretKeyAuth } from "@mad-land/lib/middleware";
import mongoose from "mongoose";
import { NextApiHandler } from "next";

const importMadLadsHolderSnapshot: NextApiHandler = async (req, res) => {
  const session = await mongoose.startSession();

  const madLadsHolders = await ShyftService.getNftHoldersByCollection({
    collectionAddress: MAD_LADS_COLLECTION_ADDRESS,
  });

  if (madLadsHolders.length === 0) {
    throw NotFound;
  }

  session.startTransaction();
  try {
    const collection = await NftCollectionModel.findOne({
      collectionType: SupportedCollection.MadLads,
    }).session(session);

    if (!collection) {
      throw NotFound;
    }

    // Re-import the holders snapshot
    await CollectionHolderModel.deleteMany(
      {
        collectionRef: collection._id,
      },
      { session }
    );
    await CollectionHolderModel.insertMany(
      madLadsHolders.map((i) => ({
        ...i,
        collectionRef: collection._id,
      })),
      {
        session,
      }
    );

    await session.commitTransaction();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    throw UnableToImportCollectionSnapshot;
  } finally {
    session.endSession();
  }
};
export default apiHandler()
  .all(cors)
  .use(database, secretKeyAuth)
  .get(importMadLadsHolderSnapshot);
