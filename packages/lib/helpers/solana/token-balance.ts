import { MadLadsNft } from "../../types";
import { getBatchAtaBalance } from "../../utils";

/**
 * Reformats the MadLads NFT object with fetched wormhole balance
 * @param {MadLadsNft} madLads Array of MadLads NFTs
 */
export const formatWithWBalance = async (madLads: MadLadsNft[]) => {
  const wormholeLads = madLads.filter((nft) => !!nft.wormholeVestingPubkey);

  const balances = await getBatchAtaBalance(
    wormholeLads.map((nft) => nft.wormholeVestingPubkey!)
  );

  const ladsMap = wormholeLads.map((nft, index) => ({
    mintAddress: nft.mintAddress,
    wormholeBalance: balances[index],
  }));

  madLads.forEach((nft) => {
    const lad = ladsMap.find((i) => i.mintAddress === nft.mintAddress);
    if (lad) {
      // eslint-disable-next-line no-param-reassign -- allow
      nft.wormholeVestingBalance = lad.wormholeBalance;
    }
  });
  return madLads;
};
