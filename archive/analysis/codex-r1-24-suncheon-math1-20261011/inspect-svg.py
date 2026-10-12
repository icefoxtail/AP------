from pathlib import Path
import xml.etree.ElementTree as ET, json, hashlib, sys
base=Path('archive/assets/images/24_순천여고_1학기_중간_고2_수학I')
for name in ['q18-solution.svg','q19-solution.svg','q20-solution.svg','q22-solution.svg']:
 p=base/name; b=p.read_bytes(); root=ET.fromstring(b)
 def local(t):return t.rsplit('}',1)[-1]
 rows=[]
 for node in root.iter():
  tag=local(node.tag)
  if tag not in ('text','line','polyline','path','circle','rect','polygon'):continue
  attrs={k:v for k,v in node.attrib.items() if k not in ('style',)}; val=' '.join(''.join(node.itertext()).split()) if tag=='text' else ''
  rows.append({'tag':tag,'attrs':attrs,'text':val})
 print(json.dumps({'ref':'archive/assets/images/24_순천여고_1학기_중간_고2_수학I/'+name,'sha256':hashlib.sha256(b).hexdigest(),'viewBox':root.attrib.get('viewBox'),'nodes':rows},ensure_ascii=False))
