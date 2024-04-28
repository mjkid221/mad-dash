import { Flex, Text, Box, FlexProps } from "@chakra-ui/react";
import { ReactNode } from "react";

import { StandardContainer } from "./StyledContainers";

export const TitledStandardContainer = ({
  title,
  children,
  orientation = "center",
  ...props
}: {
  title: string;
  children: ReactNode;
  orientation?: "left" | "center" | "right";
} & FlexProps) => (
  <Flex
    position="relative"
    width="100%"
    height="100%"
    justifyContent="center"
    {...props}
  >
    <StandardContainer {...props}>{children}</StandardContainer>
    <Box
      position="absolute"
      top="-5px"
      left={orientation === "left" ? "15px" : "auto"}
      right={orientation === "right" ? "15px" : "auto"}
      display="flex"
      px="4px"
      bg="red.400"
      borderRadius="8px"
    >
      <Text fontSize="8px" textAlign="center">
        {title}
      </Text>
    </Box>
  </Flex>
);
