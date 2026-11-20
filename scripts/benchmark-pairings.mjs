// Checks the pairings against an outside dataset: the recipes behind Ahn et al., "Flavor network
// and the principles of food pairing" (Scientific Reports, 2011), about 56,000 recipes from
// Allrecipes, Epicurious and Menupan labelled by region. CC BY 4.0, from Zenodo
// (doi:10.5281/zenodo.11449657). It's only a yardstick: nothing from it is shown on the site.
//
//   npm run benchmark            (downloads the dataset into .cache/ the first time)
//
// For each region it prints:
//   1. The ingredients most distinctive of that region (how much more common there than
//      elsewhere), in their data and in ours, and which of theirs we don't rank.
//   2. Their region's most distinctive pairs, and whether our pairings page (same scoring code,
//      src/lib/pairing-score.js) puts each in a band in the matching cuisine.
// Their ingredient names are read with KitchenCatalog's matcher, so both sides use catalog ids.
// Their data is older, mostly American sites, with coarse names ("fish" for fish sauce), so
// disagreement is a reason to look, not proof we're wrong.

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { link, linksOf } from '../src/lib/pairing-score.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cache = join(root, '.cache', 'ahn');
const dir = join(cache, 'scirep-cuisines-detail');
const ZIP = 'https://zenodo.org/api/records/11449658/files/flavor_network_data.zip/content';
const vendor = join(root, '..', 'recipe-search', 'vendor', 'kitchen-catalog');

if (!existsSync(dir)) {
  console.log('Downloading the Ahn et al. dataset (830 KB, CC BY 4.0) into .cache/ahn ...');
  mkdirSync(cache, { recursive: true });
  const res = await fetch(ZIP, { headers: { 'user-agent': 'cooking-reference-benchmark' } });
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  writeFileSync(join(cache, 'data.zip'), Buffer.from(await res.arrayBuffer()));
  execFileSync('unzip', ['-oq', join(cache, 'data.zip'), '-d', cache]);
}
if (!existsSync(join(vendor, 'catalog.mjs'))) throw new Error(`Needs a clone of kyle-pace/recipe-search beside this repo (for ${vendor}).`);
const { load, match } = await import(join(vendor, 'catalog.mjs'));
const catalog = load(join(vendor, 'catalog.json'));

// Our cuisines, grouped into their regions. Cuisines left out are too broad to place.
const REGIONS = {
  SoutheastAsian: ['Thai', 'Vietnamese', 'Filipino'],
  EastAsian: ['Chinese', 'Japanese', 'Korean'],
  SouthAsian: ['Indian'],
  LatinAmerican: ['Mexican'],
  SouthernEuropean: ['Italian', 'Greek', 'Mediterranean'],
  MiddleEastern: ['Middle Eastern', 'Lebanese', 'Persian', 'Turkish'],
  WesternEuropean: ['French'],
  NorthAmerican: ['American'],
};
const TOP = 15, PAIRS = 12;

// ---- Their recipes, as sets of catalog ids, by region ----
const regionOf = new Map(readFileSync(join(dir, 'map.txt'), 'utf8').trim().split('\n').map((l) => l.split('\t')));
const named = new Map();
const idOf = (name) => {
  if (!named.has(name)) { const m = match(catalog, name.replace(/_/g, ' ')); named.set(name, m && m.strength === 'strong' ? m.id : null); }
  return named.get(name);
};
const theirs = [];
for (const f of ['allr_recipes.txt', 'epic_recipes.txt', 'menu_recipes.txt']) {
  for (const line of readFileSync(join(dir, f), 'utf8').split('\n')) {
    const [label, ...names] = line.trim().split('\t');
    if (!label || !names.length) continue;
    const region = regionOf.get(label) || (Object.hasOwn(REGIONS, label) ? label : null);
    if (!region) continue;
    const ids = new Set(names.map(idOf).filter(Boolean));
    if (ids.size >= 2) theirs.push({ region, ids });
  }
}
const unmatched = [...named].filter(([, id]) => !id).map(([n]) => n);

// ---- Ours ----
const data = JSON.parse(readFileSync(join(root, 'public', 'cooking-reference', 'pairings.json'), 'utf8'));
const links = linksOf(data);
const at = new Map(data.ing.map((g, i) => [g.id, i]));
const cuisineAt = new Map(data.cuisines.map((c, i) => [c.name, i]));
const labelled = data.cuisines.reduce((s, c) => s + c.n, 0);
const ourCount = (i, cs) => cs.reduce((s, c) => s + data.ing[i].c[c], 0);
const ourTotal = data.ing.map((g) => g.c.reduce((s, x) => s + x, 0));
// Pantry staples (salt, oil, flour, sugar and their kinds) are hidden on the page unless asked
// for, and which kind of salt a recipe names is a site's habit, not a cuisine's: left out of both sides.
const pantry = new Set(data.ing.filter((g) => g.staple).map((g) => g.id));

// How much more common an ingredient is in a region than outside it: the measure Ahn et al. call
// authenticity. Needs a few recipes in the region so a single odd recipe doesn't top the list.
function distinctive(inRegion, nIn, total, nAll, minIn) {
  return [...inRegion].filter(([, k]) => k >= minIn).map(([id, k]) => ({ id, d: k / nIn - ((total.get(id) || 0) - k) / Math.max(1, nAll - nIn) })).sort((a, b) => b.d - a.d);
}
const name = (id) => catalog.items[id]?.name || id;
const pct = (x) => `${Math.round(x * 100)}%`;

let agreeIng = 0, totalIng = 0, banded = 0, listed = 0, scored = 0;
console.log(`Ahn et al.: ${theirs.length.toLocaleString()} recipes read; ${named.size - unmatched.length} of ${named.size} ingredient names matched to the catalog.`);
console.log(`Ours: ${data.recipes.toLocaleString()} recipes, ${labelled.toLocaleString()} with a cuisine.\n`);

for (const [region, cuisines] of Object.entries(REGIONS)) {
  const cs = cuisines.map((c) => cuisineAt.get(c)).filter((c) => c !== undefined);
  if (!cs.length) continue;
  const nOurs = cs.reduce((s, c) => s + data.cuisines[c].n, 0);
  const rec = theirs.filter((r) => r.region === region);
  if (rec.length < 30) { console.log(`## ${region}: only ${rec.length} of their recipes, skipped\n`); continue; }

  // 1. Distinctive ingredients
  const tIn = new Map(), tAll = new Map();
  for (const r of theirs) for (const id of r.ids) { if (pantry.has(id)) continue; tAll.set(id, (tAll.get(id) || 0) + 1); if (r.region === region) tIn.set(id, (tIn.get(id) || 0) + 1); }
  const theirTop = distinctive(tIn, rec.length, tAll, theirs.length, 5).slice(0, TOP);
  const oIn = new Map(), oAll = new Map();
  data.ing.forEach((g, i) => { if (g.staple) return; oAll.set(g.id, ourTotal[i]); const k = ourCount(i, cs); if (k) oIn.set(g.id, k); });
  const ourRank = distinctive(oIn, nOurs, oAll, labelled, 3);
  const ourTop = ourRank.slice(0, TOP);
  const ourSet = new Set(ourRank.slice(0, TOP * 2).map((x) => x.id));
  const shared = theirTop.filter((x) => ourSet.has(x.id));
  agreeIng += shared.length; totalIng += theirTop.length;

  console.log(`## ${region}  (theirs ${rec.length.toLocaleString()} recipes; ours ${nOurs.toLocaleString()}: ${cuisines.join(', ')})`);
  console.log(`  Most distinctive, theirs: ${theirTop.map((x) => `${name(x.id)} +${pct(x.d)}`).join(', ')}`);
  console.log(`  Most distinctive, ours:   ${ourTop.map((x) => `${name(x.id)} +${pct(x.d)}`).join(', ')}`);
  console.log(`  ${shared.length} of their top ${theirTop.length} are in our top ${TOP * 2}.` + (theirTop.length > shared.length ? ` Not there: ${theirTop.filter((x) => !ourSet.has(x.id)).map((x) => `${name(x.id)}${oIn.has(x.id) ? ` (we have ${oIn.get(x.id)})` : ' (none of ours)'}`).join(', ')}.` : ''));

  // 2. Distinctive pairs: their pair share in the region minus outside, for pairs in 3%+ of the region's recipes
  const pIn = new Map(), pAll = new Map();
  for (const r of theirs) {
    const ids = [...r.ids].sort();
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      if (pantry.has(ids[i]) || pantry.has(ids[j])) continue;
      const k = ids[i] + '|' + ids[j];
      pAll.set(k, (pAll.get(k) || 0) + 1);
      if (r.region === region) pIn.set(k, (pIn.get(k) || 0) + 1);
    }
  }
  const topPairs = distinctive(pIn, rec.length, pAll, theirs.length, Math.max(5, rec.length * 0.03)).slice(0, PAIRS);
  const rows = topPairs.map(({ id }) => {
    const [x, y] = id.split('|');
    const a = at.get(x), b = at.get(y);
    if (a === undefined || b === undefined) return `${name(x)} + ${name(y)}: not in our data`;
    // Best of the region's cuisines, from either side, as the page would show it.
    let best = null;
    for (const c of cs) for (const l of [link(data, links, a, b, c), link(data, links, b, a, c)]) if (l && l.band && (!best || l.score > best.score)) best = { ...l, cuisine: data.cuisines[c].name };
    scored++;
    if (best && best.band !== 'one') banded++;
    const staple = cs.find((c) => data.ing[a].c[c] / data.cuisines[c].n >= 0.3 || data.ing[b].c[c] / data.cuisines[c].n >= 0.3);
    // On the cuisine's staples line instead: the page still says they belong together there.
    if (!(best && best.band !== 'one') && staple !== undefined) listed++;
    return `${name(x)} + ${name(y)}: ${best ? `${best.band} in ${best.cuisine} (${best.score.toFixed(2)})` : staple !== undefined ? `on the ${data.cuisines[staple].name} staples line` : 'not a pairing in ours'}`;
  });
  console.log(`  Their most distinctive pairs, and what our page says:\n    ${rows.join('\n    ')}\n`);
}
console.log(`Overall: ${agreeIng} of ${totalIng} of their distinctive ingredients are in our top ${TOP * 2}; of their ${scored} distinctive pairs in our data, ${banded} are a pairing on our page and ${listed} more are on a staples line; ${scored - banded - listed} are missing.`);
console.log(`Their names with no catalog match (${unmatched.length}): ${unmatched.slice(0, 40).join(', ')}${unmatched.length > 40 ? ', ...' : ''}`);
