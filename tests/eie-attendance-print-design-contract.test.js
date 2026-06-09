const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'eie/css/eie.css'), 'utf8');
const view = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');

assert(css.includes('--eie-att-main: #0F766E;'), 'attendance should use a muted teal main color');
assert(!view.includes('#1A5CFF'), 'attendance view should not hard-code bright blue');
assert(!/\.eie-att-time-nc strong\s*\{[^}]*var\(--eie-primary\)/s.test(css), 'period title should not use bright blue primary');
assert(/\.eie-att-time-nc strong\s*\{[^}]*font-weight:\s*500;/s.test(css), 'period title should be medium weight');
assert(/\.eie-att-time-nc span\s*\{[^}]*color:\s*var\(--eie-att-text-sub\)[^}]*font-weight:\s*400;/s.test(css), 'time should be regular sub text');
assert(/\.eie-att-time-nc small\s*\{[^}]*color:\s*var\(--eie-att-main\)[^}]*font-size:\s*10\.5px;[^}]*font-weight:\s*500;/s.test(css), 'class code should be more visible with a muted accent');
assert(/\.eie-att-student-nc\s*\{[^}]*font-weight:\s*500;/s.test(css), 'student names should be fixed at 500 weight');
assert(/\.eie-att-icon\s*\{[^}]*width:\s*8\.5px;[^}]*height:\s*8\.5px;[^}]*stroke-width:\s*1\.35;/s.test(css), 'attendance icons should be smaller and thinner on screen');
assert(css.includes('--eie-att-day-size: 20px;') && css.includes('--eie-att-row-size: 20px;'), 'screen date cells should be compact square cells');
assert(/\.eie-att-today-btn\s*\{[^}]*background:\s*var\(--eie-att-today-bg\);[^}]*color:\s*var\(--eie-att-main\)/s.test(css), 'today button should use a soft teal treatment');
assert(/@media print\s*\{[\s\S]*@page\s*\{[^}]*size:\s*A4 landscape;[^}]*margin:\s*8mm 8mm 7mm;[\s\S]*--eie-att-day-size:\s*24px;[\s\S]*--eie-att-row-size:\s*24px;[\s\S]*--eie-att-print-table-width:\s*874px;[\s\S]*\.eie-att-print-head\s*\{[^}]*grid-template-columns:\s*1fr auto 1fr;[^}]*width:\s*var\(--eie-att-print-table-width\);[^}]*margin:\s*0 auto 4mm;[\s\S]*\.eie-att-tbl-wrap\s*\{[^}]*width:\s*max-content;[^}]*margin:\s*0 auto;[^}]*border-radius:\s*8px;[\s\S]*\.eie-att-icon\s*\{[^}]*width:\s*9px;[^}]*stroke-width:\s*1\.15;/s.test(css), 'print mode should use a near-full-width balanced table with square cells and rounded edges');
assert(/\.eie-att-block\s*\{[\s\S]*break-inside:\s*avoid;[\s\S]*page-break-inside:\s*avoid;/s.test(css), 'print mode should keep each class block together when possible');
assert(view.includes('eie-att-print-head') && /년[\s\S]*월[\s\S]*출석부/.test(view), 'print output should order month, title, and teacher across the header');
assert(view.includes('<tbody class="eie-att-block">'), 'attendance rows should be grouped by class block for print pagination');
assert(view.includes('eie-att-viewmodes') && view.includes('setScopeMode'), 'attendance toolbar should expose view mode pills');

console.log('EIE attendance print design contract test passed');
