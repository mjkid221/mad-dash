import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { solanaRpcApiInstance } from "../../../api";

type TokenAmountRpcApiResponse = {
  jsonrpc: "2.0";
  result: {
    context: {
      slot: number;
    };
    value: {
      amount: string;
      decimals: number;
      uiAmount: number;
      uiAmountString: string;
    };
  };
};
/**
 * Get the batched balance of multiple ATAs
 * @param atas Array of ATAs in base58
 */
export const getBatchAtaBalance = async (atas: string[]) => {
  try {
    // Attempt to fetch all balances in a single batch
    const response = await solanaRpcApiInstance.post<
      TokenAmountRpcApiResponse[]
    >(
      "", // specify the endpoint URL
      atas.map((ata) => ({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountBalance",
        params: [ata],
      })),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.map((data) => data.result.value.uiAmountString);
  } catch (error) {
    const batchSize = 25;
    const batchedPromises = [];

    for (let i = 0; i < atas.length; i += batchSize) {
      const batch = atas.slice(i, i + batchSize);
      const batchPromise = solanaRpcApiInstance
        .post<TokenAmountRpcApiResponse[]>(
          "",
          batch.map((ata) => ({
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountBalance",
            params: [ata],
          })),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) =>
          res.data.map((data) => data.result.value.uiAmountString)
        );
      batchedPromises.push(batchPromise);
    }

    // Wait for all batches to complete and flatten the results
    const results = await Promise.all(batchedPromises);
    return results.flat();
  }
};

/**
 * Get the batched balances of multiple users for a token
 * @param userAddresses Array of user wallet addresses in base58
 * @param tokenAddress Token address in base58
 */
export const getBatchUserBalance = async (
  userAddresses: string[],
  tokenAddress: string[]
) =>
  getBatchAtaBalance(
    userAddresses.map((userAddress) =>
      getAssociatedTokenAddressSync(
        new PublicKey(tokenAddress),
        new PublicKey(userAddress),
        true
      ).toBase58()
    )
  );
