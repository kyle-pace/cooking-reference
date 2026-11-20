# Design plan: Cooking reference

Cooking reference is a standalone lab on kylepace.dev (kp-design's `LabLayout`). The tokens live
in `src/styles/theme.css`.

## Subject and audience

Reference for cooking without a recipe: what goes with what (pairings drawn from the recipes
Findish searches), the ratios behind the classics, and spice blends, pastes and sauces. For home cooks who already
cook a bit and want to understand why things work, so they can improvise.

## Concept

The reference chart taped inside a kitchen cupboard door: a printed sheet on pale card stock,
ruled lines, one strong ink color for the numbers that matter, a second for links. Dark mode is
the same chart under a dim kitchen light: dark green-black paper, pale ink.

## The one bold element

Proportion bars. On the pairings list, a beet bar shows how strong each pairing is. On a ratio
page, one wide bar split into parts ("3 parts oil", "1 part acid") is the biggest thing on the
page, labeled in text so it never relies on color. Everything else is plain ruled lists.

A ratio can have any number of parts (pie dough is three, bread dough four). The bar gets one
segment for each, as wide as its share; the first is solid beet and the rest are the pale beet
wash. A part too thin for its name, like the salt in bread dough, stays as an unlabeled sliver:
how small it is is the point, and the sentence beside the figures names every part. The bar is
hidden from screen readers, which get that sentence.

## Color

Carried over from the Flavor pairings test page (November 2026), which Kyle has already seen.

| Name | Light | Dark | Use |
| --- | --- | --- | --- |
| Paper | #f2f5f1 | #131917 | Page |
| Sheet | #ffffff | #1b2320 | Inputs and raised panels |
| Ink | #1b2420 | #e8eee9 | Text |
| Quiet | #55625b | #a3b1a9 | Secondary text (5.9:1 light, 7.4:1 dark) |
| Rule | #c9d3cc | #35423c | Decorative lines only |
| Beet | #8a1f4f | #ee8db4 | The bars and the current section |
| Leek | #2f6240 | #93cfa3 | Links and focus rings |

## Type

Atkinson Hyperlegible Next throughout. Page titles at step 3; the ratio itself ("3 : 1") at
step 4, the largest type in the lab, in beet. A ratio of four or more parts ("100 : 65 : 2 : 1")
drops to step 3 so it fits a phone. Numbers use tabular figures.

## Layout

```
phone                          wide
+----------------------+       +---------------------------------------------+
| < More labs   About  |       | < More labs                          About  |
| Cooking reference    |       | Cooking reference                           |
| Pairings Ratios Blends|      | Pairings   Ratios   Blends and sauces       |
| [find an ingredient] |       | [search, picks,  | Goes with pork           |
| Goes with pork       |       |  cuisine view]   | Strong  ===== soy sauce  |
| ==== soy sauce       |       |                  | Good    ===   ginger     |
+----------------------+       +---------------------------------------------+
```

Ratio pages: name, the ratio in big type, the proportion bar, then the calculator, why it works,
method, swaps table, related links. Blend pages: name, what it is, amounts table, method, how it
varies, make or buy, uses.

The calculator works in the ratio's own measure: spoons and cups (ml, tbsp, cups) for sauces and
grains, a scale (g, oz, lb) for doughs, brines and cures. Weights show the reading that helps
most beside the grams: ounces, millilitres for liquids, teaspoons for salt and yeast, a count
for eggs. A ratio with one part a cook adjusts (the water in bread, the salt in a brine) has a
slider for it and, where there are well-known settings, a "Make it for" list of them.

### The indexes (added November 2026, when the lab grew to dozens of entries)

```
phone                          wide
+----------------------+       +---------------------------------------------+
| Ratios               |       | Find a ratio [            ]                 |
| Find a ratio [     ] |       | Doughs  Pastry  Sauces  Brines  Grains ...  |
| Doughs  Pastry  ...  |       | ============  ============================== |
| Bread and pasta      |       | Bread and     Bread dough    100 : 65 : 2 : 1|
| Bread dough          |       | pasta doughs  A plain loaf by weight...     |
|      100 : 65 : 2 : 1|       |               ----------------------------- |
| A plain loaf...      |       |               Fresh egg pasta      100 : 55 |
+----------------------+       +---------------------------------------------+
```

- Ratios are grouped by what they make; blends and sauces by where they come from.
- Still ruled lists. On a wide screen the group's name moves into the left margin, like the row
  labels of a chart, under a heavy ink rule, and the rows run in two columns that share rules.
- Each ratio's row ends with its figures in beet, so the index reads as a chart on its own.
- A plain line of links jumps to each group. A filter box narrows the rows by name, summary or
  ingredient; it only appears when JavaScript runs.
- The third section is named "Blends and sauces" now that it holds pastes and sauces too.

## Checked against the generated defaults

- No headline over a muted lede: one line of title, then the section links, then the tool.
- Section links are plain words with a beet rule under the current one, not pills or tabs.
- Lists are ruled rows, not card grids. The Ratios and the Blends and sauces indexes are ruled
  lists too, in groups; the group links are plain underlined words, not pills.
- No small labels above headings, no decorative dots, no middle-dot meta lines, no monospace.
- Two corner radii at most (2px on inputs, none on bars).
