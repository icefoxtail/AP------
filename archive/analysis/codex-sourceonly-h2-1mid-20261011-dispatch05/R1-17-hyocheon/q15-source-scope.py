from pathlib import Path
import pdfplumber, re, json
p=Path(r'C:\Users\USER\Desktop\기출정리 파일\(1)1중간\확률과통계\과년도기출\효천고2_확률과통계_이과_1중간_2017.pdf')
out=[]
with pdfplumber.open(p) as doc:
    for idx,page in enumerate(doc.pages):
        text=page.extract_text() or ''
        if '옳은 것을 모두 고른' in text and ('2018' in text or '이항계수' in text):
            lines=text.splitlines()
            for j,line in enumerate(lines):
                if '옳은 것을 모두 고른' in line:
                    out.append({'page':idx+1,'snippet':'\n'.join(lines[max(0,j-2):min(len(lines),j+18)])})
print(json.dumps({'pageCount':len(doc.pages),'hits':out},ensure_ascii=False,indent=2))
