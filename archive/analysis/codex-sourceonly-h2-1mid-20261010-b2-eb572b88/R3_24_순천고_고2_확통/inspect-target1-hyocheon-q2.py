from pathlib import Path
import xml.etree.ElementTree as ET,json,hashlib
p=Path('archive/assets/images/25_효천고_2학기_중간_고1_기출/q02-solution.svg');b=p.read_bytes();r=ET.fromstring(b);out=[]
for n in r.iter():
 t=n.tag.rsplit('}',1)[-1]
 if t in ('text','line','path','circle','rect','polyline','polygon'):
  out.append({'tag':t,'attrs':{k:v for k,v in n.attrib.items() if k not in ('style',)},'text':' '.join(''.join(n.itertext()).split()) if t=='text' else ''})
print(json.dumps({'path':str(p).replace('\\','/'),'sha256':hashlib.sha256(b).hexdigest(),'viewBox':r.attrib.get('viewBox'),'items':out},ensure_ascii=False))
