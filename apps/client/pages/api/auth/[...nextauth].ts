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
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

          if (signinMessage.nonce !== csrfToken) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
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
