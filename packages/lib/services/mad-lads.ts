/* eslint-disable no-param-reassign -- allow reassignment */
import { Program, AnchorProvider, Provider, BN } from "@coral-xyz/anchor";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

import {
  CARDINAL_REWARD_DISTRIBUTOR_PROGRAM_ID,
  CARDINAL_STAKE_POOL_PROGRAM_ID,
  GOLD_MINT,
  REWARD_DISTRIBUTOR,
  SOLANA_RPC_PROVIDER,
  SOUL_BOUND_PROGRAM_ID,
  STAKE_POOL,
} from "../constants";
import { MadLadsServiceQueryArgs } from "../types";
import {
  SoulBoundIdl,
  SoulBoundAuthority,
  CardinalRewardDistributor,
  CardinalRewardDistributorIdl,
  CardinalStakePoolIdl,
  CardinalStakePool,
} from "../types/programs";
import { MockWallet } from "../utils";

function getStakeSeed(supply: number, user: PublicKey): PublicKey {
  if (supply > 1) {
    return user;
  }
  return PublicKey.default;
}

export class MadLadsService {
  public static soulBoundProgram: Program<SoulBoundAuthority>;

  public static rewardDistributorProgram: Program<CardinalRewardDistributor>;

  public static stakingPoolProgram: Program<CardinalStakePool>;

  public static getSoulboundProgram(
    provider: Provider = new AnchorProvider(
      new Connection(SOLANA_RPC_PROVIDER),
      MockWallet,
      {}
    )
  ) {
    if (!this.soulBoundProgram) {
      this.soulBoundProgram = new Program(
        SoulBoundIdl,
        SOUL_BOUND_PROGRAM_ID,
        provider
      );
    }
    return this.soulBoundProgram;
  }

  public static getRewardDistributorProgram(
    provider: Provider = new AnchorProvider(
      new Connection(SOLANA_RPC_PROVIDER),
      MockWallet,
      {}
    )
  ) {
    if (!this.rewardDistributorProgram) {
      this.rewardDistributorProgram = new Program(
        CardinalRewardDistributorIdl,
        CARDINAL_REWARD_DISTRIBUTOR_PROGRAM_ID,
        provider
      );
    }
    return this.rewardDistributorProgram;
  }

  public static getStakingPoolProgram(
    provider: Provider = new AnchorProvider(
      new Connection(SOLANA_RPC_PROVIDER),
      MockWallet,
      {}
    )
  ) {
    if (!this.stakingPoolProgram) {
      this.stakingPoolProgram = new Program(
        CardinalStakePoolIdl,
        CARDINAL_STAKE_POOL_PROGRAM_ID,
        provider
      );
    }
    return this.stakingPoolProgram;
  }

  /**
   * Read the user's gold points balance (both claimed and unclaimed)
   * @param user - The user's public key
   * @param nft - The NFT object
   * @param goldMintPubkey - The gold mint public key
   * @param stakePoolPubkey - The stake pool public key
   * @param rewardDistributorPubkey - The reward distributor public key
   * @param soulboundProgram - The soulbound program
   * @param stakePoolProgram - The stake pool program
   * @param rewardDistributorProgram - The reward distributor program
   * @param accounts - The accounts object containing the stake entry, reward entry, and reward distributor accounts
   */
  public static async getGoldPoints({
    user,
    nft,
    goldMintPubkey = GOLD_MINT,
    stakePoolPubkey = STAKE_POOL,
    rewardDistributorPubkey = REWARD_DISTRIBUTOR,
    soulboundProgram = this.getSoulboundProgram(),
    stakePoolProgram = this.getStakingPoolProgram(),
    rewardDistributorProgram = this.getRewardDistributorProgram(),
    accounts,
  }: MadLadsServiceQueryArgs): Promise<number> {
    const unclaimed = await (async () => {
      try {
        return await this.getUnclaimedGoldPoints({
          user,
          nft,
          stakePoolPubkey,
          rewardDistributorPubkey,
          stakePoolProgram,
          rewardDistributorProgram,
          accounts,
        });
      } catch {
        return new BN(0);
      }
    })();
    const claimed = await (async () => {
      try {
        return await this.getClaimedGoldPoints({
          user,
          nft,
          goldMintPubkey,
          soulboundProgram,
          rewardDistributorProgram,
          accounts,
        });
      } catch {
        return new BN(0);
      }
    })();

    const native = unclaimed.add(claimed);
    const decimals = 0;
    return native.toNumber() / 10 ** decimals;
  }

  public static async isStaked({
    user,
    nft,
    stakePoolPubkey = STAKE_POOL,
    stakePoolProgram = this.getStakingPoolProgram(),
  }: MadLadsServiceQueryArgs) {
    try {
      const stakeEntry = await this.fetchStakeEntry({
        user,
        nft,
        stakePool: stakePoolPubkey,
        stakePoolProgram,
      });
      return stakeEntry.lastStaker.equals(user);
    } catch (err) {
      // If throws, then the account probably doesn't exist.
      return false;
    }
  }

  // Private functions
  private static async getUnclaimedGoldPoints({
    user,
    nft,
    stakePoolPubkey = STAKE_POOL,
    rewardDistributorPubkey = REWARD_DISTRIBUTOR,
    stakePoolProgram = this.getStakingPoolProgram(),
    rewardDistributorProgram = this.getRewardDistributorProgram(),
    accounts,
  }: MadLadsServiceQueryArgs): Promise<BN> {
    const stakeEntryAccount = accounts
      ? accounts.stakeEntry
      : await this.fetchStakeEntry({
          user,
          nft,
          stakePoolPubkey,
          stakePoolProgram,
        });
    const rewardEntryAccount = accounts
      ? accounts.rewardEntry
      : await this.fetchRewardEntry({
          user,
          nft,
          stakePool: stakePoolPubkey,
          rewardDistributor: rewardDistributorPubkey,
        });

    if (stakeEntryAccount.lastStaker.equals(PublicKey.default)) {
      return new BN(0);
    }
    if (stakeEntryAccount.amount.eq(new BN(0))) {
      return new BN(0);
    }

    const totalStakeSeconds = stakeEntryAccount.totalStakeSeconds.add(
      stakeEntryAccount.amount.eq(new BN(0))
        ? new BN(0)
        : new BN(Date.now() / 1000).sub(stakeEntryAccount.lastUpdatedAt as BN)
    );

    const { rewardSecondsReceived } = rewardEntryAccount;
    const rewardDistributorAccount = accounts
      ? accounts.rewardDistributor
      : await rewardDistributorProgram.account.rewardDistributor.fetch(
          rewardDistributorPubkey
        );
    const rewardAmountToReceive = totalStakeSeconds
      .sub(rewardSecondsReceived)
      .div(rewardDistributorAccount.rewardDurationSeconds)
      .mul(rewardDistributorAccount.rewardAmount)
      .mul(new BN(1))
      .div(new BN(10).pow(new BN(rewardDistributorAccount.multiplierDecimals)));

    return rewardAmountToReceive;
  }

  private static async getClaimedGoldPoints({
    user,
    nft,
    goldMintPubkey = GOLD_MINT,
    rewardDistributorProgram = this.getRewardDistributorProgram(),
    soulboundProgram = this.getSoulboundProgram(),
    accounts,
  }: MadLadsServiceQueryArgs) {
    const userRewardMintTokenAccount = await this.getUserGoldPointsAddress({
      user,
      nft,
      goldMintPubkey,
      soulboundProgram,
      rewardDistributorProgram,
    });

    const claimedAmount = await (async () => {
      try {
        const rewardTokenAccount = accounts
          ? accounts.goldTokenAccount
          : await getAccount(
              soulboundProgram.provider.connection,
              userRewardMintTokenAccount
            );
        return new BN(rewardTokenAccount.amount.toString());
      } catch {
        return new BN(0);
      }
    })();

    return claimedAmount;
  }

  private static async fetchStakeEntry({
    user,
    nft,
    stakePoolPubkey = STAKE_POOL,
    stakePoolProgram = this.getStakingPoolProgram(),
  }: MadLadsServiceQueryArgs) {
    return stakePoolProgram.account.stakeEntry.fetch(
      await this.getStakeEntryAddress({ user, nft, stakePoolPubkey })
    );
  }

  private static async getStakeEntryAddress({
    user,
    nft,
    stakePoolPubkey = STAKE_POOL,
    stakePoolProgram = this.getStakingPoolProgram(),
  }: MadLadsServiceQueryArgs) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("stake-entry"),
        stakePoolPubkey.toBuffer(),
        nft.mintAddress.toBuffer(),
        getStakeSeed(1, user).toBuffer(),
      ],
      stakePoolProgram.programId
    )[0];
  }

  private static async fetchRewardEntry({
    user,
    nft,
    stakePool = STAKE_POOL,
    rewardDistributor = REWARD_DISTRIBUTOR,
    rewardDistributorProgram = this.getRewardDistributorProgram(),
  }: MadLadsServiceQueryArgs) {
    return rewardDistributorProgram.account.rewardEntry.fetch(
      await this.getRewardEntryAddress({
        user,
        nft,
        stakePool,
        rewardDistributor,
      })
    );
  }

  private static async getRewardEntryAddress({
    user,
    nft,
    stakePool = STAKE_POOL,
    rewardDistributor = REWARD_DISTRIBUTOR,
    rewardDistributorProgram = this.getRewardDistributorProgram(),
  }: MadLadsServiceQueryArgs) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("reward-entry"),
        rewardDistributor.toBuffer(),
        (await this.getStakeEntryAddress({ user, nft, stakePool })).toBuffer(),
      ],
      rewardDistributorProgram.programId
    )[0];
  }

  private static async getUserGoldPointsAddress({
    user,
    nft,
    goldMintPubkey = GOLD_MINT,
    soulboundProgram = this.getSoulboundProgram(),
    rewardDistributorProgram = this.getRewardDistributorProgram(),
  }: MadLadsServiceQueryArgs) {
    const userRewardMintTokenAccount = await getAssociatedTokenAddress(
      goldMintPubkey,
      await this.getScopedSbaUserAuthorityAddress({
        user,
        nft,
        rewardDistributorProgram,
        soulboundProgram,
      }),
      true
    );

    return userRewardMintTokenAccount;
  }

  private static async getScopedSbaUserAuthorityAddress({
    user,
    nft,
    rewardDistributorProgram = this.getRewardDistributorProgram(),
    soulboundProgram = this.getSoulboundProgram(),
  }: MadLadsServiceQueryArgs) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("sba-scoped-user-nft-program"),

        user.toBuffer(),
        nft.mintAddress.toBuffer(),
        rewardDistributorProgram.programId.toBuffer(),
      ],
      soulboundProgram.programId
    )[0];
  }
}
