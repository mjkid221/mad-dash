import {
  FormControl,
  HStack,
  InputGroup,
  Input,
  ChakraStyledOptions,
  InputAddonProps,
  InputLeftAddon,
  InputRightAddon,
  Flex,
} from "@chakra-ui/react";
import { get } from "lodash";
import { ReactNode } from "react";
import {
  RegisterOptions,
  UseFormReturn,
  FieldValues,
  Path,
} from "react-hook-form";

import {
  StyledFormLabel,
  StyledFormDescription,
  ErrorMessage,
} from "../form-text";

export interface IFormInput<T extends FieldValues>
  extends InputAddonProps,
    ChakraStyledOptions {
  label?: string;
  description?: string[] | string;
  field: Path<T>;
  type?: string;
  form: UseFormReturn<T>;
  registerOptions?: RegisterOptions;
  placeholder?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  showFormInvalidationErr?: boolean;
  leftAddonProps?: InputAddonProps;
  rightAddonProps?: InputAddonProps;
}

export const FormInput = <T extends FieldValues>({
  label,
  description,
  field,
  type = "text",
  form: {
    register,
    formState: { errors },
  },
  placeholder,
  registerOptions,
  leftAddon,
  rightAddon,
  isDisabled,
  leftAddonProps,
  rightAddonProps,
  showFormInvalidationErr,
  ...props
}: IFormInput<T>) => (
  <FormControl isInvalid={!!errors[field]} isDisabled={isDisabled}>
    {(label || description) && (
      <Flex flexDirection="column" mb="10px">
        {label && (
          <HStack>
            <StyledFormLabel>{label}</StyledFormLabel>
          </HStack>
        )}
        {description && typeof description === "string" ? (
          <StyledFormDescription>{description}</StyledFormDescription>
        ) : (
          (description as string[])?.map((text, key) => (
            // eslint-disable-next-line react/no-array-index-key -- allow
            <StyledFormDescription key={key}>{text}</StyledFormDescription>
          ))
        )}
      </Flex>
    )}
    <InputGroup
      opacity={isDisabled ? 0.3 : 1}
      pointerEvents={isDisabled ? "none" : "all"}
    >
      {leftAddon && (
        <InputLeftAddon
          border="none"
          p="8px"
          opacity={isDisabled ? 0.3 : 1}
          {...leftAddonProps}
        >
          {leftAddon}
        </InputLeftAddon>
      )}
      <Input
        {...props}
        required={registerOptions?.required as boolean}
        borderRadius="8px"
        type={type}
        isDisabled={isDisabled}
        placeholder={placeholder}
        {...register(field, registerOptions)}
        onKeyDown={
          type === "number" || type === "decimal"
            ? (e) => {
                // Prevents illegal inputs that count as numbers in HTML
                const illegalKeys = ["e", "E", "+"];
                const { value } = e.currentTarget;
                if (
                  illegalKeys.includes(e.key) ||
                  (e.key === "." && (value.includes(".") || value.length === 0))
                ) {
                  e.preventDefault();
                }
              }
            : undefined
        }
      />
      {rightAddon && (
        <InputRightAddon
          border="none"
          rounded="full"
          opacity={isDisabled ? 0.3 : 1}
          {...rightAddonProps}
        >
          {rightAddon}
        </InputRightAddon>
      )}
    </InputGroup>
    {showFormInvalidationErr && (
      <ErrorMessage>{get(errors, field)?.message?.toString()}</ErrorMessage>
    )}
  </FormControl>
);

export const InputTextWrapper = <T extends FieldValues>({
  label,
  description,
  children,
}: Pick<IFormInput<T>, "label" | "description"> & { children: ReactNode }) => (
  <Flex flexDir="column" pb="20px">
    <Flex flexDirection="column" mb="10px">
      {label && (
        <HStack>
          <StyledFormLabel>{label}</StyledFormLabel>
        </HStack>
      )}
      {description && typeof description === "string" ? (
        <StyledFormDescription>{description}</StyledFormDescription>
      ) : (
        (description as string[])?.map((text, key) => (
          // eslint-disable-next-line react/no-array-index-key -- allow
          <StyledFormDescription key={key}>{text}</StyledFormDescription>
        ))
      )}
    </Flex>
    {children}
  </Flex>
);
