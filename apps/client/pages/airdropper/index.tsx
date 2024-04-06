import { useGetMadLadsHolders, useGetUserTokens } from "@mad-land/lib";
import {
  CollectionHolderSspType,
  getHoldersByCollection,
} from "@mad-land/lib/helpers/server-side-props/";
import { AirdropPage, StandardMadLandPageContainer } from "@mad-land/ui";
import { useSessionAddress } from "@mad-land/ui/hooks/use-session-address";

const Airdropper = (serverSideProps: CollectionHolderSspType) => {
  const { address: userAddress } = useSessionAddress();
  const useMadLadsHolders = useGetMadLadsHolders();
  const { data: userTokens } = useGetUserTokens({
    userAddress,
    initialData: serverSideProps.userTokens,
  });

  const formattedServerSideProps = {
    ...serverSideProps,
    userTokens,
  };
  return (
    <StandardMadLandPageContainer>
      <AirdropPage {...formattedServerSideProps} {...useMadLadsHolders} />
    </StandardMadLandPageContainer>
  );
};

export const getServerSideProps = getHoldersByCollection;

export default Airdropper;
