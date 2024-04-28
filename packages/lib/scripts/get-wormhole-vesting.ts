/* eslint-disable no-await-in-loop -- allow */
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey, Connection } from "@solana/web3.js";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import { DatabaseURIMissing } from "../api";
import { CollectionMintModel } from "../database/models";
import { LadBadge } from "../types";

configDotenv();
// Make sure MONGODB_URI is set in ENV
const MONGODB_URI = process.env.MONGODB_URI as string;
const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC_PROVIDER as string;

/**
 * Connects to mongo db
 */
const connect = async () => {
  if (!MONGODB_URI) {
    throw DatabaseURIMissing;
  }
  return mongoose.connect(MONGODB_URI);
};

const streamFlowProgram = new PublicKey(
  "strmdbLr6w7QNmsiEXyFwWg3VSfg1GiELgU27P8aCGw"
);

const wormholeToken = new PublicKey(
  "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ"
);

/**
 * Two step process
 * Figure out the PDA attached to Lads
 * Then figure out the PDA attached to the above with StreamFlow.
 */
const main = async () => {
  await connect();
  const connection = new Connection(rpc);

  const mints = await CollectionMintModel.find({
    wormholeVestingPubkey: { $exists: false },
    badges: { $in: [LadBadge.Wormhole] },
  });

  // eslint-disable-next-line no-restricted-syntax -- allow
  for (const mint of mints) {
    const mintAddress = new PublicKey(mint.mint);
    const flowRecipient = PublicKey.findProgramAddressSync(
      [
        Buffer.from("sba-scoped-nft-program-prefix"),
        mintAddress.toBuffer(),
        streamFlowProgram.toBuffer(),
      ],
      new PublicKey("7DkjPwuKxvz6Viiawtbmb4CqnMKP6eGb1WqYas1airUS")
    )[0];

    const wormholeAta = await getAssociatedTokenAddress(
      wormholeToken,
      flowRecipient,
      true
    );

    const recipientTokens = wormholeAta;
    try {
      const recipientTxSignatures = await connection.getSignaturesForAddress(
        recipientTokens
      );
      const creationSignature =
        recipientTxSignatures[recipientTxSignatures.length - 1];

      const tx = await connection.getTransaction(creationSignature.signature, {
        maxSupportedTransactionVersion: 0,
      });

      const wormholeVestingAccount = tx?.transaction.message
        .staticAccountKeys[4] as PublicKey;

      console.log(
        "wormholeVestingAccount: ",
        wormholeVestingAccount.toBase58()
      );

      mint.wormholeVestingPubkey = wormholeVestingAccount.toBase58();
      await mint.save();
    } catch (e) {
      console.log("Unable to get: ", e);
    }
  }

  // const wormholeBalance = await connection.getTokenAccountBalance(
  //   wormholeVestingAccount
  // );

  // console.log("Current wormhole balance: ", wormholeBalance.value.uiAmount);

  process.exit(0);
};

main();
