import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { MissingSigner, MissingToken } from "../../api";
import { useTokenSelectStore } from "../../stores";
import { AirdropDistributionResult } from "../../types";
import {
  configureAndSendCurrentTransaction,
  solanaTransactionHandler,
} from "../../utils";

const distributeAirdrop = async ({
  airdropDistributionResult,
  sender,
  tokenMintAddress,
  tokenDecimals,
  connection,
  sendTransaction,
}: {
  airdropDistributionResult?: AirdropDistributionResult;
  sender?: PublicKey;
  tokenMintAddress: string;
  tokenDecimals: number;
  connection?: Connection;
  sendTransaction?: SignerWalletAdapterProps["sendTransaction"];
}) => {
  if (
    !airdropDistributionResult ||
    !sender ||
    !tokenMintAddress ||
    !connection ||
    !sendTransaction
  ) {
    throw Error("Unable to perform airdrop. Please try again.");
  }

  const { distributionData } = airdropDistributionResult;
  const tokenMint = new PublicKey(tokenMintAddress);
  const transactions = new Transaction();

  const sourceAta = await getAssociatedTokenAddress(tokenMint, sender);

  await Promise.all(
    distributionData.map(async ({ userAddress, distribution }) => {
      const recipient = new PublicKey(userAddress);
      const recipientAta = await getAssociatedTokenAddress(
        tokenMint,
        recipient
      );

      if (!(await connection.getAccountInfo(recipientAta))) {
        transactions.add(
          createAssociatedTokenAccountInstruction(
            sender,
            recipientAta,
            recipient,
            tokenMint
          )
        );
      }

      transactions.add(
        createTransferInstruction(
          sourceAta,
          recipientAta,
          sender,
          distribution * 10 ** tokenDecimals
        )
      );
    })
  );

  return configureAndSendCurrentTransaction(
    transactions,
    connection,
    sender,
    sendTransaction
  );
};

export const useDistributeAirdrop = ({
  airdropDistributionResult,
  onSuccess,
}: {
  airdropDistributionResult?: AirdropDistributionResult;
  onSuccess?: () => void;
}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { token } = useTokenSelectStore();

  const response = useMutation({
    mutationFn: async () => {
      if (!publicKey || !sendTransaction) {
        throw MissingSigner;
      }
      if (!token) {
        throw MissingToken;
      }

      return solanaTransactionHandler(
        () =>
          distributeAirdrop({
            airdropDistributionResult,
            sender: publicKey,
            tokenMintAddress: token?.mintAddress,
            tokenDecimals: token?.tokenDecimals,
            connection,
            sendTransaction,
          }),
        onSuccess
      );
    },
  });

  return response;
};
