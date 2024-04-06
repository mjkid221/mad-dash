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
import PageLoading from "nextjs-progressbar";
import { useMemo, useState } from "react";
import AnimatedCursor from "react-animated-cursor";
import { ToastContainer } from "react-toastify";

import "@solana/wallet-adapter-react-ui/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/effect-cards";
import "../styles/swiper.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [queryClient] = useState(() => new QueryClient());

  const endpoint = useMemo(
    () => SOLANA_RPC_PROVIDER || clusterApiUrl(WalletAdapterNetwork.Devnet),
    []
  );

  const defaultTheme = {
    color: "white",
    bg: theme.colors.red[900],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <ChakraProvider theme={theme}>
                <Head>
                  <title>Mad Land</title>
                  <link rel="shortcut icon" href="/mad-land-favicon.ico" />
                </Head>
                <Analytics />
                <Navbar />
                <ToastContainer theme="dark" position="top-left" closeOnClick />
                <PageLoading
                  color={defaultTheme.bg}
                  options={{ showSpinner: false }}
                />
                <Component {...pageProps} {...defaultTheme} />
                <AnimatedCursor />
              </ChakraProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
