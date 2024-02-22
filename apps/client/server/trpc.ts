import { Unauthorized } from "@mad-land/lib";
import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";

import { Context } from "./context";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

const isAuthenticated = t.middleware((opts) => {
  const { token } = opts.ctx;

  if (!token || !token.sub) throw Unauthorized;
  return opts.next();
});

export const { router, middleware } = t;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
