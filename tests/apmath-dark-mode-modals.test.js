const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'apmath/js/ui.js'), 'utf8');
const planner = fs.readFileSync(path.join(root, 'apmath/planner/index.html'), 'utf8');
const studentTools = fs.readFileSync(path.join(root, 'apmath/css/student-tools.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'apmath/index.html'), 'utf8');

function toolsRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = studentTools.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]+)\\}`));
  assert(match, `${selector} should have a shared student tools style rule`);
  return match[1];
}
function themeTokens(selector) {
  return Object.fromEntries(Array.from(toolsRule(selector).matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi), match => [match[1], match[2]]));
}
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

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
    /<link rel="stylesheet" href="\.\.\/css\/student-tools\.css\?v=[^"]+">/.test(planner) &&
    planner.includes('<body class="student-tool-page planner-page">') &&
    /color-scheme:\s*dark/.test(toolsRule('body.student-tool-page.dark')) &&
    planner.includes("localStorage.getItem('APMATH_THEME')") &&
    planner.includes("matchMedia('(prefers-color-scheme: dark)')"),
  'planner should apply the shared warm light/dark tokens while preserving saved and phone system theme selection'
);

for (const selector of ['body.student-tool-page', 'body.student-tool-page.dark']) {
  const tokens = themeTokens(selector);
  for (const surface of ['bg', 'surface', 'surface-2']) {
    for (const foreground of ['text', 'secondary', 'primary', 'success', 'warning', 'error']) {
      assert(contrast(tokens[foreground], tokens[surface]) >= 4.5, `${selector}: ${foreground} should be readable on ${surface}`);
    }
  }
  for (const status of ['primary', 'success', 'warning', 'error']) {
    assert(contrast(tokens[status], tokens[`${status}-soft`]) >= 4.5, `${selector}: selected/status labels should remain readable on their soft surfaces`);
  }
  for (const surface of ['surface', 'surface-2']) {
    assert(contrast(tokens['control-border'], tokens[surface]) >= 3, `${selector}: input borders should remain visible on ${surface}`);
  }
  assert(contrast(tokens['on-primary'], tokens['action-primary']) >= 4.5, `${selector}: the main action label should remain readable`);
}

const examDateEditor = planner.match(/function openExamDateEditor\(\) \{[\s\S]*?\n    \}/);
assert(examDateEditor, 'planner exam-date editor should exist');
assert(
  /class="modal exam-date-modal" role="dialog" aria-modal="true" aria-labelledby="exam-date-title"/.test(examDateEditor[0]) &&
    /<label[^>]+for="exam-date-input"/.test(examDateEditor[0]) &&
    /id="exam-date-input" class="input" type="date"/.test(examDateEditor[0]) &&
    /id="exam-date-save" class="btn btn-primary"/.test(examDateEditor[0]) &&
    /\.modal\s*\{[^}]*background:\s*var\(--surface\);[^}]*color:\s*var\(--text\);/.test(planner) &&
    /background:\s*var\(--surface\);\s*color:\s*var\(--text\);\s*font-size:\s*16px/.test(toolsRule('.student-tool-page .input')) &&
    /min-height:\s*44px/.test(toolsRule('.student-tool-page .btn')) &&
    /background:\s*var\(--action-primary\);[^}]*color:\s*var\(--on-primary\)/.test(toolsRule('.student-tool-page .btn-primary')) &&
    !planner.includes('background:var(--card,#fff)') &&
    !planner.includes('background:#4f46e5'),
  'planner exam-date dialog should share theme-aware surfaces, labelled 16px input, and 44px primary/cancel controls'
);

assert(
  planner.includes('background:var(--surface-alpha)') &&
    planner.includes('border:1px solid var(--border)') &&
    planner.includes('background:var(--primary-soft)') &&
    /background:\s*var\(--surface\)/.test(toolsRule('.planner-page .planner-timer-mini')) &&
    /min-height:\s*44px/.test(toolsRule('.planner-page .timer-btn')),
  'planner floating timer and soft action surfaces should remain legible in dark mode'
);

console.log('AP Math dark mode modal checks passed');
