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
 'archive/data/question_metadata.json',
 'archive/data/archive2-canonical-input-manifest.json', 'archive/data/archive2-canonical-projection-policy.json',
 'archive/data/archive2-item-review-overrides.json', 'archive/data/basic-scope-parent-links.json',
}
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
