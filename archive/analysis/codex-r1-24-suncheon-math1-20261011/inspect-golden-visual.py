from pathlib import Path
import xml.etree.ElementTree as ET,json,hashlib
p=Path('archive/assets/images/25_효천고_2학기_중간_고1_기출/q03-solution.svg');b=p.read_bytes();r=ET.fromstring(b);print(json.dumps({'ref':str(p).replace('\\','/'),'sha256':hashlib.sha256(b).hexdigest(),'viewBox':r.attrib.get('viewBox'),'labels':[' '.join(''.join(x.itertext()).split()) for x in r.iter() if x.tag.endswith('text')]},ensure_ascii=False))
