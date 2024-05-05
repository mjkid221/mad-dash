import { Center, FlexProps, Img } from "@chakra-ui/react";

import { animatedHoverProps } from "../props";

export const StandardIconButton = ({
  imgSrc,
  onClick,
  ...props
}: {
  imgSrc: string;
  onClick?: () => void;
} & FlexProps) => (
  <Center
    borderRadius="full"
    boxSize="25px"
    p="1px"
    border="1px solid #4e3e3e"
    as="button"
    {...animatedHoverProps}
    _hover={{
      cursor: "pointer",
      border: "1px solid #fff",
    }}
    {...props}
  >
    <Img src={imgSrc} onClick={onClick} />
  </Center>
);
