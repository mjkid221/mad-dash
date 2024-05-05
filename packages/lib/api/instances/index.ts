import axios from "axios";

import { solanaEndpoint } from "../../utils/blockchain/solana/endpoint";

/**
 * Base instance for Next.js API routes
 *
 * NOTE: this includes versioning so all files in the API directory that use this instance
 * should be in a directory that matches the version number
 */
export const baseApiInstance = axios.create({
  baseURL: "/api/v1",
});

/**
 * Instance for the How Rare API
 */
export const howRareApiInstance = axios.create({
  baseURL: "https://api.howrare.is/v0.1/collections/",
});

/**
 * Instance for the Solana RPC API
 */
export const solanaRpcApiInstance = axios.create({
  baseURL: solanaEndpoint,
});
