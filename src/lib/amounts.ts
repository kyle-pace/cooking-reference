// Turning millilitres into the amounts a cook reads: spoons and cups with kitchen fractions.
// Used by the ratio pages at build time (the no-script amounts) and in the browser.

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
export type Unit = 'ml' | keyof typeof ML_PER;

/** How much a cook would measure: "180 ml (¾ cup)", "45 ml (3 tbsp)", "1½ tsp". */
export function volume(ml: number): string {
  if (ml < 12.5) return `${fraction(ml / ML_PER.tsp)} tsp`;
  const rounded = ml < 100 ? Math.round(ml) : Math.round(ml / 5) * 5;
  const cups = ml / ML_PER.cup;
  const spoon = ml < 60 ? `${fraction(ml / ML_PER.tbsp)} tbsp` : `${fraction(cups)} ${cups > 1.125 ? 'cups' : 'cup'}`;
  return `${rounded} ml (${spoon})`;
}

/** Teaspoons, for the small additions: "½ tsp", "1¼ tsp". */
export function teaspoons(tsp: number): string {
  if (tsp >= 3) return `${fraction(tsp / 3)} tbsp`;
  return `${fraction(tsp)} tsp`;
}

export function toMl(amount: number, unit: Unit): number {
  return unit === 'ml' ? amount : amount * ML_PER[unit];
}
