import { Button } from "@chakra-ui/react";
// import * as Backpack from "@coral-xyz/wallet-standard";
// import { useWallet } from "@solana/wallet-adapter-react";

export const BackpackConnectButton = () => {
  // const { wallets, select, publicKey } = useWallet();
  // const backpack = new Backpack();
  console.log("Backpack Connect Button: ");

  // const [phantomWallet, setPhantomWallet] =
  //   useState<BackpackWallet>();
  // const getProvider = () => {
  //   const currentWindow: any = window;
  //   if ("backpack" in window) {
  //     const provider = currentWindow.backpack?.solana;
  //     if (provider?.isBackpack) {
  //       return provider;
  //     }
  //   }
  //   return null;
  // };

  return <Button onClick={() => {}}>Connect!</Button>;
};
