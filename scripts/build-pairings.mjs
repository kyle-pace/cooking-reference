// Builds public/cooking-reference/pairings.json from Findish's index: how often each pair of
// ingredients shares a recipe, on how many sites, and in which cuisines. The page does the
// scoring; this only counts.
//
//   npm run pairings                      (expects a clone of kyle-pace/recipe-search beside this repo,
//   node scripts/build-pairings.mjs ../recipe-search    with its index built: node scripts/build-index.mjs)
//
// The output is committed, because Cloudflare builds this repo without Findish next to it.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const rs = process.argv[2] || '../recipe-search';
const indexPath = join(rs, 'public/index.json');
if (!existsSync(indexPath)) {
  console.error(`No Findish index at ${indexPath}. In recipe-search, run: node scripts/build-index.mjs`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const catalog = JSON.parse(readFileSync(join(rs, 'vendor/kitchen-catalog/catalog.json'), 'utf8')).items;

// Shown only when someone asks for them: they go with everything.
const STAPLES = new Set(['salt', 'kosher-salt', 'sea-salt', 'fine-sea-salt', 'water', 'black-pepper', 'white-pepper', 'cooking-oil', 'neutral-oil', 'sugar', 'white-sugar', 'all-purpose-flour', 'cornstarch', 'baking-powder', 'baking-soda', 'ice']);
// Broad groups that say little as a pairing ("fresh herbs"): their kinds are listed instead.
const BUCKETS = new Set(['fresh-herbs', 'lemons-and-limes', 'leafy-greens', 'seafood', 'shellfish', 'fish', 'nuts', 'squash', 'garlic-and-onions', 'potatoes-and-root-vegetables', 'broth', 'noodles', 'rice', 'cheese', 'sausage', 'drinks', 'juice', 'asian-greens', 'dried-mushrooms', 'tinned-fish', 'lettuce', 'salad-greens']);
const MIN = 5; // recipes an ingredient needs to be scored at all
const MINCO = 3; // recipes a pair needs to be kept
const MIN_CUISINE = 30; // recipes a cuisine needs for its own view

const up = (id) => {
  const o = [];
  for (let p = catalog[id]?.parent, n = 0; p && n < 10; p = catalog[p]?.parent, n++) o.push(p);
  return o;
};
const ids = index.ing.map((g) => g[0]);
// Index rows: [site, name, link, minutes, cuisine, [ingredient positions], ...]
const recipes = index.recipes
  .map((r) => ({
    site: r[0],
    cuisine: r[4] || '',
    set: [...new Set(r[5] || [])].filter((p) => catalog[ids[p]] && !catalog[ids[p]].product && !BUCKETS.has(ids[p])).sort((a, b) => a - b),
  }))
  .filter((r) => r.set.length >= 2);

const byCuisine = new Map();
for (const r of recipes) if (r.cuisine) byCuisine.set(r.cuisine, (byCuisine.get(r.cuisine) || 0) + 1);
const cuisines = [...byCuisine].filter(([, n]) => n >= MIN_CUISINE).sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
const cIdx = new Map(cuisines.map((c, i) => [c.name, i]));

const count = ids.map(() => 0);
const sites = ids.map(() => new Set());
const perC = ids.map(() => cuisines.map(() => 0));
const pair = new Map();
for (const r of recipes) {
  const c = cIdx.get(r.cuisine);
  for (const a of r.set) {
    count[a]++;
    sites[a].add(r.site);
    if (c !== undefined) perC[a][c]++;
  }
  for (let i = 0; i < r.set.length; i++)
    for (let j = i + 1; j < r.set.length; j++) {
      const k = r.set[i] * 4096 + r.set[j];
      let e = pair.get(k);
      if (!e) pair.set(k, (e = { n: 0, sites: new Set(), c: new Map(), labeled: 0 }));
      e.n++;
      e.sites.add(r.site);
      if (r.cuisine) {
        e.labeled++;
        if (c !== undefined) e.c.set(c, (e.c.get(c) || 0) + 1);
      }
    }
}

const keep = ids.map((id, p) => count[p] >= MIN);
const pos = new Map();
const ing = [];
ids.forEach((id, p) => {
  if (!keep[p]) return;
  pos.set(p, ing.length);
  const g = index.ing[p];
  const also = (Array.isArray(g[3]) ? g[3] : g.slice(4)).filter((a) => typeof a === 'string').slice(0, 12);
  ing.push({ id, name: catalog[id].name, n: count[p], sites: sites[p].size, staple: STAPLES.has(id) ? 1 : 0, c: perC[p], also });
});
const related = (a, b) => up(a).includes(b) || up(b).includes(a);

// Each pair: [a, b, recipes together, sites, recipes together with a cuisine label, [cuisine, count, ...]]
const pairs = [];
for (const [k, e] of pair) {
  const a = Math.floor(k / 4096), b = k % 4096;
  if (e.n < MINCO || !keep[a] || !keep[b] || related(ids[a], ids[b])) continue;
  pairs.push([pos.get(a), pos.get(b), e.n, e.sites.size, e.labeled, [...e.c].filter(([, n]) => n >= 2).flat()]);
}
if (ing.length < 100 || pairs.length < 1000) {
  console.error(`Only ${ing.length} ingredients and ${pairs.length} pairs: something's wrong with the index. Not writing.`);
  process.exit(1);
}
const out = { built: index.built, recipes: recipes.length, labeled: recipes.filter((r) => r.cuisine).length, sites: index.sources.length, cuisines, ing, pairs };
writeFileSync('public/cooking-reference/pairings.json', JSON.stringify(out));
console.log(`${recipes.length} recipes (${out.labeled} with a cuisine), ${ing.length} ingredients, ${pairs.length} pairs, ${cuisines.length} cuisines; ${Math.round(JSON.stringify(out).length / 1024)} KB`);
