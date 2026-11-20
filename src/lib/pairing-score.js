// How well two ingredients go together, from the counts in pairings.json. Shared by the
// pairings page (src/scripts/pairings.js) and the benchmark (scripts/benchmark-pairings.mjs),
// so the check always measures what the page shows.

/** Shared recipes a pair needs before it's scored. */
export const MIN_CO = 3;
/** In one cuisine, an ingredient in this share of its recipes is one of its staples, not a pairing. */
export const STAPLE_AT = 0.3;
/** A cuisine with fewer recipes than this is labelled "few recipes". */
export const THIN = 100;

/** Each ingredient's pairs, both ways round: links[a].get(b) is the pair's row. */
export function linksOf(data) {
  const links = data.ing.map(() => new Map());
  for (const p of data.pairs) { links[p[0]].set(p[1], p); links[p[1]].set(p[0], p); }
  return links;
}

/**
 * How well b goes with a, seen from a's side, in all recipes (scope -1) or in one cuisine.
 * The score is how far above chance they share recipes (thin evidence counts for less:
 * the shared recipes are discounted by their own square root), plus credit for how much
 * more of a's cooking b is in than of cooking in general (so fish sauce, in most Thai
 * recipes, earns nothing for being in most Thai chicken recipes too). In one cuisine, that
 * cuisine's staples aren't pairings at all. One site alone never makes a pairing.
 */
export function link(data, links, a, b, scope) {
  const p = links[a].get(b);
  if (!p) return null;
  let N = data.recipes, na = data.ing[a].n, nb = data.ing[b].n, co = p[2];
  if (scope >= 0) {
    N = data.cuisines[scope].n; na = data.ing[a].c[scope]; nb = data.ing[b].c[scope]; co = 0;
    for (let i = 0; i < p[5].length; i += 2) if (p[5][i] === scope) co = p[5][i + 1];
  }
  if (co < MIN_CO || !na || !nb) return null;
  const base = nb / N, share = co / na, lift = share / base;
  if (lift < 1.15 || (scope >= 0 && base >= STAPLE_AT)) return null;
  const pxy = (co - Math.sqrt(co)) / N;
  const score = Math.log(pxy / ((na / N) * (nb / N))) / -Math.log(pxy) + 0.25 * Math.sqrt(Math.max(0, share - base));
  let mostly = '';
  if (scope < 0 && p[4] >= 3) for (let i = 0; i < p[5].length; i += 2) if (p[5][i + 1] / p[4] >= 0.6) mostly = data.cuisines[p[5][i]].name;
  const band = p[3] < 2 ? (score >= 0.14 ? 'one' : '') : score >= 0.38 && share >= 0.04 ? 'strong' : score >= 0.25 && share >= 0.02 ? 'good' : score >= 0.14 ? 'try' : '';
  return { a, c: b, score, co, share, sites: p[3], mostly, band };
}
