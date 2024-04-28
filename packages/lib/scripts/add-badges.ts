import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import { DatabaseURIMissing } from "../api";
import { NftCollectionModel, CollectionMintModel } from "../database/models";
import { LadBadge, SupportedCollection } from "../types";

import { wormholeLads } from "./wormholeLads";

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
 * Adds the wormhole badges to the collection
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

    const itemsWithoutBadge = await CollectionMintModel.find({
      collectionRef: collection._id,
      badges: { $exists: false },
    });

    // eslint-disable-next-line no-restricted-syntax -- allow
    for (const item of itemsWithoutBadge) {
      const { mint } = item;

      if (wormholeLads.includes(mint)) {
        console.log("Updating : ", mint);

        if (!item.badges) {
          item.badges = [];
        }
        item.badges?.push(LadBadge.Wormhole);
        // eslint-disable-next-line no-await-in-loop -- allow
        await item.save();
      }
    }

    console.log("Complete");
  } catch (error) {
    console.log("Error: ", error);
  }
  process.exit(0);
};

main();
