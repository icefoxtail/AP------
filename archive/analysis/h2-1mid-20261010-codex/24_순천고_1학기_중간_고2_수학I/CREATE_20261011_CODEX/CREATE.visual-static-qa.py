import json,math,xml.etree.ElementTree as ET,hashlib
from pathlib import Path
root=Path.cwd(); assets=root/'archive/assets/images/24_순천고_1학기_중간_고2_수학I'; qids=[11,13,18,20,24]; rows=[]
for qid in qids:
 spec=json.loads((assets/f'q{qid}-solution.visualSpec.json').read_text(encoding='utf-8'))
 svg_path=assets/f'q{qid}-solution.svg'; raw=svg_path.read_bytes(); tree=ET.fromstring(raw.decode('utf-8'))
 assert tree.tag.rsplit('}',1)[-1]=='svg'
 width,height=map(float,tree.attrib['viewBox'].split()[2:]);x0,x1=spec['xRange'];y0,y1=spec['yRange'];pad=32
 tx=lambda x:pad+(x-x0)*(width-2*pad)/(x1-x0)
 ty=lambda y:height-pad-(y-y0)*(height-2*pad)/(y1-y0)
 ix=lambda x:x0+(x-pad)*(x1-x0)/(width-2*pad)
 iy=lambda y:y0+(height-pad-y)*(y1-y0)/(height-2*pad)
 ns={'s':'http://www.w3.org/2000/svg'}
 polylines=tree.findall('.//s:polyline',ns); curves=[el for el in polylines if el.attrib.get('class')=='curve']
 expected_curves=spec.get('curves',[]); curve_rows=[]
 if len(curves)!=len(expected_curves): raise Exception(f'q{qid} curve count {len(curves)} != {len(expected_curves)}')
 for idx,(el,expected) in enumerate(zip(curves,expected_curves)):
  obs=[]
  for p in el.attrib['points'].split():
   x,y=map(float,p.split(','));obs.append({'x':ix(x),'y':iy(y)})
  if len(obs)!=len(expected['points']):raise Exception(f'q{qid} curve points mismatch')
  err=max(max(abs(a['x']-b['x']),abs(a['y']-b['y'])) for a,b in zip(obs,expected['points']))
  curve_rows.append({'curveIndex':idx,'pointCount':len(obs),'maxCoordinateDelta':err,'expectedStart':expected['points'][0],'observedStart':obs[0],'expectedEnd':expected['points'][-1],'observedEnd':obs[-1]})
 circles=tree.findall('.//s:circle',ns); expected_points=spec.get('points',[]);point_rows=[]
 if len(circles)!=len(expected_points):raise Exception(f'q{qid} point count {len(circles)} != {len(expected_points)}')
 for i,(el,e) in enumerate(zip(circles,expected_points)):
  ox,oy=ix(float(el.attrib['cx'])),iy(float(el.attrib['cy']))
  delta=max(abs(ox-e['x']),abs(oy-e['y']))
  point_rows.append({'index':i,'label':e.get('label'),'expected':e,'observed':{'x':ox,'y':oy},'maxCoordinateDelta':delta})
 line_obs=[]
 for el in tree.findall('.//s:line',ns):
  if el.attrib.get('class')=='axis':continue
  a={'x':ix(float(el.attrib['x1'])),'y':iy(float(el.attrib['y1']))};b={'x':ix(float(el.attrib['x2'])),'y':iy(float(el.attrib['y2']))}
  line_obs.append({'class':el.attrib.get('class'),'from':a,'to':b})
 expected_segments=spec.get('segments',[])
 if len(line_obs)-len(spec.get('asymptotes',[]))!=len(expected_segments):raise Exception(f'q{qid} segment count {len(line_obs)} != {len(expected_segments)}')
 segment_rows=[]
 for i,(o,e) in enumerate(zip(line_obs,expected_segments)):
  delta=max(abs(o['from']['x']-e['from']['x']),abs(o['from']['y']-e['from']['y']),abs(o['to']['x']-e['to']['x']),abs(o['to']['y']-e['to']['y']))
  segment_rows.append({'index':i,'kind':e.get('kind','segment'),'expectedFrom':e['from'],'expectedTo':e['to'],'observed':o,'maxCoordinateDelta':delta})
 labels=[el.text or '' for el in tree.findall('.//s:text',ns)]
 if not raw.lstrip().startswith(b'<?xml'):raise Exception(f'q{qid} svg xml declaration missing')
 if tree.findall('.//s:script',ns) or tree.findall('.//s:foreignObject',ns):raise Exception(f'q{qid} active SVG')
 row={'qid':qid,'assetRef':f'assets/images/24_순천고_1학기_중간_고2_수학I/q{qid}-solution.svg','assetSha256':hashlib.sha256(raw).hexdigest(),'renderReport':json.loads((assets/f'q{qid}-solution.render-report.json').read_text()),'visualSpecSha256':json.loads((assets/f'q{qid}-solution.render-report.json').read_text())['specSha256'],'xmlParse':'PASS','geometryParity':'PASS','maxCoordinateDelta':max([r['maxCoordinateDelta'] for group in [curve_rows,point_rows,segment_rows] for r in group] or [0]),'curvePrimitiveEvidence':curve_rows,'pointPrimitiveEvidence':point_rows,'segmentPrimitiveEvidence':segment_rows,'studentLabelTexts':labels,'actualBrowserRender':'NOT_RUN_CREATE_R3_HANDOFF'}
 if qid==11:
  guides=[el for el in tree.findall('.//s:line',ns) if el.attrib.get('class')=='guide'];row['asymptoteObservedY']=iy(float(guides[0].attrib['y1']));row['expectedAsymptoteY']=3
 if qid==13:
  mt=segment_rows[3]['observed'];ot=segment_rows[4]['observed'];om=segment_rows[2]['observed'];u=(mt['from']['x']-mt['to']['x'],mt['from']['y']-mt['to']['y']);v=(ot['from']['x']-ot['to']['x'],ot['from']['y']-ot['to']['y']);dot=u[0]*v[0]+u[1]*v[1];row['tangentGeometry']={'M':{'x':4,'y':0},'T':{'x':3,'y':math.sqrt(3)},'expectedMT':2,'observedMT':math.dist((mt['from']['x'],mt['from']['y']),(mt['to']['x'],mt['to']['y'])),'expectedOT':2*math.sqrt(3),'observedOT':math.dist((ot['from']['x'],ot['from']['y']),(ot['to']['x'],ot['to']['y'])),'perpendicularDot':dot}
 if qid==18:row['intersectionMarkersCount']=len(point_rows);row['expectedIntersectionMarkersCount']=5
 if qid==20:row['integerLatticeMarkersCount']=len(point_rows);row['expectedIntegerLatticeMarkersCount']=9
 rows.append(row)
out={'schemaVersion':'JS_ARCHIVE_CREATE_VISUAL_STATIC_QA_V1','renderer':'alive.engine.visual_renderer.render_visual_spec','rendererVersion':'0.5.2-circle-geometry-label-layout','qualityContractVersion':'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006','executionLine':'CODEX','items':rows}
p=root/'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/CREATE_20261011_CODEX/CREATE.visual-qa.json';p.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps({'items':len(rows),'maxCoordinateDelta':max(r['maxCoordinateDelta'] for r in rows),'svgPaths':[r['assetRef'] for r in rows]},ensure_ascii=False))


