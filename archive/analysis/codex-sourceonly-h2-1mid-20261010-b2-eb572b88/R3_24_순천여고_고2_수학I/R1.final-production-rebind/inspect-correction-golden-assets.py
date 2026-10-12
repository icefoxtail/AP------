from pathlib import Path
import xml.etree.ElementTree as ET,json,hashlib
files=['archive/assets/images/25_매산여고_2학기_중간_고1_기출/q7-solution.svg','archive/assets/images/25_효천고_2학기_중간_고1_기출/q03-solution.svg','archive/assets/images/25_제일고_2학기_중간_고1_기출/q06-solution.svg']
for name in files:
 p=Path(name);b=p.read_bytes();r=ET.fromstring(b);out=[]
 for n in r.iter():
  t=n.tag.rsplit('}',1)[-1]
  if t in ('text','circle','ellipse','line','polyline','path','rect'):
   out.append({'tag':t,'attrs':{k:v for k,v in n.attrib.items() if k not in ('style',)},'text':' '.join(''.join(n.itertext()).split()) if t=='text' else ''})
 print(json.dumps({'path':name,'sha256':hashlib.sha256(b).hexdigest(),'viewBox':r.attrib.get('viewBox'),'nodes':out},ensure_ascii=False))
