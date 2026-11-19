// The ratio calculator: type an amount of either part and the rest follows. Without this
// script the page still shows the amounts for 60 ml of the smaller part.
import { track } from '../lib/track';
import { volume, teaspoons, toMl, type Unit } from '../lib/amounts';
import './links';

interface Calc {
  slug: string;
  parts: { key: string; name: string; per: number }[];
  extras: { name: string; tspPer60ml: number; note: string }[];
}

const box = document.querySelector<HTMLElement>('[data-ratio]');
const controls = document.querySelector<HTMLElement>('[data-controls]');
if (box && controls) {
  const calc: Calc = JSON.parse(box.dataset.ratio || '{}');
  const amount = document.getElementById('amount') as HTMLInputElement;
  const unit = document.getElementById('unit') as HTMLSelectElement;
  const of = document.getElementById('of') as HTMLSelectElement;
  const per = document.getElementById('per') as HTMLInputElement | null;
  const perOut = document.getElementById('per-out');
  const out = document.querySelector<HTMLElement>('[data-out]')!;
  const makes = document.querySelector<HTMLElement>('[data-makes]')!;
  const bigPer = document.querySelector<HTMLElement>('[data-per]');
  const bar = document.querySelector<HTMLElement>('[data-bar] .big-part');
  controls.hidden = false;

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

  function draw() {
    const parts = calc.parts.map((p, i) => ({ ...p, per: i === 0 && per ? Number(per.value) : p.per }));
    const small = parts[parts.length - 1];
    const known = parts.find((p) => p.key === of.value) || small;
    const ml = toMl(Math.max(0, Number(amount.value) || 0), unit.value as Unit);
    const onePart = ml / known.per; // millilitres in one part
    const smallMl = onePart * small.per;
    const shown = String(parts[0].per).replace('.5', '½');
    if (bigPer) bigPer.textContent = shown;
    if (perOut) perOut.textContent = shown;
    if (bar) bar.style.flexGrow = String(parts[0].per);
    out.innerHTML =
      parts.map((p) => `<li><span>${esc(p.name)}</span><span class="num">${ml ? volume(onePart * p.per) : '–'}</span></li>`).join('') +
      calc.extras.map((e) => `<li><span>${esc(e.name)}</span><span class="num">${ml ? teaspoons((e.tspPer60ml * smallMl) / 60) : '–'}${e.note ? ', ' + esc(e.note) : ''}</span></li>`).join('');
    const total = parts.reduce((t, p) => t + onePart * p.per, 0);
    makes.textContent = ml ? `Makes ${volume(total)}.` : 'Type an amount to work it out.';
  }

  amount.addEventListener('input', draw);
  unit.addEventListener('change', draw);
  of.addEventListener('change', draw);
  per?.addEventListener('input', draw);
  // One event per settled change, never the number typed.
  amount.addEventListener('change', () => track('Changed Ratio Amount', { foundation: calc.slug, unit: unit.value, amount_of: of.value }));
  unit.addEventListener('change', () => track('Changed Ratio Amount', { foundation: calc.slug, unit: unit.value, amount_of: of.value }));
  of.addEventListener('change', () => track('Changed Ratio Amount', { foundation: calc.slug, unit: unit.value, amount_of: of.value }));
  per?.addEventListener('change', () => track('Changed Ratio Strength', { foundation: calc.slug, ratio_parts: Number(per.value) }));
  draw();
}
