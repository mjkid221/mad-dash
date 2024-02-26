import { chakra, Flex } from "@chakra-ui/react";
import { NAVBAR_HEIGHT } from "@mad-land/lib";
import { DesktopNav } from "@mad-land/ui";
import { ReactNode } from "react";

export const Navbar = () => (
  <StandardNavbarWrapper>
    <NavbarContainer>
      <Flex display={{ base: "none", sm: "flex" }}>
        <DesktopNav />
      </Flex>
    </NavbarContainer>
  </StandardNavbarWrapper>
);
const StandardNavbarWrapper = ({ children }: { children: ReactNode }) => (
  <Flex width="100%" pos="sticky" zIndex={99}>
    {children}
  </Flex>
);

const NavbarContainer = chakra(Flex, {
  baseStyle: {
    position: "absolute",
    height: NAVBAR_HEIGHT,
    py: "32px",
    px: "36px",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    w: "full",
  },
});
