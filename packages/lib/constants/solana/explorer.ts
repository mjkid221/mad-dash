import { DeploymentEnv } from "../../types";
import { DEPLOYMENT_ENV } from "../environment";

export const generateBlockExplorerLink = (walletAddress: string) => {
  const blockExplorer: Record<DeploymentEnv, string> = {
    local: `https://solana.fm/address/${walletAddress}?cluster=devnet-alpha`,
    development: `https://solana.fm/address/${walletAddress}?cluster=devnet-alpha`,
    staging: `https://solana.fm/address/${walletAddress}?cluster=devnet-alpha`,
    production: `https://solana.fm/address/${walletAddress}?cluster=mainnet-alpha`,
  };
  return `${blockExplorer[DEPLOYMENT_ENV]}`;
};
