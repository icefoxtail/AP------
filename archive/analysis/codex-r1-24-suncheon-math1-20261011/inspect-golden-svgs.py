from pathlib import Path
import xml.etree.ElementTree as ET,json,hashlib
for p in [Path('archive/assets/images/25_매산여고_2학기_중간_고1_기출/q7-solution.svg'),Path('archive/assets/images/25_제일고_2학기_중간_고1_기출/q06-solution.svg')]:
 b=p.read_bytes();r=ET.fromstring(b);items=[]
 for n in r.iter():
  t=n.tag.rsplit('}',1)[-1]
  if t in ('text','circle','ellipse','line','path','rect','polygon','polyline'):
   items.append({'tag':t,'attrs':n.attrib,'text':' '.join(''.join(n.itertext()).split()) if t=='text' else ''})
 print(json.dumps({'path':str(p).replace('\\','/'),'sha256':hashlib.sha256(b).hexdigest(),'viewBox':r.attrib.get('viewBox'),'items':items},ensure_ascii=False))
