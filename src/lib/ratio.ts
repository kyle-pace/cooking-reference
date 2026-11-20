// The arithmetic of a ratio page: how the ratio reads ("3 : 2 : 1"), and what each part comes
// to for a given amount of one of them. Shared by the page at build time (so it reads fine
// without JavaScript) and by the calculator in the browser.
import { volume, weight, teaspoons, count, fraction, type WeightHelp } from './amounts';

export interface CalcPart extends WeightHelp {
  key: string;
  name: string;
  per: number;
}

export interface CalcExtra {
  name: string;
  /** How much, in teaspoons or grams... */
  amount: number;
  unit: 'tsp' | 'g';
  /** ...for this much (ml or g) of the part named in `of`, or of everything ('total'). */
  per: number;
  of: string;
  note?: string;
}

export interface Calc {
  slug: string;
  measure: 'volume' | 'weight';
  /** 'percent': two parts, the second read as a percentage of the first. */
  show: 'parts' | 'percent';
  parts: CalcPart[];
  extras: CalcExtra[];
  /** What the total is, as in "Makes 840 g of dough". Left out when a total means nothing. */
  makes?: string;
  /** True when the page wrote its own sentence for the ratio, so the calculator leaves it be. */
  saidFixed?: boolean;
}

/** A number of parts as a cook says it: 1.5 → "1½", 1.1 → "1.1", 65 → "65". */
export function perText(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return Number.isInteger(n * 4) ? fraction(n) : String(Number(n.toFixed(2)));
}

/** The ratio in figures: "3 : 2 : 1", or "5%" for a percentage. */
export function figures(calc: Pick<Calc, 'show' | 'parts'>, pers = calc.parts.map((p) => p.per)): string {
  if (calc.show === 'percent') return `${Number(pers[1].toFixed(2))}%`;
  return pers.map(perText).join(' : ');
}

/** The ratio in words, the text equivalent of the bar: "3 parts flour, 2 parts butter, 1 part water". */
export function said(calc: Pick<Calc, 'show' | 'parts' | 'measure'>, pers = calc.parts.map((p) => p.per)): string {
  const [first, second] = calc.parts;
  if (calc.show === 'percent') {
    const unit = calc.measure === 'weight' ? 'g' : 'ml';
    return `${Number(pers[1].toFixed(2))} ${unit} of ${second.name} for every 100 ${unit} of ${first.name}`;
  }
  const each = calc.parts.map((p, i) => `${perText(pers[i])} ${pers[i] > 1 ? 'parts' : 'part'} ${p.name}`);
  const how = calc.measure === 'weight' ? ', by weight' : ', by volume';
  return (each.length === 2 ? each.join(' to ') : each.join(', ')) + how;
}

const amountText = (calc: Calc, part: CalcPart, x: number) => {
  if (calc.measure === 'weight') return weight(x, part);
  const whole = part.each ? count(x, part.each) : '';
  return whole ? `${volume(x)}, ${whole}` : volume(x);
};

/** Every line of the amounts list for `amount` (ml or g) of the part `of`, and the "Makes" line. */
export function work(calc: Calc, pers: number[], amount: number, of: string): { rows: { name: string; text: string }[]; makes: string } {
  const known = Math.max(0, calc.parts.findIndex((p) => p.key === of));
  const one = amount / pers[known]; // ml or g in one part
  const each = calc.parts.map((_, i) => one * pers[i]);
  const total = each.reduce((a, b) => a + b, 0);
  const rows = calc.parts.map((p, i) => ({ name: p.name, text: amount ? amountText(calc, p, each[i]) : '–' }));
  for (const e of calc.extras) {
    const i = calc.parts.findIndex((p) => p.key === e.of);
    const x = (e.amount * (i < 0 ? total : each[i])) / e.per;
    const text = !amount ? '–' : e.unit === 'tsp' ? teaspoons(x) : weight(x);
    rows.push({ name: e.name, text: text + (e.note ? `, ${e.note}` : '') });
  }
  let makes = '';
  if (!amount) makes = 'Type an amount to work it out.';
  else if (calc.makes !== undefined) {
    const sum = calc.measure === 'weight' ? weight(total) : volume(total);
    makes = `Makes about ${sum}${calc.makes ? ' ' + calc.makes : ''}.`;
  }
  return { rows, makes };
}
