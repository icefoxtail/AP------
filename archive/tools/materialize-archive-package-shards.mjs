import fs from 'node:fs';
import path from 'node:path';

// Packaging may reconstruct ignored mixed lookup shards, but must not repair or
// rewrite the registered catalog it is about to publish. Validate all authority
// bytes before writing even the first temporary shard.
export function materializePackageShards({ root, registeredFiles, packageFiles }) {
  const prefix = 'archive/data/archive2-source-verification/mixed-v1/';
  for (const [relative, expected] of registeredFiles) {
    const actual = fs.readFileSync(path.join(root, relative), 'utf8').replace(/\r\n/g, '\n');
    if (actual !== expected) throw new Error(`REGISTERED_PACKAGE_INPUT_MISMATCH: ${relative}`);
  }
  for (const [relative] of packageFiles) {
    if (!relative.startsWith(prefix) || relative.split('/').some(p => !p || p === '.' || p === '..') || relative.includes('\\')) {
      throw new Error(`NOT_A_TEMPORARY_PACKAGE_SHARD: ${relative}`);
    }
    let current = root;
    for (const part of relative.split('/')) {
      current = path.join(current, part);
      if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error(`PACKAGE_SHARD_SYMLINK: ${relative}`);
    }
  }
  for (const [relative, content] of packageFiles) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return { registeredFilesVerified: registeredFiles.length, temporaryFilesWritten: packageFiles.length };
}
