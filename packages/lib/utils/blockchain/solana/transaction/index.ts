/* eslint-disable no-param-reassign --  Allow param reassign to get the latest block in the transaction object */
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import {
  Connection,
  PublicKey,
  Transaction,
  Commitment,
} from "@solana/web3.js";
import { toast } from "react-toastify";

import {
  SignatureConfirmationNotFound,
  SignatureNotFound,
} from "../../../../api";

export const executeTransactionWithToast = async <T>({
  transactionPromise,
  pendingMessage = "Waiting for confirmation...",
  successMessage = "Transaction confirmed!",
  errorMessage = "Transaction failed!",
}: {
  transactionPromise: Promise<T>;
  pendingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}) =>
  toast.promise(transactionPromise, {
    pending: pendingMessage,
    success: successMessage,
    error: errorMessage,
  });

/**
 * Waits for the transaction to be confirmed.
 * @param transaction The Solana transaction object to send to the network.
 * @param connection The connection to the Solana network.
 * @param feePayer The fee payer's public key.
 * @param sendTransaction The wallet adapter's send transaction function.
 * @returns The transaction signature.
 * @throws If the transaction is not confirmed.
 */
export const configureAndSendCurrentTransaction = async (
  transaction: Transaction,
  connection: Connection,
  feePayer: PublicKey,
  sendTransaction: SignerWalletAdapterProps["sendTransaction"],
  commitment: Commitment = "confirmed"
) => {
  const blockHash = await connection.getLatestBlockhash();
  transaction.feePayer = feePayer;
  transaction.recentBlockhash = blockHash.blockhash;

  const transactionSignature = await sendTransaction(transaction, connection);
  if (!transactionSignature) {
    throw SignatureNotFound;
  }

  const transactionConfirmedSignature = await connection.confirmTransaction(
    {
      blockhash: blockHash.blockhash,
      lastValidBlockHeight: blockHash.lastValidBlockHeight,
      signature: transactionSignature,
    },
    commitment
  );
  if (!transactionConfirmedSignature) {
    throw SignatureConfirmationNotFound;
  }

  return transactionSignature;
};

export const solanaTransactionHandler = async (
  transaction: () => Promise<string>,
  onSuccess?: () => void
  // eslint-disable-next-line consistent-return -- consistent return is disabled to handle the error
) => {
  try {
    const tx = await executeTransactionWithToast({
      transactionPromise: transaction(),
    });
    if (onSuccess) onSuccess();
    return tx;
  } catch (err: any) {
    console.log(err);
    toast.error(err.message);
  }
};
