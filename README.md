# Cooking reference

Cook without a recipe. Three parts:

- **Pairings** (the main page): pick an ingredient and see what it's cooked with, drawn from the recipes [Findish](https://findish.now/) indexes. Add up to three to see what goes with all of them, or narrow to one cuisine. Started as the private Flavor pairings test page (November 2026).
- **Ratios**: the proportions behind the classics, with a calculator. So far: vinaigrette.
- **Spice blends**: blends to toast, grind and keep. So far: garam masala.

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

Adding a ratio or blend is an entry in `src/data/foundations.ts`; its page, index line and links are built from that.

`main` deploys to Cloudflare automatically. How it's put together, and the rules it follows, are in [AGENTS.md](AGENTS.md).
