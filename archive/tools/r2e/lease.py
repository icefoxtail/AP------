"""Local repository-wide kernel lock. EOF/crash releases it; age never steals it."""
import argparse
import json
import os
from pathlib import Path
import socket
import sys
import time

p = argparse.ArgumentParser()
p.add_argument('--root', required=True)
p.add_argument('--owner', required=True)
p.add_argument('--parent', type=int, required=True)
p.add_argument('--run-id', required=True)
a = p.parse_args()
root = Path(a.root).resolve()
root.mkdir(parents=True, exist_ok=True)
guard_path = root / 'run.guard'
lease_path = root / 'lease.json'
if guard_path.is_symlink() or lease_path.is_symlink():
    raise RuntimeError('LOCK_SYMLINK_FORBIDDEN')
with open(guard_path, 'a+b') as guard:
    guard.seek(0, os.SEEK_END)
    if guard.tell() == 0:
        guard.write(b'0')
        guard.flush()
    guard.seek(0)
    try:
        if os.name == 'nt':
            import msvcrt
            msvcrt.locking(guard.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(guard.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        print(json.dumps({'status': 'RUN_ALREADY_ACTIVE'}), flush=True)
        sys.exit(2)
    old = json.loads(lease_path.read_text('utf-8')) if lease_path.exists() else {}
    if old.get('host') and old['host'].lower() != socket.gethostname().lower():
        raise RuntimeError('FOREIGN_LOCK_HOST_REQUIRES_RECONCILIATION')
    lease = {'schemaVersion': 'APMATH_R2E_LEASE_v1', 'runId': a.run_id, 'ownerToken': a.owner,
             'host': socket.gethostname(), 'pid': a.parent, 'guardPid': os.getpid(),
             'fencingToken': int(old.get('fencingToken', 0)) + 1, 'acquiredAt': time.time(), 'heartbeatAt': time.time()}

    def persist():
        tmp = root / ('lease-' + a.owner + '.next')
        with open(tmp, 'x', encoding='utf-8') as f:
            json.dump(lease, f)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, lease_path)

    persist()
    print(json.dumps({'status': 'ACQUIRED', 'fencingToken': lease['fencingToken']}), flush=True)
    try:
        for line in sys.stdin:
            if line.strip() == 'release':
                break
            lease['heartbeatAt'] = time.time()
            persist()
    finally:
        lease['releasedAt'] = time.time()
        persist()
