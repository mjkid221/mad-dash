import { configDotenv } from "dotenv";

configDotenv();

const MONGODB_URI = process.env.MONGODB_URI as string;

const SOLANA_RPC_PROVIDER = process.env
  .NEXT_PUBLIC_SOLANA_RPC_PROVIDER as string;

export { MONGODB_URI, SOLANA_RPC_PROVIDER };
