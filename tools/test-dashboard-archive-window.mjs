import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const dashboardJs = fs.readFileSync(path.join(root, 'apmath/js/dashboard.js'), 'utf8');

const match = dashboardJs.match(/function openDashboardArchiveWindow\(event\) \{[\s\S]*?\n\}/);
assert.ok(match, 'openDashboardArchiveWindow function must exist');

const body = match[0];
assert.ok(body.includes("window.open(url, '_blank'"), 'archive must open in a new window');
assert.ok(body.includes('event.preventDefault()'), 'archive click must prevent default navigation');
assert.ok(body.includes('event.stopPropagation()'), 'archive click must not bubble into dashboard navigation');
assert.ok(!body.includes('window.location.href'), 'dashboard archive click must not navigate the AP Math home window');

console.log('Dashboard archive window contract passed');
