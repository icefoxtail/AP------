import fs from 'node:fs';
import { bytesSha, objectSha, safePath } from './canonical.mjs';

export function rulePreflight(root) {
  const errors = [], refs = [];
  try {
    const manifest = fs.readFileSync(safePath(root, 'docs/rules/MANIFEST.md'));
    refs.push({ path: 'docs/rules/MANIFEST.md', bytes: manifest.length, sha256: bytesSha(manifest), role: 'rule' });
    const entries = [...manifest.toString('utf8').matchAll(/^- (.+) \| (\d+) bytes \| sha256 ([0-9a-f]{64})$/gm)];
    if (!entries.length) errors.push('EMPTY_RULE_MANIFEST');
    for (const [, relative, size, digest] of entries) {
      const file = `docs/rules/${relative}`;
      try {
        const bytes = fs.readFileSync(safePath(root, file));
        const ref = { path: file, bytes: bytes.length, sha256: bytesSha(bytes), declaredVersion: bytes.toString('utf8').split(/\r?\n/)[0], role: 'rule' };
        refs.push(ref);
        if (ref.bytes !== Number(size) || ref.sha256 !== `sha256:${digest}`) errors.push(`RULE_DRIFT:${file}`);
      } catch (error) { errors.push(`RULE_MISSING:${file}:${error.message}`); }
    }
  } catch (error) { errors.push(`RULE_ROUTING_BLOCKED:${error.message}`); }
  return { status: errors.length ? 'BLOCKED' : 'PASS', rulePackSha: objectSha(refs), refs, errors };
}
