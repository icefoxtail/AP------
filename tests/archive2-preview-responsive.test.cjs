const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sharedStyle = path.join(root, "archive", "archive2-preview-mobile.css");
const engines = ["engine.html", "mixed_engine.html"];

test("both Archive output engines load screen-only responsive paper reflow without changing A4 print authority", () => {
  const htmlSources = engines.map(name => fs.readFileSync(path.join(root, "archive", name), "utf8"));
  for (const html of htmlSources) {
    const styleEnd = html.lastIndexOf("</style>");
    const linkAt = html.indexOf("archive2-preview-mobile.css");
    assert.ok(linkAt > styleEnd, "mobile preview stylesheet must follow each engine's print stylesheet");
    assert.match(html, /@page\s*\{\s*size:\s*A4\s*;/);
  }

  const css = fs.readFileSync(sharedStyle, "utf8");
  assert.match(css, /@media\s+screen\s+and\s+\(max-width:\s*640px\)/);
  assert.match(css, /transform:\s*none\s*!important/);
  assert.match(css, /\.ap-slot-content[^\{]*\{[^}]*position:\s*static\s*!important[^}]*transform:\s*none\s*!important/s);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/);
  assert.match(css, /height:\s*auto\s*!important/);
  assert.doesNotMatch(css, /@media\s+print/i);
});
