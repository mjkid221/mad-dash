import { PublicKey } from "@solana/web3.js";
import {
  prop,
  modelOptions,
  DocumentType,
  Severity,
} from "@typegoose/typegoose";

import { SupportedCollection } from "../../types/collection";

const { isOnCurve } = PublicKey;

export const NftCollectionClassName = "NftCollectionClass";
@modelOptions({
  schemaOptions: {
    collection: NftCollectionClassName,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class NftCollectionClass {
  /**
   * Token mint address
   */
  @prop({
    required: true,
    unique: true,
    validate: {
      validator: (address: string) => isOnCurve(address),
    },
  })
  public collectionAddress!: string;

  @prop({
    required: false,
    enum: SupportedCollection,
    type: String,
    default: SupportedCollection.Unknown,
  })
  public collectionType?: SupportedCollection;

  @prop({ required: false })
  public collectionName?: string;

  @prop({ required: false })
  public image?: string;

  @prop({ required: false })
  public description?: string;

  @prop({
    required: false,
    validate: {
      validator: (url: string) => url.startsWith("http"),
      message: "Invalid URL",
    },
  })
  public externalUrl?: string;
}

// Document type
export type NftCollectionDocument = DocumentType<NftCollectionClass>;
