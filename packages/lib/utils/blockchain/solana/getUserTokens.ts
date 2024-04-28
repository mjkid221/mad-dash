import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  LAMPORTS_PER_SOL,
  AccountInfo,
} from "@solana/web3.js";

import { MetaplexService } from "../../../services/metaplex";
import { UserTokensType } from "../../../types";

import { solanaEndpoint } from "./endpoint";

export enum TokenFilterState {
  Fungible,
  NonFungible,
  Both,
}

const baseFilter = (account: AccountInfo<any>) => {
  const {
    state,
    tokenAmount: { uiAmount },
  } = account.data.parsed.info;
  return state === "initialized" && uiAmount > 0;
};

const filterHook = {
  [TokenFilterState.Fungible]: (account: AccountInfo<any>) => {
    const {
      tokenAmount: { decimals },
    } = account.data.parsed.info;
    return baseFilter(account) && decimals > 0;
  },
  [TokenFilterState.NonFungible]: (account: AccountInfo<any>) => {
    const {
      tokenAmount: { decimals },
    } = account.data.parsed.info;
    return baseFilter(account) && decimals === 0;
  },
  [TokenFilterState.Both]: (account: AccountInfo<any>) => baseFilter(account),
};

/**
 * Get all tokens for a user. Supply a filter to get only fungible, non-fungible, or both.
 * @param {string} userAddress User wallet address string in base58
 * @param {Connection} connection  Solana connection RPC endpoint
 * @param {TokenFilterState} filter Filter to apply to the token list
 */
export const getUserTokens = async ({
  userAddress,
  connection = new Connection(solanaEndpoint),
  filter = TokenFilterState.Fungible,
  nativeTokenAllowed = true,
}: {
  userAddress?: string;
  connection?: Connection;
  filter?: TokenFilterState;
  nativeTokenAllowed?: boolean;
}) => {
  if (!userAddress) return [];

  try {
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165, // size of account data
      },
      {
        memcmp: {
          offset: 32,
          bytes: userAddress,
        },
      },
    ];

    const accounts = await connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters,
      }
    );

    const allTokens = await Promise.all(
      accounts.map(async (account) => {
        const {
          pubkey,
          account: accountInfo,
        }: { pubkey: PublicKey; account: AccountInfo<any> } = account;

        const {
          mint: mintAddress,
          tokenAmount: {
            uiAmount: tokenBalanceUI,
            amount: tokenBalance,
            decimals: tokenDecimals,
          },
        }: {
          mint: string;
          state: string;
          tokenAmount: { uiAmount: number; amount: string; decimals: number };
        } = accountInfo.data.parsed.info;

        if (!filterHook[filter](accountInfo)) return undefined;

        const tokenMetadata: {
          image?: string;
          name?: string;
          symbol?: string;
        } = {};
        try {
          const result = await MetaplexService.getTokenMetadata({
            mintAddress,
          });
          tokenMetadata.symbol = result.data.symbol;
          tokenMetadata.name = result.data.name;

          const metadataResponse = await fetch(result.data.uri.toString());
          const metadata = await metadataResponse.json();

          if (metadata) {
            tokenMetadata.image = metadata.image;
          }
        } catch {
          // do nothing
        }

        return {
          pubkey,
          mintAddress,
          tokenBalance,
          tokenBalanceUI,
          tokenDecimals,
          ...tokenMetadata,
        };
      })
    );

    const solanaTokenBalance = [];
    const userSolanaBalance = await connection.getBalance(
      new PublicKey(userAddress)
    );
    if (userSolanaBalance > 0 && nativeTokenAllowed)
      solanaTokenBalance.push({
        // Placeholder, ignore.
        pubkey: new PublicKey(userAddress),
        // Dummy representation of native sol as a SPL token
        mintAddress: PublicKey.default.toString(),
        tokenBalance: userSolanaBalance,
        tokenDecimals: 9,
        tokenBalanceUI: userSolanaBalance / LAMPORTS_PER_SOL,
        image:
          "https://s3.us-east-1.amazonaws.com/app-assets.xnfts.dev/images/useBlockchainLogo/solana.png",
        name: "Solana",
        symbol: "SOL",
      });

    return [
      ...solanaTokenBalance,
      ...allTokens
        .filter(Boolean)
        .sort(
          (a, b) =>
            Number(b?.tokenBalanceUI ?? 0) - Number(a?.tokenBalanceUI ?? 0)
        ),
    ] as UserTokensType[];
  } catch (error) {
    console.log(error);
    return [];
  }
};
