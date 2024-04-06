import { chakra, Flex } from "@chakra-ui/react";

export const StandardContainer = chakra(Flex, {
  baseStyle: {
    gap: "8px",
    flexDir: "column",
    width: "100%",
    flex: 1,
    border: "1px #4e3e3e solid",
    p: "16px",
    borderRadius: "8px",
    boxShadow: "0 0 1px 0 rgb(24 1 1 / 0.4)",
  },
});
