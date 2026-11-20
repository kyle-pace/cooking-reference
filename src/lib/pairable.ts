// Which ingredient ids the pairings page knows. A ratio or blend can name any KitchenCatalog
// id, but "what goes with it" only links the ones the pairings data holds, so no link leads
// to an empty page. Build-time only: the pages are prerendered, so this never reaches a browser.
import data from '../../public/cooking-reference/pairings.json';

const known = new Set((data.ing as { id: string }[]).map((i) => i.id));

/** The ingredients that have pairings, once each, in the order given. */
export function pairable(ingredients: ({ name: string; id?: string } | undefined)[]): { name: string; id: string }[] {
  const seen = new Set<string>();
  const out: { name: string; id: string }[] = [];
  for (const g of ingredients) {
    if (!g?.id || !known.has(g.id) || seen.has(g.id)) continue;
    seen.add(g.id);
    out.push({ name: g.name.replace(/, .*| \(.*/, ''), id: g.id });
  }
  return out;
}
