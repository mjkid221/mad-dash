import { Flex, Image } from "@chakra-ui/react";
import {
  BACKPACK_RED,
  BACKPACK_WHITE,
  SiwsProvider,
  formatAddress,
} from "@mad-land/lib";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { Tooltip } from "react-tooltip";

import { siwsOptions } from "../../config";
import { useSessionAddress } from "../../hooks/use-session-address";

export const BackpackConnectButton = () => {
  const { publicKey, wallets, select, signMessage, connected, disconnect } =
    useWallet();
  const { address, isConnected } = useSessionAddress();

  const onClick = useCallback(async () => {
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
      if (!isConnected) {
        onClick();
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
  }, [isConnected, onClick, publicKey, signMessage]);

  useEffect(() => {
    if (connected && !isConnected) {
      handleSignIn();
    }
  }, [connected, handleSignIn, isConnected]);

  const switchIconStateSrc = isConnected ? BACKPACK_RED : BACKPACK_WHITE;

  const handleClick = () => {
    if (isConnected) {
      disconnect().then(() => signOut());
      return;
    }
    handleSignIn();
  };

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
      onClick={handleClick}
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
