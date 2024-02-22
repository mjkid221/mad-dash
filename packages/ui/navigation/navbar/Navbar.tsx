import { Button, chakra, Flex, Spacer } from "@chakra-ui/react";
import Link from "next/link";

import { DarkModeButton } from "../dark-mode/DarkModeButton";

export const Navbar = () => (
  <NavbarContainer>
    <Link href="/">
      <Button>Home</Button>
    </Link>
    <Link href="/example">
      <Button>Example</Button>
    </Link>
    <Link href="/example-trpc">
      <Button>Example - tRPC</Button>
    </Link>
    <Link href="/zustand">
      <Button>Zustand</Button>
    </Link>
    <Link href="/api/docs">
      <Button>API Docs</Button>
    </Link>
    <Spacer />
    <DarkModeButton />
  </NavbarContainer>
);

const NavbarContainer = chakra(Flex, {
  baseStyle: {
    alignItems: "center",
    justifyContent: "flex-start",
    h: "60px",
    px: "10px",
    boxShadow: "base",
    position: "fixed",
    w: "full",
    zIndex: "999",
    gap: "10px",
  },
});
