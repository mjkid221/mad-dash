import { Flex, Image } from "@chakra-ui/react";
import {
  BACKPACK_RED,
  BACKPACK_WHITE,
  SiwsProvider,
  formatAddress,
} from "@mad-dash/lib";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { Tooltip } from "react-tooltip";

import { siwsOptions } from "../../config";
import { useSessionAddress } from "../../hooks/use-session-address";

export const BackpackConnectButton = () => {
  const {
    publicKey,
    wallets,
    select,
    signMessage,
    connected,
    disconnect,
    connecting,
  } = useWallet();
  const { address, isConnected } = useSessionAddress();

  const handleWalletConnect = useCallback(async () => {
    const backpackWallet = wallets.find(
      (wallet) => wallet.adapter.name === "Backpack"
    );
    if (!backpackWallet) {
      window.location.href = "https://backpack.app/";
      return;
    }
    select(backpackWallet?.adapter.name);
  }, [select, wallets]);

  const handleSignIn = useCallback(async () => {
    try {
      if (!connected) {
        handleWalletConnect();
      }
      const csrf = await getCsrfToken();
      if (!publicKey || !csrf || !signMessage) return;
      const message = new SiwsProvider({
        domain: window.location.host,
        publicKey: publicKey?.toBase58(),
        statement: siwsOptions.statement!,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(data);
      const serializedSignature = bs58.encode(signature);
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (err) {
      console.log(err);
    }
  }, [connected, handleWalletConnect, publicKey, signMessage]);

  const switchIconStateSrc = isConnected ? BACKPACK_RED : BACKPACK_WHITE;

  const onClick = async () => {
    if (isConnected) {
      disconnect().then(() => signOut());
      return;
    }
    handleSignIn();
  };

  useEffect(() => {
    // Automatically sign in if connected and not signed in
    // The delay is to allow the wallet hook to return the correct state during mount
    const timer = setTimeout(() => {
      if (publicKey && !isConnected) {
        handleSignIn();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [connecting, handleSignIn, isConnected, publicKey]);

  const tooltipLabel = isConnected
    ? `Disconnect ${formatAddress(address ?? "", 4, 4)}`
    : "Connect Backpack";

  return (
    <Flex
      width="36px"
      height="36px"
      borderRadius="full"
      border="1px rgb(229, 231, 235) solid"
      alignItems="center"
      justifyContent="center"
      _hover={{ cursor: "pointer", borderColor: "white" }}
      onClick={onClick}
      data-tooltip-id="wallet-connect"
    >
      <Image
        src={switchIconStateSrc}
        width="21px"
        height="21px"
        marginTop="-1px"
      />

      <Tooltip id="wallet-connect" place="bottom-start" arrowColor="red">
        {tooltipLabel}
      </Tooltip>
    </Flex>
  );
};
