import { getModelForClass } from "@typegoose/typegoose";

import {
  CollectionMintClass,
  CollectionHolderClass,
  NftCollectionClass,
} from "../classes";

export const CollectionMintModel = getModelForClass(CollectionMintClass);
export const NftCollectionModel = getModelForClass(NftCollectionClass);
export const CollectionHolderModel = getModelForClass(CollectionHolderClass);
