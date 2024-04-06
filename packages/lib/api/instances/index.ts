import axios from "axios";

/**
 * Base instance for Next.js API routes
 *
 * NOTE: this includes versioning so all files in the API directory that use this instance
 * should be in a directory that matches the version number
 */
export const baseApiInstance = axios.create({
  baseURL: "/api/v1",
});

export const howRareApiInstance = axios.create({
  baseURL: "https://api.howrare.is/v0.1/collections/",
});
