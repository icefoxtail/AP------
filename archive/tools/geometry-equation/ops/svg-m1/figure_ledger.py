"""시험지별 해설 그림 장부(exam-figure-ledger/) 공용 읽기·쓰기. Node 쪽은 figure-ledger.cjs(같은 규칙).

저장 형식
  production/exam-figure-ledger/_meta.json          장부 머리(schemaVersion, updated, rule)
  production/exam-figure-ledger/<src 하위 경로>.json  시험지 하나 = 파일 하나 = 옛 exams[]의 원소 하나
  예) src archive/exams/original/middle/m3/2final/X.js -> exam-figure-ledger/middle/m3/2final/X.json
  직렬화는 json.dumps(indent=2, ensure_ascii=False) + LF 하나. Node JSON.stringify(v,null,2)와 바이트가 같다.

쓰기 규칙(save_exam이 항상 강제)
  - 그 시험지 파일 하나만 쓴다(임시 파일에 쓰고 바꿔치기).
  - 이미 PUBLISHED인 문항은 allow_demote에 그 번호를 넘기지 않으면 PUBLISHED가 아닌 상태로 바꿀 수 없다.
  - 이미 있던 문항을 지울 수 없다.
  - CLOSED는 모든 문항이 PUBLISHED/EXEMPT일 때만 허용한다.

명령: python figure_ledger.py split-ledger | join-ledger | check-ledger | queue | port-ledger-change (--help 참고)
"""
import argparse
import collections
import json
import os
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from portable_root import repo_root  # noqa: E402  (stdout UTF-8 설정 포함)

LEDGER_REL = 'archive/tools/geometry-equation/production/exam-figure-ledger'
LEGACY_REL = 'archive/tools/geometry-equation/production/exam-figure-ledger.json'
META_NAME = '_meta.json'
SRC_PREFIX = 'archive/exams/original/'
TERMINAL = ('PUBLISHED', 'EXEMPT')


class LedgerError(ValueError):
    pass


def _root(root):
    return Path(root) if root is not None else repo_root()


def ledger_dir(root=None):
    return _root(root) / LEDGER_REL


def rel_path(src):
    """src(archive/exams/original/.../X.js) -> 장부 폴더 안 상대 경로(.../X.json)."""
    if not isinstance(src, str) or not src.startswith(SRC_PREFIX) or not src.endswith('.js'):
        raise LedgerError(f'src must be {SRC_PREFIX}...js: {src!r}')
    rel = src[len(SRC_PREFIX):-3]
    parts = rel.split('/')
    if any(p in ('', '.', '..') or '\\' in p for p in parts) or parts[-1] == META_NAME[:-5]:
        raise LedgerError(f'invalid src path: {src!r}')
    return rel + '.json'


def exam_path(src, root=None):
    return ledger_dir(root) / rel_path(src)


def dumps(obj):
    return (json.dumps(obj, ensure_ascii=False, indent=2) + '\n').encode('utf-8')


def _parse(data):
    return json.loads(data.decode('utf-8-sig') if isinstance(data, bytes) else data)


def ord_id(o):
    """문항 번호 비교 키: 1 과 '1' 은 같은 문항으로 본다(중복 금지 판정용)."""
    return str(o)


def is_terminal(item):
    return item.get('state') in TERMINAL


def check_entry(entry, rel=None):
    """시험지 항목 하나의 구조와 닫힘 규칙. 문제가 있으면 LedgerError."""
    if not isinstance(entry, dict):
        raise LedgerError('exam entry must be an object')
    for k in ('exam', 'src', 'items', 'status'):
        if k not in entry:
            raise LedgerError(f'{entry.get("exam")}: missing {k}')
    want = rel_path(entry['src'])
    if rel is not None and rel != want:
        raise LedgerError(f'{entry["exam"]}: file {rel} does not match src ({want})')
    if Path(entry['src']).stem != entry['exam']:
        raise LedgerError(f'{entry["exam"]}: exam name differs from src file name')
    if entry['status'] not in ('OPEN', 'CLOSED'):
        raise LedgerError(f'{entry["exam"]}: status must be OPEN or CLOSED')
    items = entry['items']
    if not isinstance(items, list):
        raise LedgerError(f'{entry["exam"]}: items must be a list')
    seen = set()
    for it in items:
        if not isinstance(it, dict) or 'ord' not in it or 'state' not in it:
            raise LedgerError(f'{entry["exam"]}: item without ord/state')
        if ord_id(it['ord']) in seen:
            raise LedgerError(f'{entry["exam"]}: duplicate ord {it["ord"]}')
        seen.add(ord_id(it['ord']))
    if entry['status'] == 'CLOSED':
        bad = [it['ord'] for it in items if not is_terminal(it)]
        if bad:
            raise LedgerError(f'{entry["exam"]}: CLOSED with unresolved items {bad}')


def guard_change(previous, entry, allow_demote=()):
    """문항 단위 보호: 있던 문항은 남고, PUBLISHED는 명시한 번호만 내려간다."""
    if previous is None:
        return
    allowed = {ord_id(o) for o in allow_demote}
    now = {ord_id(it['ord']): it for it in entry['items']}
    for it in previous['items']:
        k = ord_id(it['ord'])
        if k not in now:
            raise LedgerError(f'{entry["exam"]} q{it["ord"]}: existing item would be removed')
        if it.get('state') == 'PUBLISHED' and now[k].get('state') != 'PUBLISHED' and k not in allowed:
            raise LedgerError(f'{entry["exam"]} q{it["ord"]}: PUBLISHED would become {now[k].get("state")} '
                              '(pass the ord explicitly to demote)')


def _atomic_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix='.' + path.stem + '.', suffix='.part', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(data)
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def load_exam(src, root=None):
    p = exam_path(src, root)
    if not p.is_file():
        return None
    entry = _parse(p.read_bytes())
    check_entry(entry, rel_path(src))
    return entry


def find_exam(name, root=None):
    """시험지 이름(파일 이름)으로 찾는다. 없으면 None, 둘 이상이면 오류."""
    if not isinstance(name, str) or not name or '/' in name or '\\' in name or name in ('.', '..'):
        raise LedgerError(f'invalid exam name: {name!r}')
    hits = [p for p in ledger_dir(root).rglob(name + '.json') if p.name == name + '.json']
    if len(hits) > 1:
        raise LedgerError(f'{name}: found in several folders')
    if not hits:
        return None
    entry = _parse(hits[0].read_bytes())
    check_entry(entry, hits[0].relative_to(ledger_dir(root)).as_posix())
    return entry


def save_exam(entry, root=None, allow_demote=()):
    """그 시험지 파일 하나만 쓴다. 디스크의 이전 판과 비교해 문항 단위 보호를 강제한다."""
    check_entry(entry)
    previous = load_exam(entry['src'], root)
    if previous is not None and previous['exam'] != entry['exam']:
        raise LedgerError(f'{entry["src"]}: exam name changed')
    guard_change(previous, entry, allow_demote)
    path = exam_path(entry['src'], root)
    data = dumps(entry)
    if path.is_file() and path.read_bytes() == data:
        return path
    _atomic_write(path, data)
    return path


def settle_status(entry):
    """열린 문항이 있으면 OPEN(닫힘 해제). 모두 끝났다고 저절로 CLOSED로 만들지는 않는다."""
    if any(not is_terminal(it) for it in entry['items']):
        if entry.get('status') == 'CLOSED' and entry.get('closedBy') is not None:
            entry['closedBy'] = None
        entry['status'] = 'OPEN'
    return entry


def upsert_item(src, ord_, patch, root=None, allow_demote=False):
    """문항 하나만 고친다. 다른 문항은 그대로. 있던 키 순서는 유지하고 새 키는 뒤에 붙인다."""
    entry = load_exam(src, root)
    if entry is None:
        raise LedgerError(f'{src}: not in ledger')
    if 'ord' in patch and ord_id(patch['ord']) != ord_id(ord_):
        raise LedgerError('patch cannot change ord')
    for i, it in enumerate(entry['items']):
        if ord_id(it['ord']) == ord_id(ord_):
            entry['items'][i] = {**it, **patch}
            break
    else:
        entry['items'].append({'ord': ord_, **patch})
    settle_status(entry)
    return save_exam(entry, root, allow_demote=[ord_] if allow_demote else ())


def exam_files(root=None):
    d = ledger_dir(root)
    if not d.is_dir():
        return []
    return sorted(p for p in d.rglob('*.json') if p.relative_to(d).as_posix() != META_NAME)


def _assemble(meta, entries):
    if 'exams' in meta:
        raise LedgerError('_meta.json must not contain exams')
    out = dict(meta)
    out['exams'] = sorted(entries, key=lambda e: e['src'])
    return out


def load_all(root=None):
    """옛 한 파일과 같은 모양의 객체. 시험지 순서는 src 순."""
    d = ledger_dir(root)
    meta = _parse((d / META_NAME).read_bytes())
    entries = []
    for p in exam_files(root):
        e = _parse(p.read_bytes())
        check_entry(e, p.relative_to(d).as_posix())
        entries.append(e)
    return _assemble(meta, entries)


def _git(root, *args, input=None):
    r = subprocess.run(['git', '-c', 'core.quotepath=off', *args], cwd=root, input=input, capture_output=True)
    if r.returncode != 0:
        raise LedgerError(f'git {args[0]} failed: {r.stderr.decode("utf-8", "replace").strip()}')
    return r.stdout


def _cat_files(root, specs):
    """git cat-file --batch 로 여러 blob을 한 번에 읽는다."""
    if not specs:
        return []
    raw = _git(root, 'cat-file', '--batch', input=''.join(s + '\n' for s in specs).encode('utf-8'))
    out, pos = [], 0
    for s in specs:
        nl = raw.index(b'\n', pos)
        head = raw[pos:nl].split(b' ')
        if len(head) != 3 or head[1] != b'blob':
            raise LedgerError(f'cannot read {s}')
        size = int(head[2])
        out.append(raw[nl + 1:nl + 1 + size])
        pos = nl + 1 + size + 1
    return out


def load_all_at(rev, root=None):
    """커밋 하나의 장부 전체. 새 형식이 있으면 그것을, 없으면 옛 한 파일을 읽는다."""
    root = _root(root)
    names = [n for n in _git(root, 'ls-tree', '-r', '-z', '--name-only', rev, '--', LEDGER_REL + '/').decode('utf-8').split('\0') if n]
    if names:
        blobs = _cat_files(root, [f'{rev}:{n}' for n in names])
        meta, entries = None, []
        for n, b in zip(names, blobs):
            if not n.endswith('.json'):
                continue
            rel = n[len(LEDGER_REL) + 1:]
            if rel == META_NAME:
                meta = _parse(b)
            else:
                e = _parse(b)
                check_entry(e, rel)
                entries.append(e)
        if meta is None:
            raise LedgerError(f'{rev}: {META_NAME} missing')
        return _assemble(meta, entries)
    return _parse(_cat_files(root, [f'{rev}:{LEGACY_REL}'])[0])


def entries_at(rev, root=None):
    return {e['src']: e for e in load_all_at(rev, root)['exams']}


def legacy_bytes(ledger):
    return dumps(ledger)


# ---------- split / join ----------

def split(ledger, root=None):
    """옛 한 파일 객체를 폴더로 쓴다. 폴더에 있던, 원본에 없는 시험지 파일은 지운다. 쓴 파일 수를 돌려준다."""
    if not isinstance(ledger, dict) or not isinstance(ledger.get('exams'), list):
        raise LedgerError('legacy ledger must have exams[]')
    keys = list(ledger)
    if keys[-1] != 'exams':
        raise LedgerError('legacy ledger: exams must be the last top-level key')
    d = ledger_dir(root)
    meta = {k: v for k, v in ledger.items() if k != 'exams'}
    seen = {}
    for e in ledger['exams']:
        check_entry(e)
        rel = rel_path(e['src'])
        if rel.lower() in seen:
            raise LedgerError(f'duplicate exam file {rel}')
        seen[rel.lower()] = e
    stale = [p for p in exam_files(root) if p.relative_to(d).as_posix().lower() not in seen]
    _atomic_write(d / META_NAME, dumps(meta))
    written = 0
    for e in seen.values():
        p = d / rel_path(e['src'])
        data = dumps(e)
        if not (p.is_file() and p.read_bytes() == data):
            _atomic_write(p, data)
            written += 1
    for p in stale:
        p.unlink()
    return {'exams': len(seen), 'written': written, 'removed': len(stale)}


def same_content(a, b):
    """시험지 순서만 빼고 같은가(시험지마다 직렬화 바이트까지 비교)."""
    if [k for k in a if k != 'exams'] != [k for k in b if k != 'exams']:
        return False
    if any(a[k] != b[k] for k in a if k != 'exams'):
        return False
    ea = {e['src']: dumps(e) for e in a['exams']}
    eb = {e['src']: dumps(e) for e in b['exams']}
    return ea == eb and len(ea) == len(a['exams']) == len(b['exams'])


# ---------- 3-way port ----------

def _merge_value(b, h, c):
    if h == b:
        return c, False
    if c == b or c == h:
        return h, False
    return c, True


def merge3(base, head, cur, allow_demote=False):
    """branch(head)가 base에서 바꾼 것만 현재 판(cur)에 옮긴다. (결과, 충돌 목록)."""
    conflicts = []
    if cur is None:
        if base is not None:
            conflicts.append('exam removed on target since base')
        return head, conflicts
    b = base or {'items': []}
    bi = {ord_id(i['ord']): i for i in b['items']}
    hi = {ord_id(i['ord']): i for i in head['items']}
    ci = {ord_id(i['ord']): i for i in cur['items']}
    order = [ord_id(i['ord']) for i in cur['items']] + [k for k in (ord_id(i['ord']) for i in head['items']) if k not in ci]
    items = []
    for k in order:
        bv, hv, cv = bi.get(k), hi.get(k), ci.get(k)
        v, clash = _merge_value(bv, hv, cv)
        if clash:
            conflicts.append(f'q{k}: both sides changed (target {cv and cv.get("state")}, branch {hv and hv.get("state")})')
            v = cv
        if (not allow_demote and bv is not None and hv is not None and bv.get('state') == 'PUBLISHED'
                and hv.get('state') != 'PUBLISHED' and v is hv):
            conflicts.append(f'q{k}: branch demotes PUBLISHED to {hv.get("state")}')
            v = cv
        if v is not None:
            items.append(v)
    out = {}
    for key in list(cur) + [k for k in head if k not in cur]:
        if key == 'items':
            out['items'] = items
            continue
        v, clash = _merge_value(b.get(key), head.get(key), cur.get(key))
        if clash:
            conflicts.append(f'{key}: both sides changed')
            v = cur.get(key)
        if key in cur or key in head:
            out[key] = v
    settle_status(out)
    return out, conflicts


def port_change(base_rev, head_rev, root=None, dry_run=False, allow_demote=False):
    root = _root(root)
    base, head = entries_at(base_rev, root), entries_at(head_rev, root)
    report = {'changed': [], 'written': [], 'conflicts': {}, 'removedOnBranch': [], 'metaChanged': False}
    bm = {k: v for k, v in load_all_at(base_rev, root).items() if k != 'exams'}
    hm = {k: v for k, v in load_all_at(head_rev, root).items() if k != 'exams'}
    report['metaChanged'] = {k: v for k, v in hm.items() if k != 'updated'} != {k: v for k, v in bm.items() if k != 'updated'}
    for src in sorted(set(base) - set(head)):
        report['removedOnBranch'].append(src)
    for src in sorted(head):
        if base.get(src) == head[src]:
            continue
        report['changed'].append(src)
        cur = load_exam(src, root)
        merged, conflicts = merge3(base.get(src), head[src], cur, allow_demote)
        if conflicts:
            report['conflicts'][src] = conflicts
            continue
        try:
            check_entry(merged)
            prev_published = {ord_id(i['ord']) for i in (cur or {'items': []})['items'] if i.get('state') == 'PUBLISHED'}
            demoted = [i['ord'] for i in merged['items'] if ord_id(i['ord']) in prev_published and i.get('state') != 'PUBLISHED']
            if not dry_run:
                save_exam(merged, root, allow_demote=demoted if allow_demote else ())
            report['written'].append(src)
        except LedgerError as err:
            report['conflicts'][src] = [str(err)]
    return report


# ---------- queue summary ----------

def queue_markdown(ledger):
    exams = ledger['exams']
    st = collections.Counter(e['status'] for e in exams)
    items = collections.Counter(i['state'] for e in exams for i in e['items'])
    lines = [f'# 시험지별 해설 그림 작업 큐 ({date.today().isoformat()} 생성)', '',
             '이 파일은 `python archive/tools/geometry-equation/ops/svg-m1/figure_ledger.py queue`로 만든 요약이다. '
             '게시할 때마다 고치지 않는다. 기준은 `production/exam-figure-ledger/`(시험지별 파일)다.', '',
             '## 현황', '',
             f'- 시험지 {len(exams)}개: ' + ' / '.join(f'{k} {st[k]}' for k in sorted(st)),
             f'- 문항 {sum(items.values())}개: ' + ', '.join(f'{k} {items[k]}' for k in sorted(items)), '',
             '## OPEN 큐 (열린 문항 수 내림차순, 같으면 시험지명순)', '']
    rows = []
    for e in exams:
        opn = [i for i in e['items'] if not is_terminal(i)]
        if e['status'] == 'CLOSED' and not opn:
            continue
        if not opn:
            rows.append((0, e['exam'], f'- **{e["exam"]}** (0건): 열린 문항 없음, status {e["status"]}'))
            continue
        desc = ' · '.join(f'q{i["ord"]} {i["state"]}' + (f' — {str(i.get("reason", ""))[:70]}' if i.get('reason') else '') for i in opn)
        rows.append((len(opn), e['exam'], f'- **{e["exam"]}** ({len(opn)}건): {desc}'))
    rows.sort(key=lambda r: (-r[0], r[1]))
    lines += [r[2] for r in rows] or ['- 없음']
    return ('\n'.join(lines) + '\n').encode('utf-8')


# ---------- CLI ----------

def check_all(root=None):
    """폴더 전체 검사. 문제 목록을 돌려준다(빈 목록 = 정상)."""
    root = _root(root)
    d = ledger_dir(root)
    problems = []
    if (root / LEGACY_REL).exists():
        problems.append(f'legacy single-file ledger still exists: {LEGACY_REL}')
    if not (d / META_NAME).is_file():
        problems.append(f'missing {META_NAME}')
    else:
        meta = _parse((d / META_NAME).read_bytes())
        if 'exams' in meta or not meta.get('schemaVersion'):
            problems.append(f'{META_NAME}: needs schemaVersion and no exams')
        if (d / META_NAME).read_bytes() != dumps(meta):
            problems.append(f'{META_NAME}: not in canonical format')
    for p in exam_files(root):
        rel = p.relative_to(d).as_posix()
        raw = p.read_bytes()
        try:
            e = _parse(raw)
            check_entry(e, rel)
        except (LedgerError, ValueError) as err:
            problems.append(f'{rel}: {err}')
            continue
        if raw != dumps(e):
            problems.append(f'{rel}: not in canonical format (regenerate with split-ledger or save_exam)')
    for p in d.rglob('*') if d.is_dir() else []:
        if p.is_file() and p.suffix != '.json':
            problems.append(f'{p.relative_to(d).as_posix()}: unexpected file')
    return problems


def main(argv=None):
    ap = argparse.ArgumentParser(prog='figure_ledger.py')
    sub = ap.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('split-ledger', help='옛 한 파일 장부를 시험지별 파일로 쪼갠다(재생성)')
    g = s.add_mutually_exclusive_group()
    g.add_argument('--from', dest='src_file', help='옛 장부 파일(기본: 작업 트리의 exam-figure-ledger.json)')
    g.add_argument('--rev', help='git 커밋의 옛 장부를 읽는다(예: origin/main, MERGE_HEAD)')
    s.add_argument('--keep-legacy', action='store_true', help='작업 트리의 옛 파일을 지우지 않는다')
    j = sub.add_parser('join-ledger', help='시험지별 파일을 옛 한 파일 형식으로 합친다')
    j.add_argument('--out', required=True)
    j.add_argument('--rev', help='작업 트리 대신 이 커밋의 장부를 합친다')
    sub.add_parser('check-ledger', help='폴더 전체 형식·닫힘 규칙 검사')
    q = sub.add_parser('queue', help='전체 요약(exam-figure-queue.md)을 필요할 때만 만든다')
    q.add_argument('--out', default=None, help='기본: production/exam-figure-queue.md')
    pc = sub.add_parser('port-ledger-change', help='옛 형식 장부를 고친 브랜치의 변경을 시험지별 파일로 옮긴다')
    pc.add_argument('--base', required=True, help='브랜치가 갈라진 main 커밋(예: $(git merge-base HEAD origin/main))')
    pc.add_argument('--head', required=True, help='브랜치 커밋')
    pc.add_argument('--dry-run', action='store_true')
    pc.add_argument('--allow-demote', action='store_true', help='브랜치가 PUBLISHED를 내린 변경도 옮긴다(사람이 확인한 경우만)')
    a = ap.parse_args(argv)
    root = repo_root()
    if a.cmd == 'split-ledger':
        if a.rev:
            raw = _cat_files(root, [f'{a.rev}:{LEGACY_REL}'])[0]
        else:
            raw = Path(a.src_file or root / LEGACY_REL).read_bytes()
        legacy = _parse(raw)
        if raw.lstrip(b'\xef\xbb\xbf') != dumps(legacy):
            print('note: source is not in canonical format; per-exam files use canonical format', file=sys.stderr)
        res = split(legacy, root)
        back = load_all(root)
        if not same_content(legacy, back):
            raise LedgerError('round trip mismatch after split')
        if not a.keep_legacy and not a.src_file and (root / LEGACY_REL).exists():
            (root / LEGACY_REL).unlink()
            res['legacyRemoved'] = True
        print(json.dumps({**res, 'roundTrip': 'OK'}, ensure_ascii=False))
    elif a.cmd == 'join-ledger':
        led = load_all_at(a.rev, root) if a.rev else load_all(root)
        Path(a.out).write_bytes(legacy_bytes(led))
        print(a.out, len(led['exams']))
    elif a.cmd == 'check-ledger':
        problems = check_all(root)
        for p in problems:
            print('PROBLEM', p)
        print(f'checked {len(exam_files(root))} exam files, problems {len(problems)}')
        return 1 if problems else 0
    elif a.cmd == 'queue':
        out = Path(a.out) if a.out else root / 'archive/tools/geometry-equation/production/exam-figure-queue.md'
        out.write_bytes(queue_markdown(load_all(root)))
        print(out)
    elif a.cmd == 'port-ledger-change':
        rep = port_change(a.base, a.head, root, a.dry_run, a.allow_demote)
        print(json.dumps(rep, ensure_ascii=False, indent=2))
        return 2 if rep['conflicts'] else 0
    return 0


if __name__ == '__main__':
    sys.exit(main())
