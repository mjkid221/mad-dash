import { NextApiRequest, NextApiResponse } from "next/types";
import { NextHandler } from "next-connect";

import { generateUrl } from "../api";

/**
 * CORS policy
 */
export const cors = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const url = generateUrl(req);
  const allowedOrigin = url.toString(); // Get the string representation of the URL

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  return next();
};
