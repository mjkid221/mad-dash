import { apiHandler } from "@mad-land/lib";
import { database } from "@mad-land/lib/middleware";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";

import { createContext } from "@/server/context";
import { appRouter } from "@/server/router/_app";

/**
 * @see https://trpc.io/docs/server/adapters
 */
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext,
});

// @see https://nextjs.org/docs/api-routes/introduction
export default apiHandler()
  .use(database)
  .all(async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }

    return nextApiHandler(req, res);
  });
