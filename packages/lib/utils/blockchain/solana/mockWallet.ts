import { Keypair } from "@solana/web3.js";

export const MockWallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
};
