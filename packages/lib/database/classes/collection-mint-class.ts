import { prop, modelOptions, Severity } from "@typegoose/typegoose";
import type { DocumentType, Ref } from "@typegoose/typegoose";

import { LadBadge } from "../../types/collection";

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

  /**
   * Image blurhash used with react-blurhash. Quick loading image placeholder.
   */
  @prop({ required: false })
  public imageBlurhash?: string;

  @prop({ required: false })
  public attributes?: {
    name: string;
    value: string;
    rarity: string;
  }[];

  @prop({ required: false })
  public rank?: number;

  @prop({ required: false, enum: LadBadge, type: String, default: [] })
  public badges?: LadBadge[];

  @prop({ required: false })
  public wormholeVestingPubkey?: string;
}

// Document type
export type CollectionMintDocument = Omit<
  DocumentType<CollectionMintClass>,
  "collectionRef"
>;
