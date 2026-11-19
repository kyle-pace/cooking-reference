// The foundations: ratios and spice blends, written for this lab. Facts about cooking are
// common knowledge; the wording, choices and structure here are our own. Books that cover the
// same ground are listed under `reading` as recommendations, never copied.
//
// Ingredient ids are KitchenCatalog ids (the same ones Findish and the pairings use), so each
// one can link to "what goes with it" on the pairings page.

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

export interface Ratio {
  kind: 'ratio';
  slug: string;
  name: string;
  /** One sentence for the index and the share card. */
  summary: string;
  /** The parts, biggest first. `per` is how many parts of it in the ratio. */
  parts: { key: string; name: string; per: number; ingredient: Ingredient; range?: [number, number] }[];
  /** Small additions, as teaspoons per 60 ml (1/4 cup) of the smallest part. */
  extras: { name: string; tspPer60ml: number; ingredient?: Ingredient; note?: string }[];
  why: string[];
  method: string[];
  swapRows: string[];
  swaps: Swap[];
  related: { name: string; note: string; href?: string }[];
  findish: { label: string; query: string };
  reading: { title: string; author: string }[];
}

export interface Blend {
  kind: 'blend';
  slug: string;
  name: string;
  summary: string;
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

const WC = 'https://kylepace.dev/world-cuisine/cuisine/';

export const ratios: Ratio[] = [
  {
    kind: 'ratio',
    slug: 'vinaigrette',
    name: 'Vinaigrette',
    summary: 'The everyday salad dressing: oil, acid, salt and something to hold them together.',
    parts: [
      { key: 'oil', name: 'oil', per: 3, ingredient: { name: 'olive oil', id: 'olive-oil' }, range: [2, 4] },
      { key: 'acid', name: 'acid', per: 1, ingredient: { name: 'vinegar', id: 'vinegar' } },
    ],
    extras: [
      { name: 'salt', tspPer60ml: 0.5, note: 'then taste' },
      { name: 'Dijon mustard', tspPer60ml: 1, ingredient: { name: 'Dijon mustard', id: 'dijon-mustard' }, note: 'or another binder' },
    ],
    why: [
      'Oil and acid don’t want to mix. Shake them and they part again within a minute. Mustard, honey, miso or an egg yolk sits between the two and holds them together for longer, and makes the dressing cling to leaves instead of pooling.',
      'At three to one, the acid tastes bright without being sharp. Go to two to one for sturdy greens, beans or grain salads, which soak up dressing and can take more bite. Go to four to one for delicate lettuces, or when the acid is a strong one like lime juice.',
    ],
    method: [
      'Put the acid, salt and mustard in a jar or bowl first. Salt dissolves in acid but hardly at all in oil, so it goes in before the oil does.',
      'Add the oil slowly while whisking, or close the jar and shake hard for about ten seconds.',
      'Taste it on a leaf, not from a spoon. A dressing that tastes too sharp on its own is often right on salad.',
    ],
    swapRows: ['Acid', 'Oil', 'Binder', 'Add'],
    swaps: [
      { style: 'Classic French', cuisine: { name: 'French', href: `${WC}french-cuisine/` }, values: ['red or white wine vinegar', 'olive oil', 'Dijon mustard', 'a minced shallot'] },
      { style: 'Japanese-style', cuisine: { name: 'Japanese', href: `${WC}japanese-cuisine/` }, values: ['rice vinegar', 'neutral oil with a little sesame oil', 'white miso', 'soy sauce and grated ginger'] },
      { style: 'Southeast Asian-style', cuisine: { name: 'Thai', href: `${WC}thai-cuisine/` }, values: ['lime juice', 'neutral oil, or none at all', 'palm sugar or honey', 'fish sauce, garlic and chili'] },
    ],
    related: [
      { name: 'Mayonnaise', note: 'The same idea made stable: an egg yolk holds far more oil than mustard can.' },
      { name: 'Quick pickles', note: 'The same acid, doing a different job.' },
    ],
    findish: { label: 'Find salads and dressings on Findish', query: 'q=vinaigrette' },
    reading: [
      { title: 'Ratio', author: 'Michael Ruhlman' },
      { title: 'Salt, Fat, Acid, Heat', author: 'Samin Nosrat' },
    ],
  },
];

export const blends: Blend[] = [
  {
    kind: 'blend',
    slug: 'garam-masala',
    name: 'Garam masala',
    summary: 'A warm blend of whole spices, toasted and ground, from North Indian cooking.',
    about: [
      'Garam masala is a blend of warming spices, most often cumin, coriander, cardamom, black pepper, cloves and cinnamon. It’s usually stirred in near the end of cooking, or sprinkled over a finished dish, so its aroma stays bright.',
      'There is no single recipe. Every family and region has its own, so treat the amounts below as a starting point.',
    ],
    cuisine: { name: 'Indian', href: `${WC}indian-cuisine/` },
    makes: 'about ⅓ cup',
    amounts: [
      { amount: '2 tbsp', ingredient: { name: 'cumin seeds', id: 'cumin' } },
      { amount: '2 tbsp', ingredient: { name: 'coriander seeds', id: 'coriander-seed' } },
      { amount: '1 tbsp', ingredient: { name: 'green cardamom pods', id: 'cardamom' } },
      { amount: '2 tsp', ingredient: { name: 'black peppercorns', id: 'black-pepper' } },
      { amount: '1 tsp', ingredient: { name: 'whole cloves', id: 'cloves' } },
      { amount: '1 stick (about 3 in)', ingredient: { name: 'cinnamon', id: 'cinnamon-sticks' }, note: 'broken up' },
      { amount: '2', ingredient: { name: 'bay leaves', id: 'bay-leaf' }, note: 'Indian bay leaves if you can find them' },
      { amount: '¼ tsp', ingredient: { name: 'nutmeg, freshly grated', id: 'nutmeg' }, note: 'added after grinding' },
    ],
    method: [
      'Toast everything except the nutmeg in a dry pan over medium-low heat, stirring, for two to three minutes, until it smells strongly and the cumin is a shade darker. Don’t let it smoke.',
      'Tip it onto a plate and let it cool completely. Warm spices turn gummy in a grinder.',
      'Grind it fine in a spice grinder or a clean coffee grinder, then stir in the nutmeg. Sift out any hard bits of cardamom husk or cinnamon if you like.',
      'Keep it in a small airtight jar away from light. It’s at its best for the first month or two, then slowly fades.',
    ],
    varies: [
      'Some blends lean on cardamom and cinnamon and taste sweeter and rounder. Others lean on black pepper and cloves and taste sharper and hotter.',
      'Fennel seeds, mace, star anise or dried ginger turn up in some versions. Try one at a time so you can taste what it adds.',
    ],
    makeOrBuy: [
      'Make it if you cook Indian food often. Ground spices lose their aroma within months, and a fresh batch is much brighter than most jars.',
      'Buy it if you only use it now and then. Get a small jar from a shop that sells a lot of spices, and check the date.',
    ],
    uses: [
      'Stirred into a curry or dal for the last few minutes of cooking',
      'In a yogurt marinade for chicken or paneer',
      'Tossed with oil and vegetables before roasting',
      'A pinch over chickpeas, rice or eggs',
    ],
    id: 'garam-masala',
    reading: [{ title: 'The Spice Companion', author: 'Lior Lev Sercarz' }],
  },
];

export const foundations: Foundation[] = [...ratios, ...blends];
