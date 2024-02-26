import { NextApiRequest } from "next";

// import { VERCEL_URL } from "../../constants";

const VERCEL_URL = "https://mad-land.vercel.app";
/**
 * Generate a formatted URL for the current environment
 *
 * @param req The Next API request object
 * @returns A formatted URL for the current environment
 */
export const generateUrl = (req: NextApiRequest) => {
  const { host } = req.headers;
  const protocol = VERCEL_URL ? "https" : "http";
  return new URL(`${protocol}://${host}`);
};
