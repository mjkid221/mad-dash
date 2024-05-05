import { chakra, Flex, FlexProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export const StandardTextWrapper = ({
  children,
  ...props
}: { children: ReactNode } & FlexProps) => (
  <StandardWrapper {...props}>{children}</StandardWrapper>
);

const StandardWrapper = chakra(Flex, {
  baseStyle: {
    bg: "transparentRed",
    justifyContent: "space-between",
    borderRadius: "12px",
    p: "8px",
    alignItems: "center",
  },
});
