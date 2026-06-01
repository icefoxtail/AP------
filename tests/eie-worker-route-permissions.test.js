const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/routes/eie.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'workers/wangji-eie-worker/index.js'), 'utf8');

const handleMatch = worker.match(/export async function handleEie\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(handleMatch, 'handleEie should exist');
const handleBody = handleMatch[1];

assert(
  !handleBody.includes("if (!isEieOwner(teacher)) return jsonResponse({ success: false, error: 'EIE management is owner only' }, 403);"),
  'handleEie should not block all teacher-role EIE API requests at the top level'
);
assert(
  !index.includes("return jsonResponse({ success: false, error: 'EIE login is owner only' }, 403);"),
  'teacher-role accounts should be able to log in to EIE'
);

assert(
  /function\s+requireEieOwner\s*\(/.test(worker),
  'worker should expose a route-level owner gate helper'
);

for (const route of [
  "method === 'GET' && path[2] === 'teachers'",
  "method === 'POST' && path[2] === 'teachers'",
  "method === 'POST' && path[2] === 'teachers' && path[3] === 'seed-defaults'",
  "method === 'PATCH' && path[2] === 'teachers'",
  "method === 'DELETE' && path[2] === 'teachers'",
  "method === 'POST' && path[2] === 'import'"
]) {
  assert(worker.includes(route), `worker should keep ${route} route branch`);
}

assert(
  worker.includes('const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;'),
  'admin-only routes should use the route-level owner gate'
);
assert(
  worker.includes('Carmen') &&
  worker.includes('IVY') &&
  worker.includes('Lily') &&
  worker.includes('Stacy') &&
  worker.includes('Zoe') &&
  worker.includes('Laura') &&
  worker.includes('eie1234'),
  'worker should include the default EIE teacher seed accounts'
);

for (const allowed of [
  "method === 'GET'",
  "method === 'POST' && path[2] === 'students'",
  "method === 'PATCH' && path[2] === 'students'",
  "method === 'DELETE' && path[2] === 'students'",
  "method === 'POST' && path[2] === 'timetable-cells' && path[3] && path[4] === 'students'",
  "method === 'DELETE' && path[2] === 'timetable-cells' && path[3] && path[4] === 'students'"
]) {
  assert(worker.includes(allowed), `teacher-allowed route should remain available: ${allowed}`);
}

console.log('EIE worker route permissions test passed');
