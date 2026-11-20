// The foundations: ratios, and blends and sauces, written for this lab. Facts about cooking are
// common knowledge; the wording, choices and structure here are our own. Books that cover the
// same ground are listed under `reading` as recommendations, never copied.
//
// Ingredient ids are KitchenCatalog ids (the same ones Findish and the pairings use), so each
// one can link to "what goes with it" on the pairings page.
//
// The entries live in ratios-*.ts and blends-*.ts. This file gathers them and refuses to build
// if one is put together wrong (a link to a page that doesn't exist, a swap table with a
// missing cell), so a typo fails here and not on the live page.
import { RATIO_GROUPS, BLEND_REGIONS, R, B, type Ratio, type Blend, type Foundation } from './types';
import { doughs } from './ratios-doughs';
import { sauces } from './ratios-sauces';
import { pantry } from './ratios-pantry';
import { sweets } from './ratios-sweets';
import { asia } from './blends-asia';
import { middleEastAfrica } from './blends-middle-east-africa';
import { west } from './blends-west';

export * from './types';

const byGroup = <T, K extends string>(items: T[], groups: readonly { key: K }[], key: (item: T) => K) =>
  groups.flatMap((g) => items.filter((item) => key(item) === g.key));

export const ratios: Ratio[] = byGroup([...doughs, ...sauces, ...pantry, ...sweets], RATIO_GROUPS, (r) => r.group);
export const blends: Blend[] = byGroup([...asia, ...middleEastAfrica, ...west], BLEND_REGIONS, (b) => b.region);
export const foundations: Foundation[] = [...ratios, ...blends];

// ---------- Checks, run whenever the site builds ----------
const problems: string[] = [];
const pages = new Set([...ratios.map((r) => R + r.slug + '/'), ...blends.map((b) => B + b.slug + '/')]);
if (pages.size !== foundations.length) problems.push('two entries share a slug');

for (const r of ratios) {
  const say = (what: string) => problems.push(`ratio ${r.slug}: ${what}`);
  const keys = new Set(r.parts.map((p) => p.key));
  if (r.parts.length < 2) say('needs at least two parts');
  if (r.show === 'percent' && (r.parts.length !== 2 || r.parts[0].per !== 100)) say('a percent ratio is 100 of one part and some of another');
  if (!keys.has(r.start.of)) say(`starts with a part it doesn't have (${r.start.of})`);
  const ranged = r.parts.filter((p) => p.range);
  if (ranged.length > 1) say('only one part can have a range');
  if (ranged.length === 1 && !r.adjust) say('a part with a range needs `adjust` (the slider label and hint)');
  if (r.adjust && ranged.length === 0) say('`adjust` needs a part with a range');
  for (const p of ranged) {
    if (p.per < p.range![0] || p.per > p.range![1]) say(`${p.key} starts outside its range`);
    for (const s of r.adjust?.presets ?? []) if (s.per < p.range![0] || s.per > p.range![1]) say(`preset "${s.name}" is outside the range`);
  }
  for (const e of r.extras) if (e.of !== 'total' && !keys.has(e.of)) say(`extra "${e.name}" is sized against a part it doesn't have (${e.of})`);
  for (const s of r.swaps) if (s.values.length !== r.swapRows.length) say(`swap "${s.style}" has ${s.values.length} values for ${r.swapRows.length} rows`);
  for (const x of r.related) if (x.href && !pages.has(x.href)) say(`related link to a page that doesn't exist (${x.href})`);
}
for (const b of blends) {
  if (!b.amounts.length || !b.method.length || !b.uses.length) problems.push(`blend ${b.slug}: missing amounts, method or uses`);
}
if (problems.length) throw new Error('foundations.ts:\n  ' + problems.join('\n  '));
