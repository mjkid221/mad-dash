import { PublicKey } from "@solana/web3.js";

export type UserTokensType = {
  pubkey: PublicKey;
  mintAddress: string;
  tokenBalance: string;
  tokenDecimals: number;
  tokenBalanceUI: number;
  image?: string;
  name?: string;
  symbol?: string;
};
