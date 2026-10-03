import json, math, re, hashlib, pathlib, xml.etree.ElementTree as ET
from fractions import Fraction
EVID=pathlib.Path('docs/evidence/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3')
manifest=json.loads((EVID/'candidate_manifest.json').read_text(encoding='utf-8'))
facts=json.loads((EVID/'independent_math_facts.json').read_text(encoding='utf-8'))['facts']
NS='{http://www.w3.org/2000/svg}'
style_size={'title':18,'panel-title':16,'note':14,'small':13,'label':15,'value':16,'strong':17}
layer_rank={'Z00_BACKGROUND':0,'Z10_FILL_HATCH':10,'Z20_AUXILIARY':20,'Z30_SECONDARY_SHAPE':30,'Z30_COORDINATE_AXIS':30,'Z40_MAIN_SHAPE':40,'Z50_DIMENSION':50,'Z60_INDICATOR':60,'Z70_POINT':70,'Z80_LEADER_LINE':80,'Z90_LABEL':90}

def exval(s):
 s=str(s).replace('−','-').strip()
 if 'sqrt(' in s:
  m=re.fullmatch(r'([+-]?\d+(?:\.\d+)?)\s*([+-])\s*sqrt\((\d+(?:\.\d+)?)\)',s)
  if m: return float(m.group(1))+(1 if m.group(2)=='+' else -1)*math.sqrt(float(m.group(3)))
  m=re.fullmatch(r'([+-]?\d+(?:\.\d+)?)',s)
  if m:return float(m.group(1))
  raise ValueError('unsupported exact expression '+s)
 return float(Fraction(s))
def ancestor_group(el,parent):
 p=parent.get(el)
 while p is not None:
  if p.tag==NS+'g' and p.attrib.get('data-origin-x') is not None: return p
  p=parent.get(p)
 return None
def text_width(t,size):
 w=0.0
 for ch in t:
  o=ord(ch)
  if ch.isspace(): w+=.34*size
  elif 0xAC00<=o<=0xD7A3 or 0x4E00<=o<=0x9FFF: w+=size
  elif ch in 'ilI.,:;!|': w+=.32*size
  elif ch in 'MW@%': w+=.84*size
  else: w+=.58*size
 return w
def segments_intersect(a,b,c,d):
 def orient(p,q,r):return (q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])
 def on(p,q,r):return min(p[0],r[0])-1e-6<=q[0]<=max(p[0],r[0])+1e-6 and min(p[1],r[1])-1e-6<=q[1]<=max(p[1],r[1])+1e-6
 o1,o2,o3,o4=orient(a,b,c),orient(a,b,d),orient(c,d,a),orient(c,d,b)
 if o1*o2<0 and o3*o4<0:return True
 return (abs(o1)<1e-6 and on(a,c,b)) or (abs(o2)<1e-6 and on(a,d,b)) or (abs(o3)<1e-6 and on(c,a,d)) or (abs(o4)<1e-6 and on(c,b,d))
def segment_hits_box(a,b,box,pad=1.5):
 x0,y0,x1,y1=box; x0-=pad;y0-=pad;x1+=pad;y1+=pad
 if max(a[0],b[0])<x0 or min(a[0],b[0])>x1 or max(a[1],b[1])<y0 or min(a[1],b[1])>y1:return False
 if x0<=a[0]<=x1 and y0<=a[1]<=y1:return True
 if x0<=b[0]<=x1 and y0<=b[1]<=y1:return True
 r=[(x0,y0),(x1,y0),(x1,y1),(x0,y1)]
 return any(segments_intersect(a,b,r[i],r[(i+1)%4]) for i in range(4))
results=[]
for cand in manifest['candidates']:
 path=pathlib.Path(cand['path']); root=ET.parse(path).getroot(); qid=cand['qid']
 issues=[]; bounds=[float('inf'),float('inf'),float('-inf'),float('-inf')]
 if 'sha256:'+hashlib.sha256(path.read_bytes()).hexdigest()!=cand.get('sha256'): issues.append('SVG_HASH_MISMATCH')
 def add(x0,y0,x1,y1):
  bounds[0]=min(bounds[0],x0);bounds[1]=min(bounds[1],y0);bounds[2]=max(bounds[2],x1);bounds[3]=max(bounds[3],y1)
 if root.attrib.get('preserveAspectRatio')!='xMidYMid meet': issues.append('PRESERVE_ASPECT_RATIO')
 if not root.attrib.get('viewBox'): issues.append('VIEWBOX_MISSING')
 expected_hash=hashlib.sha256(json.dumps(facts[str(qid)],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
 if root.attrib.get('data-fact-hash')!=expected_hash: issues.append('FACT_HASH_MISMATCH')
 if root.attrib.get('data-geometry-mode')=='COORDINATE_GEOMETRY_HYBRID' and root.attrib.get('data-geometry-fact-hash')!=expected_hash: issues.append('GEOMETRY_FACT_HASH_MISMATCH')
 if root.attrib.get('data-visual-provenance')!='independent-python-facts': issues.append('VISUAL_PROVENANCE')
 if cand['backend']!=root.attrib.get('data-visual-backend'): issues.append('BACKEND_MANIFEST_MISMATCH')
 if root.attrib.get('data-geometry-mode')=='COORDINATE_GEOMETRY_HYBRID':
  for key in ('data-geometry-style-version','data-geometry-preset','data-geometry-fact-hash','data-axis-scale-mode'):
   if not root.attrib.get(key): issues.append('HYBRID_METADATA_MISSING:'+key)
 if root.attrib.get('data-visual-family')=='NUMBER_LINE_INTERVAL':
  for key in ('data-graph-style-version','data-graph-preset'):
   if not root.attrib.get(key): issues.append('NUMBERLINE_METADATA_MISSING:'+key)
 style_text=' '.join((e.text or '') for e in root.iter() if e.tag==NS+'style')
 width_ranges={'shape':(2.0,2.1),'secondary':(1.5,1.7),'aux':(.9,1.1),'indicator':(.7,.9),'axis':(1.1,1.3)}
 for cls,(lo,hi) in width_ranges.items():
  match=re.search(r'\.'+cls+r'\s*\{[^}]*stroke-width\s*:\s*([0-9.]+)(?:px)?',style_text)
  if not match or not (lo<=float(match.group(1))<=hi): issues.append('STROKE_TOKEN:'+cls)
 view=list(map(float,root.attrib['viewBox'].split())); vx,vy,vw,vh=view
 parent={c:p for p in root.iter() for c in p}
 def in_defs(el):
  p=parent.get(el)
  while p is not None:
   if p.tag==NS+'defs': return True
   p=parent.get(p)
  return False
 text_boxes=[]; point_errors=[]; segments=[]; transform_count=0; forbidden=[]
 for el in root.iter():
  for attr in ('href','{http://www.w3.org/1999/xlink}href'):
   if el.attrib.get(attr) and not el.attrib[attr].startswith('#'): issues.append('EXTERNAL_SVG_REFERENCE:'+el.attrib[attr])
  if in_defs(el): continue
  tag=el.tag.split('}')[-1]
  if el.attrib.get('transform'): forbidden.append('transform')
  if tag=='text':
   value=''.join(el.itertext()).strip()
   if not value:
    issues.append('TEXT_EMPTY')
    continue
   if '<br' in value.lower() or '$' in value or '\\frac' in value or '\\sqrt' in value: issues.append('STUDENT_LATEX_OR_BR')
   cls=el.attrib.get('class','note'); size=style_size.get(cls,14)
   x=float(el.attrib['x']); y=float(el.attrib['y']); width=text_width(value,size); anchor=el.attrib.get('text-anchor','start')
   if anchor=='middle': x0=x-width/2; x1=x+width/2
   elif anchor=='end': x0=x-width; x1=x
   else: x0=x; x1=x+width
   box=(x0,y-size*.84,x1,y+size*.24)
   text_boxes.append({'text':value,'owner':el.attrib.get('data-label-owner'),'box':box,'class':cls})
   add(*box)
   if cls in ('label','value','small') and not el.attrib.get('data-label-owner'): issues.append('LABEL_OWNER_MISSING:'+value)
  elif tag=='circle':
   cx=float(el.attrib['cx']);cy=float(el.attrib['cy']);r=float(el.attrib['r']);add(cx-r,cy-r,cx+r,cy+r)
   if el.attrib.get('data-point-label'):
    if root.attrib.get('data-geometry-mode')=='COORDINATE_GEOMETRY_HYBRID' and not (1.8<=r<=2.2): issues.append('GEOMETRY_POINT_RADIUS_TOKEN:'+str(r))
    grp=ancestor_group(el,parent)
    if grp is None: point_errors.append((el.attrib.get('data-point-label'),'MODEL_MISSING')); continue
    model=[float(grp.attrib[k]) for k in ('data-origin-x','data-origin-y','data-sx','data-sy')]
    mx=exval(el.attrib['data-point-x']);my=exval(el.attrib['data-point-y'])
    ox,oy,sx,sy=model; tx=ox+sx*mx;ty=oy-sy*my
    err=max(abs(cx-tx),abs(cy-ty))
    if err>.025: point_errors.append((el.attrib.get('data-point-label'),round(err,4)))
  elif tag=='line':
   x1=float(el.attrib['x1']);y1=float(el.attrib['y1']);x2=float(el.attrib['x2']);y2=float(el.attrib['y2']);add(min(x1,x2),min(y1,y2),max(x1,x2),max(y1,y2));segments.append(((x1,y1),(x2,y2),el.attrib.get('data-owner','')))
  elif tag in ('polyline','polygon'):
   vals=[float(v) for v in re.findall(r'[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',el.attrib.get('points',''))]
   pts=[(vals[i],vals[i+1]) for i in range(0,len(vals)-1,2)]
   for x,y in pts:add(x,y,x,y)
   for a,b in zip(pts,pts[1:]):segments.append((a,b,el.attrib.get('data-owner','')))
   if tag=='polygon' and len(pts)>2:segments.append((pts[-1],pts[0],el.attrib.get('data-owner','')))
  elif tag=='rect':
   fill=el.attrib.get('fill','')
   if el.attrib.get('data-layer')=='Z00_BACKGROUND' and fill=='#fff':continue
   x=float(el.attrib['x']);y=float(el.attrib['y']);w=float(el.attrib['width']);h=float(el.attrib['height']);add(x,y,x+w,y+h)
 # Estimated text-vs-text collisions only; browser getBBox/actual fonts remain pending.
 overlaps=[]
 for i,a in enumerate(text_boxes):
  for b in text_boxes[i+1:]:
   ax0,ay0,ax1,ay1=a['box'];bx0,by0,bx1,by1=b['box']
   iw=min(ax1,bx1)-max(ax0,bx0);ih=min(ay1,by1)-max(ay0,by0)
   gapx=max(bx0-ax1,ax0-bx1,0);gapy=max(by0-ay1,ay0-by1,0)
   if gapx<6 and gapy<6: overlaps.append((a['text'],b['text'],round(gapx,1),round(gapy,1)))
 if overlaps: issues.extend('ESTIMATED_TEXT_CLEARANCE_BELOW_6PX:'+repr(x) for x in overlaps)
 line_collisions=[]
 for t in text_boxes:
  for a,b,owner in segments:
   if t['owner'] and t['owner']==owner: continue
   if owner.startswith('label-leader:'): continue
   if segment_hits_box(a,b,t['box']): line_collisions.append((t['text'],t['owner'],owner))
 if line_collisions: issues.extend('ESTIMATED_LABEL_LINE_COLLISION:'+repr(x) for x in line_collisions)
 zorder_errors=[]
 for g in (e for e in root.iter() if e.tag==NS+'g'):
  ranks=[layer_rank.get(child.attrib.get('data-layer')) for child in list(g) if child.attrib.get('data-layer') in layer_rank]
  if ranks!=sorted(ranks): zorder_errors.append(g.attrib.get('data-panel','group'))
 if zorder_errors: issues.append('GEOMETRY_Z_ORDER:'+','.join(zorder_errors))
 if forbidden: issues.append('SVG_TRANSFORM_UNSUPPORTED')
 if point_errors: issues.extend('COORDINATE_PARITY:'+repr(x) for x in point_errors)
 if bounds[0]==float('inf'): margins=None
 else: margins={'left':round(bounds[0]-vx,2),'top':round(bounds[1]-vy,2),'right':round(vx+vw-bounds[2],2),'bottom':round(vy+vh-bounds[3],2)}
 if margins and min(margins.values())<32: issues.append('SAFE_MARGIN_LT_32PX:'+str(margins))
 all_text=''.join(el.text or '' for el in root.iter() if el.tag==NS+'text')
 if '-' in all_text and '−' not in all_text: pass
 results.append({'qid':qid,'path':path.as_posix(),'sha256':cand['sha256'],'viewBox':root.attrib['viewBox'],'estimatedVisibleBoundsMargins':margins,'coordinatePointCheckCount':sum(1 for el in root.iter() if el.tag==NS+'circle' and el.attrib.get('data-point-label')),'coordinateErrors':point_errors,'estimatedTextCollisionCount':len(overlaps),'estimatedTextCollisions':overlaps,'issues':issues,'qualification':'STATIC_PASS_RENDER_PENDING' if not issues else 'STATIC_FAIL'})
geometry_ids=[x['qid'] for x in results if x['qid'] not in (1,20)]
geometry_status='PASS' if all(not x['issues'] for x in results if x['qid'] in geometry_ids) else 'FAIL'
report={'scope':'Offline SVG XML/numeric/layout estimate. No browser, actual font fallback, getBBox, getBoundingClientRect, or print scaling was run.','overall':'STATIC_PASS_RENDER_PENDING' if all(not x['issues'] for x in results) else 'STATIC_REVIEW_REQUIRED','candidateCount':len(results),'geometryStyleLint':{'status':geometry_status,'questionIds':geometry_ids,'validator':'validate_candidates.py','checks':['required geometry metadata','AP_GEOMETRY stroke token ranges','2.0px geometry point radius','coordinate parity','geometry DOM z-order','safe margin >=32px','estimated label-owner and collision checks']},'printPublication':{'staticStatus':'PASS' if all(not x['issues'] for x in results) else 'FAIL','actualRender':'PENDING','fullQualification':'PRINT95_RENDER_PENDING'},'results':results}
(EVID/'candidate_static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for x in results: print(f"q{x['qid']:02} margin={x['estimatedVisibleBoundsMargins']} pts={x['coordinatePointCheckCount']} collisions={x['estimatedTextCollisionCount']} issues={x['issues']}")
print('OVERALL',report['overall'])
