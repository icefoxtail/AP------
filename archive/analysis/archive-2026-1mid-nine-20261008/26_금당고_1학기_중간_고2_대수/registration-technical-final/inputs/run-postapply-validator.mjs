import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const [root, outDir, name, commandToken, ...args] = process.argv.slice(2);
if (!root || !outDir || !name || !commandToken) throw new Error('RUNNER_ARGUMENTS_REQUIRED');
const command = commandToken === '@node' ? process.execPath : commandToken;
const absoluteOut = path.resolve(outDir);
fs.mkdirSync(absoluteOut, { recursive: true });
const result = spawnSync(command, args, { cwd: root, windowsHide: true, encoding: null, maxBuffer: 256 * 1024 * 1024 });
const stdout = Buffer.from(result.stdout || []);
const stderr = Buffer.from(result.stderr || []);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stdoutPath = path.join(absoluteOut, 'stdout.bin');
const stderrPath = path.join(absoluteOut, 'stderr.bin');
fs.writeFileSync(stdoutPath, stdout);
fs.writeFileSync(stderrPath, stderr);
const exitCode = Number.isInteger(result.status) ? result.status : 1;
const report = {
  schemaVersion: 'ROOT_POSTAPPLY_VALIDATOR_RUN_V1',
  name,
  command: [command, ...args],
  cwd: root,
  exitCode,
  disposition: exitCode === 0 ? 'PASS' : 'FAIL',
  processError: result.error ? String(result.error) : null,
  stdout: { path: stdoutPath, sha256: sha(stdout), bytes: stdout.length },
  stderr: { path: stderrPath, sha256: sha(stderr), bytes: stderr.length },
  finishedAt: new Date().toISOString(),
};
const reportPath = path.join(absoluteOut, 'result.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
process.stdout.write(JSON.stringify({ ...report, resultPath: reportPath, resultSha256: sha(fs.readFileSync(reportPath)) }, null, 2) + '\n');
process.exitCode = exitCode;