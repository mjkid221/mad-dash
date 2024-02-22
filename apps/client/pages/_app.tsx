import "@total-typescript/ts-reset";
import { ChakraProvider } from "@chakra-ui/react";
import { SOLANA_RPC_PROVIDER } from "@mad-land/lib";
import { Navbar, theme } from "@mad-land/ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useMemo, useState } from "react";

import { trpc } from "@/utils/trpc";

import "@solana/wallet-adapter-react-ui/styles.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [queryClient] = useState(() => new QueryClient());

  const endpoint = useMemo(
    () => SOLANA_RPC_PROVIDER || clusterApiUrl(WalletAdapterNetwork.Devnet),
    []
  );

  const wallets = useMemo(() => [], []);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <ChakraProvider theme={theme}>
                <Head>
                  <title>Mad Land</title>
                  <link rel="shortcut icon" href="/mad-land-favicon.ico" />
                </Head>
                <Analytics />
                <Navbar />
                <Component {...pageProps} />
              </ChakraProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(App);
