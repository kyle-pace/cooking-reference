# Cooking reference

Cook without a recipe. Three parts:

- **Pairings** (the main page): pick an ingredient and see what it's cooked with, drawn from the recipes [Findish](https://findish.now/) indexes. Add up to three to see what goes with all of them, or narrow to one cuisine. Started as the private Flavor pairings test page (November 2026).
- **Ratios**: the proportions behind the classics, from bread dough to vinaigrette, each with a calculator that works by weight or by volume.
- **Blends and sauces**: spice blends, herb mixes, pastes and sauces from around the world, with amounts, a method and what to use them on.

Live at [kylepace.dev/cooking-reference/](https://kylepace.dev/cooking-reference/), one of the labs on [kylepace.dev](https://kylepace.dev/labs/).

## Working on it

```sh
npm install
npm run dev      # local site at localhost:4321/cooking-reference/
npm run build    # must pass before pushing
npm run check    # accessibility, sideways scrolling, JavaScript weight, screenshots
npm run og       # re-render the share cards from design/og*.html
npm run pairings # recount the pairings from Findish's index (needs ../recipe-search with its index built)
```

Adding a ratio is an entry in one of the `src/data/ratios-*.ts` files, and a blend or sauce in one of the `blends-*.ts` files; its page, index line and links are built from that. `src/data/types.ts` says what an entry holds, and the build fails if one is put together wrong.

`main` deploys to Cloudflare automatically. How it's put together, and the rules it follows, are in [AGENTS.md](AGENTS.md).
