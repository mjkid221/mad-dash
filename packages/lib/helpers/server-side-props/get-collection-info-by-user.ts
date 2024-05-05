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
import { formatWithWBalance } from "../solana";

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
          const queryKey = {
            user: new PublicKey(userAddress),
            nft: {
              mintAddress: (nft as Metadata).mintAddress,
              metadataAddress: nft.address,
            },
          };
          await Promise.all([
            new Promise<void>((resolve) => {
              const metadata = metadataList.find(
                (item) => item.mint === pickMintAddress(nft)
              );
              nft.rank = metadata?.rank ?? 0;
              nft.imageBlurhash = metadata?.imageBlurhash;
              nft.badges = metadata?.badges;
              nft.wormholeVestingPubkey = metadata?.wormholeVestingPubkey;
              resolve();
            }),
            MadLadsService.getGoldPoints({
              ...queryKey,
            }).then((goldPoints) => {
              nft.goldPoints = goldPoints;
            }),
            MadLadsService.isStaked({
              ...queryKey,
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
        userNfts: propsParser(await formatWithWBalance(updatedUserNfts)),
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
