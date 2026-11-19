// Events for the links out of a ratio or blend page: to the pairings, to Findish and to
// World cuisine. Each carries the page's foundation and never anything typed.
import { track } from '../lib/track';

const foundation = document.querySelector<HTMLElement>('[data-foundation]')?.dataset.foundation || '';
const kind = location.pathname.includes('/blends/') ? 'blend' : 'ratio';

document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-out-link]');
  if (!a) return;
  const to = a.dataset.outLink;
  if (to === 'pairings') track('Opened Pairings', { foundation, opened_from: kind, ingredient_id: a.hash.slice(1) });
  else if (to === 'findish') track('Opened Findish Link', { foundation, opened_from: kind });
  else if (to === 'world-cuisine') track('Opened World Cuisine', { foundation, opened_from: kind, cuisine: a.textContent?.trim() || '' });
});
