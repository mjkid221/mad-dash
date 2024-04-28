/* eslint-disable no-param-reassign -- allow reassignment for additional metadata */
import type { Metadata } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";

import { aggregateMadLadsCollectionData } from "../../api/handlers/nft/collections/mad-lads/rarity";
import { MAD_LADS_COLLECTION_ADDRESS } from "../../constants";
import { connect } from "../../database";
import { MadLadsService, MetaplexService } from "../../services";
import { MadLadsNft, StandardNftType } from "../../types";
import { propsParser } from "../../utils";

export const getCollectionInfoByUser = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;

  try {
    await connect();
    const session = await getToken({ req });

    const userAddress = session?.sub;

    if (!userAddress) {
      return {
        props: {
          userNfts: [],
        },
      };
    }

    // TODO: optimize this logic
    const userNfts = (await MetaplexService.getNFTsByOwner({
      userAddress,
      collectionAddress: MAD_LADS_COLLECTION_ADDRESS,
    })) as MadLadsNft[];

    const mint = userNfts.map((nft) => pickMintAddress(nft));

    const metadataList = await aggregateMadLadsCollectionData({ mint });
    const updatedUserNfts = (
      await Promise.all(
        userNfts.map(async (nft) => {
          await Promise.all([
            new Promise<void>((resolve) => {
              const metadata = metadataList.find(
                (item) => item.mint === pickMintAddress(nft)
              );
              nft.rank = metadata?.rank ?? 0;
              nft.imageBlurhash = metadata?.imageBlurhash;
              nft.badges = metadata?.badges;
              resolve();
            }),
            MadLadsService.getGoldPoints({
              user: new PublicKey(userAddress),
              nft: {
                mintAddress: (nft as Metadata).mintAddress,
                metadataAddress: nft.address,
              },
            }).then((goldPoints) => {
              nft.goldPoints = goldPoints;
            }),
            MadLadsService.isStaked({
              user: new PublicKey(userAddress),
              nft: {
                mintAddress: (nft as Metadata).mintAddress,
                metadataAddress: nft.address,
              },
            }).then((isStaked) => {
              nft.isStaked = isStaked;
            }),
          ]);
          return nft;
        })
      )
    ).sort((a, b) => b.rank! - a.rank!);
    return {
      props: {
        userNfts: propsParser(updatedUserNfts),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        userNfts: [],
      },
    };
  }
};

const pickMintAddress = (nft: StandardNftType) =>
  ((nft as Metadata)?.mintAddress || nft.address).toBase58();
