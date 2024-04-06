import { prop, modelOptions, Severity } from "@typegoose/typegoose";
import type { DocumentType, Ref } from "@typegoose/typegoose";

import { ClassBase } from "./class-base";
import { NftCollectionClass } from "./nft-collection-class";

export const CollectionHolderClassName = "CollectionHolderClass";
@modelOptions({
  schemaOptions: {
    collection: CollectionHolderClassName,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class CollectionHolderClass extends ClassBase {
  /**
   * Solana public key (ED25519)
   */
  @prop({
    required: true,
    unique: true,
  })
  public userAddress!: string;

  @prop({ required: true, ref: () => NftCollectionClass })
  public collectionRef!: Ref<NftCollectionClass>;

  /**
   * Quantity of the token held
   */
  @prop({ required: true })
  public quantity!: number;
}

// Document type
export type CollectionHolderDocument = Omit<
  DocumentType<CollectionHolderClass>,
  "collectionRef"
>;
