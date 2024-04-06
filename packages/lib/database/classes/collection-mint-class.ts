import { prop, modelOptions, Severity } from "@typegoose/typegoose";
import type { DocumentType, Ref } from "@typegoose/typegoose";

import { ClassBase } from "./class-base";
import { NftCollectionClass } from "./nft-collection-class";

export const CollectionMintClassName = "CollectionMintClass";

@modelOptions({
  schemaOptions: {
    collection: CollectionMintClassName,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class CollectionMintClass extends ClassBase {
  /**
   * Token Id
   */
  @prop({ required: true })
  public id!: string;

  @prop({ required: true, ref: () => NftCollectionClass })
  public collectionRef!: Ref<NftCollectionClass>;

  /**
   * Token mint address
   */
  @prop({ required: true, unique: true })
  public mint!: string;

  @prop({ required: false })
  public name?: string;

  @prop({ required: false })
  public image?: string;

  @prop({ required: false })
  public attributes?: {
    name: string;
    value: string;
    rarity: string;
  }[];

  @prop({ required: false })
  public rank?: number;
}

// Document type
export type CollectionMintDocument = Omit<
  DocumentType<CollectionMintClass>,
  "collectionRef"
>;
