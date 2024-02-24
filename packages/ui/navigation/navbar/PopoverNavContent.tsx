import {
  Portal,
  PopoverContent,
  Stack,
  PopoverContentProps,
} from "@chakra-ui/react";
import { NavItem } from "@mad-land/lib/constants/navigation";

import { SubNavigation } from "./SubNavigation";

export const PopoverNavContent = ({
  navItems,
  propOverride,
}: {
  navItems: NavItem[];
  propOverride?: PopoverContentProps;
}) => (
  <Portal>
    <PopoverContent
      boxShadow="rgb(255, 255, 255)"
      padding="8px"
      borderRadius="8px"
      width="100%"
      backdropFilter="blur(16px)"
      bg="transparent"
      border="1px #4e3e3e solid"
      {...propOverride}
      _focus={{ boxShadow: "none !important" }}
    >
      <Stack>
        {navItems.map((item) => (
          <SubNavigation key={item.label} {...item} />
        ))}
      </Stack>
    </PopoverContent>
  </Portal>
);
