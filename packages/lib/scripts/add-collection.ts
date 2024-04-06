import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import mongoose from "mongoose";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

import { DatabaseURIMissing } from "../api";
import { NftCollectionModel } from "../database/models";

import { MONGODB_URI, SOLANA_RPC_PROVIDER } from "./shared";

const { argv } = yargs(hideBin(process.argv)).option("collection", {
  alias: "a",
  describe: "The collection address",
  type: "string",
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
 * Populates the collection information
 */
const main = async () => {
  await connect();
  const argvObject = await argv;
  const collectionAddress = argvObject.collection as string;
  try {
    const metaplex = new Metaplex(new Connection(SOLANA_RPC_PROVIDER));

    const nft = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(collectionAddress) });

    const collectionName = nft.json?.name;

    await NftCollectionModel.findOneAndUpdate(
      {
        collectionAddress,
      },
      {
        collectionName,
        image: nft.json?.image,
        description: nft.json?.description,
        externalUrl: nft.json?.external_url,
      },
      {
        upsert: true,
        new: true,
      }
    );
    console.log(`Updated ${collectionName} Collection`);
  } catch (error) {
    console.log("Error during updating", error);
  }

  process.exit(0);
};

main();
