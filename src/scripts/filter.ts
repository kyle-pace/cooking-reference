// The filter on the Ratios and the Blends and sauces indexes: type a word and only the rows
// that mention it stay (in the name, the summary or the ingredients). Groups with nothing
// left are hidden. Without this script the filter box never shows.
import { track } from '../lib/track';

const index = document.querySelector<HTMLElement>('[data-index]');
const find = index?.querySelector<HTMLElement>('[data-find]');
if (index && find) {
  const input = find.querySelector<HTMLInputElement>('input')!;
  const count = find.querySelector<HTMLElement>('[data-count]')!;
  const none = index.querySelector<HTMLElement>('[data-none]')!;
  const jump = index.querySelector<HTMLElement>('[data-jump]')!;
  const groups = [...index.querySelectorAll<HTMLElement>('[data-group]')].map((el) => ({ el, rows: [...el.querySelectorAll<HTMLElement>('[data-text]')] }));
  const total = Number(count.dataset.total);
  find.hidden = false;
  let shown = total;
  let timer = 0;

  function apply() {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    shown = 0;
    for (const g of groups) {
      let any = false;
      for (const row of g.rows) {
        const hit = words.every((w) => row.dataset.text!.includes(w));
        row.hidden = !hit;
        if (hit) (any = true), shown++;
      }
      g.el.hidden = !any;
    }
    jump.hidden = words.length > 0;
    none.hidden = shown > 0;
    count.textContent = words.length ? `${shown} of ${total}` : '';
    // One event once the typing stops, with how many matched and never what was typed.
    clearTimeout(timer);
    if (words.length) timer = window.setTimeout(() => track('Changed List Filter', { list: index!.dataset.index, result_count: shown }), 1500);
  }

  input.addEventListener('input', apply);
  none.querySelector('button')!.addEventListener('click', () => {
    input.value = '';
    apply();
    input.focus();
  });
  if (input.value) apply();
}
