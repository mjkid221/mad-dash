import { useQuery } from "@tanstack/react-query";

import {
  GetUserTokensQuery,
  UserTokensQueryResponse,
  UserTokensType,
} from "../../../types";
import { getUserTokens } from "../../../utils";

export const GetUserTokensQueryKey = "get-user-tokens";
export const useGetUserTokens = ({
  userAddress,
  initialData,
}: {
  userAddress?: string;
  initialData?: UserTokensType[];
}): GetUserTokensQuery => {
  const { data, ...queryResponse } = useQuery({
    queryKey: [GetUserTokensQueryKey, userAddress],
    queryFn: () => getUserTokens({ userAddress }),
    initialData,
    enabled: !!userAddress,
    refetchOnWindowFocus: true,
  });

  return {
    data: data ?? [],
    ...(queryResponse as UserTokensQueryResponse),
  };
};
