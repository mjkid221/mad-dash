import { DecodeType, IdlTypes } from "@coral-xyz/anchor";
import { IdlType } from "@coral-xyz/anchor/dist/cjs/idl";
import { IDL } from "@coral-xyz/anchor/dist/cjs/native/system";

/**
 * Helpers to infer types from Anchor's IDL. We need to do this because the IDL is built to be consumed by Anchor and Rust runtime.
 * This means that the IDL is not directly consumable by Typescript.
 * For example, type "u64" in the IDL is represented as "BN" in Typescript.
 * @typedef {Name} Name Program's function name
 * @typedef {Program} Program Optional program IDL
 * @usage
 * ```ts
 * type InitializePoolArgs = ProgramIxStruct<"initializePool">;
 * ```
 * @author MJ
 */
export type ProgramIxStruct<Name extends string, Program> = UnionToIntersection<
  ExtractProperties<InstructionTypeByName<Program, Name>>
>;
export type ProgramAccStruct<
  Name extends string,
  Program
> = UnionToIntersection<ExtractProperties<AccountTypeByName<Program, Name>>>;

// Generalized type to fetch instruction or account by name from a list.
type NamedTypeFromList<List, Name extends string> = List extends Array<
  infer Item
>
  ? Item extends { name: Name }
    ? Item
    : never
  : never;

// Simplifies getting fields or args and their types
type ExtractProperties<T> = T extends
  | { type: { fields: infer Fields } }
  | { args: infer Fields }
  ? Fields extends Array<infer Field>
    ? Field extends { name: infer Name; type: infer Type extends IdlType }
      ? Name extends string
        ? { [P in Name]: DecodeType<Type, IdlTypes<typeof IDL>> }
        : never
      : never
    : never
  : never;

// Helper types to extract instruction and account types from a program
type InstructionTypeByName<Program, Name extends string> = Program extends {
  instructions: infer Instructions;
}
  ? NamedTypeFromList<Instructions, Name>
  : never;

type AccountTypeByName<Program, Name extends string> = Program extends {
  accounts: infer Accounts;
}
  ? NamedTypeFromList<Accounts, Name>
  : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
