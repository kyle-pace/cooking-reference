# Design plan: Cooking reference

Cooking reference is a standalone lab on kylepace.dev (kp-design's `LabLayout`). The tokens live
in `src/styles/theme.css`.

## Subject and audience

Reference for cooking without a recipe: what goes with what (pairings drawn from the recipes
Findish searches), the ratios behind the classics, and spice blends. For home cooks who already
cook a bit and want to understand why things work, so they can improvise.

## Concept

The reference chart taped inside a kitchen cupboard door: a printed sheet on pale card stock,
ruled lines, one strong ink color for the numbers that matter, a second for links. Dark mode is
the same chart under a dim kitchen light: dark green-black paper, pale ink.

## The one bold element

Proportion bars. On the pairings list, a beet bar shows how strong each pairing is. On a ratio
page, one wide bar split into parts ("3 parts oil", "1 part acid") is the biggest thing on the
page, labeled in text so it never relies on color. Everything else is plain ruled lists.

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
step 4, the largest type in the lab. Numbers use tabular figures.

## Layout

```
phone                          wide
+----------------------+       +---------------------------------------------+
| < More labs   About  |       | < More labs                          About  |
| Cooking reference    |       | Cooking reference                           |
| Pairings Ratios Blends|      | Pairings   Ratios   Spice blends            |
| [find an ingredient] |       | [search, picks,  | Goes with pork           |
| Goes with pork       |       |  cuisine view]   | Strong  ===== soy sauce  |
| ==== soy sauce       |       |                  | Good    ===   ginger     |
+----------------------+       +---------------------------------------------+
```

Ratio pages: name, the ratio in big type, the proportion bar, then the calculator, why it works,
method, swaps table, related links. Blend pages: name, what it is, amounts table, method, how it
varies, make or buy, uses.

## Checked against the generated defaults

- No headline over a muted lede: one line of title, then the section links, then the tool.
- Section links are plain words with a beet rule under the current one, not pills or tabs.
- Lists are ruled rows, not card grids. The Ratios and Spice blends indexes are ruled lists too.
- No small labels above headings, no decorative dots, no middle-dot meta lines, no monospace.
- Two corner radii at most (2px on inputs, none on bars).
