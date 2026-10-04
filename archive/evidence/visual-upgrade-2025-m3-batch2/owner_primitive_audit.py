from __future__ import annotations
import json,re,math,xml.etree.ElementTree as ET
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8',errors='replace')
EVID=Path('archive/evidence/visual-upgrade-2025-m3-batch2')
INV=json.loads((EVID/'inventory.json').read_text(encoding='utf-8'))
ADDS=json.loads((EVID/'new_visual_build_evidence.json').read_text(encoding='utf-8'))
assets=[]
for ex in INV['exams']:
 for q in ex['questions']:
  if q.get('solutionImagePath'):assets.append({'qid':q['qid'],'path':q['solutionImagePath'],'exam':Path(ex['sourcePath']).name,'action':'EXISTING'})
for a in ADDS['assets']:assets.append({'qid':a['qid'],'path':a['path'],'exam':next(Path(e['sourcePath']).name for e in INV['exams'] if a['path'].split('/assets/images/')[1].split('/')[0] in Path(e['sourcePath']).name.replace('.js','')),'action':'ADD'})

def tag(x):return x.tag.rsplit('}',1)[-1]
def normpair(a,b):return '-'.join(sorted((a,b)))
def pair_tokens(value):
 if not value:return []
 return [tuple(x.split('-',1)) for x in value.split() if '-' in x]
def rect_edges(el):
 try:x=float(el.get('x'));y=float(el.get('y'));w=float(el.get('width'));h=float(el.get('height'))
 except:return []
 return [((x,y),(x+w,y)),((x+w,y),(x+w,y+h)),((x+w,y+h),(x,y+h)),((x,y+h),(x,y))]
def owner_graph(root):
 graph={};pair_owners={};ids={}
 def add(a,b,pid):
  graph.setdefault(a,set()).add(b);graph.setdefault(b,set()).add(a);pair_owners.setdefault(normpair(a,b),[]).append(pid)
 for p in root.iter():
  if tag(p) not in ('line','polyline','polygon','rect'):continue
  pid=p.get('id') or tag(p)
  pairs=pair_tokens(p.get('data-segment-pairs'))
  if p.get('data-segment-pair'):
   x=p.get('data-segment-pair').split('-')
   if len(x)>=2:pairs.append((x[0],'-'.join(x[1:])))
  if p.get('data-start-point') and p.get('data-end-point'):pairs.append((p.get('data-start-point'),p.get('data-end-point')))
  for a,b in pairs:add(a,b,pid)
  ids[pid]=p
 return graph,pair_owners,ids

def connected(graph,a,b):
 if a==b:return False
 todo=[a];seen={a}
 while todo:
  n=todo.pop()
  if n==b:return True
  for z in graph.get(n,()):
   if z not in seen:seen.add(z);todo.append(z)
 return False

def coordinate_name(name):
 m=re.fullmatch(r'p(-?\d+(?:\.\d+)?)_(-?\d+(?:\.\d+)?)',name or '')
 return (float(m.group(1)),float(m.group(2))) if m else None

def owner_coordinates(root):
 out={}
 for e in root.iter():
  if tag(e)=='line' and e.get('data-start-point') and e.get('data-end-point'):
   out[e.get('data-start-point')]=(float(e.get('x1')),float(e.get('y1')))
   out[e.get('data-end-point')]=(float(e.get('x2')),float(e.get('y2')))
  if tag(e)=='circle' and e.get('data-owner-point'):
   out[e.get('data-owner-point')]=(float(e.get('cx')),float(e.get('cy')))
  if tag(e)=='text' and e.get('data-owner-point') and e.get('data-point-x') and e.get('data-point-y'):
   out[e.get('data-owner-point')]=(float(e.get('data-point-x')),float(e.get('data-point-y')))
 return out

issues=[];rows=[]
for item in assets:
 path=Path(item['path']);root=ET.parse(path).getroot();graph,pairOwners,primIds=owner_graph(root);coords=owner_coordinates(root)
 labels=[x for x in root.iter() if tag(x)=='text']
 markers=[x for x in root.iter() if x.get('data-marker-kind') in ('angle-arc','right-angle-square','dimension-line','dimension-end-cap','congruent-tick')]
 angle_rows=[];length_rows=[];right_rows=[]
 for lab in labels:
  typ=lab.get('data-label-kind');s=''.join(lab.itertext()).strip();lid=lab.get('id') or s
  if typ=='angle':
   v=lab.get('data-owner-vertex');rays=lab.get('data-owner-rays','').split();found=[m for m in markers if m.get('data-marker-kind')=='angle-arc' and m.get('data-owner-vertex')==v and m.get('data-owner-rays')==lab.get('data-owner-rays')]
   if not v or len(rays)!=2 or len(found)!=1:issues.append({'code':'ANGLE_LABEL_MARKER_BINDING_FAIL','qid':item['qid'],'path':item['path'],'label':s,'vertex':v,'rays':rays,'matchingArcCount':len(found)})
   center=coords.get(v) or coordinate_name(v);ray_angles=[]
   for ray in rays:
    p=ray.split('-',1)
    if len(p)!=2 or p[0]!=v or not connected(graph,*p):issues.append({'code':'ANGLE_RAY_PRIMITIVE_OWNER_FAIL','qid':item['qid'],'path':item['path'],'label':s,'ray':ray})
    endpoint=(coords.get(p[1]) or coordinate_name(p[1])) if len(p)==2 else None
    if center is not None and endpoint is not None:ray_angles.append(math.atan2(endpoint[1]-center[1],endpoint[0]-center[0]))
   inside_wedge=None;label_delta=None;wedge_degrees=None
   if center is not None and len(ray_angles)==2:
    delta=(ray_angles[1]-ray_angles[0]+math.pi)%(2*math.pi)-math.pi;mid=ray_angles[0]+delta/2
    label_angle=math.atan2(float(lab.get('y'))-center[1],float(lab.get('x'))-center[0])
    label_delta=abs((label_angle-mid+math.pi)%(2*math.pi)-math.pi);wedge_degrees=abs(math.degrees(delta))
    inside_wedge=label_delta<=abs(delta)/2+1e-6
    if not inside_wedge:issues.append({'code':'ANGLE_LABEL_OUTSIDE_OWNER_WEDGE','qid':item['qid'],'path':item['path'],'label':s,'ownerVertex':v,'ownerRays':rays,'labelMidpointDeltaDegrees':math.degrees(label_delta),'ownerWedgeDegrees':wedge_degrees})
   else:issues.append({'code':'ANGLE_LABEL_POSITION_OWNER_GEOMETRY_UNRESOLVED','qid':item['qid'],'path':item['path'],'label':s,'ownerVertex':v,'ownerRays':rays})
   angle_ok=bool(v and len(rays)==2 and len(found)==1 and inside_wedge)
   angle_rows.append({'labelId':lid,'text':s,'ownerVertex':v,'ownerRays':rays,'arcIds':[x.get('id') for x in found],'ownerWedgeDegrees':wedge_degrees,'labelMidpointDeltaDegrees':math.degrees(label_delta) if label_delta is not None else None,'labelInsideOwnerWedge':inside_wedge,'result':'PASS' if angle_ok else 'FAIL'})
  if typ=='length':
   start=lab.get('data-owner-start-point');end=lab.get('data-owner-end-point');dim=lab.get('data-owner-dimension');seg=lab.get('data-owner-segment')
   extra_pairs=lab.get('data-owner-additional-segments','').split()
   dimprim=primIds.get(dim) if dim else None
   caps=[m for m in markers if m.get('data-marker-kind')=='dimension-end-cap' and m.get('data-owner-dimension')==dim]
   segok=False
   if start and end:segok=connected(graph,start,end)
   if seg=='outer-square-side':segok=any(p.get('data-owner-boundary')=='outer-square' or p.get('id')=='outer-square' for p in root.iter())
   dimok=bool(dimprim is not None and len(caps)>=2)
   extra_ok=all(len(x.split('-',1))==2 and connected(graph,*x.split('-',1)) for x in extra_pairs)
   owner_ok=((start and end and segok and extra_ok) or dimok)
   if not owner_ok:issues.append({'code':'LENGTH_LABEL_OWNER_PRIMITIVE_FAIL','qid':item['qid'],'path':item['path'],'label':s,'segment':seg,'start':start,'end':end,'extraSegments':extra_pairs,'extraSegmentsPass':extra_ok,'dimension':dim,'dimensionFound':dimprim is not None,'endCapCount':len(caps)})
   length_rows.append({'labelId':lid,'text':s,'ownerSegment':seg,'ownerStartPoint':start,'ownerEndPoint':end,'ownerAdditionalSegments':extra_pairs,'ownerDimension':dim,'dimensionPrimitiveId':dimprim.get('id') if dimprim is not None else None,'dimensionEndCapIds':[x.get('id') for x in caps],'result':'PASS' if owner_ok else 'FAIL'})
 for marker in markers:
  kind=marker.get('data-marker-kind')
  if kind=='right-angle-square':
   v=marker.get('data-owner-vertex');rays=marker.get('data-owner-rays','').split()
   if not v or len(rays)!=2:issues.append({'code':'RIGHT_ANGLE_MARKER_OWNER_MISSING','qid':item['qid'],'path':item['path'],'marker':marker.get('id')})
   for ray in rays:
    p=ray.split('-',1)
    if len(p)!=2 or p[0]!=v or not connected(graph,*p):issues.append({'code':'RIGHT_ANGLE_RAY_OWNER_FAIL','qid':item['qid'],'path':item['path'],'marker':marker.get('id'),'ray':ray})
   right_rows.append({'markerId':marker.get('id'),'ownerVertex':v,'ownerRays':rays,'result':'PASS' if v and len(rays)==2 else 'FAIL'})
 for x in markers:
  if x.get('data-fact-role')=='CONCLUSION' and x.get('data-marker-kind')=='congruent-tick':issues.append({'code':'CONCLUSION_AS_EQUAL_GIVEN_TICK','qid':item['qid'],'path':item['path'],'marker':x.get('id')})
 # Multiple angle marks at one vertex use separate geometric radii so their wedges remain distinguishable.
 arc_radii={}
 for marker in markers:
  if marker.get('data-marker-kind')!='angle-arc':continue
  v=marker.get('data-owner-vertex');center=coords.get(v) or coordinate_name(v);nums=[float(x) for x in re.findall(r'[-+]?(?:\d*\.\d+|\d+\.?\d*)',marker.get('points',''))];pts=list(zip(nums[::2],nums[1::2]))
  if center is None or not pts:continue
  radius=math.fsum(math.dist(center,p) for p in pts)/len(pts);arc_radii.setdefault(v,[]).append({'id':marker.get('id'),'radius':radius,'rays':marker.get('data-owner-rays')})
 for v,rows_at_vertex in arc_radii.items():
  for i,a in enumerate(rows_at_vertex):
   for b in rows_at_vertex[i+1:]:
    if abs(a['radius']-b['radius'])<0.05:issues.append({'code':'ANGLE_ARCS_NOT_NESTED_AT_SHARED_VERTEX','qid':item['qid'],'path':item['path'],'vertex':v,'arcA':a,'arcB':b})
 rows.append({'qid':item['qid'],'exam':item['exam'],'assetPath':item['path'],'action':item['action'],'angleLabelCount':len(angle_rows),'angleLabels':angle_rows,'angleArcRadiiByVertex':arc_radii,'lengthLabelCount':len(length_rows),'lengthLabels':length_rows,'rightAngleSquareCount':len(right_rows),'rightAngleSquares':right_rows,'xmlParse':'PASS'})
out={'schemaVersion':'M3_FINAL_SVG_OWNER_PRIMITIVE_AUDIT_v1','assetCount':len(rows),'labelCount':sum(x['angleLabelCount']+x['lengthLabelCount'] for x in rows),'issueCount':len(issues),'status':'PASS' if not issues else 'FAIL','issues':issues,'assets':rows}
(EVID/'owner_primitive_audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'assetCount':len(rows),'labelCount':out['labelCount'],'issueCount':len(issues),'status':out['status'],'issues':issues[:40],'out':str(EVID/'owner_primitive_audit.json')},ensure_ascii=False,indent=2))
