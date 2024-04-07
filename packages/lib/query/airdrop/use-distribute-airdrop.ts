import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { MissingSigner, MissingToken } from "../../api";
import { useTokenSelectStore } from "../../stores";
import { AirdropDistributionResult } from "../../types";
import {
  configureAndSendCurrentTransaction,
  solanaTransactionHandler,
} from "../../utils";

/**
 * Distribute airdrop to the users.
 * @deprecated This will not work with batch sizes greater than Solana's transaction size limit.
 * @param {Object} params
 * @param {AirdropDistributionResult} params.airdropDistributionResult Airdrop distribution result
 * @param {PublicKey} params.sender Sender wallet address
 * @param {string} params.tokenMintAddress Token mint address
 * @param {number} params.tokenDecimals Token decimals
 * @param {Connection} params.connection Solana connection rpc endpoint
 * @param {SignerWalletAdapterProps["sendTransaction"]} params.sendTransaction Send transaction function
 * @returns {Promise<void>}
 */
const distributeAirdrop = async ({
  airdropDistributionResult,
  sender,
  tokenMintAddress,
  connection,
  sendTransaction,
}: {
  airdropDistributionResult?: AirdropDistributionResult;
  sender?: PublicKey;
  tokenMintAddress: string;
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
  const transactions = new Transaction();

  // If the token mint address is a native token
  if (tokenMintAddress === PublicKey.default.toString()) {
    await Promise.all(
      distributionData.map(async ({ userAddress, distribution }) => {
        const recipient = new PublicKey(userAddress);
        transactions.add(
          SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: recipient,
            lamports: distribution,
          })
        );
      })
    );
  } else {
    const tokenMint = new PublicKey(tokenMintAddress);

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
            distribution
          )
        );
      })
    );
  }

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
            connection,
            sendTransaction,
          }),
        onSuccess
      );
    },
  });

  return response;
};
