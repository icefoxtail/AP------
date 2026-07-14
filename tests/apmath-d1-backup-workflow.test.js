const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const workflow = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/backup-workflow.js'), 'utf8');
const config = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/wrangler.jsonc'), 'utf8');

assert.match(workflow, /extends WorkflowEntrypoint/);
assert.match(workflow, /output_format:\s*"polling"/);
assert.match(workflow, /current_bookmark:\s*bookmark/);
assert.match(workflow, /D1_BACKUP_BUCKET\.put\(objectKey, response\.body/);
assert.match(workflow, /D1_BACKUP_API_TOKEN/);
assert.doesNotMatch(workflow, /D1_BACKUP_API_TOKEN\s*[:=]\s*["'][^"']+["']/);
assert.match(config, /"name":\s*"ap-math-os-d1-backup"/);
assert.match(config, /"schedules":\s*\["0 18 \* \* \*"\]/);
assert.match(config, /"bucket_name":\s*"apmath-d1-backups"/);

console.log('apmath D1 backup workflow contract: ok');
