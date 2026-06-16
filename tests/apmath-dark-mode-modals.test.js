const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const planner = fs.readFileSync(path.join(root, 'apmath/planner/index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'apmath/index.html'), 'utf8');

assert(
  ui.includes("localStorage.getItem('APMATH_THEME')") &&
    ui.includes("matchMedia('(prefers-color-scheme: dark)')") &&
    ui.includes('media.addEventListener') &&
    ui.includes('if (!localStorage.getItem(\'APMATH_THEME\')) applyTheme(getTheme())'),
  'student management should follow phone dark mode when no explicit theme is saved'
);

assert(
  app.includes('#modal-content') &&
    /#modal-content\s*\{[\s\S]*background:\s*var\(--surface\);[\s\S]*color:\s*var\(--text\);/.test(app) &&
    app.includes('body.dark'),
  'student management modal shell should use dark-mode surface/text tokens'
);

assert(
  planner.includes('body.dark') &&
    planner.includes('@media (prefers-color-scheme: dark)') &&
    planner.includes('--surface:#1A1D23') &&
    planner.includes('--text:#F3F4F6') &&
    planner.includes("localStorage.getItem('APMATH_THEME')") &&
    planner.includes("matchMedia('(prefers-color-scheme: dark)')"),
  'planner should define and apply dark-mode tokens from saved or phone system theme'
);

assert(
  planner.includes('background:var(--surface);color:var(--text);border:1px solid var(--border)') &&
    planner.includes('background:var(--surface-2);color:var(--text);') &&
    planner.includes('background:var(--primary);color:#fff') &&
    !planner.includes('background:var(--card,#fff)') &&
    !planner.includes('background:#4f46e5'),
  'planner exam-date modal should avoid fixed light backgrounds and fixed purple buttons'
);

assert(
  planner.includes('background:var(--surface-alpha)') &&
    planner.includes('border:1px solid var(--border)') &&
    planner.includes('background:var(--primary-soft)'),
  'planner floating timer and soft action surfaces should remain legible in dark mode'
);

console.log('AP Math dark mode modal checks passed');
