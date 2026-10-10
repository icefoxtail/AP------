import os
import sys
import json
import re
import argparse
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ARCHIVE_ORIGINAL_DIR = os.path.join(REPO_ROOT, 'archive', 'exams', 'original')
LEDGER_PATH = os.path.join(REPO_ROOT, 'archive', 'intake_tracking_ledger.json')
SOURCE_BASE = r'C:\Users\USER\Desktop\기출정리 파일'

PRIORITY_CATEGORIES = [
    {
        'id': 'h2_1mid',
        'label': '고2 1중간',
        'term_dir': '(1)1중간',
        'subdirs': ['수1', '수2', '확률과통계', '미적분', '기벡', '대수'],
        'grade': '고2',
        'term': '1mid',
        'target_dest_dir': os.path.join(ARCHIVE_ORIGINAL_DIR, 'high', 'h2', '1mid')
    },
    {
        'id': 'h2_1final',
        'label': '고2 1기말',
        'term_dir': '(2)1기말',
        'subdirs': ['수1', '수2', '확률과 통계', '미적분', '기하'],
        'grade': '고2',
        'term': '1final',
        'target_dest_dir': os.path.join(ARCHIVE_ORIGINAL_DIR, 'high', 'h2', '1final')
    },
    {
        'id': 'm3_1mid',
        'label': '중3 1중간',
        'term_dir': '(1)1중간',
        'subdirs': ['중3'],
        'grade': '중3',
        'term': '1mid',
        'target_dest_dir': os.path.join(ARCHIVE_ORIGINAL_DIR, 'middle', 'm3', '1mid')
    },
    {
        'id': 'm3_1final',
        'label': '중3 1기말',
        'term_dir': '(2)1기말',
        'subdirs': ['중3'],
        'grade': '중3',
        'term': '1final',
        'target_dest_dir': os.path.join(ARCHIVE_ORIGINAL_DIR, 'middle', 'm3', '1final')
    },
    {
        'id': 'm2_1mid',
        'label': '중2 1중간',
        'term_dir': '(1)1중간',
        'subdirs': ['중2'],
        'grade': '중2',
        'term': '1mid',
        'target_dest_dir': os.path.join(ARCHIVE_ORIGINAL_DIR, 'middle', 'm2', '1mid')
    },
    {
        'id': 'm2_1final',
        'label': '중2 1기말',
        'term_dir': '(2)1기말',
        'subdirs': ['중2'],
        'grade': '중2',
        'term': '1final',
        'target_dest_dir': os.path.join(ARCHIVE_ORIGINAL_DIR, 'middle', 'm2', '1final')
    }
]

SCHOOLS = [
    ('강남여고', ['강남여고', '강남고', '강남여']),
    ('매산여고', ['매산여고', '매여고']),
    ('매산고', ['매산고']),
    ('순천여고', ['순천여고', '순여고']),
    ('순천고', ['순천고']),
    ('팔마고', ['팔마고']),
    ('금당고', ['금당고']),
    ('효천고', ['효천고']),
    ('제일고', ['제일고']),
    ('청암고', ['청암고']),
    ('광양고', ['광양고']),
    ('광영고', ['광영고']),
    ('백운고', ['백운고']),
    ('중마고', ['중마고']),
    ('금당중', ['금당중']),
    ('동산중', ['동산중', '동산여중']),
    ('연향중', ['연향중']),
    ('이수중', ['이수중']),
    ('왕운중', ['왕운중']),
    ('풍덕중', ['풍덕중']),
    ('삼산중', ['삼산중']),
    ('순천중', ['순천중']),
    ('신흥중', ['신흥중']),
    ('승평중', ['승평중']),
    ('향림중', ['향림중']),
    ('팔마중', ['팔마중']),
    ('매산중', ['매산중'])
]

SUBJECTS = [
    ('수1', ['대수', '수1', '수학1']),
    ('수2', ['수2', '수학2', '수학ii', '수학II']),
    ('확통', ['확통', '확률과통계', '확률과 통계']),
    ('미적분', ['미적분', '미적분1', '미적분2', '미적']),
    ('기하', ['기하', '기벡', '기하와벡터']),
    ('공통수학1', ['공통수학1', '공수1']),
    ('수학(상)', ['수학(상)', '수학상']),
    ('수학(하)', ['수학(하)', '수학하']),
    ('수학', ['수학'])
]

def parse_exam_identity(name):
    n = name.replace('.pdf', '').replace('.js', '')

    m_yr = re.search(r'(20\d{2})|^(\d{2})_|_(\d{2})_', n)
    yr = None
    if m_yr:
        for g in m_yr.groups():
            if g:
                yr = int(g)
                if yr < 100: yr += 2000
                break

    grade = None
    if '고1' in n or '_h1_' in n or 'h1' in n: grade = '고1'
    elif '고2' in n or '_h2_' in n or 'h2' in n: grade = '고2'
    elif '고3' in n or '_h3_' in n or 'h3' in n: grade = '고3'
    elif '중1' in n or '_m1_' in n or 'm1' in n: grade = '중1'
    elif '중2' in n or '_m2_' in n or 'm2' in n: grade = '중2'
    elif '중3' in n or '_m3_' in n or 'm3' in n: grade = '중3'

    term = None
    if '1중간' in n or '1학기_중간' in n: term = '1mid'
    elif '1기말' in n or '1학기_기말' in n: term = '1final'
    elif '2중간' in n or '2학기_중간' in n: term = '2mid'
    elif '2기말' in n or '2학기_기말' in n: term = '2final'

    school = None
    for canon, aliases in SCHOOLS:
        if any(a in n for a in aliases):
            school = canon
            break

    subject = None
    for canon, aliases in SUBJECTS:
        if any(a.lower() in n.lower() for a in aliases):
            subject = canon
            break

    return (yr, school, grade, term, subject)

def load_ledger():
    if os.path.exists(LEDGER_PATH):
        try:
            with open(LEDGER_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {'completed_exams': {}, 'history': []}

def save_ledger(ledger):
    os.makedirs(os.path.dirname(LEDGER_PATH), exist_ok=True)
    with open(LEDGER_PATH, 'w', encoding='utf-8') as f:
        json.dump(ledger, f, ensure_ascii=False, indent=2)

def is_valid_question_pdf(file_path):
    fn = os.path.basename(file_path).lower()
    if not fn.endswith('.pdf'): return False
    exclude_keywords = ['_해설', '_정답', '_답지', '_답안', '_풀이', '해설', '정답', '올백', '교재']
    if any(k in fn for k in exclude_keywords): return False
    exclude_subjects = ['사회', '과학', '역사', '국어', '도덕', '기술', '가정', '영어']
    if any(k in fn for k in exclude_subjects): return False
    parts = file_path.lower().split(os.sep)
    if any(p in ['타과목'] for p in parts): return False
    return True

def scan_all_queue():
    ledger = load_ledger()

    # Pre-collect all existing archive JS files
    archive_identities = set()
    archive_basenames = set()
    for root, dirs, files in os.walk(ARCHIVE_ORIGINAL_DIR):
        for f in files:
            if f.endswith('.js'):
                archive_basenames.add(f[:-3].lower())
                idt = parse_exam_identity(f)
                if idt[0] and idt[1] and idt[2]:
                    archive_identities.add(idt)

    queue = []

    for cat in PRIORITY_CATEGORIES:
        term_dir = cat['term_dir']
        subdirs = cat['subdirs']
        grade = cat['grade']
        term = cat['term']
        dest_dir = cat['target_dest_dir']

        cat_exams = []

        for sub in subdirs:
            base_sub_dir = os.path.join(SOURCE_BASE, term_dir, sub)
            if not os.path.exists(base_sub_dir):
                continue
            for root, dirs, files in os.walk(base_sub_dir):
                if any(x in root for x in ['타과목']):
                    continue
                for f in sorted(files):
                    fp = os.path.join(root, f)
                    if is_valid_question_pdf(fp):
                        idt = parse_exam_identity(f)
                        fn_stem = os.path.splitext(f)[0]
                        item_grade = idt[2] or grade
                        # Enforce strict grade match (e.g. 고2 only for h2)
                        if item_grade != grade:
                            continue

                        # Check if completed
                        is_done = False
                        if idt in archive_identities:
                            is_done = True
                        elif fn_stem.lower() in archive_basenames:
                            is_done = True
                        elif fp in ledger.get('completed_exams', {}):
                            is_done = True

                        cat_exams.append({
                            'filename': f,
                            'pdf_path': fp,
                            'category_id': cat['id'],
                            'category_label': cat['label'],
                            'grade': grade,
                            'term': term,
                            'dest_dir': dest_dir,
                            'identity': idt,
                            'is_completed': is_done
                        })

        def sort_key(item):
            yr = item['identity'][0] or 0
            # Priority: Known local schools first
            school = item['identity'][1] or ''
            has_school = 1 if school else 0
            return (-yr, -has_school, item['filename'])

        cat_exams.sort(key=sort_key)
        queue.extend(cat_exams)

    return queue

def main():
    parser = argparse.ArgumentParser(description="Exam Intake Priority Queue Manager")
    parser.add_argument('--next', type=int, default=0, help="Get next N exams to process")
    parser.add_argument('--status', action='store_true', help="Print queue status summary")
    parser.add_argument('--mark-done', type=str, default="", help="Mark exam or JS file as completed")
    parser.add_argument('--dump-batch', type=str, default="", help="Path to dump batch JSON")
    args = parser.parse_args()

    ledger = load_ledger()

    if args.mark_done:
        ledger['completed_exams'][args.mark_done] = {
            'marked_at': datetime.now().isoformat()
        }
        save_ledger(ledger)
        print(f"Marked as completed: {args.mark_done}")
        return

    all_exams = scan_all_queue()

    if args.status:
        print("=== EXAM INTAKE QUEUE STATUS ===")
        by_cat = {}
        for item in all_exams:
            cat = item['category_label']
            if cat not in by_cat:
                by_cat[cat] = {'total': 0, 'completed': 0, 'remaining': 0}
            by_cat[cat]['total'] += 1
            if item['is_completed']:
                by_cat[cat]['completed'] += 1
            else:
                by_cat[cat]['remaining'] += 1

        for cat_label, counts in by_cat.items():
            print(f"[{cat_label:<8}] Total: {counts['total']:3d} | Completed: {counts['completed']:3d} | Remaining: {counts['remaining']:3d}")

        rem_total = sum(c['remaining'] for c in by_cat.values())
        print("================================")
        print(f"Total Remaining across all categories: {rem_total} exams\n")

    if args.next > 0:
        remaining = [item for item in all_exams if not item['is_completed']]
        batch = remaining[:args.next]
        print(f"Selected next {len(batch)} exams (requested: {args.next}):")
        for i, item in enumerate(batch, 1):
            idt = item['identity']
            print(f"  [{i:02d}] ({item['category_label']}) {item['filename']} -> id: {idt}")

        dump_path = args.dump_batch or os.path.join(REPO_ROOT, '.tmp', 'current_intake_batch.json')
        os.makedirs(os.path.dirname(dump_path), exist_ok=True)
        with open(dump_path, 'w', encoding='utf-8') as f:
            json.dump(batch, f, ensure_ascii=False, indent=2)
        print(f"\nBatch saved to: {dump_path}")

if __name__ == '__main__':
    main()
