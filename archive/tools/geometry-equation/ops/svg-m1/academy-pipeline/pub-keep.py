# usage: python pub-keep.py <key> <keep ords csv> [replace ords csv]
# pub/<key>의 review/rows를 지정한 ord만 남기고(나머지는 이미 게시됨), replace ord에는 교체 기록을 붙인다.
import json, sys, os, shutil
key = sys.argv[1]; keep = set(sys.argv[2].split(',')); rep = set(sys.argv[3].split(',')) if len(sys.argv) > 3 and sys.argv[3] else set()
d = '.tmp/work/pub/' + key + '/'
for f in ['review', 'rows']:
    if not os.path.exists(d + f + '.all.json'): shutil.copy(d + f + '.json', d + f + '.all.json')
    data = [x for x in json.load(open(d + f + '.all.json', encoding='utf-8')) if str(x['ord']) in keep]
    for x in data:
        if str(x['ord']) in rep:
            if f == 'rows': x['replace'] = 'True'
            else: x['B'] = {'verdict': 'FAIL'}; x['better'] = 'A'
    open(d + f + '.json', 'wb').write(json.dumps(data, ensure_ascii=False, indent=1).encode('utf-8'))
    print(key, f, len(data))
