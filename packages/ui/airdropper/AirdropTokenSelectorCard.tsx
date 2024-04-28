import { Flex, Button, Checkbox, chakra } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AirdropDistributionQueryType,
  GetCollectionHoldersQuery,
  GetUserTokensQueryKey,
  airdropDistributionQuerySchema,
  useComputeAirdropDistribution,
  useDistributeAirdrop,
  useTokenSelectStore,
} from "@mad-land/lib";
import { CollectionHolderSspType } from "@mad-land/lib/helpers/server-side-props";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { FormInput } from "../forms";
import { useSessionAddress } from "../hooks/use-session-address";
import { StandardContainer, animatedHoverProps } from "../shared";

import { DistributionChart } from "./DistributionChart";
import { TokenSelector } from "./TokenSelector";

export const AirdropTokenSelectorCard = ({
  userTokens,
  data: holdersData,
}: CollectionHolderSspType & GetCollectionHoldersQuery) => {
  const { isOpen, token } = useTokenSelectStore();
  const { isConnected, address: userAddress } = useSessionAddress();
  const queryClient = useQueryClient();

  const formMethods = useForm<AirdropDistributionQueryType>({
    resolver: zodResolver(airdropDistributionQuerySchema),
    defaultValues: {
      isWeighted: true,
    },
    mode: "onChange",
  });

  const [distributionAmount, isWeighted] = formMethods.watch([
    "distributionAmount",
    "isWeighted",
  ]);
  const { data: airdropDistributionResult } = useComputeAirdropDistribution({
    data: holdersData,
    distributionAmount: distributionAmount * 10 ** (token?.tokenDecimals ?? 0),
    isWeighted,
  });

  const distributionData = airdropDistributionResult?.distributionData ?? [];

  const { mutate: distributeAirdrop, isLoading: isDistributing } =
    useDistributeAirdrop({
      airdropDistributionResult,
      onSuccess: () => {
        const queryKey = [GetUserTokensQueryKey, userAddress];
        queryClient.invalidateQueries({ queryKey });
        formMethods.reset();
        toast.success("Airdrop successful.");
      },
    });

  const onSubmit = async () => distributeAirdrop();

  const isDisabled =
    !formMethods.formState.isValid ||
    (token?.tokenBalanceUI ?? 0) < distributionAmount ||
    !distributionAmount ||
    isDistributing;

  const disableOverride = {
    isDisabled: !isConnected || userTokens.length === 0,
  };
  return (
    <StandardContainer flexDir="row">
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          style={{ width: "100%" }}
        >
          <Flex flexDir="column" justifyContent="space-between" height="100%">
            <Flex gap="8px" flexDir="column" width="100%">
              {/* Inputs */}
              <StandardInputWrapper>
                <TokenSelector
                  userTokens={userTokens}
                  formMethods={formMethods}
                  {...disableOverride}
                />
              </StandardInputWrapper>
              {!isOpen && (
                <StandardInputWrapper>
                  <FormInput<AirdropDistributionQueryType>
                    form={formMethods}
                    field="distributionAmount"
                    name="Distribution Amount"
                    placeholder="Amount"
                    registerOptions={{ required: true }}
                    type="decimal"
                    leftAddon="MAX"
                    leftAddonProps={{
                      onClick: () =>
                        formMethods.setValue(
                          "distributionAmount",
                          token?.tokenBalanceUI || 0
                        ),
                      _hover: {
                        cursor: "pointer",
                      },
                    }}
                    max={token?.tokenBalanceUI ?? 0}
                    {...disableOverride}
                  />

                  <StyledInputContainer flex={1}>
                    <Controller
                      name="isWeighted"
                      control={formMethods.control}
                      render={({ field }) => (
                        <Checkbox
                          colorScheme="red"
                          defaultChecked={field.value}
                          onChange={(e) => {
                            formMethods.setValue(
                              "isWeighted",
                              e.target.checked
                            );
                            field.onChange(e.target.checked);
                          }}
                          {...disableOverride}
                        >
                          Weighted
                        </Checkbox>
                      )}
                    />
                  </StyledInputContainer>
                </StandardInputWrapper>
              )}
            </Flex>
            <DistributionChart
              distributionData={distributionData}
              display={isOpen ? "none" : "flex"}
            />
            <Button
              type="submit"
              width="100%"
              isDisabled={isDisabled}
              {...animatedHoverProps}
            >
              Airdrop
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </StandardContainer>
  );
};

const StandardInputWrapper = chakra(Flex, {
  baseStyle: {
    flexDir: "row",
    gap: "8px",
    width: "100%",
    height: "40px",
  },
});

const StyledInputContainer = chakra(StandardInputWrapper, {
  baseStyle: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.24)",
    justifyContent: "center",
  },
});
