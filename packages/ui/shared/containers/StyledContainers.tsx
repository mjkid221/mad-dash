import { Flex, FlexProps, chakra } from "@chakra-ui/react";
import { MAD_LADS_LOGO, NAVBAR_HEIGHT } from "@mad-land/lib";
import { ReactNode } from "react";

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

export const StandardMadLandPageContainer = ({
  children,
  ...props
}: {
  children: ReactNode;
} & FlexProps) => (
  <StandardPageContainer
    bgImage={MAD_LADS_LOGO}
    backgroundSize="480px"
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
    {...props}
  >
    <BlurOverlay>{children}</BlurOverlay>
  </StandardPageContainer>
);

const BlurOverlay = chakra(Flex, {
  baseStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pt: NAVBAR_HEIGHT,
    backdropFilter: "blur(40px)",
  },
});
