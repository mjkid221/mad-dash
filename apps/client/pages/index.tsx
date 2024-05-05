import { MAD_LADS_LOGO } from "@mad-dash/lib";
import { StandardPageContainer } from "@mad-dash/ui/shared";
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
