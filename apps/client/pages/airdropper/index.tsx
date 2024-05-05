import { useGetMadLadsHolders, useGetUserTokens } from "@mad-dash/lib";
import {
  CollectionHolderSspType,
  getHoldersByCollection,
} from "@mad-dash/lib/helpers/server-side-props/";
import { AirdropPage, StandardMadLandPageContainer } from "@mad-dash/ui";
import { useSessionAddress } from "@mad-dash/ui/hooks/use-session-address";

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
