// The ratio calculator: type an amount of any part and the rest follows. A ratio can have any
// number of parts, by volume or weight; one of them may have a slider (and named settings).
// Without this script the page still shows the amounts for the ratio's starting amount.
import { track } from '../lib/track';
import { toBase, type Unit } from '../lib/amounts';
import { perText, said, work, type Calc } from '../lib/ratio';
import './links';

const box = document.querySelector<HTMLElement>('[data-ratio]');
const controls = document.querySelector<HTMLElement>('[data-controls]');
if (box && controls) {
  const calc: Calc = JSON.parse(box.dataset.ratio || '{}');
  const amount = document.getElementById('amount') as HTMLInputElement;
  const unit = document.getElementById('unit') as HTMLSelectElement;
  const of = document.getElementById('of') as HTMLSelectElement;
  const per = document.getElementById('per') as HTMLInputElement | null;
  const preset = document.getElementById('preset') as HTMLSelectElement | null;
  const perOut = document.getElementById('per-out');
  const out = document.querySelector<HTMLElement>('[data-out]')!;
  const makes = document.querySelector<HTMLElement>('[data-makes]')!;
  const saidEl = document.querySelector<HTMLElement>('[data-said]');
  const ranged = per ? calc.parts.findIndex((p) => p.key === per.dataset.key) : -1;
  controls.hidden = false;
  // The controls say these two things now.
  document.querySelector<HTMLElement>('[data-for]')?.setAttribute('hidden', '');
  document.querySelector<HTMLElement>('[data-presets-said]')?.setAttribute('hidden', '');

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

  function draw() {
    const pers = calc.parts.map((p, i) => (i === ranged && per ? Number(per.value) : p.per));
    if (ranged >= 0) {
      const shown = calc.show === 'percent' ? String(pers[ranged]) : perText(pers[ranged]);
      const figure = document.querySelector<HTMLElement>(`[data-per="${calc.parts[ranged].key}"]`);
      const bar = document.querySelector<HTMLElement>(`[data-part="${calc.parts[ranged].key}"]`);
      if (figure) figure.textContent = shown;
      if (perOut) perOut.textContent = shown;
      if (bar) bar.style.flexGrow = String(pers[ranged]);
      if (saidEl && !calc.saidFixed) saidEl.textContent = said(calc, pers);
    }
    const base = toBase(Math.max(0, Number(amount.value) || 0), unit.value as Unit);
    const result = work(calc, pers, base, of.value);
    out.innerHTML = result.rows.map((row) => `<li><span>${esc(row.name)}</span><span class="num">${esc(row.text)}</span></li>`).join('');
    makes.textContent = result.makes;
  }

  amount.addEventListener('input', draw);
  unit.addEventListener('change', draw);
  of.addEventListener('change', draw);
  // The slider and the named settings move together: picking a setting moves the slider, and
  // moving the slider picks the setting it lands on, or "My own setting".
  per?.addEventListener('input', () => {
    if (preset) preset.value = [...preset.options].find((o) => o.value && Number(o.value) === Number(per.value))?.value ?? '';
    draw();
  });
  preset?.addEventListener('change', () => {
    if (per && preset.value) per.value = preset.value;
    draw();
  });

  // One event per settled change, never the number typed.
  const changed = () => track('Changed Ratio Amount', { foundation: calc.slug, unit: unit.value, amount_of: of.value });
  amount.addEventListener('change', changed);
  unit.addEventListener('change', changed);
  of.addEventListener('change', changed);
  const strength = () => per && track('Changed Ratio Strength', { foundation: calc.slug, ratio_parts: Number(per.value) });
  per?.addEventListener('change', strength);
  preset?.addEventListener('change', strength);
  draw();
}
