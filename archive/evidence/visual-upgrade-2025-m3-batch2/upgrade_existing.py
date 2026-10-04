from __future__ import annotations
import json, math, re, sys, xml.etree.ElementTree as ET
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8', errors='backslashreplace')
ET.register_namespace('', 'http://www.w3.org/2000/svg')
BASE=Path('.')
EVID=BASE/'archive/evidence/visual-upgrade-2025-m3-batch2'
INV=json.loads((EVID/'inventory.json').read_text(encoding='utf-8'))
SVG='http://www.w3.org/2000/svg'
TAU=2*math.pi

def tag(e): return e.tag.rsplit('}',1)[-1]
def parse_points(value):
    nums=[float(x) for x in re.split(r'[ ,]+', value.strip()) if x]
    return list(zip(nums[::2],nums[1::2]))
def dist(a,b): return math.hypot(a[0]-b[0],a[1]-b[1])
def proj(p,a,b):
    dx=b[0]-a[0];dy=b[1]-a[1];den=dx*dx+dy*dy
    t=0 if den==0 else ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den
    t=max(0,min(1,t));return (a[0]+t*dx,a[1]+t*dy),t
def angle_diff(a,b): return abs((a-b+math.pi)%TAU-math.pi)
def normalized_deg(a):
    d=math.degrees(a)%360
    if d>180:d-=360
    if d>90:d-=180
    if d<-90:d+=180
    return d

def shape_source_edges(root):
    rows=[]
    try:vb=[float(x) for x in re.split(r'[ ,]+',root.get('viewBox','0 0 300 220').strip())]
    except:vb=[0,0,300,220]
    for el in root.iter():
        typ=tag(el)
        if typ=='line':
            a=(float(el.get('x1')),float(el.get('y1'))); b=(float(el.get('x2')),float(el.get('y2')))
            rows.append((a,b,el))
        elif typ in ('polyline','polygon'):
            pts=parse_points(el.get('points',''))
            rows.extend((a,b,el) for a,b in zip(pts,pts[1:]))
            if typ=='polygon' and len(pts)>2: rows.append((pts[-1],pts[0],el))
        elif typ=='rect' and el.get('x') and el.get('y') and el.get('width') and el.get('height'):
            x=float(el.get('x'));y=float(el.get('y'));w=float(el.get('width'));h=float(el.get('height'))
            if w<vb[2]*.92 or h<vb[3]*.92:
                p=[(x,y),(x+w,y),(x+w,y+h),(x,y+h)];rows.extend((a,b,el) for a,b in zip(p,p[1:]+p[:1]))
    return rows

def font_guess(el):
    try:return float(el.get('font-size','16').replace('px',''))
    except:return 16.0

def point_labels(root, raw_edges, circles):
    labels=[]
    for el in root.iter():
        if tag(el)!='text':continue
        s=''.join(el.itertext()).strip()
        point_match=re.match(r'^([A-Z])(?:\s*\([^)]*\))?$',s)
        if point_match and el.get('x') and el.get('y'):
            name=point_match.group(1)
            p=(float(el.get('x')),float(el.get('y')))
            labels.append((name,p,el))
    mapped={}
    for name,p,el in labels:
        best=None
        intersections=[]
        for i,(a,b,_) in enumerate(raw_edges):
            r=(b[0]-a[0],b[1]-a[1])
            for c,d,_ in raw_edges[i+1:]:
                s=(d[0]-c[0],d[1]-c[1]);den=r[0]*s[1]-r[1]*s[0]
                if abs(den)<1e-8:continue
                ca=(c[0]-a[0],c[1]-a[1]);t=(ca[0]*s[1]-ca[1]*s[0])/den;u=(ca[0]*r[1]-ca[1]*r[0])/den
                if -1e-6<=t<=1+1e-6 and -1e-6<=u<=1+1e-6:
                    intersections.append((a[0]+t*r[0],a[1]+t*r[1]))
        vertices=[z for a,b,_ in raw_edges for z in (a,b)]+intersections
        if vertices:
            vp=min(vertices,key=lambda z:dist(p,z));vd=dist(p,vp)
            if vd<=max(30,font_guess(el)*1.5):best=(vd,vp,None)
        if best is None:
            for a,b,owner in raw_edges:
                cp,t=proj(p,a,b); dd=dist(p,cp)
                if best is None or dd<best[0]-0.5:best=(dd,cp,owner)
        # A centre label is a true circle centre, not circumference point.
        if name in ('O','I'):
            for c in circles:
                cp=(float(c.get('cx')),float(c.get('cy')));dd=dist(p,cp)
                if best is None or dd<best[0]:best=(dd,cp,c)
        if best and best[0] <= max(30,font_guess(el)*1.5): mapped.setdefault(name,best[1])
    # merge labels at same physical vertex using exact-near point coordinates
    for n,p in list(mapped.items()):
        for m,q in mapped.items():
            if m<n and dist(p,q)<1.0:
                mapped[n]=q
    return labels,mapped

def split_edges(raw_edges, named_points):
    rows=[]
    for a,b,owner in raw_edges:
        points=[(0,a,None),(1,b,None)]
        for name,p in named_points.items():
            cp,t=proj(p,a,b)
            if 1e-6<t<1-1e-6 and dist(cp,p)<1.5: points.append((t,p,name))
            elif dist(p,a)<1.5: points.append((0,a,name))
            elif dist(p,b)<1.5: points.append((1,b,name))
        uniq=[]
        for row in sorted(points,key=lambda x:x[0]):
            if uniq and dist(row[1],uniq[-1][1])<1.0:
                if row[2] and not uniq[-1][2]:uniq[-1]=(uniq[-1][0],uniq[-1][1],row[2])
            else:uniq.append(row)
        for left,right in zip(uniq,uniq[1:]):
            if dist(left[1],right[1])>1:
                rows.append({'a':left[1],'b':right[1],'names':(left[2],right[2]),'primitive':owner})
    # de-duplicate coincident visible geometry but retain one real primitive owner.
    out=[];seen=set()
    for r in rows:
        key=tuple(sorted((tuple(round(x,2) for x in r['a']),tuple(round(x,2) for x in r['b']))))
        if key not in seen:seen.add(key);out.append(r)
    return out

def endpoint_name(p, named_points):
    hits=[(dist(p,q),n) for n,q in named_points.items() if dist(p,q)<2]
    return min(hits)[1] if hits else f'p{round(p[0])}_{round(p[1])}'

def owner_path_exists(edges,named_points,start_name,end_name):
    if start_name not in named_points or end_name not in named_points:return False
    start=named_points[start_name];end=named_points[end_name]
    if dist(start,end)<1:return False
    graph={}
    for row in edges:
        a,b=row['a'],row['b']
        # A segment must belong to the same straight owner line, allowing named collinear split points.
        ca,ta=proj(a,start,end);cb,tb=proj(b,start,end)
        if dist(ca,a)>1.5 or dist(cb,b)>1.5:continue
        ka=tuple(round(x,2) for x in a);kb=tuple(round(x,2) for x in b)
        graph.setdefault(ka,[]).append(kb);graph.setdefault(kb,[]).append(ka)
    sk=tuple(round(x,2) for x in start);ek=tuple(round(x,2) for x in end)
    todo=[sk];seen={sk}
    while todo:
        cur=todo.pop()
        if cur==ek:return True
        for nxt in graph.get(cur,[]):
            if nxt not in seen:seen.add(nxt);todo.append(nxt)
    return False

def path_points(d):
    toks=re.findall(r'[MmLlHhVvZzAa]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?',d or '')
    pts=[];cur=(0.0,0.0);start=(0.0,0.0);i=0;cmd=None
    while i<len(toks):
        if re.fullmatch(r'[A-Za-z]',toks[i]):cmd=toks[i];i+=1
        if cmd is None:return []
        if cmd in ('A','a'):return []
        if cmd in ('Z','z'):
            if pts and dist(cur,start)>1e-6:pts.append(start);cur=start
            cmd=None;continue
        if cmd in ('M','m','L','l'):
            if i+1>=len(toks):break
            x=float(toks[i]);y=float(toks[i+1]);i+=2
            if cmd in ('m','l'):x+=cur[0];y+=cur[1]
            cur=(x,y)
            if not pts:start=cur
            pts.append(cur)
            if cmd in ('M','m'):cmd='L' if cmd=='M' else 'l'
        elif cmd in ('H','h'):
            x=float(toks[i]);i+=1;cur=(cur[0]+x if cmd=='h' else x,cur[1]);pts.append(cur)
        elif cmd in ('V','v'):
            y=float(toks[i]);i+=1;cur=(cur[0],cur[1]+y if cmd=='v' else y);pts.append(cur)
        else:return []
    return pts

def normalize_existing_right_squares(root,named,nodes,role='DERIVED_INTERMEDIATE'):
    converted=[];failures=[]
    for path_el in [e for e in root.iter() if tag(e)=='path']:
        pts=path_points(path_el.get('d',''))
        if len(pts)<3 or len(pts)>5:continue
        xs=[p[0] for p in pts];ys=[p[1] for p in pts]
        if max(xs)-min(xs)>25 or max(ys)-min(ys)>25:continue
        center=(sum(xs)/len(xs),sum(ys)/len(ys))
        choices=[]
        for node in nodes:
            nbs=node['neighbors']
            if len(nbs)<2:continue
            near=dist(node['p'],center)
            if near>34:continue
            for i in range(len(nbs)):
                for j in range(i+1,len(nbs)):
                    p=node['p'];u=nbs[i]['p'];v=nbs[j]['p']
                    ux,uy=u[0]-p[0],u[1]-p[1];vx,vy=v[0]-p[0],v[1]-p[1];lu=math.hypot(ux,uy);lv=math.hypot(vx,vy)
                    if lu<1 or lv<1:continue
                    angle=math.degrees(math.acos(max(-1,min(1,(ux*vx+uy*vy)/(lu*lv)))))
                    if abs(angle-90)>22:continue
                    choices.append((near+abs(angle-90)*.5,node,nbs[i],nbs[j]))
        if not choices:
            failures.append({'pathD':path_el.get('d'),'center':center});continue
        _,node,nb1,nb2=min(choices,key=lambda x:x[0]);vertex=node['names'][0] if node['names'] else endpoint_name(node['p'],named)
        ray1=nb1['name'] or endpoint_name(nb1['p'],named);ray2=nb2['name'] or endpoint_name(nb2['p'],named)
        v=node['p'];a=(nb1['p'][0]-v[0],nb1['p'][1]-v[1]);b=(nb2['p'][0]-v[0],nb2['p'][1]-v[1]);la=math.hypot(*a);lb=math.hypot(*b);a=(a[0]/la,a[1]/la);b=(b[0]/lb,b[1]/lb);size=7.5
        square=[(v[0]+a[0]*size,v[1]+a[1]*size),(v[0]+(a[0]+b[0])*size,v[1]+(a[1]+b[1])*size),(v[0]+b[0]*size,v[1]+b[1]*size)]
        parent=next((p for p in root.iter() if path_el in list(p)),root);idx=list(parent).index(path_el);parent.remove(path_el)
        accent={'GIVEN':'#25344a','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}[role]
        marker=ET.Element(f'{{{SVG}}}polyline',{'id':f'right-angle-owner-{len(converted)+1}','points':' '.join(f'{x:.2f},{y:.2f}' for x,y in square),'fill':'none','stroke':accent,'stroke-width':'1.8','data-marker-kind':'right-angle-square','data-owner-vertex':vertex,'data-owner-rays':f'{vertex}-{ray1} {vertex}-{ray2}','data-fact-role':role})
        parent.insert(idx,marker);converted.append({'vertex':vertex,'rays':[ray1,ray2],'d':path_el.get('d')})
    return converted,failures

def vertex_graph(edges,named_points):
    graph={}
    for e in edges:
        a,b=e['a'],e['b']
        ka=tuple(round(v,2) for v in a);kb=tuple(round(v,2) for v in b)
        graph.setdefault(ka,{'p':a,'neighbors':[],'names':[]})
        graph.setdefault(kb,{'p':b,'neighbors':[],'names':[]})
        if not any(dist(a,n['p'])<1 for n in graph[ka]['neighbors']):graph[ka]['neighbors'].append({'p':b,'name':endpoint_name(b,named_points)})
        if not any(dist(b,n['p'])<1 for n in graph[kb]['neighbors']):graph[kb]['neighbors'].append({'p':a,'name':endpoint_name(a,named_points)})
    for name,p in named_points.items():
        k=tuple(round(v,2) for v in p)
        if k in graph:graph[k]['names'].append(name)
        else:graph[k]={'p':p,'neighbors':[],'names':[name]}
    return list(graph.values())

def text_center(el):
    x=float(el.get('x',0)); y=float(el.get('y',0)); text=''.join(el.itertext()).strip()
    fs=font_guess(el)
    width=max(fs*.6, len(text)*fs*.52)
    anchor=el.get('text-anchor','start')
    if anchor=='middle':x-=width/2
    elif anchor=='end':x-=width
    baseline=el.get('dominant-baseline','').lower()
    cy=y if baseline in ('middle','central') else y-fs*.3
    return (x+width/2,cy)

def box_overlap(a,b,pad=0):
    return a['x']-pad<b['x']+b['width'] and b['x']-pad<a['x']+a['width'] and a['y']-pad<b['y']+b['height'] and b['y']-pad<a['y']+a['height']

def seg_box_hit(a,b,box,pad=1.0):
    x1=box['x']-pad;x2=box['x']+box['width']+pad;y1=box['y']-pad;y2=box['y']+box['height']+pad
    dx=b[0]-a[0];dy=b[1]-a[1];p=(-dx,dx,-dy,dy);q=(a[0]-x1,x2-a[0],a[1]-y1,y2-a[1]);lo=0.0;hi=1.0
    for pp,qq in zip(p,q):
        if abs(pp)<1e-10:
            if qq<0:return False
        else:
            t=qq/pp
            if pp<0:lo=max(lo,t)
            else:hi=min(hi,t)
            if lo>hi:return False
    return True

def owner_layout(root,named):
    # Reposition every direct segment value parallel to its actual owner, using the remaining clear space.
    edges=shape_source_edges(root);fixed=[]
    for t in root.iter():
        if tag(t)=='text' and t.get('data-label-kind')!='length':
            c=text_center(t);fs=font_guess(t);s=''.join(t.itertext()).strip();w=max(fs*.65,len(s)*fs*.52);fixed.append((t,{'x':c[0]-w/2,'y':c[1]-fs*.52,'width':w,'height':fs*1.04}))
    positioned=[]
    for t in [e for e in root.iter() if tag(e)=='text' and e.get('data-label-kind')=='length' and e.get('data-owner-start-point') and e.get('data-owner-end-point') and not e.get('data-owner-dimension')]:
        an=t.get('data-owner-start-point');bn=t.get('data-owner-end-point')
        if an not in named or bn not in named:continue
        p1,p2=named[an],named[bn];dx=p2[0]-p1[0];dy=p2[1]-p1[1];L=math.hypot(dx,dy)
        if L<1:continue
        nx,ny=-dy/L,dx/L;ang=normalized_deg(math.atan2(dy,dx));fs=font_guess(t);s=''.join(t.itertext()).strip();w=max(fs*.65,len(s)*fs*.52);h=fs*1.04;old=text_center(t)
        base_side=1 if (old[0]-(p1[0]+p2[0])/2)*nx+(old[1]-(p1[1]+p2[1])/2)*ny>=0 else -1
        candidates=[]
        for side in (base_side,-base_side):
            for off in (18,24,30,38,48):
                for frac in (.2,.32,.5,.68,.8):
                    c=(p1[0]+dx*frac+nx*side*off,p1[1]+dy*frac+ny*side*off)
                    box={'x':c[0]-w/2,'y':c[1]-h/2,'width':w,'height':h}
                    geom=[]
                    for ga,gb,g in edges:
                        if tag(g)=='polygon' and g.get('fill') not in (None,'none','transparent') and g.get('stroke') in (None,'none'):continue
                        if seg_box_hit(ga,gb,box,float(g.get('stroke-width') or 1)/2+1):geom.append(g.get('id') or tag(g))
                    text_hits=sum(1 for other,b in fixed+positioned if other is not t and box_overlap(box,b,2))
                    text_hits+=sum(1 for other,b in positioned if other is not t and box_overlap(box,b,2))
                    penalty=len(geom)*1000+text_hits*300+abs(c[0]-old[0])+abs(c[1]-old[1])*.7+off*.25+abs(frac-.5)*25
                    candidates.append((penalty,c,box,geom,text_hits))
        _,c,box,geom,text_hits=min(candidates,key=lambda x:x[0])
        t.set('x',f'{c[0]:.2f}');t.set('y',f'{c[1]:.2f}');t.set('text-anchor','middle');t.set('dominant-baseline','middle')
        if abs(ang)>.1:t.set('transform',f'rotate({ang:.2f} {c[0]:.2f} {c[1]:.2f})')
        positioned.append((t,box))

def candidate_angle(label_el,label_text,nodes,edges,named_points):
    center=text_center(label_el)
    explicit=re.match(r'^∠([A-Z])\s*=\s*(?:\d+(?:\.\d+)?°)$',label_text)
    angle_value=re.search(r'(\d+(?:\.\d+)?)°',label_text)
    target_angle=float(angle_value.group(1)) if angle_value else None
    choices=[]
    for node in nodes:
        v=node['p'];neighbors=node['neighbors']
        if len(neighbors)<2:continue
        vn=node['names'] or [None]
        if explicit and explicit.group(1) not in node['names']:continue
        radial=dist(center,v)
        if radial<7 or radial>130:continue
        pos=math.atan2(center[1]-v[1],center[0]-v[0])
        rays=[]
        for nb in neighbors:
            u=nb['p'];a=math.atan2(u[1]-v[1],u[0]-v[0])
            rays.append((a,nb))
        for i in range(len(rays)):
            for j in range(i+1,len(rays)):
                a,na=rays[i];b,nb=rays[j]
                delta=(b-a+TAU)%TAU
                if delta>math.pi:a,b=b,a;delta=TAU-delta;na,nb=nb,na
                actual_deg=math.degrees(delta)
                if target_angle is not None and target_angle<=180:
                    mismatch=abs(actual_deg-target_angle)
                    if target_angle==90 and mismatch>18:continue
                    if target_angle!=90 and mismatch>38:continue
                else:mismatch=0
                bis=(a+delta/2+math.pi)%TAU-math.pi
                dev=angle_diff(pos,bis)
                if target_angle is None and dev>math.radians(72):continue
                # proximity leads; wedge direction resolves ties and rejects wrong corners.
                score=radial+dev*(5 if target_angle is not None else 36)+abs(radial-26)*.03+mismatch*4
                choices.append((score,node,a,b,delta,na,nb,dev,radial))
    if not choices:return None
    return min(choices,key=lambda x:x[0])

def short_angle_label(s):
    s=s.strip()
    if len(s)>12:return False
    return bool(re.fullmatch(r'(?:\d+(?:\.\d+)?°|[xyabθ](?:\s*=\s*\d+(?:\.\d+)?°)?|∠[A-Z]=\d+(?:\.\d+)?°)',s))

def visual_fact_role(exam_file,qid,label,content):
    norm=lambda v:re.sub(r'[^0-9A-Za-z=+\-√π°]','',v.replace('\\sqrt{','√').replace('}','').replace('\\circ','°').replace('−','-')).lower()
    key=norm(label);source=norm(content)
    conclusions={
      ('25_금당중_2학기_중간_중3_수학.js',6):{'BD=2√3'},
      ('25_금당중_2학기_중간_중3_수학.js',7):{'BD=3√3'},
      ('25_금당중_2학기_중간_중3_수학.js',8):{'AC=2√21'},
      ('25_금당중_2학기_중간_중3_수학.js',13):{'AC=2√19'},
      ('25_금당중_2학기_중간_중3_수학.js',14):{'x=6'},
      ('25_금당중_2학기_중간_중3_수학.js',15):{'r=29/3'},
      ('25_금당중_2학기_중간_중3_수학.js',16):{'s=4+4√2'},
      ('25_금당중_2학기_중간_중3_수학.js',19):{'PA=2√21'},
      ('25_금당중_2학기_중간_중3_수학.js',20):{'area=9√3+3π'},
      ('25_금당중_2학기_중간_중3_수학.js',21):{'AB=4','BC=2√5'},
      ('25_금당중_2학기_중간_중3_수학.js',22):{'AB=4√5'},
    }
    if key in {norm(v) for v in conclusions.get((exam_file,qid),set())}:return 'CONCLUSION'
    if key and key in source:return 'GIVEN'
    m=re.match(r'^([A-Z]{2})\s*=',label)
    if m:
        n=re.search(r'=(.+)$',label);value=norm(n.group(1)) if n else ''
        if value and re.search(re.escape(m.group(1))+r'\s*=\s*[^<\n]{0,28}',content):
            candidate=re.search(re.escape(m.group(1))+r'\s*=\s*([^,$<\n]+)',content)
            if candidate and value and (value in norm(candidate.group(1)) or norm(candidate.group(1)) in value):return 'GIVEN'
    return 'DERIVED_INTERMEDIATE'

def get_svg_facts(q,root):
    return q

def add_arc(root, owner, label_id, vertex_name, rays, radius, label_el, label_text, fact_role='DERIVED_INTERMEDIATE', sq=False):
    v=owner['p']; a,b,delta=owner['a'],owner['b'],owner['delta']
    accent={'GIVEN':'#25344a','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}.get(fact_role,'#2563eb')
    if sq:
        u=(math.cos(a),math.sin(a)); w=(math.cos(b),math.sin(b));size=7.5
        pts=[(v[0]+u[0]*size,v[1]+u[1]*size),(v[0]+u[0]*size+w[0]*size,v[1]+u[1]*size+w[1]*size),(v[0]+w[0]*size,v[1]+w[1]*size)]
        marker=ET.Element(f'{{{SVG}}}polyline',{'id':f'right-angle-{label_id}','points':' '.join(f'{x:.2f},{y:.2f}' for x,y in pts),'fill':'none','stroke':accent,'stroke-width':'1.8','data-marker-kind':'right-angle-square','data-owner-vertex':vertex_name,'data-owner-rays':' '.join(rays),'data-fact-role':fact_role})
    else:
        n=18;pts=[]
        for i in range(n+1):
            t=i/n;ang=a+delta*t;pts.append((v[0]+radius*math.cos(ang),v[1]+radius*math.sin(ang)))
        marker=ET.Element(f'{{{SVG}}}polyline',{'id':f'angle-arc-{label_id}','points':' '.join(f'{x:.2f},{y:.2f}' for x,y in pts),'fill':'none','stroke':accent,'stroke-width':'1.8','stroke-linecap':'round','data-marker-kind':'angle-arc','data-owner-vertex':vertex_name,'data-owner-rays':' '.join(rays),'data-radius':str(radius),'data-fact-role':fact_role})
    root.append(marker)
    bis=a+delta/2
    fs=font_guess(label_el);label_width=max(fs*.62,len(label_text)*fs*.52,fs*1.0)
    fit=label_width/(2*max(0.12,math.sin(delta/2)))+fs*.35
    label_r=max(radius+14 if not sq else radius+17,fit)
    label_el.set('x',f'{v[0]+label_r*math.cos(bis):.2f}');label_el.set('y',f'{v[1]+label_r*math.sin(bis)+5:.2f}')
    label_el.set('text-anchor','middle');label_el.set('dominant-baseline','middle');label_el.set('transform','')
    label_el.set('data-label-kind','angle');label_el.set('data-owner-vertex',vertex_name);label_el.set('data-owner-rays',' '.join(rays));label_el.set('data-label-id',label_id)

def add_dimension(root,label_id,p1,p2,label_el,role='DERIVED_INTERMEDIATE'):
    dx=p2[0]-p1[0];dy=p2[1]-p1[1];length=math.hypot(dx,dy)
    if length<1:return None
    tx,ty=dx/length,dy/length;nx,ny=-ty,tx
    old=text_center(label_el);mid=((p1[0]+p2[0])/2,(p1[1]+p2[1])/2)
    side=1 if (old[0]-mid[0])*nx+(old[1]-mid[1])*ny>=0 else -1
    off=22*side; a=(p1[0]+nx*off,p1[1]+ny*off);b=(p2[0]+nx*off,p2[1]+ny*off)
    cap=5; children=[]
    accent={'GIVEN':'#25344a','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}.get(role,'#2563eb')
    children.append(ET.Element(f'{{{SVG}}}line',{'id':f'dimension-{label_id}','x1':f'{a[0]:.2f}','y1':f'{a[1]:.2f}','x2':f'{b[0]:.2f}','y2':f'{b[1]:.2f}','stroke':accent,'stroke-width':'1.5','data-marker-kind':'dimension-line','data-owner-start-point':'','data-owner-end-point':'','data-fact-role':role}))
    for j,p in enumerate((a,b)):
        c=(p[0]-nx*cap,p[1]-ny*cap);d=(p[0]+nx*cap,p[1]+ny*cap)
        children.append(ET.Element(f'{{{SVG}}}line',{'id':f'dimension-{label_id}-cap{j+1}','x1':f'{c[0]:.2f}','y1':f'{c[1]:.2f}','x2':f'{d[0]:.2f}','y2':f'{d[1]:.2f}','stroke':accent,'stroke-width':'1.5','data-marker-kind':'dimension-end-cap','data-owner-dimension':f'dimension-{label_id}','data-fact-role':role}))
    for x in children:root.append(x)
    ang=normalized_deg(math.atan2(dy,dx));mid2=(mid[0]+nx*off*1.85,mid[1]+ny*off*1.85)
    label_el.set('x',f'{mid2[0]:.2f}');label_el.set('y',f'{mid2[1]+7:.2f}');label_el.set('text-anchor','middle')
    label_el.set('data-fact-role',role);label_el.set('fill',{'GIVEN':'#172033','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}.get(role,'#2563eb'))
    if abs(ang)>0.1:label_el.set('transform',f'rotate({ang:.2f} {mid2[0]:.2f} {mid2[1]:.2f})')
    label_el.set('data-owner-dimension',f'dimension-{label_id}');label_el.set('data-label-id',label_id);label_el.set('data-label-kind','length')
    return f'dimension-{label_id}'

def main():
    summary={'assets':0,'angleLabels':0,'angleArcs':0,'rightSquares':0,'lengthLabels':0,'dimensionLines':0,'unresolved':[]}
    for ex in INV['exams']:
        for q in ex['questions']:
            asset=q.get('solutionImagePath')
            if not asset:continue
            path=BASE/asset
            baseline=subprocess.check_output(['git','show',f'HEAD:{asset}'])
            root=ET.fromstring(baseline);tree=ET.ElementTree(root);raw=shape_source_edges(root)
            vb=[float(x) for x in re.split(r'[ ,]+',root.get('viewBox','0 0 300 220').strip())]
            circles=[e for e in root.iter() if tag(e)=='circle']
            exam_file=Path(ex['sourcePath']).name
            plabels,named=point_labels(root,raw,circles)
            if exam_file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==12:
                # The source labels T at the tangent/diameter intersection. Keep it
                # distinct from D, which is the endpoint of diameter CD on the circle.
                named['T']=(236.97,53.00)
                tl=next((e for e in root.iter() if tag(e)=='text' and ''.join(e.itertext()).strip()=='T'),None)
                if tl is not None:
                    tl.set('data-point-x',f'{named["T"][0]:.4f}');tl.set('data-point-y',f'{named["T"][1]:.4f}')
                if not any(tag(e)=='circle' and e.get('data-owner-point')=='T' for e in root.iter()):
                    root.append(ET.Element(f'{{{SVG}}}circle',{'id':'point-T','cx':f'{named["T"][0]:.3f}','cy':f'{named["T"][1]:.3f}','r':'2.2','fill':'#25344a','data-marker-kind':'point','data-owner-point':'T','data-point-x':f'{named["T"][0]:.4f}','data-point-y':f'{named["T"][1]:.4f}','data-fact-role':'GIVEN'}))
                if 'B' in named and 'C' in named and not any(tag(e)=='line' and e.get('data-start-point') in ('B','C') and e.get('data-end-point') in ('B','C') for e in root.iter()):
                    root.append(ET.Element(f'{{{SVG}}}line',{'id':'seg-B-C','x1':f'{named["B"][0]:.3f}','y1':f'{named["B"][1]:.3f}','x2':f'{named["C"][0]:.3f}','y2':f'{named["C"][1]:.3f}','stroke':'#25344a','stroke-width':'2.3','data-segment-pair':'B-C','data-start-point':'B','data-end-point':'C','data-fact-role':'GIVEN'}))
                # Two intermediate 22-degree inscribed angles expose the subtraction
                # that determines the requested 46-degree angle BCD.
                for label_id,xy in [('q12-derived-angle-ABD',(256,147)),('q12-derived-angle-ACD',(142,165))]:
                    lab=ET.Element(f'{{{SVG}}}text',{'id':label_id,'x':str(xy[0]),'y':str(xy[1]),'font-size':str(base_font),'font-family':'Arial, "Malgun Gothic", sans-serif','text-anchor':'middle','dominant-baseline':'middle','fill':'#2563eb','data-label-kind':'angle','data-fact-role':'DERIVED_INTERMEDIATE'})
                    lab.text='22°';root.append(lab)
            if exam_file=='25_연향중_2학기_중간_중3_수학.js' and q['qid']==22 and 'A' in named and 'C' in named:
                tri=next((e for e in root.iter() if tag(e) in ('polygon','polyline') and len(parse_points(e.get('points','')))==3),None)
                if tri is not None:
                    verts=parse_points(tri.get('points',''));ap=named['A'];cp=named['C'];av=min(verts,key=lambda p:dist(p,ap));cv=min(verts,key=lambda p:dist(p,cp));bp=next((p for p in verts if dist(p,av)>1 and dist(p,cv)>1),None)
                    if bp is not None:named['B']=bp
            if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==22:
                horiz=next(((a,b) for a,b,_ in raw if abs(a[1]-b[1])<.1 and abs(a[0]-b[0])>100),None)
                vert=next(((a,b) for a,b,_ in raw if abs(a[0]-b[0])<.1 and abs(a[1]-b[1])>100),None)
                if horiz and vert:
                    origin=(vert[0][0],horiz[0][1]);named['O']=origin
                    label=ET.Element(f'{{{SVG}}}text',{'x':f'{origin[0]+15:.2f}','y':f'{origin[1]+18:.2f}','font-size':'16','text-anchor':'middle','dominant-baseline':'middle','fill':'#172033'});label.text='O';root.append(label);plabels.append(('O',origin,label))
            if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==16:
                rect=next((e for e in root.iter() if tag(e)=='rect' and e.get('x') and e.get('y') and float(e.get('width'))<vb[2]*.92),None)
                if rect is not None:
                    rect.set('id','outer-square');rect.set('data-owner-boundary','outer-square');rect.set('data-owner-segment','outer-square-side');rect.set('data-segment-pair','square-bottom-left-square-bottom-right')
                    x=float(rect.get('x'));y=float(rect.get('y'));w=float(rect.get('width'));h=float(rect.get('height'));center=(x+w/2,y+h/2)
                    cs=[e for e in circles if e.get('cx') and e.get('cy')]
                    Oel=min(cs,key=lambda e:dist((float(e.get('cx')),float(e.get('cy'))),center));Pel=min((e for e in cs if e is not Oel),key=lambda e:float(e.get('cx'))+float(e.get('cy')))
                    O=(float(Oel.get('cx')),float(Oel.get('cy')));P=(float(Pel.get('cx')),float(Pel.get('cy')));named['O']=O;named['P']=P
                    for name,ptc,off in [('O',O,(0,17)),('P',P,(-11,-14))]:
                        marker=ET.Element(f'{{{SVG}}}circle',{'id':f'point-{name}','cx':f'{ptc[0]:.3f}','cy':f'{ptc[1]:.3f}','r':'2.2','fill':'#25344a','data-marker-kind':'point','data-owner-point':name,'data-point-x':f'{ptc[0]:.4f}','data-point-y':f'{ptc[1]:.4f}'})
                        root.append(marker);lab=ET.Element(f'{{{SVG}}}text',{'x':f'{ptc[0]+off[0]:.2f}','y':f'{ptc[1]+off[1]:.2f}','font-size':'16','text-anchor':'middle','dominant-baseline':'middle','fill':'#172033'});lab.text=name;root.append(lab);plabels.append((name,ptc,lab))
                    connector=ET.Element(f'{{{SVG}}}line',{'id':'seg-O-P','x1':f'{O[0]:.3f}','y1':f'{O[1]:.3f}','x2':f'{P[0]:.3f}','y2':f'{P[1]:.3f}','stroke':'#2563eb','stroke-width':'2.2','data-segment-pair':'O-P','data-start-point':'O','data-end-point':'P','data-fact-role':'DERIVED_INTERMEDIATE'})
                    root.append(connector)
                    for label in root.iter():
                        if tag(label)=='text' and ''.join(label.itertext()).strip()=='중심거리 4':label.text='OP=4';label.set('data-fact-role','DERIVED_INTERMEDIATE')
                    named['_square-left']=(x,y+h);named['_square-right']=(x+w,y+h)
            if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==15 and 'O' in named and 'A' in named:
                rr=next((c for c in circles if c.get('cx')),None)
                exists=owner_path_exists(split_edges(raw,named),named,'O','A') if rr is not None else False
                if rr is not None and not exists:
                    root.append(ET.Element(f'{{{SVG}}}line',{'id':'seg-O-A-radius','x1':f'{named["O"][0]:.3f}','y1':f'{named["O"][1]:.3f}','x2':f'{named["A"][0]:.3f}','y2':f'{named["A"][1]:.3f}','stroke':'#2563eb','stroke-width':'2.1','data-segment-pair':'O-A','data-start-point':'O','data-end-point':'A','data-fact-role':'CONCLUSION'}))
            if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==19 and 'P' in named and 'O' in named and circles:
                cc=(float(circles[0].get('cx')),float(circles[0].get('cy')));rr=float(circles[0].get('r'));dx=named['P'][0]-cc[0];dy=named['P'][1]-cc[1];dd=math.hypot(dx,dy);near=(cc[0]+dx*rr/dd,cc[1]+dy*rr/dd);named['R']=near
                old=next((e for e in root.iter() if tag(e)=='line' and abs(float(e.get('x1'))-named['P'][0])<1 and abs(float(e.get('x2'))-named['O'][0])<1 and abs(float(e.get('y1'))-named['O'][1])<1),None)
                if old is not None:
                    old.set('x2',f'{near[0]:.3f}');old.set('y2',f'{near[1]:.3f}');old.set('id','seg-P-R');old.set('data-segment-pair','P-R');old.set('data-start-point','P');old.set('data-end-point','R')
                    root.append(ET.Element(f'{{{SVG}}}line',{'id':'seg-R-O','x1':f'{near[0]:.3f}','y1':f'{near[1]:.3f}','x2':f'{cc[0]:.3f}','y2':f'{cc[1]:.3f}','stroke':'#25344a','stroke-width':'2.3','data-segment-pair':'R-O','data-start-point':'R','data-end-point':'O'}))
                root.append(ET.Element(f'{{{SVG}}}circle',{'id':'point-R','cx':f'{near[0]:.3f}','cy':f'{near[1]:.3f}','r':'2.2','fill':'#25344a','data-marker-kind':'point','data-owner-point':'R','data-point-x':f'{near[0]:.4f}','data-point-y':f'{near[1]:.4f}'}))
                rt=ET.Element(f'{{{SVG}}}text',{'x':f'{near[0]:.2f}','y':f'{near[1]-15:.2f}','font-size':'16','text-anchor':'middle','dominant-baseline':'middle','fill':'#172033'});rt.text='R';root.append(rt);plabels.append(('R',near,rt))
                for label in root.iter():
                    if tag(label)=='text' and ''.join(label.itertext()).strip()=='distance to circle=6':label.text='PR=6';label.set('data-fact-role','GIVEN')
            if exam_file=='25_연향중_2학기_중간_중3_수학.js' and q['qid']==20 and 'A' in named and 'B' in named and not owner_path_exists(split_edges(raw,named),named,'A','B'):
                root.append(ET.Element(f'{{{SVG}}}line',{'id':'seg-A-B-diameter','x1':f'{named["A"][0]:.3f}','y1':f'{named["A"][1]:.3f}','x2':f'{named["B"][0]:.3f}','y2':f'{named["B"][1]:.3f}','stroke':'#25344a','stroke-width':'2.3','data-segment-pair':'A-B','data-start-point':'A','data-end-point':'B','data-fact-role':'GIVEN'}))
            if exam_file=='25_연향중_2학기_중간_중3_수학.js' and q['qid']==23 and 'O' in named and 'D' in named and not owner_path_exists(split_edges(raw,named),named,'O','D'):
                root.append(ET.Element(f'{{{SVG}}}line',{'id':'seg-O-D-radius','x1':f'{named["O"][0]:.3f}','y1':f'{named["O"][1]:.3f}','x2':f'{named["D"][0]:.3f}','y2':f'{named["D"][1]:.3f}','stroke':'#2563eb','stroke-width':'2.2','data-segment-pair':'O-D','data-start-point':'O','data-end-point':'D','data-fact-role':'DERIVED_INTERMEDIATE'}))
            raw=shape_source_edges(root);edges=split_edges(raw,named);nodes=vertex_graph(edges,named)
            source_right_role='GIVEN' if re.search(r'90\s*(?:°|\\circ)|⟂|직각|수직',q['content']) else 'DERIVED_INTERMEDIATE'
            converted_squares,square_failures=normalize_existing_right_squares(root,named,nodes,source_right_role)
            summary['rightSquares']+=len(converted_squares)
            if square_failures:summary['unresolved'].extend({'qid':q['qid'],'path':asset,'rightSquareCandidate':x} for x in square_failures)
            # IDs and exact segment ownership are persisted on source geometry primitives.
            primitives=[];seen_el=set()
            for i,e in enumerate(root.iter()):
                if tag(e) not in ('line','polyline','polygon','rect') or id(e) in seen_el:continue
                seen_el.add(id(e));pid=e.get('id') or f'geom-{i+1}';e.set('id',pid)
                pairs=[]
                for row in edges:
                    if row['primitive'] is e:
                        na=endpoint_name(row['a'],named);nb=endpoint_name(row['b'],named)
                        if na and nb and na!=nb:pairs.append(f'{na}-{nb}')
                if pairs:e.set('data-segment-pairs',' '.join(dict.fromkeys(pairs)))
                primitives.append(e)
            # Publishing floor: consistent slate geometry + readable text role sizing.
            vb=[float(x) for x in re.split(r'[ ,]+',root.get('viewBox','0 0 300 220').strip())]
            width,height=vb[2],vb[3]
            # Size labels for the actual full-width 390px Archive solution column after adding a 40-unit safe margin.
            base_font=max(16,12.5*(width+80)/295.7)
            root.set('role','img');root.set('aria-label',root.get('aria-label') or '수학 해설 도형')
            for e in root.iter():
                typ=tag(e)
                if typ in ('line','polyline','polygon'):
                    st=e.get('stroke')
                    if st in ('black','#111','#111111','currentColor','#000','#000000'):e.set('stroke','#25344a')
                    try:sw=float(e.get('stroke-width','2'))
                    except:sw=2
                    if e.get('data-marker-kind') is None and sw<2.3:e.set('stroke-width','2.3')
                if typ=='text':
                    fs=max(base_font,font_guess(e));e.set('font-size',str(round(fs,2)))
                    e.set('font-family','Arial, "Malgun Gothic", sans-serif')
                    if not e.get('fill') or e.get('fill') in ('black','#111','#111111','currentColor'):e.set('fill','#172033')
            # Add stable IDs/point owners and preserve GIVEN/DERIVED/CONCLUSION role as metadata.
            for label_idx,el in enumerate(z for z in root.iter() if tag(z)=='text'):
                if not el.get('id'):el.set('id',f'q{q["qid"]}-text-{label_idx+1}')
            for name,p,el in plabels:
                if name in named:
                    el.set('data-label-kind','point');el.set('data-owner-point',name);el.set('data-point-x',f'{named[name][0]:.4f}');el.set('data-point-y',f'{named[name][1]:.4f}')
                    vertex=named[name];center=text_center(el);dx=center[0]-vertex[0];dy=center[1]-vertex[1];mag=math.hypot(dx,dy)
                    if mag<1:
                        dx,dy=0,-1;mag=1
                    fs=font_guess(el);offset=max(fs*.92,17);target=(vertex[0]+dx/mag*offset,vertex[1]+dy/mag*offset)
                    el.set('x',f'{target[0]:.2f}');el.set('y',f'{target[1]:.2f}');el.set('text-anchor','middle');el.set('dominant-baseline','middle')
            if exam_file=='25_연향중_2학기_중간_중3_수학.js' and q['qid']==23:
                old=next((e for e in root.iter() if tag(e)=='text' and ''.join(e.itertext()).strip()=='AB=12, BC=16, AC=20'),None)
                if old is not None:
                    parent=next((p for p in root.iter() if old in list(p)),root);parent.remove(old)
                    for idx,(value,a_name,b_name,pos) in enumerate([
                        ('AB=12','A','B',(40,205)),('BC=16','B','C',(230,356)),('AC=20','A','C',(246,196))]):
                        t=ET.Element(f'{{{SVG}}}text',{'id':f'q23-side-{idx+1}','x':str(pos[0]),'y':str(pos[1]),'font-size':str(base_font),'font-family':'Arial, "Malgun Gothic", sans-serif','fill':'#2563eb','text-anchor':'middle','dominant-baseline':'middle','data-label-kind':'length','data-owner-segment':f'{a_name}-{b_name}','data-owner-start-point':a_name,'data-owner-end-point':b_name,'data-fact-role':'DERIVED_INTERMEDIATE'})
                        t.text=value;parent.append(t)
            # Find actual angle labels from compact mathematical labels only; prose annotations stay prose.
            angle_records=[]
            def exact_angle_owner(vertex_name,ray1_name,ray2_name):
                v=named.get(vertex_name)
                if v is None:return None
                node=next((n for n in nodes if dist(n['p'],v)<1.0),None)
                if node is None:return None
                n1=next((nb for nb in node['neighbors'] if nb['name']==ray1_name),None)
                n2=next((nb for nb in node['neighbors'] if nb['name']==ray2_name),None)
                if n1 is None or n2 is None:return None
                a=math.atan2(n1['p'][1]-v[1],n1['p'][0]-v[0]);b=math.atan2(n2['p'][1]-v[1],n2['p'][0]-v[0]);delta=(b-a+TAU)%TAU
                if delta>math.pi:a,b=b,a;delta=TAU-delta;n1,n2=n2,n1
                return (0,node,a,b,delta,n1,n2,0,0)
            for ix,el in enumerate([z for z in root.iter() if tag(z)=='text']):
                s=''.join(el.itertext()).strip()
                if not short_angle_label(s):continue
                owner=candidate_angle(el,s,nodes,edges,named)
                if Path(ex['sourcePath']).name=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==10 and s in ('60°','120°'):
                    desired=('A','B') if s=='60°' else ('A','D')
                    pn=next((n for n in nodes if 'P' in n['names']),None)
                    if pn:
                        rays=[]
                        for nb in pn['neighbors']:
                            if nb['name'] in desired:
                                ang=math.atan2(nb['p'][1]-pn['p'][1],nb['p'][0]-pn['p'][0]);rays.append((ang,nb))
                        if len(rays)==2:
                            a,na=rays[0];b,nb=rays[1];delta=(b-a+TAU)%TAU
                            if delta>math.pi:a,b=b,a;delta=TAU-delta;na,nb=nb,na
                            owner=(0,pn,a,b,delta,na,nb,0,dist(text_center(el),pn['p']))
                if exam_file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==12:
                    target=None
                    if s=='68°':target=('B','A','C')
                    elif s=='46°':target=('C','B','D')
                    elif el.get('id')=='q12-derived-angle-ABD':target=('B','A','D')
                    elif el.get('id')=='q12-derived-angle-ACD':target=('C','A','D')
                    if target:
                        explicit=exact_angle_owner(*target)
                        if explicit is not None:owner=explicit
                if owner is None:
                    summary['unresolved'].append({'qid':q['qid'],'path':asset,'label':s,'x':el.get('x'),'y':el.get('y')});continue
                score,node,a,b,delta,na,nb,dev,rad=owner
                vn=(node['names'][0] if node['names'] else endpoint_name(node['p'],named))
                rn1=na['name'] or endpoint_name(na['p'],named)
                rn2=nb['name'] or endpoint_name(nb['p'],named)
                # If the text's stated vertex is explicit, use that semantic vertex.
                if s.startswith('\u2220'):
                    m=re.match(r'^\u2220([A-Z])',s)
                    if m:vn=m.group(1)
                label_id=f'q{q["qid"]}-angle-{ix+1}';angle_records.append((label_id,el,node,a,b,delta,vn,(f'{vn}-{rn1}',f'{vn}-{rn2}'),s))
            grouped={}
            for rec in angle_records:grouped.setdefault(tuple(round(x,2) for x in rec[2]['p']),[]).append(rec)
            for group in grouped.values():
                for pos,rec in enumerate(group):
                    label_id,el,node,a,b,delta,vn,rays,s=rec;radius=12+4*pos;right=bool(re.fullmatch(r'90°',s))
                    exam_file=Path(ex['sourcePath']).name
                    mval=re.search(r'\d+(?:\.\d+)?',s)
                    value=mval.group(0) if mval else None
                    fact_role='DERIVED_INTERMEDIATE'
                    if value and re.search(r'(?<!\d)'+re.escape(value)+r'\s*\^?\s*\\?circ|(?<!\d)'+re.escape(value)+r'°',q['content']):fact_role='GIVEN'
                    if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==7 and s in ('30°','45°'):fact_role='GIVEN'
                    if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==11:fact_role='GIVEN' if s=='75°' and vn=='B' else 'DERIVED_INTERMEDIATE'
                    if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==20:fact_role='GIVEN' if s=='30°' else 'DERIVED_INTERMEDIATE'
                    if exam_file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==10:fact_role='GIVEN' if s=='60°' else 'DERIVED_INTERMEDIATE'
                    if exam_file=='25_연향중_2학기_중간_중3_수학.js' and q['qid']==17:fact_role='GIVEN' if s=='130°' else 'DERIVED_INTERMEDIATE'
                    if exam_file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==12:
                        fact_role='GIVEN' if s=='68°' else 'CONCLUSION' if s=='46°' else 'DERIVED_INTERMEDIATE'
                        radius=10 if s=='22°' else 18
                    else:radius=12+4*pos
                    add_arc(root,{"p":node["p"],"a":a,"b":b,"delta":delta},label_id,vn,rays,radius,el,s,fact_role=fact_role,sq=right)
                    el.set('data-fact-role',fact_role);el.set('fill',{'GIVEN':'#172033','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}[fact_role])
                    summary['angleLabels']+=1
                    if right:summary['rightSquares']+=1
                    else:summary['angleArcs']+=1
                    if right:
                        parent=next((p for p in root.iter() if el in list(p)),None)
                        if parent is not None:parent.remove(el)
            if exam_file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==12:
                owner=exact_angle_owner('T','A','D')
                if owner is not None:
                    dummy=ET.Element(f'{{{SVG}}}text',{'font-size':str(base_font)})
                    add_arc(root,{'p':owner[1]['p'],'a':owner[2],'b':owner[3],'delta':owner[4]},'q12-right-T','T',('T-A','T-D'),8,dummy,'90°',fact_role='GIVEN',sq=True)
                    summary['rightSquares']+=1
            # Exact AB=... style labels bind to named endpoints; numeric-only lengths get a real dimension line.
            for ix,el in enumerate([z for z in root.iter() if tag(z)=='text']):
                s=''.join(el.itertext()).strip()
                if el.get('data-label-kind')=='angle' or el.get('data-label-kind')=='point':continue
                radius_label=re.match(r'^r\s*=\s*(.+)$',s,re.I)
                if radius_label:
                    pair=None;role='DERIVED_INTERMEDIATE'
                    if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==15:pair=('O','A');role='CONCLUSION'
                    elif exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==18:pair=('O','E');role='DERIVED_INTERMEDIATE'
                    elif exam_file=='25_연향중_2학기_중간_중3_수학.js' and q['qid']==23:pair=('O','D');role='DERIVED_INTERMEDIATE'
                    if pair and owner_path_exists(edges,named,*pair):
                        el.set('data-label-kind','length');el.set('data-owner-segment',f'{pair[0]}-{pair[1]}');el.set('data-owner-start-point',pair[0]);el.set('data-owner-end-point',pair[1]);el.set('data-label-id',f'q{q["qid"]}-radius-{ix+1}');el.set('data-fact-role',role);el.set('fill',{'GIVEN':'#172033','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}[role]);summary['lengthLabels']+=1
                        continue
                if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==14 and s=='x=6' and owner_path_exists(edges,named,'A','M'):
                    el.set('data-label-kind','length');el.set('data-owner-segment','A-M');el.set('data-owner-start-point','A');el.set('data-owner-end-point','M');el.set('data-label-id',f'q{q["qid"]}-length-{ix+1}');el.set('data-fact-role','CONCLUSION');el.set('fill','#b45309');summary['lengthLabels']+=1;continue
                if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==12 and s=='2':
                    label_id=f'q{q["qid"]}-height-{ix+1}';add_dimension(root,label_id,(45,45),(45,145),el,role='GIVEN')
                    el.set('data-owner-segment','parallel-gap');el.set('data-owner-start-point','upper-guide');el.set('data-owner-end-point','lower-guide');el.set('data-fact-role','GIVEN');el.set('fill','#172033')
                    for dimline in root.iter():
                        if dimline.get('id')==f'dimension-{label_id}':dimline.set('data-owner-start-point','upper-guide');dimline.set('data-owner-end-point','lower-guide');dimline.set('data-owner-segment','parallel-gap')
                    summary['lengthLabels']+=1;summary['dimensionLines']+=1;continue
                if exam_file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==3 and s=='3+x':
                    center=text_center(el);best=min(((dist(center,proj(center,e['a'],e['b'])[0]),e) for e in edges),key=lambda x:x[0],default=None)
                    if best and best[0]<60:
                        edge=best[1];label_id=f'q{q["qid"]}-length-{ix+1}';a_name=endpoint_name(edge['a'],named);b_name=endpoint_name(edge['b'],named)
                        add_dimension(root,label_id,edge['a'],edge['b'],el)
                        if a_name and b_name:el.set('data-owner-segment',f'{a_name}-{b_name}');el.set('data-owner-start-point',a_name);el.set('data-owner-end-point',b_name)
                        summary['lengthLabels']+=1;summary['dimensionLines']+=1;continue
                if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==16 and s.startswith('s ='):
                    rect=next((e for e in root.iter() if tag(e)=='rect' and e.get('id')=='outer-square'),None)
                    if rect is not None:
                        x=float(rect.get('x'));y=float(rect.get('y'));w=float(rect.get('width'));h=float(rect.get('height'));p1=(x,y+h);p2=(x+w,y+h)
                        add_dimension(root,f'q{q["qid"]}-outer-side-{ix+1}',p1,p2,el,role='CONCLUSION')
                        el.set('data-owner-segment','outer-square-side');el.set('data-owner-start-point','square-bottom-left');el.set('data-owner-end-point','square-bottom-right');el.set('data-fact-role','CONCLUSION');el.set('fill','#b45309');summary['lengthLabels']+=1;summary['dimensionLines']+=1
                        for dimline in root.iter():
                            if dimline.get('id')==f'dimension-q{q["qid"]}-outer-side-{ix+1}':dimline.set('data-owner-start-point','square-bottom-left');dimline.set('data-owner-end-point','square-bottom-right');dimline.set('data-owner-segment','outer-square-side')
                    continue
                m=re.match(r'^([A-Z])([A-Z])\s*=\s*(.+)$',s)
                if m:
                    a_name,b_name=m.group(1),m.group(2)
                    if a_name in named and b_name in named and owner_path_exists(edges,named,a_name,b_name):
                        role='GIVEN' if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==19 and s=='PR=6' else visual_fact_role(exam_file,q['qid'],s,q['content'])
                        el.set('data-label-kind','length');el.set('data-owner-segment',f'{a_name}-{b_name}');el.set('data-owner-start-point',a_name);el.set('data-owner-end-point',b_name);el.set('data-label-id',f'q{q["qid"]}-length-{ix+1}');el.set('data-fact-role',role);el.set('fill',{'GIVEN':'#172033','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}[role]);summary['lengthLabels']+=1
                        # Keep labels along their actual owner segment at a consistent normal clearance.
                        p1,p2=named[a_name],named[b_name];dx=p2[0]-p1[0];dy=p2[1]-p1[1];L=math.hypot(dx,dy)
                        if L:
                            nx,ny=-dy/L,dx/L;mid=((p1[0]+p2[0])/2,(p1[1]+p2[1])/2);old=text_center(el);side=1 if (old[0]-mid[0])*nx+(old[1]-mid[1])*ny>=0 else -1
                            ang=normalized_deg(math.atan2(dy,dx));target=(mid[0]+nx*16*side,mid[1]+ny*16*side)
                            el.set('x',f'{target[0]:.2f}');el.set('y',f'{target[1]:.2f}');el.set('text-anchor','middle');el.set('dominant-baseline','middle');el.set('transform',f'rotate({ang:.2f} {target[0]:.2f} {target[1]:.2f})' if abs(ang)>.1 else '')
                    continue
                # Bare exact numeric labels are dimensions, not free text.
                if re.fullmatch(r'(?:\d+(?:\.\d+)?|\d*√\d+(?:/\d+)?|\d+(?:√\d+)?/\d+|(?:x|r|s)\s*=\s*[^°]{1,24}|\d+(?:\.\d+)?\s*(?:cm|m)|\d+\s*[+-]\s*x|x\s*[+-]\s*\d+)',s):
                    center=text_center(el);best=None
                    for edge in edges:
                        cp,t=proj(center,edge['a'],edge['b']);dd=dist(center,cp)
                        if best is None or dd<best[0]:best=(dd,edge)
                    if best and best[0]<44:
                        edge=best[1];label_id=f'q{q["qid"]}-dim-{ix+1}'
                        a_name=endpoint_name(edge['a'],named);b_name=endpoint_name(edge['b'],named)
                        add_dimension(root,label_id,edge['a'],edge['b'],el,role='CONCLUSION' if (Path(ex['sourcePath']).name,q['qid']) in {('25_금당중_2학기_중간_중3_수학.js',14),('25_금당중_2학기_중간_중3_수학.js',16),('25_금당중_2학기_중간_중3_수학.js',15)} else 'DERIVED_INTERMEDIATE')
                        if a_name and b_name:
                            el.set('data-owner-start-point',a_name);el.set('data-owner-end-point',b_name);el.set('data-owner-segment',f'{a_name}-{b_name}')
                            for dimline in root.iter():
                                if dimline.get('id')==f'dimension-{label_id}':dimline.set('data-owner-start-point',a_name);dimline.set('data-owner-end-point',b_name);dimline.set('data-owner-segment',f'{a_name}-{b_name}')
                        summary['lengthLabels']+=1;summary['dimensionLines']+=1
            # Keep requested outputs visually distinct from source facts.
            conclusion_labels={
                ('25_금당중_2학기_중간_중3_수학.js',6):{'BD=2√3'},
                ('25_금당중_2학기_중간_중3_수학.js',7):{'BD=3√3'},
                ('25_금당중_2학기_중간_중3_수학.js',8):{'AC=2√21'},
                ('25_금당중_2학기_중간_중3_수학.js',13):{'AC=2√19'},
                ('25_금당중_2학기_중간_중3_수학.js',14):{'x=6'},
                ('25_금당중_2학기_중간_중3_수학.js',15):{'r=29/3'},
                ('25_금당중_2학기_중간_중3_수학.js',16):{'s=4+4√2'},
                ('25_금당중_2학기_중간_중3_수학.js',19):{'PA=2√21'},
                ('25_금당중_2학기_중간_중3_수학.js',20):{'area=9√3+3π'},
                ('25_금당중_2학기_중간_중3_수학.js',21):{'AB=4','BC=2√5'},
                ('25_금당중_2학기_중간_중3_수학.js',22):{'AB=4√5'},
            }
            norm=lambda v:''.join(v.split()).replace('−','-')
            for t in [z for z in root.iter() if tag(z)=='text']:
                label=''.join(t.itertext()).strip()
                if norm(label) in {norm(v) for v in conclusion_labels.get((exam_file,q['qid']),set())}:
                    t.set('data-fact-role','CONCLUSION');t.set('fill','#b45309')
                if exam_file=='25_금당중_2학기_중간_중3_수학.js' and q['qid']==20 and label.startswith('area='):
                    t.set('data-fact-role','CONCLUSION');t.set('data-label-kind','region');t.set('data-owner-region','shaded-sector-and-triangles');t.set('fill','#b45309')
            if exam_file=='25_금당중_2학기_中3_수學.js' and q['qid']==24:
                # Split the source hypothesis from the theorem conclusion so AB=CD is never styled as given.
                for t in [z for z in root.iter() if tag(z)=='text']:
                    if 'OM=ON' in ''.join(t.itertext()) and 'AB=CD' in ''.join(t.itertext()):
                        t.text='OM=ON';t.set('id',f'q{q["qid"]}-given-equal-radii');t.set('x','110');t.set('y','207');t.set('text-anchor','middle');t.set('data-label-kind','length');t.set('data-owner-segments','O-M O-N');t.set('data-owner-segment','O-M O-N');t.set('data-owner-start-point','O');t.set('data-owner-end-point','M');t.set('data-owner-additional-segments','O-N');t.set('data-fact-role','GIVEN');t.set('fill','#172033')
                        conclusion=ET.Element(f'{{{SVG}}}text',{'id':f'q{q["qid"]}-conclusion-equal-chords','x':'190','y':'207','text-anchor':'middle','font-size':str(base_font),'font-family':'Arial, sans-serif','data-label-kind':'length','data-owner-segments':'A-B C-D','data-owner-segment':'A-B C-D','data-owner-start-point':'A','data-owner-end-point':'B','data-owner-additional-segments':'C-D','data-fact-role':'CONCLUSION','fill':'#b45309'})
                        conclusion.text='AB=CD';root.append(conclusion)
            # Remove redundant sentence-style angle/length explanations already written in the solution.
            for el in list(root.iter()):
                if tag(el)=='text':
                    s=''.join(el.itertext()).strip()
                    if len(s)>28 and ('→' in s or '에서 ' in s or '둘레' in s or '계산' in s):
                        parent=next((p for p in root.iter() if el in list(p)),None)
                        if parent is not None:parent.remove(el)
            if Path(ex['sourcePath']).name=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==10 and 'P' in named:
                px,py=named['P'];root.append(ET.Element(f'{{{SVG}}}circle',{'id':'point-P','cx':f'{px:.2f}','cy':f'{py:.2f}','r':'2.2','fill':'#25344a','data-marker-kind':'intersection-point','data-owner-point':'P'}))
                for label in root.iter():
                    if tag(label)=='text' and ''.join(label.itertext()).strip()=='P':
                        label.set('x',f'{px-13:.2f}');label.set('y',f'{py+22:.2f}');label.set('text-anchor','middle');label.set('dominant-baseline','middle')
            owner_layout(root,named)
            # Reserve consistent white space around geometry and labels at the student mobile viewport.
            pad=40;vx,vy=vb[0],vb[1]
            root.set('viewBox',f'{vx-pad:.2f} {vy-pad:.2f} {width+pad*2:.2f} {height+pad*2:.2f}')
            root.set('width',str(int(round(width+pad*2))));root.set('height',str(int(round(height+pad*2))))
            ET.indent(tree,space='  ')
            tree.write(path,encoding='utf-8',xml_declaration=False)
            # Force standard SVG root namespace, because ET writes it on every path.
            summary['assets']+=1
    print(json.dumps(summary,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
