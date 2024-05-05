import { ChevronDownIcon } from "@chakra-ui/icons";
import { Center, Link, Text, forwardRef } from "@chakra-ui/react";
import { NavItem } from "@mad-dash/lib";
import { useRouter } from "next/router";

export type NavItemProps = {
  label: string;
  href?: string;
  childItems?: Array<NavItem>;
  isSelected?: boolean;
  isDisabled?: boolean;
};

// ForwardRef required to forward popover events or triggers
export const SubNavItem = forwardRef(
  ({ label, href, childItems, isDisabled }, ref) => {
    const router = useRouter();
    const isSelected = router.asPath === href;
    return (
      <Link
        href={isDisabled ? "/" : href}
        _hover={{ textDecoration: "none" }}
        ref={ref}
        _disabled={isDisabled}
      >
        <Center
          height="35px"
          padding="0px 12px"
          margin="0px 8px"
          bgColor="transparentRed"
          borderRadius="full"
          border={`1px ${
            isSelected ? "rgb(229, 231, 235)" : "transparent"
          } solid`}
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
    );
  }
);
