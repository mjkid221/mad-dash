/**
 * This file contains a list of **backend** environment variables that are used in the application/s.
 *
 * Make sure that you add the key to the correct list and the correct `dotenv-vault`.
 *
 */

const NEXT_CLIENT_ENV_KEYS = [
  "NEXT_PUBLIC_SOLANA_RPC_PROVIDER",
  "NEXT_PUBLIC_SHYFT_API_KEY",
] as const;

const NEXT_SERVER_ENV_KEYS = [
  "NEXTAUTH_SECRET",
  "MONGODB_URI",
  "THIRD_PARTY_SECRET_KEY",
] as const;

export enum EnvironmentType {
  Client = "CLIENT",
  Server = "SERVER",
}

/**
 * Object which sets the environment variable keys for each environment type.
 */
export const environmentKeys: Record<EnvironmentType, readonly string[]> = {
  [EnvironmentType.Client]: NEXT_CLIENT_ENV_KEYS,
  [EnvironmentType.Server]: NEXT_SERVER_ENV_KEYS,
};
