import { useQuery } from "@tanstack/react-query";

import { baseApiInstance } from "../../../../api";
import {
  BaseCollectionHoldersFetchResponse,
  CollectionHoldersQueryResponse,
  GetCollectionHoldersQuery,
} from "../../../../types";

/**
 * Query key for `getMadLadsHolders` queries.
 */
export const GetMadLadsHolders = "get-mad-lads-holders";

export const getMadLadsHolders = async () => {
  const { data } = await baseApiInstance.get<
    BaseCollectionHoldersFetchResponse[]
  >("/nft/collections/mad-lads/holders");

  return data.slice(0, 50);
};

export const useGetMadLadsHolders = (): GetCollectionHoldersQuery => {
  const { data, ...queryResponse } = useQuery({
    queryKey: [GetMadLadsHolders],
    queryFn: () => getMadLadsHolders(),
  });

  return {
    data: data ?? [],
    ...(queryResponse as CollectionHoldersQueryResponse),
  };
};
