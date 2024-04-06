import { chakra, FormLabel, Text } from "@chakra-ui/react";

export const StyledFormLabel = chakra(FormLabel, {
  baseStyle: {
    fontSize: "19px",
    fontWeight: 600,
    userSelect: "none",
  },
});

export const StyledFormDescription = chakra(Text, {
  baseStyle: {
    fontSize: "sm",
    color: "gray.500",
    userSelect: "none",
  },
});

export const ErrorMessage = chakra(Text, {
  baseStyle: {
    fontSize: "sm",
    color: "red.500",
    pt: "10px",
    pb: "10px",
  },
});

export const WarningMessage = chakra(Text, {
  baseStyle: {
    fontSize: "sm",
    color: "orange.500",
    pt: "10px",
  },
});
