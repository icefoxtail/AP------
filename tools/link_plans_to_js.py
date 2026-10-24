# -*- coding: utf-8 -*-
import json
import re

JS_PATH = 'archive/exams/similar/middle/m3/2mid/25_왕운중_2학기_중간_중3_유사.js'
with open(JS_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'window\.questionBank\s*=\s*(\[[\s\S]*\]);?', text)
questions = json.loads(m.group(1).strip().rstrip(';'))

for q in questions:
    qid = q['id']
    q['problemPlanRef'] = f'archive/exams/similar/middle/m3/2mid/25_왕운중_2학기_중간_중3_유사_plans/q{qid:02d}-problem.plan.json'
    q['solutionPlanRef'] = f'archive/exams/similar/middle/m3/2mid/25_왕운중_2학기_중간_중3_유사_plans/q{qid:02d}-solution.plan.json'

header = 'window.examTitle = "25_왕운중_2학기_중간_중3_유사";\n\n'
body = f'window.questionBank = {json.dumps(questions, ensure_ascii=False, indent=2)};\n'
with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(header + body)

print('Successfully linked plan refs for all 24 questions.')
