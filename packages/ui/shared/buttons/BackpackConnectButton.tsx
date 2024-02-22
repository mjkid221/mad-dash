import { Button } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";

export const BackpackConnectButton = () => {
  const { wallets, select } = useWallet();

  const onClick = () => {
    const backpackWallet = wallets.find(
      (wallet) => wallet.adapter.name === "Backpack"
    );
    if (!backpackWallet) {
      window.location.href = "https://backpack.app/";
      return;
    }
    select(backpackWallet?.adapter.name);
  };

  return <Button onClick={onClick}>Connect!</Button>;
};
