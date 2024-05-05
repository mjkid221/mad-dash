import { Flex, chakra, Popover, PopoverTrigger, Box } from "@chakra-ui/react";
import { navigationItems } from "@mad-dash/lib";
import { useRouter } from "next/router";

import { BackpackConnectButton } from "../../shared";

import { PopoverNavContent } from "./PopoverNavContent";
import { SubNavItem } from "./SubNavItem";

export const SubNavSection = () => {
  const router = useRouter();

  return (
    <SubNavSectionContainer>
      {navigationItems.map(({ label, children, href, isDisabled }) => (
        <Box key={label}>
          <Popover trigger="click" placement="bottom-end">
            <PopoverTrigger>
              <Box>
                <SubNavItem
                  childItems={children}
                  label={label}
                  href={href}
                  isSelected={router.asPath === href}
                  isDisabled={isDisabled}
                />
              </Box>
            </PopoverTrigger>

            {children && children.length > 0 && (
              <PopoverNavContent navItems={children} />
            )}
          </Popover>
        </Box>
      ))}
      <BackpackConnectButton />
    </SubNavSectionContainer>
  );
};

const SubNavSectionContainer = chakra(Flex, {
  baseStyle: {
    alignItems: "center",
    height: "36px",
  },
});
