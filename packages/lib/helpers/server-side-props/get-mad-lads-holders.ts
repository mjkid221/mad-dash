import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";

import { getSnapshotDate } from "../../api/handlers/nft";
import { connect } from "../../database";
import { getUserTokens, propsParser } from "../../utils";

export const getHoldersByCollection = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;

  try {
    await connect();
    const snapshotDate = await getSnapshotDate();
    const token = await getToken({ req });
    const userAddress = token?.sub;
    const userTokens = await getUserTokens({ userAddress });
    return {
      props: {
        lastSnapshotDate: propsParser(snapshotDate),
        userTokens: propsParser(userTokens),
      },
    };
  } catch (err) {
    console.log(err);
    return { notFound: true };
  }
};

export type CollectionHolderSspType = InferGetServerSidePropsType<
  typeof getHoldersByCollection
>;
