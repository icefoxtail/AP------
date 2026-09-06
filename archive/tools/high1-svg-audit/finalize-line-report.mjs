import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nativeFinal } from '../pipeline-core/native-final.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const inventory = path.join(root, 'docs/reports/high1-svg-exhaustive-20260905/unit-02-line/01_unit_inventory.csv');
// Only the first CSV column (the canonical UID) is used; no legacy status is
// overwritten or promoted to PASS from the number of files in this inventory.
const uids = fs.readFileSync(inventory, 'utf8').trim().split(/\r?\n/).slice(1).map(line => line.split(',')[0]);
nativeFinal(root, 'high1-svg', uids.map(uid => ({ sourcePath: uid.split('|')[0], qid: Number(uid.split('|').at(-1)) })));
