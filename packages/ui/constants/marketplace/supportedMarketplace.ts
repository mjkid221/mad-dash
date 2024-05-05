export enum Marketplace {
  Tensor = "Tensor",
  MagicEden = "Magic Eden",
}

export const SupportedMarketplace: Record<
  Marketplace,
  { name: string; logoSrc: string; url: URL; itemUrl: URL }
> = {
  [Marketplace.Tensor]: {
    name: "Tensor",
    logoSrc: "/assets/logo/tensor.png",
    url: new URL("https://www.tensor.trade/"),
    get itemUrl() {
      return new URL("item/", this.url);
    },
  },
  [Marketplace.MagicEden]: {
    name: "Magic Eden",
    logoSrc: "/assets/logo/magic-eden.png",
    url: new URL("https://magiceden.io/"),
    get itemUrl() {
      return new URL("item-details/", this.url);
    },
  },
};
