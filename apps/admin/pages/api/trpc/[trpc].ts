import { apiHandler } from "@mad-land/lib/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter } from "@/server/router/_app";

export default apiHandler().all(
  createNextApiHandler({
    router: appRouter,
    createContext: () => ({}),
  })
);
