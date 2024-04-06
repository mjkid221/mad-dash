/* eslint-disable no-param-reassign -- allow reassignment */
import {
  Metaplex,
  JsonMetadata,
  FindNftsByOwnerOutput,
} from "@metaplex-foundation/js";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";

import { SOLANA_RPC_PROVIDER } from "../constants";

export class MetaplexService {
  public static metaplex: Metaplex;

  private static initMetaplex() {
    this.metaplex = new Metaplex(new Connection(SOLANA_RPC_PROVIDER));
  }

  public static getMetaplexInstance() {
    if (!this.metaplex) {
      this.initMetaplex();
    }
    return this.metaplex;
  }

  public static async getNFTsByOwner({
    userAddress,
    collectionAddress,
  }: {
    userAddress: string;
    collectionAddress?: string;
  }) {
    if (!this.metaplex) {
      this.initMetaplex();
    }
    const nfts = await this.metaplex.nfts().findAllByOwner({
      owner: new PublicKey(userAddress),
    });

    // Apply filter only if collectionAddress is specified
    const filteredNfts = (
      collectionAddress
        ? nfts.filter(
            (nft) => nft.collection?.address.toString() === collectionAddress
          )
        : nfts
    ) as FindNftsByOwnerOutput;

    const userNfts = await Promise.all(
      filteredNfts.map(async (token) => {
        // Get extra metadata for each token and add it to the token object
        try {
          const metadataResponse = await fetch(token.uri);
          const metadata = await metadataResponse.json();
          if (metadata.image) {
            (token as JsonMetadata).image = metadata.image;
          }
        } catch (error) {
          console.log(error);
        }
        return token;
      })
    );
    return userNfts;
  }

  public static async getTokenMetadata({
    mintAddress,
  }: {
    mintAddress: string;
  }) {
    if (!this.metaplex) {
      this.initMetaplex();
    }
    const [publicKey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        PROGRAM_ID.toBuffer(),
        new PublicKey(mintAddress).toBuffer(),
      ],
      PROGRAM_ID
    );
    return Metadata.fromAccountAddress(this.metaplex.connection, publicKey);
  }
}
