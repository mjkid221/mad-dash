/* eslint-disable no-param-reassign -- add params to session */
import {
  NEXT_SERVER_ENV,
  SiwsMessageOptions,
  SiwsProvider,
  generateUrl,
} from "@mad-land/lib";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";

const { NEXTAUTH_SECRET } = NEXT_SERVER_ENV();
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-shadow -- allow shadowing
      async authorize(credentials, req) {
        try {
          const signinMessage = new SiwsProvider(
            JSON.parse(credentials?.message || "{}") as SiwsMessageOptions
          );
          const nextAuthUrl = generateUrl(req as NextApiRequest);
          console.log("Domain mismatch", signinMessage.domain);
          console.log(" nextAuthUrl.host: ", nextAuthUrl);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          console.log("Checkpoint 1");
          console.log("signinMessage: ", signinMessage);
          console.log("req: ", req);
          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });
          console.log("csrfToken: ", csrfToken);
          if (signinMessage.nonce !== csrfToken) {
            return null;
          }
          console.log("Checkpoint 2");

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );
          console.log("Checkpoint 3");

          if (!validationResult)
            throw new Error("Could not validate the signed message");
          console.log("Checkpoint 4");

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          console.log("Checkpoint 5");

          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth?.includes("signin");

  // Hides Sign-In with Solana from the default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        // @ts-ignore
        session.publicKey = token.sub;
        if (session.user) {
          session.user.name = token.sub;
        }
        return session;
      },
    },
  });
}
