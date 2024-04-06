import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import { DatabaseURIMissing, howRareApiInstance } from "../api";
import { HowRareCollectionResponse } from "../api/schema/how-rare";
import { CollectionMintModel, NftCollectionModel } from "../database/models";
import { SupportedCollection } from "../types";

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
 * Populates the mad lads information and rarity
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

    const { data } = await howRareApiInstance.get<HowRareCollectionResponse>(
      "madlads"
    );
    const { items } = data.result.data;

    // const items = baseItems.slice(0, 3);
    await Promise.all(
      items.map(async (item) => {
        const { id, mint, name, image, attributes, rank } = item;
        console.log("Updating id: ", id);

        return CollectionMintModel.findOneAndUpdate(
          {
            id: id.toString(),
          },
          {
            mint,
            name,
            image,
            attributes,
            rank,
            collectionRef: collection._id,
          },
          {
            upsert: true,
            new: true,
          }
        );
      })
    );
    console.log("Population complete");
  } catch (error) {
    console.log("Error during population", error);
  }

  process.exit(0);
};

main();
