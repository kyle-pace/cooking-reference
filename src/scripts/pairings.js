// The pairings tool. Carried over from the Flavor pairings test page (November 2026).
// Scoring is described above link(); the data is built by scripts/build-pairings.mjs.
import { track } from '../lib/track';
import { link as scoreLink, linksOf, STAPLE_AT, THIN } from '../lib/pairing-score.js';

const $ = (id) => /** @type {any} */ (document.getElementById(id));
  const TESTS = ['tomatoes', 'miso', 'lamb', 'basil', 'cilantro', 'lemons', 'limes', 'ginger', 'kimchi', 'butter', 'salmon', 'tofu', 'mushrooms', 'chocolate', 'rosemary', 'pork', 'coconut-milk', 'cumin', 'eggs', 'pecans'];
  // [key, heading, the line beside it]
  const BANDS = [['strong', 'Strong', 'Cooked together a lot, by several cooks'], ['good', 'Good', 'A clear habit'], ['try', 'Worth trying', 'Shows up together now and then'], ['one', 'Seen on one site only', "One cook's habit, so not counted as a pairing yet"]];
  const SHOWN = 14, SHOWN_ONE = 5, MAX = 3;
  let data = null, byId = new Map(), links = [], picked = [], open = new Set(), scope = -1;
  const store = {
    read() { try { return JSON.parse(localStorage.getItem('cooking-reference-verdicts') || '{}') || {}; } catch { return {}; } },
    write(v) { try { localStorage.setItem('cooking-reference-verdicts', JSON.stringify(v)); } catch {} },
  };
  let verdicts = store.read();
  const review = new URLSearchParams(location.search).has('review');
  $('review').hidden = !review;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lower = (name) => (name === name.toUpperCase() ? name : name.toLowerCase());
  const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const listOf = (names) => names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  const pct = (x) => (x >= 0.095 ? Math.round(x * 100) : x >= 0.01 ? Math.round(x * 100) : '<1') + '%';

  /** Every event names ingredients by catalog id, never by anything typed. */
  function sent(event, i, from) {
    if (data && data.ing[i]) track(event, { ingredient_id: data.ing[i].id, picked_count: picked.length, picked_from: from });
  }

  function prepare(d) {
    data = d;
    d.ing.forEach((g, i) => byId.set(g.id, i));
    links = linksOf(d);
  }

  /** How well b goes with a, in the cuisine being looked at (src/lib/pairing-score.js). */
  const link = (a, b) => scoreLink(data, links, a, b, scope);

  /** Partners of everything picked: each one's weakest link, strongest first. */
  function partners(sel, staples) {
    if (!sel.length) return [];
    const out = [];
    for (const c of links[sel[0]].keys()) {
      if (sel.includes(c) || (!staples && data.ing[c].staple)) continue;
      let weak = null;
      for (const a of sel) { const l = link(a, c); if (!l || !l.band) { weak = null; break; } if (!weak || l.score < weak.score) weak = l; }
      if (weak) out.push(weak);
    }
    // In a combination, one site anywhere along the way keeps it out of the bands.
    if (sel.length > 1) for (const x of out) if (sel.some((a) => link(a, x.c).band === 'one')) x.band = 'one';
    return out.sort((a, b) => b.score - a.score || b.co - a.co);
  }

  function readHash() {
    return decodeURIComponent(location.hash.slice(1)).split('--').filter((id) => byId.has(id)).slice(0, MAX).map((id) => byId.get(id));
  }
  function writeHash() {
    const h = picked.map((p) => data.ing[p].id).join('--');
    if (location.hash.slice(1) !== h) history.replaceState(null, '', '#' + h);
  }
  function setPicked(next) { picked = next.slice(0, MAX); open = new Set(); writeHash(); render(); }
  const inScope = (p) => (scope < 0 ? data.ing[p].n : data.ing[p].c[scope]);

  function render() {
    const staples = $('staples').checked;
    const names = picked.map((p) => lower(data.ing[p].name));
    const where = scope < 0 ? '' : ` in ${data.cuisines[scope].name} recipes`;
    const thin = scope >= 0 && data.cuisines[scope].n < THIN;
    $('chosen').innerHTML = picked.length
      ? picked.map((p, i) => `<li><span>${esc(data.ing[p].name)} <small>${inScope(p).toLocaleString()} ${scope < 0 ? '' : esc(data.cuisines[scope].name) + ' '}recipes</small></span><button type="button" data-drop="${i}"><span aria-hidden="true">×</span><span class="sr">Remove ${esc(data.ing[p].name)}</span></button></li>`).join('')
      : '<li><span>Nothing yet. Find an ingredient above.</span></li>';
    const all = partners(picked, staples);
    const counted = all.filter((x) => x.band !== 'one').length;
    $('title').textContent = picked.length ? `Goes with ${listOf(names)}${where}` : 'Pick an ingredient';
    $('status').textContent = picked.length ? `${counted} ${counted === 1 ? 'pairing' : 'pairings'}${picked.length > 1 ? ' that go with all of them' : ''}.${thin ? ` Only ${data.cuisines[scope].n} ${data.cuisines[scope].name} recipes so far, so treat these as rough.` : ''}` : '';
    const single = picked.length === 1 && scope < 0 ? data.ing[picked[0]].id : null;
    $('judge').hidden = !single || !review;
    if (single) for (const b of $('judge').querySelectorAll('button')) b.setAttribute('aria-pressed', String(verdicts[single] === b.dataset.v));
    let html = '';
    BANDS.forEach(([key, label, gloss], bi) => {
      const rows = all.filter((x) => x.band === key);
      if (!rows.length) return;
      const cut = open.has(bi) ? rows : rows.slice(0, key === 'one' ? SHOWN_ONE : SHOWN);
      html += `<section class="band" aria-labelledby="band-${bi}"><div class="band-head"><h3 id="band-${bi}">${label}</h3><p>${gloss}</p></div><ul class="rows">` + cut.map((x) => row(x, key === 'one')).join('') + '</ul>' +
        (rows.length > cut.length ? `<button class="plain more" type="button" data-open="${bi}">Show all ${rows.length}</button>` : '') + '</section>';
    });
    $('bands').innerHTML = cuisineStaples(staples) + html;
    $('after').innerHTML = after(counted, staples);
    if (review) renderTests();
  }

  /** In one cuisine: what's in most of its recipes, which is why those aren't listed as pairings. */
  function cuisineStaples(pantry) {
    if (scope < 0 || !picked.length) return '';
    const c = data.cuisines[scope];
    const top = data.ing.map((g, i) => ({ i, r: g.c[scope] / c.n })).filter((x) => x.r >= STAPLE_AT && !picked.includes(x.i) && (pantry || !data.ing[x.i].staple)).sort((a, b) => b.r - a.r);
    if (!top.length) return '';
    return `<p class="staples-line">In most ${esc(c.name)} recipes, so not listed as pairings: ${top.map((x) => `${esc(lower(data.ing[x.i].name))} (${pct(x.r)})`).join(', ')}.</p>`;
  }

  function row(x, one) {
    const g = data.ing[x.c];
    const w = Math.max(4, Math.round(Math.min(1, Math.max(0, x.score) / 0.7) * 100));
    const of = lower(data.ing[x.a].name);
    const sites = scope < 0 ? (x.sites === 1 ? ', on one site' : `, on ${x.sites} sites`) : '';
    const mostly = x.mostly ? ` Mostly ${esc(x.mostly)}.` : '';
    const canAdd = picked.length < MAX;
    return `<li class="row${one ? ' faint' : ''}"><button type="button" class="name" data-go="${x.c}">${esc(g.name)}<span class="sr">: see what goes with it</span></button>` +
      (canAdd ? `<button type="button" class="add" data-add="${x.c}">Add<span class="sr"> ${esc(g.name)} to the combination</span></button>` : '<span></span>') +
      `<div class="meter"><div class="bar" aria-hidden="true"><i style="width:${w}%"></i></div><span class="score"><span class="sr">Score </span>${x.score.toFixed(2)}</span><small>${picked.length > 1 ? `Weakest with ${esc(of)}: in ${pct(x.share)} of its recipes` : `In ${pct(x.share)} of ${esc(of)} recipes`}, ${x.co.toLocaleString()} in all${sites}.${mostly}</small></div></li>`;
  }

  function after(counted, staples) {
    if (!picked.length) return '';
    const ids = picked.map((p) => data.ing[p].id);
    let html = '';
    if (!counted) {
      const thin = picked.filter((p) => inScope(p) < 5);
      if (scope >= 0 && thin.length) {
        html += `<div class="note"><p>${esc(listOf(thin.map((p) => data.ing[p].name)))} ${thin.length === 1 ? 'is' : 'are'} in fewer than five ${esc(data.cuisines[scope].name)} recipes here, so there is nothing to score.</p><p><button class="plain" type="button" data-scope="-1">Look at all cooking</button></p></div>`;
      } else if (picked.length > 1) {
        const tries = picked.map((p, i) => ({ p, n: partners(picked.filter((_, j) => j !== i), staples).filter((x) => x.band !== 'one').length })).sort((a, b) => b.n - a.n);
        html += `<div class="note"><p>Nothing here is cooked with all of them often enough, by more than one cook.</p><p>` + (tries.filter((t) => t.n).map((t) => `<button class="plain" type="button" data-drop="${picked.indexOf(t.p)}">Without ${esc(lower(data.ing[t.p].name))}: ${t.n} ${t.n === 1 ? 'pairing' : 'pairings'}</button>`).join(' ') || 'Take one off to start again.') + '</p></div>';
      } else {
        html += `<div class="note"><p>Not enough recipes from more than one site use ${esc(lower(data.ing[picked[0]].name))} to call anything a pairing yet (${inScope(picked[0])} recipes).</p></div>`;
      }
    }
    const q = `with=${encodeURIComponent(ids.join(','))}` + (scope >= 0 ? `&cuisine=${encodeURIComponent(data.cuisines[scope].name)}` : '');
    html += `<p style="margin-top:1.5rem"><a data-findish href="https://findish.now/?${q}">Find ${scope >= 0 ? esc(data.cuisines[scope].name) + ' ' : ''}recipes with ${esc(listOf(picked.map((p) => lower(data.ing[p].name))))} on Findish</a></p>`;
    return html;
  }

  function renderTests() {
    $('tests').innerHTML = TESTS.filter((id) => byId.has(id)).map((id) => {
      const v = verdicts[id];
      return `<li><button type="button" data-test="${id}"><span>${esc(data.ing[byId.get(id)].name)}</span><span class="mark" data-v="${v || ''}">${v === 'right' ? 'right' : v === 'off' ? 'off' : ''}</span></button></li>`;
    }).join('');
    const vals = Object.values(verdicts), right = vals.filter((v) => v === 'right').length;
    $('tally').textContent = vals.length ? `${vals.length} judged: ${right} right, ${vals.length - right} off.` : 'None judged yet.';
  }

  function search(text) {
    const want = fold(text);
    if (!want) return [];
    const hits = [];
    data.ing.forEach((g, i) => {
      const names = [g.name, ...g.also].map(fold);
      let best = 9;
      names.forEach((n, k) => { const r = n === want ? 0 : n.startsWith(want) ? 1 : n.includes(' ' + want) ? 2 : n.includes(want) && want.length > 2 ? 3 : 9; if (r < 9) best = Math.min(best, r + (k ? 0.5 : 0)); });
      if (best < 9) hits.push({ i, best, via: names.findIndex((n) => n.includes(want)) });
    });
    return hits.sort((a, b) => a.best - b.best || data.ing[b.i].n - data.ing[a.i].n).slice(0, 8);
  }
  function showFound() {
    const hits = search($('q').value);
    $('found').innerHTML = hits.map((h) => { const g = data.ing[h.i]; const via = h.via > 0 ? ` (${esc(g.also[h.via - 1])})` : ''; const add = picked.length && picked.length < MAX && !picked.includes(h.i) ? `<button type="button" class="also" data-add="${h.i}">Add<span class="sr"> ${esc(g.name)} to the combination</span></button>` : ''; return `<li><button type="button" data-pick="${h.i}"><span>${esc(g.name)}${via}</span><small>${g.n.toLocaleString()} recipes</small></button>${add}</li>`; }).join('') ||
      ($('q').value.trim() ? '<li><button type="button" disabled>No ingredient by that name has enough recipes</button></li>' : '');
  }
  const clearFind = () => { $('q').value = ''; $('found').innerHTML = ''; };
  function pick(i) { clearFind(); setPicked([i]); sent('Picked Ingredient', i, 'search'); }
  function setScope(v) { scope = Number(v); $('cuisine').value = String(scope); open = new Set(); render(); track('Changed Cuisine View', { cuisine: scope < 0 ? 'all' : data.cuisines[scope].name }); }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !data) return;
    if (b.dataset.pick) pick(Number(b.dataset.pick));
    else if (b.dataset.go) { setPicked([Number(b.dataset.go)]); sent('Picked Ingredient', Number(b.dataset.go), 'list'); $('title').scrollIntoView({ block: 'nearest' }); }
    else if (b.dataset.add) { const from = b.closest('#found') ? 'search' : 'list'; clearFind(); setPicked([...picked, Number(b.dataset.add)]); sent('Added Ingredient', Number(b.dataset.add), from); }
    else if (b.dataset.drop) { const gone = picked[Number(b.dataset.drop)]; setPicked(picked.filter((_, i) => i !== Number(b.dataset.drop))); sent('Removed Ingredient', gone, b.closest('#after') ? 'suggestion' : 'picked'); }
    else if (b.dataset.test) setPicked([byId.get(b.dataset.test)]);
    else if (b.dataset.scope) setScope(b.dataset.scope);
    else if (b.dataset.open) { open.add(Number(b.dataset.open)); render(); }
    else if (b.dataset.v && picked.length === 1) {
      const id = data.ing[picked[0]].id;
      if (verdicts[id] === b.dataset.v) delete verdicts[id]; else verdicts[id] = b.dataset.v;
      store.write(verdicts); render();
    } else if (b.id === 'copy') {
      const lines = Object.entries(verdicts).map(([id, v]) => `${data.ing[byId.get(id)]?.name || id}: ${v === 'right' ? 'looks right' : "something's off"}`);
      const text = lines.length ? 'Flavor Pairings verdicts\n' + lines.join('\n') : 'No verdicts yet.';
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => { $('copied').textContent = 'Copied. Paste it into the chat.'; }, () => { $('copied').textContent = text; });
    }
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-findish]');
    if (a) track('Opened Findish Link', { opened_from: 'pairings', picked_count: picked.length });
  });
  $('q').addEventListener('input', () => data && showFound());
  $('q').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const first = $('found').querySelector('button[data-pick]'); if (first) { e.preventDefault(); pick(Number(first.dataset.pick)); } }
    else if (e.key === 'ArrowDown') { const first = $('found').querySelector('button'); if (first) { e.preventDefault(); first.focus(); } }
    else if (e.key === 'Escape') clearFind();
  });
  $('found').addEventListener('keydown', (e) => {
    const items = [...$('found').querySelectorAll('button')], at = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && items[at + 1]) { e.preventDefault(); items[at + 1].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (items[at - 1] || $('q')).focus(); }
  });
  $('staples').addEventListener('change', () => data && render());
  $('cuisine').addEventListener('change', () => data && setScope($('cuisine').value));
  addEventListener('hashchange', () => { if (data) { picked = readHash(); open = new Set(); render(); } });

  fetch('/cooking-reference/pairings.json').then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).then((d) => {
    prepare(d);
    $('cuisine').innerHTML = `<option value="-1">All cooking (${d.recipes.toLocaleString()} recipes)</option>` + d.cuisines.map((c, i) => `<option value="${i}">${esc(c.name)} (${c.n.toLocaleString()}${c.n < THIN ? ', few recipes' : ''})</option>`).join('');
    $('about-data').innerHTML = `From ${d.recipes.toLocaleString()} recipes on the ${d.sites} sites Findish searches, as of ${esc(d.built)}. <a href="/cooking-reference/about/#use-title">How the bands work</a>.`;
    picked = readHash();
    if (picked.length) sent('Picked Ingredient', picked[0], document.referrer.includes('/cooking-reference/') ? 'reference' : 'link');
    render();
  }).catch(() => { $('title').textContent = "The pairings didn't load"; $('status').textContent = 'Reload the page to try again.'; });
