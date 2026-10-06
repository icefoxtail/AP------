import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const acorn = require('C:/Users/USER/AppData/Local/npm-cache/_npx/bbbefcae0b32ac69/node_modules/acorn');
const root = '.tmp/archive/archive2-m2-codex-20261006-03/20_신흥중_2학기_기말_중2_기출';
const source = path.join(root, '20_신흥중_2학기_기말_중2_기출.js');
const raw = fs.readFileSync(source, 'utf8');
const sourceSha256 = crypto.createHash('sha256').update(raw).digest('hex');
const ast = acorn.parse(raw, { ecmaVersion: 'latest', sourceType: 'script' });
const assignment = ast.body.find(n => n.type === 'ExpressionStatement' && n.expression?.type === 'AssignmentExpression' && n.expression.left?.property?.name === 'questionBank');
if (!assignment || assignment.expression.right.type !== 'ArrayExpression') throw new Error('questionBank literal not found');
function literal(node) {
  if (node.type === 'Literal') return node.value;
  if (node.type === 'ArrayExpression') return node.elements.map(literal);
  if (node.type === 'ObjectExpression') {
    const out = {};
    for (const p of node.properties) {
      if (p.type !== 'Property' || p.computed || p.kind !== 'init') throw new Error('non-literal property');
      const key = p.key.name ?? p.key.value;
      out[key] = literal(p.value);
    }
    return out;
  }
  throw new Error('non-literal student field node: ' + node.type);
}
const fields = new Set(['id', 'content', 'choices', 'image']);
const questions = assignment.expression.right.elements.map((q, i) => {
  if (q.type !== 'ObjectExpression') throw new Error('non-object qid at ' + i);
  const row = {};
  for (const p of q.properties) {
    const key = p.key.name ?? p.key.value;
    if (fields.has(key)) row[key] = literal(p.value);
  }
  if (row.id == null || typeof row.content !== 'string' || !Array.isArray(row.choices)) throw new Error('incomplete student row ' + i);
  return row;
});
const refs = questions.flatMap(q => typeof q.image === 'string' && q.image ? [{ qid: q.id, ref: q.image }] : []);
const assetRoot = path.join(root, 'assets/images');
const assets = refs.map(({ qid, ref }) => {
  const file = path.resolve(root, ref.replaceAll('/', path.sep));
  const allowed = path.resolve(assetRoot) + path.sep;
  if (!file.startsWith(allowed) || !fs.existsSync(file)) throw new Error('unresolved/out-of-root visual ref for qid ' + qid);
  const bytes = fs.readFileSync(file);
  return { qid, ref, path: path.relative(root, file).replaceAll(path.sep, '/'), sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
});
const result = { source: { path: source.replaceAll(path.sep, '/'), sha256: sourceSha256 }, count: questions.length, questions, assets };
fs.writeFileSync(path.join(root, 'evidence/R2.student-input.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ sourceSha256, count: questions.length, visualCount: assets.length, qids: questions.map(q => q.id), assetRefs: assets.map(a => ({ qid: a.qid, ref: a.ref, sha256: a.sha256, bytes: a.bytes })) }));
