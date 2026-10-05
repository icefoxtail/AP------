import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nativeFinal } from '../pipeline-core/native-final.mjs';
import { archiveSourceIdentity } from '../pipeline-core/integration.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const target = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidence/high1-geometry-equation/final_target_manifest.json'), 'utf8'));
// Compatibility command: emits a quality receipt, never manufactures a seal.
nativeFinal(root, 'geometry-equation', target.rows.map(row => archiveSourceIdentity(row.sourceJsPath, row.id)));
