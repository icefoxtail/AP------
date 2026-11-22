// Which golden items a run covers: what the changed file names say (kind table), plus every item whose own inputs differ between base and head.
// The second part closes the hole of paths git names do not explain: a golden exam that names an image in another exam's folder changes
// when that image changes, although the changed file is not under any golden exam.
import {classifyFile, parseFamilies, selectItems} from './kinds.mjs';

// Items present on both sides whose own inputs (plan, exam source, every asset the exam names) differ.
export function ownKeyDiff(baseSnap, headSnap) {
  const baseItems = new Map(baseSnap.items.map(i => [i.dir, i]));
  return headSnap.items.filter(i => baseItems.has(i.dir) && baseSnap.itemOwnKey(baseItems.get(i.dir)) !== headSnap.itemOwnKey(i)).map(i => i.dir);
}

export function chooseItems({families = 'auto', changed, baseSnap, headSnap, expectedItems = []}) {
  const union = new Map();
  for (const i of [...baseSnap.items, ...headSnap.items]) union.set(i.dir, i);
  const allItems = [...union.values()];
  const plans = {...baseSnap.plans, ...headSnap.plans};
  const reachable = new Set([...baseSnap.reachable, ...headSnap.reachable]);
  const classes = changed.map(f => ({file: f, ...classifyFile(f, {renderReachable: reachable, items: allItems})}));
  const words = String(families).split(',').map(s => s.trim()).filter(Boolean);
  const auto = words.length === 1 && words[0] === 'auto';
  let all = false; const kinds = new Set(); const itemDirs = new Set(expectedItems); const reasons = []; let unknown = [];
  const keyDiff = ownKeyDiff(baseSnap, headSnap);
  if (auto) {
    for (const c of classes) {
      if (c.effect === 'ALL') { all = true; reasons.push(`${c.file}: ${c.reason}`); }
      else if (c.effect === 'KINDS') { c.kinds.forEach(k => kinds.add(k)); reasons.push(`${c.file}: kinds ${c.kinds.join('+')}`); }
      else if (c.effect === 'ITEM') { c.items.forEach(i => itemDirs.add(i)); reasons.push(`${c.file}: ${c.reason} ${c.items.join(',')}`); }
    }
    for (const d of keyDiff) if (!itemDirs.has(d)) { itemDirs.add(d); reasons.push(`${d}: its own inputs differ between base and head (an image or source a changed path does not name)`); }
  } else {
    const f = parseFamilies(words, allItems);
    unknown = f.unknown; all = f.all; f.kinds.forEach(k => kinds.add(k)); f.items.forEach(i => itemDirs.add(i));
    reasons.push(`--families ${families === '' ? '(empty)' : families}`);
  }
  const selected = selectItems({items: headSnap.items, plans, all, kinds, itemDirs});
  return {classes, auto, all, kinds, itemDirs, selected, reasons, unknown, keyDiff, plans, explicit: !auto};
}
