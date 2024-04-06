import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import { SOLANA_RPC_PROVIDER } from "../../../constants";

export const solanaEndpoint =
  SOLANA_RPC_PROVIDER || clusterApiUrl(WalletAdapterNetwork.Devnet);
