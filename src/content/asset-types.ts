import type { BrandId } from "./types";

/**
 * What a file is for. The first 14 values are the spec contract; "avatar",
 * "manifest" and "watermark" were added because the Downloads pack lists them.
 */
export type AssetKind =
  | "primary"
  | "on-light"
  | "mono-white"
  | "mono-ink"
  | "horizontal"
  | "square"
  | "mark"
  | "app-icon"
  | "favicon"
  | "apple-touch"
  | "og"
  | "mascot"
  | "cursor"
  | "doc"
  | "avatar"
  | "manifest"
  | "watermark";

/** The background a file is designed to sit on (what to preview it over). */
export type AssetBg = "dark" | "light" | "transparent";

export type AssetFormat = "svg" | "png" | "jpg" | "ico" | "webp" | "pdf";

export interface BrandAsset {
  readonly id: string;
  readonly brand: BrandId;
  readonly kind: AssetKind;
  readonly label: string;
  /** Public path under /brand, for example '/brand/ventures/horizontal.png'. */
  readonly file: string;
  readonly format: AssetFormat;
  readonly width?: number;
  readonly height?: number;
  readonly bytes: number;
  readonly bg: AssetBg;
  /** "derived" files are never official: the UI must show a derived tag. */
  readonly source: "original" | "derived";
  /** Where the file came from, or how it was derived. */
  readonly provenance: string;
}

/** How trustworthy the vector situation is for a brand. */
export type VectorStatus = "original" | "traced" | "placeholder";

export interface BrandVectorStatus {
  readonly status: VectorStatus;
  /** Text for the Downloads UI. */
  readonly note: string;
}

/** A file that was expected but could not be collected. */
export interface MissingAsset {
  readonly brand: BrandId;
  readonly name: string;
  readonly reason: string;
}
