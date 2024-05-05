import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export const StandardBadgeItem = ({ children }: { children: ReactNode }) => (
  <Box
    boxSize="75px"
    className="items"
    bgColor="transparentRed"
    borderRadius="12px"
    _hover={{
      transform: "scale(1.05)",
      cursor: "pointer",
    }}
    transition="transform 0.4s ease-in-out"
  >
    {children}
  </Box>
);
