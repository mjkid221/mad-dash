import { ResourceNotFound, apiHandler } from "@mad-dash/lib";
import { aggregateMadLadsHoldersData } from "@mad-dash/lib/api/handlers/nft";
import { database, cors } from "@mad-dash/lib/middleware";
import { PublicKey } from "@solana/web3.js";
import { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";

const getMadLadsHolders: NextApiHandler = async (req, res) => {
  const session = await getToken({ req });
  const userAddress = session?.sub;
  try {
    const madLadsHolders = (
      await aggregateMadLadsHoldersData({ userAddress })
    ).filter((holder) => PublicKey.isOnCurve(holder.userAddress));
    return res.status(200).json(madLadsHolders);
  } catch (err) {
    console.error(err);
    throw ResourceNotFound;
  }
};

export default apiHandler().all(cors).use(database).get(getMadLadsHolders);
