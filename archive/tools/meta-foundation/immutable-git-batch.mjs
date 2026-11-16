// Read fresh immutable file bytes in one Git process per bounded batch. Nothing
// here caches bytes, live inputs, hashes, or a review/approval decision.
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createImmutableGitMetadataLookup} from './immutable-git-metadata.mjs';

const immutableMetadata = createImmutableGitMetadataLookup();

const SHA1 = /^[a-f0-9]{40}$/;
const fail = message => {throw Error('immutable Git batch: ' + message);};
const blob = raw => crypto.createHash('sha1').update(`blob ${raw.length}\0`).update(raw).digest('hex');
const safe = value => typeof value === 'string' && value && !path.isAbsolute(value) &&
  !/[\\\x00-\x1f]/.test(value) && !value.split('/').some(p => !p || p === '.' || p === '..');

export function decodeImmutableGitBatch(output, expected) {
  if (!Buffer.isBuffer(output) || !Array.isArray(expected)) fail('binary output and exact inventory required');
  let offset = 0;
  const result = [];
  for (const entry of expected) {
    if (!SHA1.test(entry?.objectId || '') || !Number.isSafeInteger(entry.size) || entry.size < 0)
      fail('invalid expected object identity/size');
    const end = output.indexOf(10, offset);
    if (end < offset) fail('missing object header');
    const match = /^([a-f0-9]{40}) blob (0|[1-9][0-9]*)$/.exec(output.subarray(offset, end).toString('ascii'));
    if (!match || match[1] !== entry.objectId || Number(match[2]) !== entry.size) fail('object order/type/identity/size mismatch');
    offset = end + 1;
    const after = offset + entry.size;
    if (!Number.isSafeInteger(after) || after >= output.length || output[after] !== 10) fail('truncated object or missing delimiter');
    const raw = output.subarray(offset, after);
    if (blob(raw) !== entry.objectId) fail('object bytes do not match their Git identity');
    result.push(Buffer.from(raw));
    offset = after + 1;
  }
  if (offset !== output.length) fail('unexpected trailing output');
  return result;
}

function readFiles(root, inputs, consume) {
  if (!Array.isArray(inputs)) fail('exact file inventory required');
  if (!inputs.length) return;
  const byCommit = new Map();
  for (const entry of inputs) {
    if (!SHA1.test(entry?.commit || '') || !safe(entry.path)) fail('exact commit and safe file path required');
    if (!byCommit.has(entry.commit)) byCommit.set(entry.commit, new Set());
    byCommit.get(entry.commit).add(entry.path);
  }
  const git = (args, input) => {
    try {return immutableMetadata(root,args,()=>execFileSync('git', args,
      {cwd:root,input,maxBuffer:256*1024*1024,stdio:['pipe','pipe','pipe']}));}
    catch {fail('immutable Git input unavailable');}
  };
  const entries = new Map();
  for (const [commit, paths] of byCommit) {
    if (git(['rev-parse','--verify',`${commit}^{commit}`]).toString().trim() !== commit) fail('exact commit required');
    const seen = new Set();
    const directory = git(['--literal-pathspecs','ls-tree','-l','-z',commit,'--',...paths]).toString('utf8');
    for (const line of directory.split('\0').filter(Boolean)) {
      const tab = line.indexOf('\t'), relative = line.slice(tab + 1);
      const match = /^(100644|100755) blob ([a-f0-9]{40}) +(0|[1-9][0-9]*)$/.exec(line.slice(0, tab));
      if (tab < 0 || !match || !paths.has(relative) || seen.has(relative)) fail('exact regular file entry required');
      const size = Number(match[3]);
      if (!Number.isSafeInteger(size)) fail('invalid immutable object size');
      seen.add(relative);
      entries.set(JSON.stringify([commit,relative]), {objectId:match[2],size});
    }
    if (seen.size !== paths.size) fail('immutable file missing');
  }
  const ordered = inputs.map(({commit,path:p}) => entries.get(JSON.stringify([commit,p])));
  let batch = [], size = 0, index = 0;
  const flush = () => {
    if (!batch.length) return;
    const output = git(['cat-file','--batch'], batch.map(entry => entry.objectId).join('\n') + '\n');
    for (const raw of decodeImmutableGitBatch(output,batch)) consume(raw,index++);
    batch = [];size = 0;
  };
  for (const entry of ordered) {
    if (batch.length && size + entry.size > 64*1024*1024) flush();
    batch.push(entry);size += entry.size;
  }
  flush();
}

export function readImmutableGitFiles(root, inputs) {
  const result=[];
  readFiles(root,inputs,raw=>result.push(raw));
  return result;
}

// Hydration consumes each already verified batch before reading the next one,
// so large original metadata/identity files do not accumulate in memory.
export function forEachImmutableGitFile(root, inputs, consume) {
  if (typeof consume !== 'function') fail('file consumer required');
  readFiles(root,inputs,consume);
}
