export type BrandId =
  | "ventures"
  | "media"
  | "academy"
  | "club"
  | "labs"
  | "mazal"
  | "commune";

export interface Swatch {
  readonly name: string;
  readonly hex?: string;
  readonly css?: string;
  readonly role: string;
  readonly group?: string;
}

export interface FontSpec {
  readonly family: string;
  readonly weights: string;
  readonly role: string;
  readonly googleName: string;
  readonly cssVar?: string;
}

export interface UiRecipe {
  readonly label: string;
  readonly value: string;
}

export interface Brand {
  readonly id: BrandId;
  readonly name: string;
  readonly domain?: string;
  readonly tagline?: string;
  readonly descriptor: string;
  readonly status: "live" | "dev" | "placeholder" | "unbranded";
  readonly swatches: readonly Swatch[];
  readonly fonts: readonly FontSpec[];
  readonly voice: readonly string[];
  readonly dos: readonly string[];
  readonly donts: readonly string[];
  readonly ui: readonly UiRecipe[];
  readonly accent: string;
  readonly accentRgb: readonly [number, number, number];
  readonly flags: readonly string[];
}

export interface NavSection {
  readonly id: string;
  readonly num: string;
  readonly title: string;
  readonly brand: BrandId;
}

export interface NavPart {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly sections: readonly NavSection[];
}
