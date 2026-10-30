const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// The root AGENTS.md is loaded into every agent session, so it stays a short router: area rules live in
// docs/agents/*.md and are read only for that task. This guards the budget, keeps dated directive sections
// out of the root, and checks both directions of the routing (every route exists, every area doc is routed).
// Raise the budget only on an explicit user decision; add new directives to the matching area doc instead.

const repo = path.join(__dirname, '..');
const agentsText = fs.readFileSync(path.join(repo, 'AGENTS.md'), 'utf8');
const areaDir = path.join(repo, 'docs', 'agents');
const BUDGET = { chars: 6000, lines: 80 };

function relativeLinks(text) {
  const out = [];
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    let file = target.split('#')[0];
    try { file = decodeURIComponent(file); } catch (_) { /* keep raw */ }
    if (file) out.push(file);
  }
  return out;
}

function codePaths(text) {
  const out = [];
  for (const m of text.matchAll(/`([^`\s]+)`/g)) {
    if (/^(?:docs|tools|tests|archive|alive|apmath|shared|\.codex|\.github)\/[^<>?*|]+$/.test(m[1])) out.push(m[1]);
  }
  return out;
}

test('AGENTS.md stays within the router budget', () => {
  const chars = [...agentsText].length;
  const lines = agentsText.split('\n').length;
  assert.ok(chars <= BUDGET.chars, `AGENTS.md has ${chars} chars (budget ${BUDGET.chars}); move detail into docs/agents/`);
  assert.ok(lines <= BUDGET.lines, `AGENTS.md has ${lines} lines (budget ${BUDGET.lines}); move detail into docs/agents/`);
});

test('AGENTS.md holds no dated directive sections', () => {
  const dated = agentsText.split('\n').filter(line => /^#{1,6}\s*CURRENT\b/.test(line));
  assert.deepEqual(dated, [], 'add dated CURRENT directives to the matching docs/agents/*.md file, not to AGENTS.md');
});

test('every path AGENTS.md routes to exists', () => {
  const missing = [...relativeLinks(agentsText), ...codePaths(agentsText)]
    .filter(p => !fs.existsSync(path.join(repo, p)));
  assert.deepEqual(missing, []);
});

test('every area doc is routed from AGENTS.md and its own links resolve', () => {
  const routed = new Set(relativeLinks(agentsText).map(p => path.normalize(p)));
  const areaDocs = fs.readdirSync(areaDir).filter(name => name.endsWith('.md'));
  assert.ok(areaDocs.length > 0);
  for (const name of areaDocs) {
    const rel = path.join('docs', 'agents', name);
    assert.ok(routed.has(rel), `${rel} is not linked from AGENTS.md`);
    const text = fs.readFileSync(path.join(areaDir, name), 'utf8');
    const broken = relativeLinks(text).filter(p => !fs.existsSync(path.join(areaDir, p)));
    assert.deepEqual(broken, [], `${rel} has broken links`);
  }
});
