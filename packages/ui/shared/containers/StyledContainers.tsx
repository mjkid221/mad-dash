import { Flex, chakra } from "@chakra-ui/react";
import { NAVBAR_HEIGHT } from "@mad-land/lib";

export const StandardPageContainer = chakra(Flex, {
  baseStyle: {
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "red.900",
    pt: NAVBAR_HEIGHT,
    color: "white",
  },
});
