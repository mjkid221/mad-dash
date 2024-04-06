import {
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Image,
  Text,
  ButtonProps,
} from "@chakra-ui/react";
import {
  AirdropDistributionQueryType,
  UserTokensType,
  formatAddress,
  useTokenSelectStore,
} from "@mad-land/lib";
import { CollectionHolderSspType } from "@mad-land/lib/helpers/server-side-props";
import { UseFormReturn, Controller } from "react-hook-form";

export const TokenSelector = ({
  userTokens,
  formMethods,
  ...props
}: Omit<CollectionHolderSspType, "lastSnapshotDate"> & {
  formMethods: UseFormReturn<AirdropDistributionQueryType, any>;
} & ButtonProps) => {
  const {
    token: selectedToken,
    setIsOpen,
    setIsClosed,
    setToken: setSelectedToken,
  } = useTokenSelectStore();

  const formatTokenName = (token: UserTokensType) =>
    token?.name || token?.symbol || "Unknown";

  return (
    <Flex flex={3}>
      <Controller
        name="tokenMintAddress"
        control={formMethods.control}
        render={({ field }) => (
          <Menu matchWidth onOpen={setIsOpen} onClose={setIsClosed}>
            <MenuButton
              as={Button}
              width="100%"
              leftIcon={
                <Image
                  src={selectedToken?.image || "https://placehold.co/20x20"}
                  boxSize="20px"
                  borderRadius="full"
                  visibility={selectedToken ? "visible" : "hidden"}
                />
              }
              rightIcon={
                <Text
                  fontSize="8px"
                  color="gray.100"
                  visibility={selectedToken ? "visible" : "hidden"}
                >
                  QTY: {selectedToken?.tokenBalanceUI || 0}
                </Text>
              }
              borderRadius="8px"
              {...props}
            >
              {selectedToken ? formatTokenName(selectedToken) : "Select Token"}
            </MenuButton>
            <MenuList
              sx={{
                height: "400px",
                overflowY: "auto",
                backgroundColor: "transparent",
                backdropFilter: "blur(10px)",
                borderColor: "transparent",
              }}
            >
              {userTokens.map((token) => (
                <MenuItem
                  key={token?.mintAddress}
                  onClick={() => {
                    setSelectedToken(token);
                    formMethods.setValue("tokenMintAddress", token.mintAddress);
                    field.onChange(token?.mintAddress);
                  }}
                  command={formatAddress(token?.mintAddress)}
                  icon={
                    <Image
                      src={token?.image || "https://placehold.co/20x20"}
                      boxSize="20px"
                      borderRadius="full"
                    />
                  }
                  sx={{
                    backgroundColor: "transparent",
                  }}
                  _hover={{
                    backgroundColor: "rgb(255 255 255/0.1)",
                  }}
                >
                  {formatTokenName(token)}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      />
    </Flex>
  );
};
