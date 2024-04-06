import { UseQueryResult } from "@tanstack/react-query";

import { UserTokensType } from "../../../solana";

export type UserTokensQueryResponse = Omit<
  UseQueryResult<UserTokensType[]>,
  "data"
>;

export type GetUserTokensQuery = {
  data: UserTokensType[];
} & UserTokensQueryResponse;
