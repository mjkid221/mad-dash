import { MAD_LADS_LOGO } from "@mad-land/lib";
import { StandardPageContainer } from "@mad-land/ui/shared";
import { NextPage } from "next";

const HomePage: NextPage = () => (
  <StandardPageContainer
    bgImage={MAD_LADS_LOGO}
    backgroundSize="480px"
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
  />
);

export default HomePage;
