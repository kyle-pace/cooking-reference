// The shapes of the foundations: ratios, and blends and sauces. The entries themselves are in
// ratios.ts and the blends-*.ts files; foundations.ts gathers and checks them.
import type { Unit, WeightHelp } from '../lib/amounts';

export interface Ingredient {
  name: string;
  /** KitchenCatalog id, when the catalog has it: links to its pairings. */
  id?: string;
}

export interface Swap {
  /** Column heading: a style, like "Japanese-style". */
  style: string;
  /** World cuisine page for that style's cuisine. */
  cuisine?: { name: string; href: string };
  /** One value per row in the ratio's `swapRows`. */
  values: string[];
}

export const RATIO_GROUPS = [
  { key: 'doughs', name: 'Bread and pasta doughs' },
  { key: 'batters', name: 'Pastry and batters' },
  { key: 'sauces', name: 'Sauces and dressings' },
  { key: 'salt', name: 'Meat, brines and pickles' },
  { key: 'grains', name: 'Rice and grains' },
  { key: 'stocks', name: 'Stocks' },
  { key: 'sweets', name: 'Custards and sweets' },
] as const;
export type RatioGroup = (typeof RATIO_GROUPS)[number]['key'];

/** One part of a ratio. Weight ratios can say how a cook reads each part (see WeightHelp). */
export interface Part extends WeightHelp {
  key: string;
  name: string;
  /** How many parts of it in the ratio. */
  per: number;
  ingredient?: Ingredient;
  /** For the one part a cook adjusts: the lowest and highest sensible `per`. */
  range?: [number, number];
  step?: number;
}

/** A small addition, sized against one part (or 'total'): "½ tsp for every 60 ml of acid". */
export interface Extra {
  name: string;
  amount: number;
  unit: 'tsp' | 'g';
  per: number;
  of: string;
  ingredient?: Ingredient;
  note?: string;
}

export interface Ratio {
  kind: 'ratio';
  slug: string;
  name: string;
  /** One sentence for the index and the share card. */
  summary: string;
  group: RatioGroup;
  /** What the parts are measured in: spoons and cups, or a scale. */
  measure: 'volume' | 'weight';
  /** 'percent' is for two parts where the second is read as a percentage of the first (a 5% brine). */
  show?: 'percent';
  /** The parts in the order a cook says them. The first is the strong color in the bar. */
  parts: Part[];
  /** The ratio in words, when the usual "3 parts this, 1 part that" doesn't fit. */
  said?: string;
  /** What the calculator starts with, and what the page shows without JavaScript. */
  start: { amount: number; unit: Unit; of: string };
  /** For the part with a `range`: its slider's label and hint, and named settings to pick from. */
  adjust?: { label: string; hint: string; presets?: { name: string; per: number }[] };
  extras: Extra[];
  /** What the parts add up to, as in "Makes about 840 g of dough". Leave out when a total means nothing. */
  makes?: string;
  /** A line under the amounts: what an egg weighs, how many it feeds. */
  note?: string;
  why: string[];
  method: string[];
  swapRows: string[];
  swaps: Swap[];
  related: { name: string; note: string; href?: string }[];
  findish: { label: string; query: string };
  reading: { title: string; author: string }[];
}

export const BLEND_REGIONS = [
  { key: 'south-asia', name: 'South Asia' },
  { key: 'east-asia', name: 'East Asia' },
  { key: 'southeast-asia', name: 'Southeast Asia' },
  { key: 'middle-east', name: 'Middle East and the Caucasus' },
  { key: 'africa', name: 'Africa' },
  { key: 'europe', name: 'Europe' },
  { key: 'americas', name: 'The Americas and the Caribbean' },
] as const;
export type BlendRegion = (typeof BLEND_REGIONS)[number]['key'];

export interface Blend {
  kind: 'blend';
  slug: string;
  name: string;
  summary: string;
  region: BlendRegion;
  /** A dry spice blend, a mix of herbs, a pounded paste or a sauce. */
  form: 'dry' | 'herbs' | 'paste' | 'sauce';
  /** What it is, in a short paragraph or two. */
  about: string[];
  cuisine: { name: string; href: string };
  makes: string;
  amounts: { amount: string; ingredient: Ingredient; note?: string }[];
  method: string[];
  varies: string[];
  makeOrBuy: string[];
  uses: string[];
  /** The blend's own id in KitchenCatalog, for "what goes with it" and Findish. */
  id?: string;
  reading: { title: string; author: string }[];
}

export type Foundation = Ratio | Blend;

export const WC = 'https://kylepace.dev/world-cuisine/cuisine/';
/** A World cuisine link: wc('French', 'french-cuisine'). */
export const wc = (name: string, slug: string) => ({ name, href: `${WC}${slug}/` });
export const R = '/cooking-reference/ratios/';
export const B = '/cooking-reference/blends/';
