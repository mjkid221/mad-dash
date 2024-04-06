import type { Metadata } from "@metaplex-foundation/js";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";

import { aggregateMadLadsCollectionData } from "../../api/handlers/nft/collections/mad-lads/rarity";
import { MAD_LADS_COLLECTION_ADDRESS } from "../../constants";
import { connect } from "../../database";
import { MetaplexService } from "../../services";
import { FindNftsByOwnerOutputV2, StandardNftType } from "../../types";
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
    })) as FindNftsByOwnerOutputV2;

    const mint = userNfts.map((nft) => pickMintAddress(nft));

    const metadataList = await aggregateMadLadsCollectionData({ mint });
    const updatedUserNfts = (
      await Promise.all(
        userNfts.map((nft) => {
          // eslint-disable-next-line no-param-reassign -- allow reassignment
          nft.rank =
            metadataList.find((item) => item.mint === pickMintAddress(nft))
              ?.rank ?? 0;
          return nft;
        })
      )
    ).sort((a, b) => a.rank! - b.rank!);

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
