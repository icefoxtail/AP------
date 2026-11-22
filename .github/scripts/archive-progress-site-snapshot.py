"""Read-only digest of the *actual uploaded Pages artifact* ZIP (never extract paths or run files)."""
import hashlib
import io
import json
import sys
import tarfile
import zipfile

ZIP_FILE = sys.argv[1]
MAX_FILE = 50 * 1024 * 1024
PREFIXES = ('archive/exams/', 'archive/assets/images/', 'archive/data/meta-foundation/runtime/')
REGISTRY = {
 'archive/db.js', 'archive/question-index.js', 'archive/question-identity.js',
 'archive/question-index-report.md', 'archive/question-index-audit.md',
 'archive/data/archive2-catalog.json', 'archive/data/archive2-crosswalk-inventory.json',
 'archive/data/archive2-canonical-input-manifest.json', 'archive/data/archive2-canonical-projection-policy.json',
 'archive/data/archive2-item-review-overrides.json', 'archive/data/basic-scope-parent-links.json',
}
METADATA = 'archive/data/question_metadata.json'
SHARD_DIR = 'archive/data/question-metadata/v1/'
MAX_META = 200 * 1024 * 1024


def metadata_shard_blobs(text):
    """{shard path: git blob sha1} of the per-exam shards the assembled question metadata splits into.

    The assembled file is `{ ...head keys..., "records": [ one compact record per line ], ... }`; a shard is one exam's
    record lines (already questionUid ordered in the file) as `[\\n  line,\\n  line\\n]\\n`, named by sha256(sourceArchiveFile)."""
    lines = text.split('\n')
    start = next((i for i, l in enumerate(lines) if l == '  "records": ['), None)
    if start is None:
        raise RuntimeError('question metadata records block not found')
    groups = {}
    i = start + 1
    while i < len(lines) and not lines[i].startswith('  ]'):
        raw = lines[i]
        if not raw.startswith('    '):
            raise RuntimeError('unexpected question metadata record line')
        body = raw[4:-1] if raw.endswith(',') else raw[4:]
        record = json.loads(body)
        key = hashlib.sha256(str(record['sourceArchiveFile']).encode('utf-8')).hexdigest()
        groups.setdefault(key, []).append(body)
        i += 1
    out = {}
    for key, rows in groups.items():
        shard = ('[\n' + ',\n'.join('  ' + row for row in rows) + '\n]\n').encode('utf-8')
        out[SHARD_DIR + key + '.json'] = hashlib.sha1(b'blob %d\0' % len(shard) + shard).hexdigest()
    return out


seen_meta = False
files = {}
with zipfile.ZipFile(ZIP_FILE) as z:
    members = [m for m in z.infolist() if m.filename in ('artifact.tar', 'artifact.tar.gz')]
    if len(members) != 1:
        raise RuntimeError('Expected one uploaded Pages artifact.tar')
    with z.open(members[0]) as stream:
        with tarfile.open(fileobj=stream, mode='r|*') as tf:
            for member in tf:
                name = member.name
                if name.startswith('./'):
                    name = name[2:]
                if not member.isfile():
                    continue
                if name in files:
                    raise RuntimeError('Duplicate deployed path: ' + name)
                if name == METADATA:
                    # Git holds the question metadata as per-exam shards; the deployed one file is their assembly. Split it into the
                    # same shard blobs (byte-exact: records are one compact JSON line each, in questionUid order) so the witness
                    # still reflects every metadata record. Never extract a path or run anything from the artifact.
                    if member.size > MAX_META or member.size < 0:
                        raise RuntimeError('Oversize witness file: ' + name)
                    if seen_meta:
                        raise RuntimeError('Duplicate deployed path: ' + name)
                    seen_meta = True
                    f = tf.extractfile(member)
                    if f is None:
                        raise RuntimeError('Unreadable tar member')
                    data = f.read(MAX_META + 1)
                    if len(data) != member.size:
                        raise RuntimeError('Incomplete site artifact member')
                    files.update(metadata_shard_blobs(data.decode('utf-8')))
                    continue
                if not (name.startswith(PREFIXES) or name in REGISTRY):
                    continue
                if member.size > MAX_FILE or member.size < 0:
                    raise RuntimeError('Oversize witness file: ' + name)
                f = tf.extractfile(member)
                if f is None:
                    raise RuntimeError('Unreadable tar member')
                h = hashlib.sha1()
                h.update(f'blob {member.size}\0'.encode())
                actual = 0
                while True:
                    chunk = f.read(65536)
                    if not chunk:
                        break
                    actual += len(chunk)
                    h.update(chunk)
                if actual != member.size:
                    raise RuntimeError('Incomplete site artifact member')
                files[name] = h.hexdigest()
print(json.dumps(files, separators=(',', ':')))
