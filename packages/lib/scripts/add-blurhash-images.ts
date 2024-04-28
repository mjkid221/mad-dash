import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import { DatabaseURIMissing } from "../api";
import { CollectionMintModel, NftCollectionModel } from "../database/models";
import { SupportedCollection } from "../types";
import { encodeImageToBlurhash } from "../utils/blurhash";

configDotenv();

// Make sure MONGODB_URI is set in ENV
const MONGODB_URI = process.env.MONGODB_URI as string;

/**
 * Connects to mongo db
 */
const connect = async () => {
  if (!MONGODB_URI) {
    throw DatabaseURIMissing;
  }
  return mongoose.connect(MONGODB_URI);
};

/**
 * Populates the mad lads image blurhash
 */
const main = async () => {
  await connect();

  try {
    const collection = await NftCollectionModel.findOne({
      collectionType: SupportedCollection.MadLads,
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    const itemsWithoutHash = await CollectionMintModel.find({
      collectionRef: collection._id,
      imageBlurhash: { $exists: false },
    });

    // eslint-disable-next-line no-restricted-syntax -- allow
    for (const item of itemsWithoutHash) {
      const { image, id } = item;
      console.log("Hashing: ", id);
      // eslint-disable-next-line no-await-in-loop -- allow
      const imageBlurhash = await encodeImageToBlurhash(image);

      console.log("imageBlurhash: ", imageBlurhash);
      // eslint-disable-next-line no-param-reassign -- allow
      item.imageBlurhash = imageBlurhash;
      item.save();
    }

    console.log("Hashing complete");
  } catch (error) {
    console.log("Error during hashing", error);
  }
  process.exit(0);
};

main();
