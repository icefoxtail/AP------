// Which golden items a run renders (2026-11-24): the items related to the change, not the whole set.
// The gate only blocks a broken figure, so it does not need every one of the 209 items on every pull request. select.mjs/kinds.mjs say which kinds and items a changed
// file reaches; this file narrows what they would send to the whole set:
//   - a change that reaches the whole set (shared render code, an unknown engine file: "when it is unclear, include it") renders every KIND, a spread sample of each
//   - a change to one kind's own files renders that kind's items (a spread sample when a kind has more than `maxPerKind`)
//   - items named by the change itself (their plan, exam source or figure changed) always render
//   - --all renders the whole set, as before
// Kept out of kinds.mjs and select.mjs on purpose: those two files' bytes are part of every stored result's key (KINDS_VERSION), so editing them would throw the cache away.
import {planKinds} from './kinds.mjs';

export const DEFAULT_SAMPLE_PER_KIND = 6;
export const DEFAULT_MAX_PER_KIND = 30;

// n items spread evenly over a list (the first and the last included), deterministic.
export function spread(list, n) {
  if (n >= list.length) return [...list];
  if (n <= 0) return [];
  if (n === 1) return [list[0]];
  const out = new Set();
  for (let i = 0; i < n; i++) out.add(list[Math.round(i * (list.length - 1) / (n - 1))]);
  return [...out];
}

// The items of one kind (an item with panels of several kinds counts for each of them), in item order.
function itemsOfKind(items, plans, kind) {
  return items.filter(i => planKinds(plans[i.dir]).has(kind)).map(i => i.dir);
}

// sel: the result of chooseItems(); items: the head snapshot's golden items. Returns {selected, sampled, note}.
export function narrowSelection({sel, items, perKind = DEFAULT_SAMPLE_PER_KIND, maxPerKind = DEFAULT_MAX_PER_KIND}) {
  if (!sel.auto) return {selected: sel.selected, sampled: false, note: null};
  const order = items.map(i => i.dir);
  const chosen = new Set();
  let note = null;
  if (sel.all) {
    // shared or unknown code: every kind is related, a sample of each
    const kinds = new Set();
    for (const i of items) for (const k of planKinds(sel.plans[i.dir])) if (k !== 'status-only') kinds.add(k);
    for (const k of [...kinds].sort()) for (const d of spread(itemsOfKind(items, sel.plans, k), perKind)) chosen.add(d);
    note = `the change reaches shared render code: every kind, up to ${perKind} items each (--all renders the whole set, --sample N changes the number)`;
  } else {
    for (const k of sel.kinds) for (const d of spread(itemsOfKind(items, sel.plans, k), maxPerKind)) chosen.add(d);
    // an unmapped capability is never skipped by a kind run (selectItems rule)
    if (sel.kinds.size) for (const i of items) if (planKinds(sel.plans[i.dir]).has('unknown')) chosen.add(i.dir);
    if ([...sel.kinds].some(k => itemsOfKind(items, sel.plans, k).length > maxPerKind)) note = `a kind has more than ${maxPerKind} items: a spread sample of it (--all renders the whole set, --max-per-kind N changes the number)`;
  }
  for (const d of sel.itemDirs) chosen.add(d); // items the change names itself
  const selected = order.filter(d => chosen.has(d));
  const whole = selected.length === order.length;
  return {selected, sampled: !whole && (sel.all || note !== null), note};
}
