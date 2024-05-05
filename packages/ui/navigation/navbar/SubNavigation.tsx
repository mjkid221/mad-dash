import { Stack, Text, Box, Flex, Image, useTheme } from "@chakra-ui/react";
import { MAD_LADS_LOGO, NavItem, NavigationIconSelector } from "@mad-dash/lib/";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";

export const SubNavigation = ({ label, href, onClick, icon }: NavItem) => {
  const theme = useTheme();
  const iconColor = theme.colors.red[500];

  const returnIcons = (selector: NavigationIconSelector) => {
    if (NavigationIconSelector.MadLads === selector) {
      return <Image src={MAD_LADS_LOGO} width="36px" height="36px" />;
    }
    return (
      <SocialIcon
        url={href}
        fgColor="white"
        bgColor={iconColor}
        style={{ width: "36px", height: "36px" }}
      />
    );
  };
  return (
    <Link href={href ?? ""}>
      <Box role="group" display="block" rounded="md" w="100%">
        <Stack direction="row" align="center">
          <Flex
            onClick={onClick}
            gap="8px"
            flexDirection="row"
            alignItems="center"
          >
            {icon && (
              <Flex
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s ease-in-out"
              >
                {returnIcons(icon)}
              </Flex>
            )}
            {label && (
              <Text fontSize="16px" fontWeight={600}>
                {label}
              </Text>
            )}
          </Flex>
        </Stack>
      </Box>
    </Link>
  );
};
