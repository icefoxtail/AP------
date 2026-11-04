const fs = require('node:fs');
const path = require('node:path');
function repoRoot() {
  const valid = p => fs.existsSync(path.join(p, '.git')) && fs.existsSync(path.join(p, 'archive', 'tools', 'geometry-equation', 'visual-browser-runtime.mjs'));
  if (process.env.APMS_ROOT) {
    const root = path.resolve(process.env.APMS_ROOT);
    if (!valid(root)) throw Error(`Invalid APMS_ROOT: ${root}`);
    return root;
  }
  for (const start of [process.cwd(), __dirname]) {
    let p = path.resolve(start);
    for (;;) {
      if (valid(p)) return p;
      const parent = path.dirname(p);
      if (parent === p) break;
      p = parent;
    }
  }
  throw Error('Repository root not found; set APMS_ROOT');
}
module.exports = {repoRoot};
