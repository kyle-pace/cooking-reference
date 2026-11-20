// Turning millilitres and grams into the amounts a cook reads: spoons and cups with kitchen
// fractions, grams with ounces. Used by the ratio pages at build time (the no-script amounts)
// and in the browser.

const FRACTIONS: [number, string][] = [
  [0, ''],
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.5, '½'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
  [1, ''],
];

/** 1.5 → "1½", 0.25 → "¼". Rounds to the nearest quarter or third. */
export function fraction(x: number): string {
  let whole = Math.floor(x);
  const rest = x - whole;
  let best = FRACTIONS[0];
  for (const f of FRACTIONS) if (Math.abs(rest - f[0]) < Math.abs(rest - best[0])) best = f;
  if (best[0] === 1) whole += 1;
  const s = (whole ? String(whole) : '') + best[1];
  return s || '0';
}

export const ML_PER = { tsp: 5, tbsp: 15, cup: 240 } as const;
export const G_PER = { oz: 28.35, lb: 453.6 } as const;
export type VolumeUnit = 'ml' | keyof typeof ML_PER;
export type WeightUnit = 'g' | keyof typeof G_PER;
export type Unit = VolumeUnit | WeightUnit;

/** The units a ratio's calculator offers: spoons and cups for volume, grams and ounces for weight. */
export const UNITS: Record<'volume' | 'weight', { value: Unit; label: string }[]> = {
  volume: [
    { value: 'ml', label: 'ml' },
    { value: 'tbsp', label: 'tbsp' },
    { value: 'cup', label: 'cups' },
  ],
  weight: [
    { value: 'g', label: 'g' },
    { value: 'oz', label: 'oz' },
    { value: 'lb', label: 'lb' },
  ],
};

const trim = (x: number, places: number) => String(Number(x.toFixed(places)));

/** How much a cook would measure: "180 ml (¾ cup)", "45 ml (3 tbsp)", "1½ tsp", "2 L (8⅓ cups)". */
export function volume(ml: number): string {
  if (ml < 12.5) return teaspoons(ml / ML_PER.tsp);
  const cups = ml / ML_PER.cup;
  const spoon = ml < 60 ? `${fraction(ml / ML_PER.tbsp)} tbsp` : `${fraction(cups)} ${cups > 1.125 ? 'cups' : 'cup'}`;
  if (ml >= 1000) return `${trim(ml / 1000, 2)} L (${spoon})`;
  const rounded = ml < 100 ? Math.round(ml) : Math.round(ml / 5) * 5;
  return `${rounded} ml (${spoon})`;
}

/** Teaspoons, for the small additions: "a pinch", "½ tsp", "1¼ tsp", "2 tbsp", "¼ cup". */
export function teaspoons(tsp: number): string {
  if (tsp < 0.19) return 'a pinch';
  if (tsp >= 12) return `${fraction(tsp / 48)} ${tsp > 54 ? 'cups' : 'cup'}`;
  if (tsp >= 3) return `${fraction(tsp / 3)} tbsp`;
  return `${fraction(tsp)} tsp`;
}

/** Grams on their own: "7.5 g", "65 g", "325 g", "1.25 kg". */
export function grams(g: number): string {
  if (g >= 1000) return `${trim(g / 1000, 2)} kg`;
  if (g < 10) return `${trim(Math.round(g * 2) / 2, 1)} g`;
  return `${g < 100 ? Math.round(g) : Math.round(g / 5) * 5} g`;
}

function ounces(g: number): string {
  if (g < G_PER.lb) return `${fraction(g / G_PER.oz)} oz`;
  const lb = Math.floor(g / G_PER.lb);
  const oz = Math.round((g - lb * G_PER.lb) / G_PER.oz);
  if (oz === 16) return `${lb + 1} lb`;
  return oz ? `${lb} lb ${oz} oz` : `${lb} lb`;
}

/** What helps a cook read a weight: spoons for salt and yeast, millilitres for liquids, a count for eggs. */
export interface WeightHelp {
  /** Grams in a teaspoon, for things measured in small amounts. */
  gPerTsp?: number;
  /** True when a gram is a millilitre, near enough (water, milk, stock). */
  liquid?: boolean;
  /** Things that come whole, like eggs: what one weighs. */
  each?: { one: string; many: string; size: number };
}

/** How many whole things an amount is: "1 egg", "about 2½ eggs". */
export function count(amount: number, each: NonNullable<WeightHelp['each']>): string {
  const n = Math.round((amount / each.size) * 2) / 2;
  if (n < 0.5) return '';
  const exact = Math.abs(amount / each.size - n) < 0.06;
  return `${exact ? '' : 'about '}${fraction(n)} ${n > 1 ? each.many : each.one}`;
}

/** A weight with the reading that helps most beside it: "300 g (10½ oz)", "9 g (1½ tsp)", "195 g (195 ml)". */
export function weight(g: number, help: WeightHelp = {}): string {
  const main = grams(g);
  let aside = '';
  if (help.each) aside = count(g, help.each);
  else if (help.gPerTsp && g / help.gPerTsp < 12) aside = teaspoons(g / help.gPerTsp);
  else if (help.liquid) aside = g >= 1000 ? `${fraction(g / ML_PER.cup)} cups` : `${Math.round(g < 100 ? g : Math.round(g / 5) * 5)} ml`;
  else if (g >= 14) aside = ounces(g);
  return aside ? `${main} (${aside})` : main;
}

/** An amount in any unit, in the ratio's own base: millilitres or grams. */
export function toBase(amount: number, unit: Unit): number {
  if (unit === 'ml' || unit === 'g') return amount;
  return amount * (unit in ML_PER ? ML_PER[unit as keyof typeof ML_PER] : G_PER[unit as keyof typeof G_PER]);
}
