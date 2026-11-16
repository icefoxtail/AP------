// Read-only unit adapters. They never repair canonical metadata or infer keys.
import fs from 'node:fs';
import path from 'node:path';
import { scopeForRecord } from './common.mjs';

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function validateMap(units) {
  if (!object(units)) throw Error('UNITS_UID_MAP_REQUIRED');
  for (const [uid, value] of Object.entries(units)) {
    if (!uid.trim() || !object(value) || typeof value.standardUnitKey !== 'string' || !value.standardUnitKey.trim()
      || (value.subUnitKey != null && typeof value.subUnitKey !== 'string')
      || Object.keys(value).some(key => !['standardUnitKey', 'subUnitKey'].includes(key)))
      throw Error(`UNITS_ENTRY_INVALID:${uid}`);
  }
  return units;
}
export function loadUnits(input, root) {
  if (input === undefined || input === null) return undefined;
  if (input === 'inline') return 'inline';
  if (typeof input !== 'string') return validateMap(input);
  const file = fs.realpathSync(path.resolve(input)), repo = fs.realpathSync(root);
  if (file === repo || file.startsWith(repo + path.sep)) throw Error('UNITS_FILE_INSIDE_REPOSITORY');
  for (let dir = path.dirname(file); ; dir = path.dirname(dir)) {
    const marker = path.join(dir, '.git');
    if (fs.existsSync(marker) && (fs.statSync(marker).isFile() || fs.existsSync(path.join(marker, 'HEAD')))) throw Error('UNITS_FILE_INSIDE_REPOSITORY');
    if (dir === path.dirname(dir)) break;
  }
  return validateMap(JSON.parse(fs.readFileSync(file, 'utf8')));
}
export function unitScopeErrors(context, scope) {
  const errors = [], unit = context.master.get(scope.unit), sub = scope.sub && context.master.get(scope.sub);
  if (!unit || unit.keyType !== 'standardUnitKey' || !['active', 'ACTIVE'].includes(unit.status)) errors.push({code:'CANONICAL_UNIT_INVALID'});
  if (scope.sub && (!sub || sub.keyType !== 'subUnitKey' || !['active', 'ACTIVE'].includes(sub.status)
    || (sub.standardUnitKey || sub.parentKey) !== scope.unit)) errors.push({code:'CANONICAL_SUBUNIT_INVALID'});
  return errors;
}
export function resolveUnitScope(context, row, question, units) {
  const metadata = row && Object.hasOwn(row, 'metadata') ? row.metadata : row;
  let scope = scopeForRecord(metadata || {}), unitSource = 'CANONICAL';
  const uid = row?.questionUid || metadata?.questionUid;
  if (units === 'inline') {
    if (unitScopeErrors(context, scope).length) {
      scope = {...scope, unit:question?.standardUnitKey || '', sub:question?.subUnitKey || null};
      unitSource = 'INLINE';
    }
  } else if (units != null) {
    validateMap(units);
    if (uid && Object.hasOwn(units, uid)) {
      scope = {...scope, unit:units[uid].standardUnitKey, sub:units[uid].subUnitKey || null};
      unitSource = 'OVERRIDE';
    }
  }
  return {scope, unitSource, errors:unitScopeErrors(context, scope)};
}
