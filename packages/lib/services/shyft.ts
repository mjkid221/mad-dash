/* eslint-disable no-param-reassign -- allow reassignment */
import { DAS, Network, ShyftSdk } from "@shyft-to/js";

import { NEXT_CLIENT_ENV } from "../constants";

const { NEXT_PUBLIC_SHYFT_API_KEY: SHYFT_API_KEY } = NEXT_CLIENT_ENV();

export class ShyftService {
  public static shyft: ShyftSdk;

  private static initShyft() {
    this.shyft = new ShyftSdk({
      apiKey: SHYFT_API_KEY,
      network: Network.Mainnet,
    });
  }

  public static getShyftInstance() {
    if (!this.shyft) {
      this.initShyft();
    }
    return this.shyft;
  }

  public static async getNftHoldersByCollection({
    collectionAddress,
  }: {
    collectionAddress: string;
  }) {
    if (!this.shyft) {
      this.initShyft();
    }

    const allNFTs: DAS.GetAssetResponse[] = [];
    let page: boolean | number = 1;
    const ITEM_PER_PAGE = 1000;

    try {
      while (page) {
        // eslint-disable-next-line no-await-in-loop -- allow
        const response = await this.shyft.rpc.getAssetsByGroup({
          groupValue: collectionAddress,
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

      return Array.from(map.values());
    } catch (error) {
      console.log(error);
    }

    return [];
  }
}
