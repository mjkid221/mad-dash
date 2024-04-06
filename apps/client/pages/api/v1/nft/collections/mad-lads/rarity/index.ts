import {
  apiHandler,
  madLadsCollectionRarityRequestSchema,
} from "@mad-land/lib";
import { aggregateMadLadsCollectionData } from "@mad-land/lib/api/handlers/nft/";
import { database, cors } from "@mad-land/lib/middleware";

export default apiHandler()
  .all(cors)
  .use(database)
  .get(async (req, res) => {
    const { mint } = madLadsCollectionRarityRequestSchema.parse(req.query);
    const collection = await aggregateMadLadsCollectionData({ mint });
    res.status(200).json({ collection });
  });
