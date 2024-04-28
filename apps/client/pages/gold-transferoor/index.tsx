import { getCollectionInfoByUser } from "@mad-land/lib/helpers/server-side-props";
import { StandardMadLandPageContainer, TransferPage } from "@mad-land/ui";
import { InferGetServerSidePropsType } from "next";

const GoldTransfer = ({
  userNfts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <StandardMadLandPageContainer>
    <TransferPage userNfts={userNfts} />
  </StandardMadLandPageContainer>
);

export const getServerSideProps = getCollectionInfoByUser;

export default GoldTransfer;
