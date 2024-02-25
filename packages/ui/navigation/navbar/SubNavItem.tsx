import { ChevronDownIcon } from "@chakra-ui/icons";
import { Center, Link, Text, forwardRef } from "@chakra-ui/react";
import { NavItem } from "@mad-land/lib";

export type NavItemProps = {
  label: string;
  href?: string;
  childItems?: Array<NavItem>;
  isSelected?: boolean;
  isDisabled?: boolean;
};

// ForwardRef required to forward popover events or triggers
export const SubNavItem = forwardRef(
  ({ label, href, childItems, isDisabled }, ref) => (
    <Link
      href={href}
      _hover={{ textDecoration: "none" }}
      ref={ref}
      _disabled={isDisabled}
    >
      <Center
        height="35px"
        padding="0px 12px"
        margin="0px 8px"
        bgColor="rgb(24 1 1 / 0.5)"
        borderRadius="full"
      >
        <Text
          fontSize="16px"
          fontWeight="600"
          whiteSpace="nowrap"
          color={isDisabled ? "gray.500" : "white"}
          _hover={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
        >
          {label} {childItems?.length && <ChevronDownIcon />}
        </Text>
      </Center>
    </Link>
  )
);
