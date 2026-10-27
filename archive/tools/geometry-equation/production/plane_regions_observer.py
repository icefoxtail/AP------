"""Independent observer of filled regions on the FINAL SVG (called by plane-marks-observer-worker.py): no producer geometry or layout imports.
The expected boundary is recomputed from the Cindy peer's points; the drawn <path> must match it vertex by vertex, arc by arc, and every boundary edge
must be drawn by an actual stroke of the final SVG. A hatched region must carry diagonal strokes that stay inside that same even-odd area, and a
region's label must sit inside THAT region and inside no other one."""
import math
import re

REGION_FILLS={'LIGHT':'#e4e7ec','MEDIUM':'#c7ccd5'}
VERTEX_TOLERANCE=0.02   # svg px: a drawn region vertex against the peer point
DRAWN_TOLERANCE=0.6     # svg px: a region edge against the stroke that draws it
LABEL_GAP=10.0          # svg px: the least room between a region's label and any other label
HATCH_TOLERANCE=0.25    # svg px: a hatch stroke against the area it is clipped to
HATCH_PARALLEL=0.5      # degrees: every hatch stroke of one region runs the same way
HATCH_SPACING=0.6       # svg px: consecutive hatch strokes keep one gap
HATCH_MIN_LINES=3       # fewer drawn strokes than this is not a hatch, it is a stray mark
HATCH_COVERAGE=0.5      # the hatch must cover at least this share of the region's extent along its normal

def tag(node):return node.tag.split('}')[-1]
def sub(p,q):return (p[0]-q[0],p[1]-q[1])
def norm(v):return math.hypot(v[0],v[1])
def point_segment_distance(p,a,b):
    d=sub(b,a);length2=d[0]*d[0]+d[1]*d[1]
    if length2<=1e-18:return norm(sub(p,a))
    t=max(0.0,min(1.0,((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/length2))
    return norm(sub(p,(a[0]+t*d[0],a[1]+t*d[1])))
def line_distance(p,a,b):
    length=norm(sub(b,a))
    return abs((p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0]))/length if length>1e-12 else math.inf

def expand_region(row,peer):
    """Region loops from the peer's points alone: [{'start': (x,y), 'edges': [{'a': id, 'b': id, 'pa': (x,y), 'pb': (x,y), 'arc': None | {'center': (x,y), 'ccw': bool}}]}],
    shapes first and then holes. A whole circle is two half arcs through the antipode of its start point."""
    def arc_of(a,b,spec):
        c=peer[spec['center']];pa,pb=peer[a],peer[b]
        ccw=(math.atan2(pb[1]-c[1],pb[0]-c[0])-math.atan2(pa[1]-c[1],pa[0]-c[0]))%(2*math.pi)
        side=spec.get('side','MINOR')
        if side in ('CCW','CW'):return {'center':c,'ccw':side=='CCW'}
        if abs(ccw-math.pi)<1e-9:raise ValueError('REGION_ARC_SIDE_AMBIGUOUS:'+row['id'])
        return {'center':c,'ccw':(side=='MAJOR')!=(ccw<math.pi)}
    def edge(a,b,spec):
        if spec is not None and spec.get('side')=='FULL':
            c=peer[spec['center']];anti=(2*c[0]-peer[a][0],2*c[1]-peer[a][1]);half={'center':c,'ccw':True}
            return [{'a':a,'b':a+'~','pa':peer[a],'pb':anti,'arc':half},{'a':a+'~','b':a,'pa':anti,'pb':peer[a],'arc':half}]
        return [{'a':a,'b':b,'pa':peer[a],'pb':peer[b],'arc':arc_of(a,b,spec) if spec else None}]
    def loop_of(shape):
        if 'polygon' in shape:
            ids=shape['polygon'];edges=[e for i in range(len(ids)) for e in edge(ids[i],ids[(i+1)%len(ids)],None)];return {'start':peer[ids[0]],'edges':edges}
        if 'sector' in shape:
            v=shape['sector'];return {'start':peer[v['center']],'edges':[*edge(v['center'],v['from'],None),*edge(v['from'],v['to'],v),*edge(v['to'],v['center'],None)]}
        if 'segment' in shape:
            v=shape['segment'];return {'start':peer[v['from']],'edges':[*edge(v['from'],v['to'],v),*edge(v['to'],v['from'],None)]}
        loop=shape['loop'];edges=[];current=loop['start']
        for step in loop['steps']:
            edges.extend(edge(current,step['to'],step.get('arc')));current=step['to']
        return {'start':peer[loop['start']],'edges':edges}
    return [loop_of(shape) for shape in [*row.get('shapes',[]),*row.get('holes',[])]]

def parse_path(d):
    """'M x y L x y A r r rot large sweep x y Z' -> [{'start': (x,y), 'edges': [('L', (x,y)) | ('A', (x,y), r, large, sweep)]}]."""
    tokens=re.findall(r'[MLAZ]|-?\d*\.?\d+(?:[eE][-+]?\d+)?',d);subpaths=[];i=0
    while i<len(tokens):
        t=tokens[i]
        if t=='M':subpaths.append({'start':(float(tokens[i+1]),float(tokens[i+2])),'edges':[]});i+=3
        elif t=='L':subpaths[-1]['edges'].append(('L',(float(tokens[i+1]),float(tokens[i+2]))));i+=3
        elif t=='A':
            rx,ry,rot,large,sweep,x,y=[float(v) for v in tokens[i+1:i+8]]
            if abs(rx-ry)>1e-6 or rot!=0:raise ValueError('REGION_PATH_UNSUPPORTED')
            subpaths[-1]['edges'].append(('A',(x,y),rx,int(large),int(sweep)));i+=8
        elif t=='Z':i+=1
        else:raise ValueError('REGION_PATH_UNSUPPORTED')
    return subpaths

def svg_arc_center(p0,p1,r,large,sweep):
    """Centre of the SVG arc (endpoint parameterisation, no rotation) or None when the radius cannot span the chord."""
    x1p,y1p=(p0[0]-p1[0])/2,(p0[1]-p1[1])/2;d2=x1p*x1p+y1p*y1p
    if d2<=1e-18 or d2>r*r*(1+1e-9):return None
    coef=math.sqrt(max(0.0,(r*r-d2)/d2))*(1 if large!=sweep else -1)
    return (coef*y1p+(p0[0]+p1[0])/2,-coef*x1p+(p0[1]+p1[1])/2)

def locate(p,poly,eps=1e-6):
    """1 inside, 0 on the boundary, -1 outside."""
    inside=False
    for i in range(len(poly)):
        a,b=poly[i],poly[(i+1)%len(poly)]
        if point_segment_distance(p,a,b)<=eps:return 0
        if (a[1]>p[1])!=(b[1]>p[1]) and p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]:inside=not inside
    return 1 if inside else -1

def area_state(point,polygons,eps=1e-6):
    """1 strictly inside the region's even-odd area, 0 on one of its boundaries, -1 outside."""
    inside=False;on_edge=False
    for poly in polygons:
        state=locate(point,poly,eps)
        if state==0:on_edge=True
        elif state==1:inside=not inside
    return 0 if on_edge else (1 if inside else -1)

def peer_ids(row):
    ids=set()
    for shape in [*row.get('shapes',[]),*row.get('holes',[])]:
        for key,value in shape.items():
            if key=='polygon':ids.update(value)
            elif key in ('sector','segment'):ids.update((value['center'],value['from'],value['to']))
            else:
                ids.add(value['start'])
                for step in value['steps']:
                    ids.add(step['to'])
                    if step.get('arc'):ids.add(step['arc']['center'])
    return ids

def audit_hatch(record,hatch_nodes,order,errors,observations):
    """A hatched region: its diagonal strokes must be a real hatch of THIS region, clipped to the same even-odd area."""
    oid=record['oid'];polygons=record['polygons']
    spans=[]
    for node in hatch_nodes:
        try:spans.append(((float(node.get('x1')),float(node.get('y1'))),(float(node.get('x2')),float(node.get('y2')))))
        except (TypeError,ValueError):errors.append('REGION_HATCH_MISSING:'+oid);return
    if len(spans)<HATCH_MIN_LINES:errors.append('REGION_HATCH_MISSING:'+oid);return
    if any(node.get('stroke-dasharray') for node in hatch_nodes):errors.append('REGION_HATCH_DASHED:'+oid)
    outside=False
    for a,b in spans:
        for point in (a,((a[0]+b[0])/2,(a[1]+b[1])/2),b):
            if area_state(point,polygons,HATCH_TOLERANCE)<0:outside=True;break
        if outside:break
    if outside:errors.append('REGION_HATCH_OUTSIDE:'+oid)
    angles=[math.degrees(math.atan2(b[1]-a[1],b[0]-a[0]))%180.0 for a,b in spans]
    if max(angles)-min(angles)>HATCH_PARALLEL:errors.append('REGION_HATCH_UNEVEN:'+oid)
    else:
        theta=math.radians(sum(angles)/len(angles));nx,ny=-math.sin(theta),math.cos(theta)
        centres=sorted(nx*(a[0]+b[0])/2+ny*(a[1]+b[1])/2 for a,b in spans)
        gaps=[hi-lo for lo,hi in zip(centres,centres[1:]) if hi-lo>1e-6]
        if gaps and max(gaps)-min(gaps)>HATCH_SPACING:errors.append('REGION_HATCH_UNEVEN:'+oid)
        edge=[nx*x+ny*y for poly in polygons for x,y in poly]
        extent=max(edge)-min(edge)
        if extent>1e-6 and centres[-1]-centres[0]<HATCH_COVERAGE*extent:errors.append('REGION_HATCH_TOO_SPARSE:'+oid)
    if any(order[id(node)]<order[id(record['node'])] for node in hatch_nodes):errors.append('REGION_HATCH_COVERED_BY_FILL:'+oid)
    observations.append({'id':oid,'type':'REGION_HATCH','strokes':len(spans),'angleDegrees':max(angles)-min(angles)})

def audit_regions(root,marks,peer_point,forward,by_mark,label_clear,errors,observations,label_boxes=None):
    label_boxes=label_boxes or {}
    rows=marks.get('regions',[])
    if not rows:return
    elements=list(root.iter());order={id(n):i for i,n in enumerate(elements)}
    stroke_lines=[((float(n.get('x1')),float(n.get('y1'))),(float(n.get('x2')),float(n.get('y2')))) for n in elements if tag(n)=='line' and n.get('data-role') in {'line','segment'}]
    stroke_circles=[(float(n.get('cx')),float(n.get('cy')),float(n.get('r'))) for n in elements if tag(n)=='circle' and n.get('data-role')=='circle']
    stroke_arcs=[]
    hatch_by_id={}
    for n in elements:
        if tag(n)=='polyline' and n.get('data-role')=='circularArc':
            raw=[float(v) for part in n.get('points','').split() for v in part.split(',')];stroke_arcs.append([(raw[i],raw[i+1]) for i in range(0,len(raw)-1,2)])
        elif tag(n)=='line' and n.get('data-mark')=='region-hatch':
            hatch_by_id.setdefault(n.get('data-mark-id'),[]).append(n)
    records=[]
    for row in rows:
        oid=row['id'];nodes=by_mark.get(('region',oid),[])
        if len(nodes)!=1 or tag(nodes[0])!='path':errors.append('REGION_MISSING:'+oid);continue
        node=nodes[0];record={'row':row,'oid':oid,'node':node,'polygons':[],'ok':False}
        records.append(record)
        try:expected=expand_region(row,{pid:peer_point(pid) for pid in peer_ids(row)})
        except (ValueError,KeyError) as error:errors.append(str(error));continue
        if node.get('fill','').lower()!=REGION_FILLS.get(row.get('fill','LIGHT'),'?'):errors.append('REGION_FILL_MISMATCH:'+oid)
        if node.get('fill-rule')!='evenodd':errors.append('REGION_FILL_RULE_MISMATCH:'+oid)
        if node.get('stroke') not in (None,'none'):errors.append('REGION_STROKE_PRESENT:'+oid)
        try:drawn=parse_path(node.get('d',''))
        except (ValueError,IndexError):errors.append('REGION_PATH_UNREADABLE:'+oid);continue
        if len(drawn)!=len(expected):errors.append('REGION_LOOP_COUNT_MISMATCH:'+oid);continue
        polygons=[];ok=True
        for loop,sub_path in zip(expected,drawn):
            if len(sub_path['edges'])!=len(loop['edges']):errors.append('REGION_LOOP_EDGE_COUNT_MISMATCH:'+oid);ok=False;continue
            if norm(sub(sub_path['start'],forward(loop['start'])))>VERTEX_TOLERANCE:errors.append('REGION_VERTEX_MISMATCH:'+oid+':'+loop['edges'][0]['a']);ok=False
            current=sub_path['start'];poly=[current]
            for item,edge in zip(loop['edges'],sub_path['edges']):
                a,b,arc=item['a'],item['b'],item['arc']
                if norm(sub(edge[1],forward(item['pb'])))>VERTEX_TOLERANCE:errors.append('REGION_VERTEX_MISMATCH:'+oid+':'+b);ok=False
                if arc is None:
                    if edge[0]!='L':errors.append('REGION_EDGE_KIND_MISMATCH:'+oid+':'+a+'-'+b);ok=False
                    poly.append(edge[1])
                elif edge[0]!='A':
                    errors.append('REGION_EDGE_KIND_MISMATCH:'+oid+':'+a+'-'+b);ok=False;poly.append(edge[1])
                else:
                    centre_expected=forward(arc['center']);radius=norm(sub(centre_expected,forward(item['pa'])))
                    if abs(edge[2]-radius)>max(1e-3,1e-6*radius):errors.append('REGION_ARC_RADIUS_MISMATCH:'+oid+':'+a+'-'+b);ok=False
                    centre=svg_arc_center(current,edge[1],edge[2],edge[3],edge[4])
                    pa,pb,pc=item['pa'],item['pb'],arc['center']
                    ccw_angle=(math.atan2(pb[1]-pc[1],pb[0]-pc[0])-math.atan2(pa[1]-pc[1],pa[0]-pc[0]))%(2*math.pi)
                    angle=ccw_angle if arc['ccw'] else 2*math.pi-ccw_angle
                    # in svg px the y axis points down: a counter-clockwise arc of the figure has sweep flag 0
                    want_sweep=0 if arc['ccw'] else 1;want_large=1 if angle>math.pi+1e-9 else 0
                    if centre is None or norm(sub(centre,centre_expected))>VERTEX_TOLERANCE or edge[4]!=want_sweep or (edge[3]!=want_large and abs(angle-math.pi)>1e-6):
                        errors.append('REGION_ARC_SIDE_MISMATCH:'+oid+':'+a+'-'+b);ok=False
                    if centre is not None:
                        start_angle=math.atan2(current[1]-centre[1],current[0]-centre[0]);sign=1 if edge[4]==1 else -1
                        total=(sign*(math.atan2(edge[1][1]-centre[1],edge[1][0]-centre[0])-start_angle))%(2*math.pi)
                        count=max(8,math.ceil(math.degrees(total)/2))
                        for k in range(1,count):
                            t=start_angle+sign*total*k/count;poly.append((centre[0]+edge[2]*math.cos(t),centre[1]+edge[2]*math.sin(t)))
                    poly.append(edge[1])
                current=edge[1]
            poly.pop();polygons.append(poly)
        record['polygons']=polygons;record['ok']=ok
        if not ok:continue
        # every boundary edge is drawn by an actual stroke of the final SVG
        for loop in expected:
            for item in loop['edges']:
                a,b,arc=item['a'],item['b'],item['arc']
                A,B=forward(item['pa']),forward(item['pb'])
                if arc is None:
                    length=norm(sub(B,A));unit=((B[0]-A[0])/length,(B[1]-A[1])/length);spans=[]
                    for P,Q in stroke_lines:
                        if line_distance(A,P,Q)>DRAWN_TOLERANCE or line_distance(B,P,Q)>DRAWN_TOLERANCE:continue
                        t=lambda pt:((pt[0]-A[0])*unit[0]+(pt[1]-A[1])*unit[1])/length
                        spans.append((min(t(P),t(Q)),max(t(P),t(Q))))
                    spans.sort();reach=0.0
                    for lo,hi in spans:
                        if lo>reach+DRAWN_TOLERANCE/length:break
                        reach=max(reach,hi)
                    if reach<1-DRAWN_TOLERANCE/length:errors.append('REGION_BOUNDARY_NOT_DRAWN:'+oid+':'+a+'-'+b)
                else:
                    C=forward(arc['center']);radius=norm(sub(A,C))
                    if any(norm(sub((cx,cy),C))<=DRAWN_TOLERANCE and abs(r-radius)<=DRAWN_TOLERANCE for cx,cy,r in stroke_circles):continue
                    # a drawn arc stroke spanning the region's arc (both ends and the middle)
                    sign=-1 if arc['ccw'] else 1   # svg angles run the other way round
                    a0=math.atan2(A[1]-C[1],A[0]-C[0]);total=(sign*(math.atan2(B[1]-C[1],B[0]-C[0])-a0))%(2*math.pi) or 2*math.pi
                    probes=[A,B,(C[0]+radius*math.cos(a0+sign*total/2),C[1]+radius*math.sin(a0+sign*total/2))]
                    covered=False
                    for pts in stroke_arcs:
                        if any(abs(norm(sub(q,C))-radius)>DRAWN_TOLERANCE for q in pts):continue
                        if all(min(norm(sub(probe,q)) for q in pts)<=max(DRAWN_TOLERANCE,radius*math.radians(1.6)) for probe in probes):covered=True;break
                    if not covered:errors.append('REGION_BOUNDARY_NOT_DRAWN:'+oid+':'+a+'-'+b)
        # beneath every stroke and label in the document
        mine=order[id(node)]
        if any(order[id(n)]<mine and n.get('data-mark')!='region-hatch' and (tag(n) in {'line','circle','polyline','polygon'} or (tag(n)=='path' and n.get('data-mark')!='region') or (tag(n)=='g' and n.get('data-fragment-sha'))) for n in elements):
            errors.append('REGION_NOT_BENEATH_STROKES:'+oid)
        if row.get('pattern')=='HATCH':audit_hatch(record,hatch_by_id.get(oid,[]),order,errors,observations)
        observations.append({'id':oid,'type':'REGION','loops':len(polygons),'pattern':row.get('pattern'),'labelKind':row.get('labelKind','MATH'),
                             'areaPx2':sum(abs(0.5*sum(p[0]*q[1]-q[0]*p[1] for p,q in zip(poly,poly[1:]+poly[:1]))) for poly in polygons)})
    # ---- labels: a region's label belongs to THAT region and to no other one
    for record in records:
        row=record['row'];oid=record['oid'];box=label_clear(oid+'-label') if row.get('label') is not None else None
        if row.get('label') is None:continue
        if box is None:continue
        corners=[(box[0],box[1]),(box[0]+box[2],box[1]),(box[0]+box[2],box[1]+box[3]),(box[0],box[1]+box[3])]
        centre=(box[0]+box[2]/2,box[1]+box[3]/2)
        if record['ok'] and not all(area_state(corner,record['polygons'])==1 for corner in corners):errors.append('REGION_LABEL_OUTSIDE:'+oid)
        if record['ok']:
            for other in records:
                if other is record or not other['ok']:continue
                if any(area_state(point,other['polygons'])==1 for point in [*corners,centre]):
                    errors.append('REGION_LABEL_IN_OTHER_REGION:'+oid+':'+other['oid']);break
        # a region's own label must not sit right beside another label (a length or an angle): it would read as one text
        for other,obox in label_boxes.items():
            if other==oid+'-label':continue
            gap_x=max(obox[0]-(box[0]+box[2]),box[0]-(obox[0]+obox[2]),0.0);gap_y=max(obox[1]-(box[1]+box[3]),box[1]-(obox[1]+obox[3]),0.0)
            if math.hypot(gap_x,gap_y)<LABEL_GAP:errors.append('REGION_LABEL_CROWDS_LABEL:'+oid+':'+other)
