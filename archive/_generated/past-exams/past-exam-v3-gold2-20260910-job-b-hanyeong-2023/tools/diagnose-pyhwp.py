import io, json, hashlib, zipfile
from pathlib import Path
from collections import Counter
from lxml import etree
from hwp5.xmlmodel import Hwp5File
base=Path('archive/_generated/past-exams/past-exam-v3-gold2-20260910-job-b-hanyeong-2023')
h=Hwp5File(str(base/'source/original.hwp'))
buf=io.BytesIO()
h.xmlevents().dump(buf)
h.close()
raw=buf.getvalue()
r=etree.fromstring(raw)
src=Counter(etree.QName(e).localname for e in r.iter())
html=etree.parse(str(base/'source/pyhwp-html/index.xhtml'))
hc=Counter(etree.QName(e).localname for e in html.iter())
with zipfile.ZipFile(base/'source/pyhwp.odt') as z:
    odt=etree.fromstring(z.read('content.xml'))
    oc=Counter(etree.QName(e).localname for e in odt.iter())
    embedded=[n for n in z.namelist() if n.startswith('Object')]
result={'sourceFormat':'HWP','sourceXmlSha256':hashlib.sha256(raw).hexdigest(),'sourceStructureCounts':dict(src),'htmlElementCounts':dict(hc),'odtElementCounts':dict(oc),'odtEmbeddedObjects':embedded,'sourceQuestionCount':None,'sourcePageCount':None,'status':'DERIVATION_ONLY_NOT_FULL_PAGE_FIDELITY','note':'Do not infer source questions or equations from the lossy converted output. All counts are parser structures, not verified question/page inventory.'}
(base/'reports/pyhwp-conversion-diagnostic.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'sourceMathTags':{k:v for k,v in src.items() if 'eq' in k.lower() or 'math' in k.lower()},'htmlMathTags':{k:v for k,v in hc.items() if 'eq' in k.lower() or 'math' in k.lower()},'odtMathTags':{k:v for k,v in oc.items() if 'eq' in k.lower() or 'math' in k.lower()},'odtEmbeddedObjects':embedded},ensure_ascii=False))
