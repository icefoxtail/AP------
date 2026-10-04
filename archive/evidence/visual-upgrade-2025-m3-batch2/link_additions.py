import json,re
from pathlib import Path
INV=json.loads(Path('archive/evidence/visual-upgrade-2025-m3-batch2/inventory.json').read_text(encoding='utf-8'))
adds={
 '25_신흥중_2학기_중간_중3_수학.js':{
 7:'직선 y=x/2+4와 x축이 이루는 각 a 및 기울기 1/2를 보이는 직각삼각형.',
 8:'삼각형 ABC에 수선의 발 H를 더해 ABH와 AHC의 길이 관계를 보인다.',
 11:'이등변삼각형 ABC에 D, E, F를 두어 풀이의 보조선과 각을 보인다.',
 14:'정삼각형의 중심 O, 중선 AM, 무게중심의 2:1 분할을 보인다.',
 18:'직사각형과 내접원에서 위아래 접점 U,V 및 DE 접점 T를 보인다.',
 20:'반원 접선에 점 C를 지나는 AB 평행선을 더해 닮음 관계를 보인다.',
 22:'열기구 C에서 AB에 내린 수선의 발 H와 두 시선의 각을 보인다.',
 24:'두 접선의 직각 관계와 중심각, 음영 영역을 보인다.'},
 '25_연향중_2학기_중간_중3_수학.js':{
 11:'삼각형 ABC의 높이 AH와 45도 각으로 밑면 넓이를 나타낸다.',
 12:'호의 비에서 중심각 120도와 현 AB의 중점 수선 OM을 보인다.',
 16:'접는 선 AB가 OP의 수직이등분선이고 M에서 수직임을 보인다.'}}

def object_ranges(s):
    arr=s.find('window.questionBank')
    if arr<0:raise ValueError('questionBank not found')
    i=s.find('[',arr)+1; sq=1;curly=0;quote=None;esc=False;linecom=False;blockcom=False;start=None
    while i<len(s):
        c=s[i];n=s[i+1] if i+1<len(s) else ''
        if linecom:
            if c=='\n':linecom=False
        elif blockcom:
            if c=='*' and n=='/':blockcom=False;i+=1
        elif quote:
            if esc:esc=False
            elif c=='\\':esc=True
            elif c==quote:quote=None
        elif c=='/' and n=='/':linecom=True;i+=1
        elif c=='/' and n=='*':blockcom=True;i+=1
        elif c in ('"',"'",'`'):quote=c
        elif c=='[':sq+=1
        elif c==']':
            sq-=1
            if sq==0:break
        elif c=='{' and sq==1:
            if curly==0:start=i
            curly+=1
        elif c=='}' and sq==1:
            curly-=1
            if curly==0 and start is not None:
                yield start,i
                start=None
        i+=1

def add_fields(text,qid,path,alt):
    rows=list(object_ranges(text));match=None
    for start,end in rows:
        chunk=text[start:end+1]
        m=re.search(r'"id"\s*:\s*(\d+)',chunk)
        if m and int(m.group(1))==qid:match=(start,end,chunk);break
    if not match:raise ValueError(f'qid {qid} not found')
    start,end,chunk=match
    if '"solutionImage"' in chunk:raise ValueError(f'qid {qid} already has solutionImage')
    idline=re.search(r'\n(\s*)"id"\s*:',chunk);indent=idline.group(1) if idline else '    '
    before=chunk[:-1].rstrip();sep='' if before.endswith(',') or before.endswith('{') else ','
    new=(sep+'\n'+indent+'"solutionImage": "'+path+'",\n'+indent+'"solutionImageSize": "full",\n'+indent+'"solutionImageAlt": "'+alt+'"\n'+(' '*max(0,len(indent)-2))+'}')
    text=text[:start]+before+new+text[end+1:]
    return text

for ex in INV['exams']:
    filename=Path(ex['sourcePath']).name
    if filename not in adds:continue
    p=Path(ex['sourcePath']);s=p.read_text(encoding='utf-8')
    for qid,alt in sorted(adds[filename].items(),reverse=True):
        folder=next(q['solutionImagePath'].split('/assets/images/')[1].split('/')[0] for q in ex['questions'] if q.get('solutionImagePath'))
        path=f'assets/images/{folder}/q{qid}-solution.svg'
        s=add_fields(s,qid,path,alt)
    p.write_text(s,encoding='utf-8')
    print(filename,len(adds[filename]))
