import { UseQueryResult } from "@tanstack/react-query";

export interface BaseCollectionHoldersFetchResponse {
  userAddress: string;
  quantity: number;
}

export type CollectionHoldersQueryResponse = Omit<
  UseQueryResult<BaseCollectionHoldersFetchResponse>,
  "data"
>;

export type GetCollectionHoldersQuery = {
  data: BaseCollectionHoldersFetchResponse[];
} & CollectionHoldersQueryResponse;
