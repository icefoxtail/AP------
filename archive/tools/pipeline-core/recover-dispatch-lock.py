"""Recover a dead local mutation lock; never mutate provider or budget state.

The permanent guard uses a kernel byte/flock lock, released by the OS on crash.
The marker excludes JS mutators, including during a crashed recovery restart.
"""
import argparse
import ctypes
import hashlib
import json
import os
from pathlib import Path
import socket
import sys
import uuid


def digest(data):
    return 'sha256:' + hashlib.sha256(data).hexdigest()


def require(ok, code):
    if not ok:
        raise RuntimeError('HOLD:' + code)


def owner_dead(pid):
    if os.name == 'nt':
        kernel = ctypes.WinDLL('kernel32', use_last_error=True)
        kernel.OpenProcess.argtypes = [ctypes.c_uint32, ctypes.c_int, ctypes.c_uint32]
        kernel.OpenProcess.restype = ctypes.c_void_p
        kernel.WaitForSingleObject.argtypes = [ctypes.c_void_p, ctypes.c_uint32]
        kernel.WaitForSingleObject.restype = ctypes.c_uint32
        kernel.CloseHandle.argtypes = [ctypes.c_void_p]
        handle = kernel.OpenProcess(0x00100000, 0, pid)  # SYNCHRONIZE only
        if not handle:
            return ctypes.get_last_error() == 87  # nonexistent PID; access denied is unknown
        try:
            return kernel.WaitForSingleObject(handle, 0) == 0
        finally:
            kernel.CloseHandle(handle)
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return True
    except PermissionError:
        return False
    return False


def recover(root, expected):
    directory = (root / 'alive/runtime/work-batches').resolve()
    require(directory.is_relative_to(root) and directory.is_dir(), 'LOCK_DIRECTORY_INVALID')
    lock = directory / '.dispatch.lock'
    marker = directory / '.dispatch.recovering'
    guard_path = directory / '.dispatch.recovery.guard'
    require(not any(p.is_symlink() for p in [lock, marker, guard_path]), 'LOCK_SYMLINK_FORBIDDEN')
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
        except OSError as exc:
            raise RuntimeError('HOLD:RECOVERY_ALREADY_RUNNING') from exc
        # A previous recovery marker is safe to replace only under the OS guard.
        marker.write_text(json.dumps({'pid': os.getpid(), 'host': socket.gethostname()}), encoding='utf-8')
        try:
            data = lock.read_bytes() if lock.exists() else None
            owner = None
            if data is None:
                require(expected == 'ABSENT', 'LOCK_CHANGED_INSPECT_AGAIN')
            else:
                require(digest(data) == expected, 'LOCK_CHANGED_INSPECT_AGAIN')
                try:
                    owner = json.loads(data)
                except (ValueError, UnicodeError) as exc:
                    raise RuntimeError('HOLD:LEGACY_OR_INCOMPLETE_LOCK_OWNER_UNKNOWN') from exc
                require(owner.get('schemaVersion') == 'APMATH_DISPATCH_LOCK_v1' and isinstance(owner.get('ownerToken'), str) and owner['ownerToken'], 'LOCK_OWNER_INVALID')
                require(owner.get('host', '').lower() == socket.gethostname().lower(), 'REMOTE_LOCK_OWNER_UNKNOWN')
                pid = owner.get('pid')
                require(type(pid) is int and 0 < pid <= 0xFFFFFFFF, 'LOCK_PID_INVALID')
                require(owner_dead(pid), 'LOCK_OWNER_ACTIVE_OR_UNKNOWN')
            states, pending, active = [], [], []
            for child in directory.iterdir():
                if child.name.startswith('.'):
                    continue
                require(not child.is_symlink(), 'STATE_SYMLINK_FORBIDDEN')
                if not child.is_dir():
                    continue
                state_file = child / 'state.json'
                if state_file.exists():
                    require(not state_file.is_symlink(), 'STATE_SYMLINK_FORBIDDEN')
                    raw = state_file.read_bytes()
                    state = json.loads(raw)
                    states.append({'path': str(state_file.relative_to(root)), 'sha256': digest(raw)})
                    active.extend({'workBatchId': state.get('workBatchId'), 'launchId': row.get('launchId'), 'externalId': row.get('externalId'), 'status': row['status']} for row in state.get('launches', []) if row.get('status') in ['RESERVED', 'DISPATCHED'])
                for name in ['state.json.next', 'state.json.hold']:
                    file = child / name
                    if file.exists():
                        require(file.is_file() and not file.is_symlink(), 'PENDING_WRITE_INVALID')
                        pending.append(file)
            require((lock.read_bytes() if lock.exists() else None) == data, 'LOCK_CHANGED_INSPECT_AGAIN')
            archive = directory / ('.recovery-' + str(uuid.uuid4()))
            archive.mkdir()
            # Pending writes were not committed/returned. Preserve, never replay or delete them.
            for file in pending:
                file.rename(archive / (file.parent.name + '-' + file.name))
            if data is not None:
                lock.rename(archive / 'dispatch.lock')
            report = {'status': 'RECOVERED_RECONCILE_REQUIRED', 'lockSha': expected, 'owner': owner, 'archive': str(archive.relative_to(root)), 'preservedStates': states, 'activeProviderTasks': active, 'quarantinedPendingWriteCount': len(pending), 'providerTasksChanged': False, 'budgetReset': False}
            (archive / 'recovery.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
            return report
        finally:
            marker.unlink(missing_ok=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True)
    parser.add_argument('--expected-lock-sha', required=True)
    args = parser.parse_args()
    try:
        result = recover(Path(args.root).resolve(strict=True), args.expected_lock_sha)
    except Exception as exc:
        print(json.dumps({'status': 'HOLD', 'errors': [str(exc)]}))
        sys.exit(1)
    print(json.dumps(result))
