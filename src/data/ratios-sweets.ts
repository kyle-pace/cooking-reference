// Ratios for custards and sweets.
import { wc, R, type Ratio } from './types';

export const sweets: Ratio[] = [
  {
    kind: 'ratio',
    slug: 'custard',
    name: 'Baked custard',
    summary: 'Milk or cream set with egg: two and a half parts liquid to one part egg, by weight.',
    group: 'sweets',
    measure: 'weight',
    parts: [
      { key: 'liquid', name: 'milk or cream', per: 2.5, range: [2, 3], step: 0.25, liquid: true, ingredient: { name: 'milk', id: 'milk' } },
      { key: 'egg', name: 'egg', per: 1, each: { one: 'egg', many: 'eggs', size: 50 }, ingredient: { name: 'eggs', id: 'eggs' } },
    ],
    start: { amount: 100, unit: 'g', of: 'egg' },
    adjust: {
      label: 'Parts liquid to one part egg',
      hint: 'Less liquid sets firm enough to slice or turn out. More gives a softer custard to eat with a spoon.',
      presets: [
        { name: 'Firm, to slice or unmold', per: 2 },
        { name: 'Everyday: one egg to 125 ml', per: 2.5 },
        { name: 'Soft and barely set', per: 3 },
      ],
    },
    extras: [{ name: 'salt', amount: 0.25, unit: 'tsp', per: 250, of: 'liquid', note: 'a pinch for sweet custards' }],
    makes: '',
    note: 'A large egg is about 50 g out of its shell. Two eggs and a cup of milk fill a small quiche or three ramekins.',
    why: [
      'Egg proteins link up as they heat and trap the liquid in a soft gel. One egg can set about half a cup of milk. With more liquid than that the gel is too loose to hold.',
      'The gel forms at around 80°C (175°F) and squeezes its water back out not far above that, which is a curdled custard. So custards cook gently, in a low oven or a water bath, and come out while the middle still wobbles.',
    ],
    method: [
      'Whisk the eggs with the seasonings without making foam. Whisk in the liquid. Warm liquid shortens the baking.',
      'Strain it into the dish or crust. This takes out the stringy bits and the bubbles.',
      'Bake at 150°C (300°F), with the dish sitting in a pan of hot water unless it’s in a pastry crust.',
      'Take it out when the edge is set and the middle still shivers, 30 to 45 minutes. It finishes setting as it cools.',
    ],
    swapRows: ['Liquid', 'Season', 'Cook'],
    swaps: [
      { style: 'Quiche', cuisine: wc('French', 'french-cuisine'), values: ['half milk, half cream', 'salt, nutmeg, cheese and bacon or greens', 'in a pre-baked crust at 165°C (325°F)'] },
      { style: 'Caramel custard', cuisine: wc('Spanish', 'spanish-cuisine'), values: ['whole milk', 'sugar, a fifth of the milk’s weight, and vanilla', 'in caramel-lined molds in a water bath'] },
      { style: 'Chawanmushi', cuisine: wc('Japanese', 'japanese-cuisine'), values: ['dashi, three parts to one of egg', 'soy sauce and mirin', 'steamed gently in cups, 12 to 15 minutes'] },
    ],
    related: [
      { name: 'Crème anglaise', note: 'The same idea stirred on the stove, so it pours.', href: `${R}creme-anglaise/` },
      { name: 'Pie dough', note: 'The crust under a quiche.', href: `${R}pie-dough/` },
      { name: 'Dashi', note: 'The liquid in a savory Japanese custard.', href: `${R}dashi/` },
    ],
    findish: { label: 'Find custard recipes on Findish', query: 'q=custard' },
    reading: [
      { title: 'Ratio', author: 'Michael Ruhlman' },
      { title: 'On Food and Cooking', author: 'Harold McGee' },
    ],
  },
  {
    kind: 'ratio',
    slug: 'creme-anglaise',
    name: 'Crème anglaise',
    summary: 'Pouring custard: five parts milk and cream, one part egg yolk, one part sugar, by weight.',
    group: 'sweets',
    measure: 'weight',
    parts: [
      { key: 'dairy', name: 'milk and cream', per: 5, liquid: true, ingredient: { name: 'milk', id: 'milk' } },
      { key: 'yolk', name: 'egg yolks', per: 1, each: { one: 'yolk', many: 'yolks', size: 18 }, ingredient: { name: 'eggs', id: 'eggs' } },
      { key: 'sugar', name: 'sugar', per: 1, ingredient: { name: 'sugar', id: 'sugar' } },
    ],
    start: { amount: 500, unit: 'g', of: 'dairy' },
    extras: [{ name: 'vanilla extract', amount: 1, unit: 'tsp', per: 500, of: 'dairy', ingredient: { name: 'vanilla extract', id: 'vanilla-extract' }, note: 'or half a vanilla bean' }],
    makes: '',
    note: 'A large yolk is about 18 g, so half a litre of milk takes five or six.',
    why: [
      'Yolks thicken milk the way whole eggs set a baked custard, but stirred over the heat the gel never gets to form in one piece. You get a sauce instead.',
      'Sugar does more than sweeten. It gets between the yolk proteins and raises the temperature at which they scramble, which gives you a wider margin on the stove.',
    ],
    method: [
      'Heat the milk and cream with the vanilla until steaming. Whisk the yolks and sugar in a bowl until just combined.',
      'Pour the hot milk slowly into the yolks while whisking, then pour everything back into the pot.',
      'Cook over low heat, stirring all the time with a spatula, until it coats the spatula and a finger drawn through it leaves a clear line. That’s 80 to 83°C (175 to 180°F). Don’t let it boil.',
      'Strain it at once into a cold bowl set over ice, and stir until cool.',
    ],
    swapRows: ['Dairy', 'Add', 'Becomes'],
    swaps: [
      { style: 'Pouring custard', cuisine: wc('French', 'french-cuisine'), values: ['whole milk, or half milk and half cream', 'vanilla', 'a sauce for cake, fruit and puddings'] },
      { style: 'Ice cream base', values: ['two parts cream to one part milk', 'vanilla, or steep coffee, mint or tea in the hot milk', 'ice cream, once chilled overnight and churned'] },
      { style: 'Pastry cream', values: ['whole milk', 'cornstarch, a twelfth of the milk’s weight, and bring it to a boil', 'a thick filling for tarts and éclairs'] },
    ],
    related: [
      { name: 'Baked custard', note: 'Whole eggs, no stirring, set firm in the oven.', href: `${R}custard/` },
      { name: 'Ganache', note: 'The other sauce every dessert cook knows.', href: `${R}ganache/` },
    ],
    findish: { label: 'Find ice cream and custard recipes on Findish', query: 'q=ice+cream' },
    reading: [
      { title: 'BraveTart', author: 'Stella Parks' },
      { title: 'Ratio', author: 'Michael Ruhlman' },
    ],
  },
  {
    kind: 'ratio',
    slug: 'ganache',
    name: 'Ganache',
    summary: 'Chocolate melted into hot cream. Equal weights make a glaze, and twice the chocolate makes truffles.',
    group: 'sweets',
    measure: 'weight',
    parts: [
      { key: 'chocolate', name: 'dark chocolate', per: 1, range: [0.5, 2.5], step: 0.25, ingredient: { name: 'chocolate', id: 'chocolate' } },
      { key: 'cream', name: 'cream', per: 1, liquid: true, ingredient: { name: 'heavy cream', id: 'heavy-whipping-cream' } },
    ],
    start: { amount: 200, unit: 'g', of: 'cream' },
    adjust: {
      label: 'Parts dark chocolate to one part cream',
      hint: 'More chocolate sets firmer. Milk and white chocolate set softer, so use about half again as much.',
      presets: [
        { name: 'Sauce, or to whip into frosting', per: 0.5 },
        { name: 'Glaze and cake filling', per: 1 },
        { name: 'Truffles', per: 2 },
      ],
    },
    extras: [],
    makes: '',
    why: [
      'Chocolate is cocoa butter and cocoa solids. Cream is fat floating in water. Stirred together warm, they make a smooth emulsion that sets as the cocoa butter cools.',
      'The more chocolate there is, the more cocoa butter, and the harder it sets. That one dial takes you from a sauce you pour to a paste you can roll in your hands.',
    ],
    method: [
      'Chop the chocolate finely and put it in a bowl.',
      'Heat the cream until it just starts to simmer and pour it over. Leave it alone for 2 minutes.',
      'Stir gently from the middle outward until smooth and glossy. If it looks oily and split, stir in a spoonful of warm milk.',
      'Use it warm to pour. Let it cool to spread. Chill it to scoop and roll, or chill then whip the looser kind for frosting.',
    ],
    swapRows: ['Chocolate', 'Liquid', 'Add'],
    swaps: [
      { style: 'Dark', cuisine: wc('French', 'french-cuisine'), values: ['60 to 70% dark chocolate', 'heavy cream', 'a pinch of salt, a knob of butter for shine'] },
      { style: 'Milk or white', values: ['milk or white chocolate, half again as much', 'heavy cream', 'vanilla, or citrus zest steeped in the cream'] },
      { style: 'Dairy-free', values: ['dark chocolate', 'full-fat coconut milk, or just hot water', 'a little maple syrup'] },
    ],
    related: [
      { name: 'Crème anglaise', note: 'A pouring sauce built on yolks instead.', href: `${R}creme-anglaise/` },
      { name: 'Simple syrup', note: 'For soaking the cake the ganache goes on.', href: `${R}simple-syrup/` },
    ],
    findish: { label: 'Find recipes with chocolate on Findish', query: 'with=chocolate' },
    reading: [
      { title: 'Chocolates and Confections', author: 'Peter Greweling' },
      { title: 'BraveTart', author: 'Stella Parks' },
    ],
  },
  {
    kind: 'ratio',
    slug: 'simple-syrup',
    name: 'Simple syrup',
    summary: 'Equal parts sugar and water for drinks and cakes. Two to one for a rich syrup that keeps.',
    group: 'sweets',
    measure: 'volume',
    parts: [
      { key: 'sugar', name: 'sugar', per: 1, range: [1, 2], step: 0.25, ingredient: { name: 'sugar', id: 'sugar' } },
      { key: 'water', name: 'water', per: 1 },
    ],
    start: { amount: 1, unit: 'cup', of: 'sugar' },
    adjust: {
      label: 'Parts sugar to one part water',
      hint: 'Rich syrup is sweeter, so use about two-thirds as much. It also keeps far longer.',
      presets: [
        { name: 'Simple syrup', per: 1 },
        { name: 'Rich syrup', per: 2 },
      ],
    },
    extras: [],
    note: 'A cup of each makes about a cup and a half, because sugar dissolves into the water’s space. Simple syrup keeps for a month in the fridge, rich syrup for several.',
    why: [
      'Sugar won’t dissolve in a cold drink. It sinks. Dissolved in water ahead of time, it mixes in at once and you can sweeten by the spoonful.',
      'At two to one there’s so little free water that not much can grow in it, which is why rich syrup lasts. It also thins a drink less.',
    ],
    method: [
      'Put the sugar and water in a jar or pot.',
      'For equal parts, shake or stir until clear. Hot tap water is enough. For rich syrup, warm it gently, stirring, until the sugar is gone. Don’t boil it down.',
      'Cool it, then keep it in a clean bottle in the fridge.',
    ],
    swapRows: ['Sugar', 'Add', 'Use in'],
    swaps: [
      { style: 'Plain', values: ['white sugar', 'nothing', 'iced tea and coffee, lemonade, brushing on cake layers'] },
      { style: 'Rich demerara', values: ['demerara or raw sugar, two to one', 'nothing', 'old fashioneds and other whiskey and rum drinks'] },
      { style: 'Infused', values: ['white sugar, or honey with hot water', 'sliced ginger, mint, citrus peel or a cinnamon stick, steeped as it cools', 'sodas, cocktails, fruit salad'] },
    ],
    related: [
      { name: 'Quick pickles', note: 'Sugar dissolved in vinegar and water instead.', href: `${R}quick-pickle/` },
      { name: 'Ganache', note: 'Two ingredients and one ratio, like this.', href: `${R}ganache/` },
    ],
    findish: { label: 'Find drinks on Findish', query: 'q=lemonade' },
    reading: [
      { title: 'Liquid Intelligence', author: 'Dave Arnold' },
      { title: 'The Bar Book', author: 'Jeffrey Morgenthaler' },
    ],
  },
];
