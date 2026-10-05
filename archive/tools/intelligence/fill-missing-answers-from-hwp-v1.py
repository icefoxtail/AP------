import os
import json
import re
import struct
import zlib
from pathlib import Path

import olefile

REPO = Path(os.environ.get('AP_REPO', Path.cwd()))
MAP = {
    'archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_수학II.js': r'D:\기출\(4)2기말\수2\2025_제일고2_수2_2기말_정답.hwp',
    'archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_확률과통계_기출.js': r'D:\기출\(4)2기말\수2\2025_제일고2_확통_2기말_정답.hwp',
    'archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js': r'D:\기출\(4)2기말\중1\2023_금당중1_수학_2기말_정답.hwp',
    'archive/exams/original/middle/m1/2final/23_연향중_2학기_기말_중1_기출.js': r'D:\기출\(4)2기말\중1\2023_연향중1_수학_2기말_정답.hwp',
    'archive/exams/original/middle/m1/2final/23_왕운중_2학기_기말_중1_기출.js': r'D:\기출\(4)2기말\중1\2023_왕운중1_수학_2기말_정답.hwp',
    'archive/exams/original/middle/m1/2final/24_율촌중_2학기_기말_중1_기출.js': r'D:\기출\(4)2기말\중1\2024_율촌중1_수학_2기말_정답.hwp',
    'archive/exams/original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js': r'D:\기출\(4)2기말\중1\2024_향림중1_수학_2기말_정답.hwp',
    'archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js': r'D:\기출\(4)2기말\중1\2025_동산중1_수학_2기말_정답.hwp',
}
SYMBOL = dict(zip('12345', '①②③④⑤'))

def paragraphs(hwp):
    ole = olefile.OleFileIO(hwp)
    out = []
    for entry in ole.listdir():
        if len(entry) != 2 or entry[0] != 'BodyText':
            continue
        data = zlib.decompress(ole.openstream(entry).read(), -15)
        i = 0
        while i + 4 <= len(data):
            header = struct.unpack_from('<I', data, i)[0]
            i += 4
            tag = header & 0x3ff
            size = header >> 20
            if size == 0xfff:
                size = struct.unpack_from('<I', data, i)[0]
                i += 4
            payload = data[i:i + size]
            i += size
            if tag == 0x43:
                out.append(payload.decode('utf-16le', 'ignore').replace('\x00', '').replace('\r', '').replace('\n', '').strip())
    return out

def answers_from_hwp(hwp):
    answers = []
    for text in paragraphs(hwp):
        if text.startswith('서술형'):
            break
        if re.fullmatch(r'[1-5](?:\s*,\s*[1-5])*', text):
            answers.append(', '.join(SYMBOL[x.strip()] for x in text.split(',')))
    return answers

for rel, hwp in MAP.items():
    js = REPO / rel
    answers = answers_from_hwp(hwp)
    text = js.read_text(encoding='utf-8')
    marker = text.find('window.questionBank')
    if marker < 0:
        raise RuntimeError(f'questionBank not found: {rel}')
    head, bank = text[:marker], text[marker:]
    index = 0
    def repl(match):
        nonlocal_dummy = None
        nonlocal_index[0] += 1
        value = answers[nonlocal_index[0] - 1] if nonlocal_index[0] <= len(answers) else None
        if value is None:
            return match.group(0)
        return f'{match.group(1)}{json.dumps(value, ensure_ascii=False)}{match.group(2)}'
    nonlocal_index = [0]
    # Only actual question objects are in bank; helper definitions are in head.
    bank, count = re.subn(r'("answer"\s*:\s*)""(\s*,\s*\n\s*"solution")', repl, bank)
    if count < len(answers):
        raise RuntimeError(f'answer replacement mismatch: {rel} {count}/{len(answers)}')
    js.write_text(head + bank, encoding='utf-8')
    print(f'{rel}: {len(answers)} answers')
