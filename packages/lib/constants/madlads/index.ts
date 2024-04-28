import { PublicKey } from "@solana/web3.js";

const STAKE_POOL = new PublicKey(
  "7xmGGtuNNvjKLDwbYWBYGPpAjRqftJnrTyzSRK92yku8"
);

const REWARD_DISTRIBUTOR = new PublicKey(
  "6DBnpqRm1szSz25dD1aWEmYzgGoMB59Y1GMv2gtWUSM4"
);

const GOLD_MINT = new PublicKey("5QPAPkBvd2B7RQ6DBGvCxGdAcyWitdvRAP58CdvBiuf7");

const SOUL_BOUND_PROGRAM_ID = new PublicKey(
  "7DkjPwuKxvz6Viiawtbmb4CqnMKP6eGb1WqYas1airUS"
);

const CARDINAL_REWARD_DISTRIBUTOR_PROGRAM_ID = new PublicKey(
  "H2yQahQ7eQH8HXXPtJSJn8MURRFEWVesTd8PsracXp1S"
);
const CARDINAL_STAKE_POOL_PROGRAM_ID = new PublicKey(
  "2gvBmibwtBnbkLExmgsijKy6hGXJneou8X6hkyWQvYnF"
);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const AUTHORIZATION_RULES_PROGRAM_ID = new PublicKey(
  "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg"
);
const AUTHORIZATION_RULES = new PublicKey(
  "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9"
);

export {
  STAKE_POOL,
  REWARD_DISTRIBUTOR,
  GOLD_MINT,
  SOUL_BOUND_PROGRAM_ID,
  CARDINAL_REWARD_DISTRIBUTOR_PROGRAM_ID,
  CARDINAL_STAKE_POOL_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  AUTHORIZATION_RULES_PROGRAM_ID,
  AUTHORIZATION_RULES,
};
