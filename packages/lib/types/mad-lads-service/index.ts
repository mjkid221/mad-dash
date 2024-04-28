import { Program } from "@coral-xyz/anchor";
import { Account } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { ProgramAccStruct } from "../../utils/blockchain/solana/anchor";
import {
  SoulBoundAuthority,
  CardinalStakePool,
  CardinalRewardDistributor,
} from "../programs/idl";

/**
 * A generalized interface used for querying the Mad Lads service class.
 */
export interface MadLadsServiceQueryArgs {
  user: PublicKey;
  nft: {
    mintAddress: PublicKey;
    metadataAddress: PublicKey;
  };
  stakePool?: PublicKey;
  rewardDistributor?: PublicKey;
  goldMintPubkey?: PublicKey;
  soulboundProgram?: Program<SoulBoundAuthority>;
  stakePoolPubkey?: PublicKey;
  rewardDistributorPubkey?: PublicKey;
  stakePoolProgram?: Program<CardinalStakePool>;
  rewardDistributorProgram?: Program<CardinalRewardDistributor>;
  accounts?: {
    stakeEntry: ProgramAccStruct<"stakeEntry", CardinalStakePool>;
    rewardEntry: ProgramAccStruct<"rewardEntry", CardinalRewardDistributor>;
    rewardDistributor: ProgramAccStruct<
      "rewardDistributor",
      CardinalRewardDistributor
    >;
    goldTokenAccount: Account;
  };
}
