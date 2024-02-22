import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getToken } from "next-auth/jwt";

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  const token = await getToken({ req });
  return {
    token,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
