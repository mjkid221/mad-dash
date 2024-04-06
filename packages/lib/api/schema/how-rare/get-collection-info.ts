/**
 * Query response type from howRare.is
 */
export type HowRareCollectionResponse = {
  result: CollectionDataType;
};

type CollectionDataType = {
  data: CollectionResultType;
};

type CollectionResultType = {
  items: CollectionItemsType[];
};

type CollectionItemsType = {
  id: number;
  mint: string;
  name: string;
  image: string;
  attributes: {
    name: string;
    value: string;
    rarity: string;
  };
  rank: number;
};
