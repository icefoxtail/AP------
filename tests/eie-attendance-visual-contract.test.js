const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = (function(){ const idx = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8'); const list = (idx.match(/href="\.\/css\/(eie[\w-]*\.css)"/g) || []).map(function(m){ return m.replace(/^.*\/css\//, '').replace(/".*$/, ''); }); return list.map(function(f){ return fs.readFileSync(path.join(root, 'eie/css', f), 'utf8'); }).join('\n'); })();
const viewSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');

assert(/\.eie-att-grid\s*\{[^}]*width:\s*max-content;[^}]*table-layout:\s*auto;/s.test(css),
  'attendance grid should use fixed-size day columns rather than stretching every date cell');
assert(/\.eie-att-day-head\s*,\s*\.eie-att-dc\s*\{[^}]*width:\s*var\(--eie-att-day-size\);[^}]*min-width:\s*var\(--eie-att-day-size\);[^}]*max-width:\s*var\(--eie-att-day-size\);/s.test(css),
  'day headers and date cells should share a square-friendly fixed width');
assert(css.includes('--eie-att-day-size: 20px;') && css.includes('--eie-att-row-size: 20px;'),
  'date cells should have a compact fixed height');
assert(/\.eie-att-time-nc\s*\{[^}]*text-align:\s*center;[^}]*vertical-align:\s*middle;/s.test(css),
  'period/time cells should be vertically centered and center aligned');
assert(/function iconSvg/.test(viewSource) && /<svg/.test(viewSource) && /aria-label/.test(viewSource),
  'attendance marks should be rendered as accessible inline SVG icons');

console.log('EIE attendance visual contract test passed');
