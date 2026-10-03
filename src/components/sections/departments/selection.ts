import type { BrandId } from "@/content/types";
import { PART_ORDER } from "../brands/parts/shared";
import type { ChapterPartKey } from "../brands/parts/shared";

/** The six departments, in column order A to F. */
export type DepartmentId = Exclude<BrandId, "ventures">;

export const DEPARTMENTS: readonly DepartmentId[] = ["media", "academy", "club", "labs", "mazal", "commune"];

export interface CellRef {
  readonly brand: DepartmentId;
  readonly part: ChapterPartKey;
}

export const DEFAULT_CELL: CellRef = { brand: "media", part: "essence" };

/** One line of purpose per part, shown in the formula bar. */
export const PART_PURPOSE: Readonly<Record<ChapterPartKey, string>> = {
  essence: "What the department is, and the line it speaks in.",
  logo: "The mark, its variants, clear space and misuse.",
  color: "Swatches, roles and contrast, in the department's own tokens.",
  type: "Font families, weights and the type scale.",
  voice: "How the department sounds, with do and don't.",
  components: "Live UI pieces built from the department's tokens.",
  imagery: "Photography, graphics and open-graph imagery.",
  applications: "The brand in use: mocks and brand-specific demos.",
  downloads: "Every file in the department's asset pack.",
};

export function columnLetter(brand: DepartmentId): string {
  return String.fromCharCode(65 + DEPARTMENTS.indexOf(brand));
}

export function rowNumber(part: ChapterPartKey): number {
  return PART_ORDER.indexOf(part) + 1;
}

/** Spreadsheet reference such as "C4". */
export function cellName(cell: CellRef): string {
  return `${columnLetter(cell.brand)}${rowNumber(cell.part)}`;
}

/** Deep link fragment such as "#academy-color". */
export function cellHash(cell: CellRef): string {
  return `#${cell.brand}-${cell.part}`;
}

export function cellKey(cell: CellRef): string {
  return `${cell.brand}-${cell.part}`;
}

export function sameCell(a: CellRef, b: CellRef): boolean {
  return a.brand === b.brand && a.part === b.part;
}

const isDepartment = (v: string): v is DepartmentId => (DEPARTMENTS as readonly string[]).includes(v);
const isPart = (v: string): v is ChapterPartKey => (PART_ORDER as readonly string[]).includes(v);

/** Parse "#brand" or "#brand-part". Anything else (including section ids like "#logo") returns null. */
export function parseHash(hash: string): CellRef | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const [brand, part, ...rest] = raw.split("-");
  if (rest.length > 0 || !isDepartment(brand)) return null;
  if (part === undefined) return { brand, part: DEFAULT_CELL.part };
  return isPart(part) ? { brand, part } : null;
}

const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max - 1);

/** Move by columns and rows, clamped to the sheet edges. */
export function moveCell(cell: CellRef, dx: number, dy: number): CellRef {
  const col = clamp(DEPARTMENTS.indexOf(cell.brand) + dx, DEPARTMENTS.length);
  const row = clamp(PART_ORDER.indexOf(cell.part) + dy, PART_ORDER.length);
  return { brand: DEPARTMENTS[col], part: PART_ORDER[row] };
}

export function rowEdge(cell: CellRef, end: boolean): CellRef {
  return { brand: end ? DEPARTMENTS[DEPARTMENTS.length - 1] : DEPARTMENTS[0], part: cell.part };
}

export function sheetCorner(end: boolean): CellRef {
  return { brand: end ? DEPARTMENTS[DEPARTMENTS.length - 1] : DEPARTMENTS[0], part: PART_ORDER[end ? PART_ORDER.length - 1 : 0] };
}
