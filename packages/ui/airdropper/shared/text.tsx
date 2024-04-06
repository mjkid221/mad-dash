import { chakra, Text } from "@chakra-ui/react";

export const StandardHeader = chakra(Text, {
  baseStyle: {
    fontWeight: "bold",
    borderRadius: "8px",
    px: "8px",
    py: "2px",
    bg: "rgb(24 1 1 / 0.7)",
  },
});
