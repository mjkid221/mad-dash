import { FlexProps } from "@chakra-ui/react";

export const animatedHoverProps: Pick<FlexProps, "_hover" | "transition"> = {
  _hover: {
    cursor: "pointer",
    transform: "scale(1.01)",
  },
  transition: "all 0.3s ease",
};
