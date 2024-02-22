import type { DeploymentEnv } from "../../types";

/**
 * The deployment environment
 *
 * "production" | "staging" | "development" | "local"
 */
export const DEPLOYMENT_ENV = process.env
  .NEXT_PUBLIC_DEPLOYMENT_ENV as DeploymentEnv;

/**
 * The Solana RPC provider
 */
export const SOLANA_RPC_PROVIDER = process.env
  .NEXT_PUBLIC_SOLANA_RPC_PROVIDER as string;
