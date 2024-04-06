import { ShyftSdk, Network, DAS } from "@shyft-to/js";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import { DatabaseURIMissing } from "../api";
import { MAD_LADS_COLLECTION_ADDRESS } from "../constants";
import { CollectionHolderModel, NftCollectionModel } from "../database/models";
import { SupportedCollection } from "../types";

configDotenv();

// Make sure ENV is set
const MONGODB_URI = process.env.MONGODB_URI as string;

const SHYFT_API_KEY = process.env.NEXT_PUBLIC_SHYFT_API_KEY as string;

const shyft = new ShyftSdk({
  apiKey: SHYFT_API_KEY,
  network: Network.Mainnet,
});

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
 * Takes a snapshot of all the holders of the Mad Lads collection
 */
const main = async () => {
  await connect();
  const allNFTs: DAS.GetAssetResponse[] = [];

  let page: boolean | number = 1;
  const ITEM_PER_PAGE = 1000;

  try {
    const collection = await NftCollectionModel.findOne({
      collectionType: SupportedCollection.MadLads,
    }).lean();

    if (!collection) {
      throw new Error("Collection not found");
    }

    while (page) {
      // eslint-disable-next-line no-await-in-loop -- allow
      const response = await shyft.rpc.getAssetsByGroup({
        groupValue: MAD_LADS_COLLECTION_ADDRESS,
        groupKey: "collection",
        sortBy: { sortBy: "created", sortDirection: "asc" },
        page,
        limit: ITEM_PER_PAGE,
      });

      allNFTs.push(...response.items);

      if (response.total < ITEM_PER_PAGE) {
        page = false;
      } else {
        page += 1;
      }
    }
    const map = new Map<string, { userAddress: string; quantity: number }>();

    await Promise.all(
      allNFTs.map(async (nft) => {
        const { owner } = nft.ownership;

        if (map.has(owner)) {
          map.set(owner, {
            userAddress: owner,
            quantity: (map.get(owner)?.quantity ?? 0) + 1,
          });
        } else {
          map.set(owner, { userAddress: owner, quantity: 1 });
        }
      })
    );

    const allHolders = Array.from(map.values());

    await CollectionHolderModel.insertMany(
      allHolders.map((i) => ({
        ...i,
        collectionRef: collection._id,
      }))
    );

    console.log("Successfully populated holders for the collection");
  } catch (error) {
    console.log(error);
  }

  process.exit(0);
};

main();
