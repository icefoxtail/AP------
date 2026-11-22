"""Independent observer of filled regions on the FINAL SVG (called by plane-marks-observer-worker.py): no producer geometry or layout imports.
The expected boundary is recomputed from the Cindy peer's points; the drawn <path> must match it vertex by vertex, arc by arc, and every boundary edge
must be drawn by an actual stroke of the final SVG. A hatched region must carry diagonal strokes that stay inside that same even-odd area, and a
region's label must sit inside THAT region and inside no other one."""
import math
import re

REGION_FILLS={'LIGHT':'#e4e7ec','MEDIUM':'#c7ccd5'}
# the colour-group tints (C1): this observer's own copy of the table (fill colour, fill-opacity); tests/test_palette_c1.py ties it to the engine's
PALETTE_FILLS={'BLUE':('#7fa6e8',0.32),'WARM':('#f2a65a',0.42),'GREEN':('#6fcf97',0.42),'ROSE':('#e98aa8',0.42),'VIOLET':('#a78bdb',0.42)}
EQUAL_AREA_TOLERANCE=1e-6   # relative: the areas of one equalAreas group, recomputed from the peer points
VERTEX_TOLERANCE=0.02   # svg px: a drawn region vertex against the peer point
DRAWN_TOLERANCE=0.6     # svg px: a region edge against the stroke that draws it
LABEL_GAP=10.0          # svg px: the least room between a region's label and any other label
HATCH_TOLERANCE=0.25    # svg px: a hatch stroke against the area it is clipped to
HATCH_PARALLEL=0.5      # degrees: every hatch stroke of one region runs the same way
HATCH_SPACING=0.6       # svg px: consecutive hatch strokes keep one gap
HATCH_MIN_LINES=3       # fewer drawn strokes than this is not a hatch, it is a stray mark
HATCH_COVERAGE=0.5      # the hatch must cover at least this share of the region's extent along its normal

LEADER_BOUNDARY_TOLERANCE=1.5   # svg px: a region label's leader starts on the region's boundary (the dense outline of an arc lies a hair inside the true circle)
LEADER_PROBE=3.0                # svg px: just beyond the start the leader is already outside its own region
LEADER_DOT_CLEAR=8.0            # svg px: the dot a region value's leader starts on stands at least this far inside its region's boundary (the engine keeps 9; a hair of slack for the dense arc outline)
LEADER_DOT_STROKE=5.0           # svg px: and at least this far from every drawn stroke (the engine keeps 7)
LEADER_DOT_RADIUS=(1.5,3.5)     # svg px: the dot's radius
LEADER_SIDE_SPAN=(0.05,0.95)    # the stretch of a drawn side beside which a value label reads as the side's length (not the region's value); past its ends it does not
LEADER_SIDE_NEAR=48.0           # svg px: 'right beside' = the label box within this of the side
REGION_LABEL_AT_SLACK=26.0      # svg px: a label placed at labelAt stands within this distance of it (the engine looks within 24 px)
REGION_WEIGHT_STROKE_EM=0.06    # a plain-text name/value label is drawn with this outline stroke (em), the weight of a math label (this observer's own copy)
REGION_UNIT_POWERS={'2':'\u00b2','3':'\u00b3'}

def named_value_drawn(row,node):
    """True when the plan gives the value a name or an area / volume unit AND the drawn label really carries that text (read from the group): then it reads as the region's value beside any boundary.
    A bare number, a length unit (cm, m) or a letter value does not; neither does a label whose name or unit was left out of the drawing."""
    expected=region_label_text(row)
    if expected is None or node is None or node.get('data-text')!=expected:return False
    powered=re.fullmatch(r'[A-Za-z]+\^[23]',str(row.get('unit','')))is not None
    name=row.get('labelName')
    # a name alone: not one of a segment or arc (two capitals, AB=6\u03c0) or a length letter (l=6), which read as lengths
    named=isinstance(name,str) and name.strip()!='' and re.fullmatch(r'[A-Z]{2}|[a-z]',name.strip()) is None
    return named or powered

def region_label_text(row):
    """The exact text of a name/unit region label as the plan says it (name=value+unit), or None for a plain region label. Written here from the declared rule."""
    if row.get('labelName') is None and row.get('unit') is None:return None
    value=row.get('label')
    if not isinstance(value,str) or not value.strip() or not re.fullmatch(r'[0-9A-Za-z+\-*().,\s\u03c0]{1,24}',value):return None
    text=re.sub(r'\s+',' ',value.strip().replace('pi','\u03c0').replace('-','\u2212').replace('*','\u00d7'))
    unit=''
    if row.get('unit') is not None:
        m=re.fullmatch(r'([A-Za-z]+)(?:\^([23]))?',str(row['unit']))
        if m is None:return None
        unit=m.group(1)+(REGION_UNIT_POWERS[m.group(2)] if m.group(2) else '')
    return (row['labelName']+'=' if row.get('labelName') is not None else '')+text+(((' ' if re.search(r'[A-Za-z\u03c0]$',text) else '')+unit) if unit else '')

def audit_named_label(node,oid,expected,errors):
    """A name/unit region label is plain text (outlines, no math glyphs) whose group keeps its text; its outline carries the weight stroke of a math label."""
    if node is None:return
    if any(tag(n)=='path' and n.get('data-c') for n in node.iter()) or node.get('data-tex') is not None:errors.append('LABEL_KIND_MISMATCH:'+oid+'-label')
    if node.get('data-text')!=expected:errors.append('LABEL_TEXT_MISMATCH:'+oid+'-label')
    try:font=float(node.get('data-font-px'))
    except (TypeError,ValueError):font=None
    paths=[n for n in node.iter() if tag(n)=='path']
    if font is not None and paths and any(abs(float(n.get('stroke-width','0'))-font*REGION_WEIGHT_STROKE_EM)>0.01 or n.get('stroke')!='#111' for n in paths):errors.append('LABEL_WEIGHT_MISMATCH:'+oid+'-label')

def properly_cross(a,b,c,d):
    """True when the segments a-b and c-d cross at a point inside both (touching at an end does not count)."""
    u=(b[0]-a[0],b[1]-a[1]);v=(d[0]-c[0],d[1]-c[1]);w=(c[0]-a[0],c[1]-a[1])
    determinant=u[0]*v[1]-u[1]*v[0]
    if abs(determinant)<1e-9:return False
    t=(w[0]*v[1]-w[1]*v[0])/determinant;s=(w[0]*u[1]-w[1]*u[0])/determinant
    return 1e-6<t<1-1e-6 and 1e-6<s<1-1e-6
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

def planned_fill(name):
    """(colour, opacity) a region of this fill name is drawn with: the opaque gray of LIGHT / MEDIUM has no opacity, a palette colour carries its fill-opacity."""
    if name in PALETTE_FILLS:return PALETTE_FILLS[name]
    return (REGION_FILLS.get(name,'?'),None)

def drawn_fill(node):
    try:opacity=None if node.get('fill-opacity') is None else round(float(node.get('fill-opacity')),6)
    except ValueError:opacity=-1.0
    return (node.get('fill','').lower(),opacity)

def loop_area(loop):
    """Signed area of one expanded region loop by Green's theorem (no sampling): a straight edge adds (x1*y2-x2*y1)/2, a circular arc of centre c and radius r
    with signed sweep f from angle a0 adds (r*(cx*(sin a1-sin a0)-cy*(cos a1-cos a0))+r*r*f)/2, a1=a0+f. Written here from the formula, not from the producer."""
    total=0.0
    for edge in loop['edges']:
        p,q,arc=edge['pa'],edge['pb'],edge['arc']
        if arc is None:total+=(p[0]*q[1]-q[0]*p[1])/2;continue
        c=arc['center'];r=norm(sub(p,c));a0=math.atan2(p[1]-c[1],p[0]-c[0])
        ccw=(math.atan2(q[1]-c[1],q[0]-c[0])-a0)%(2*math.pi)
        f=ccw if arc['ccw'] else -(2*math.pi-ccw);a1=a0+f
        total+=(r*(c[0]*(math.sin(a1)-math.sin(a0))-c[1]*(math.cos(a1)-math.cos(a0)))+r*r*f)/2
    return total

def region_area(row,peer_point):
    """Area the even-odd fill colours: the shapes' areas minus the holes' areas, from the peer points."""
    loops=expand_region(row,{pid:peer_point(pid) for pid in peer_ids(row)})
    shapes=len(row.get('shapes',[]))
    return sum((1 if index<shapes else -1)*abs(loop_area(loop)) for index,loop in enumerate(loops))

def exact_text(value):
    """The exact form of an area (SymPy nsimplify, with pi allowed) when one is found, else None."""
    try:
        import sympy
        return str(sympy.nsimplify(value,[sympy.pi],tolerance=1e-9,rational=False))
    except Exception:return None

def audit_equal_areas(root,marks,peer_point,by_mark,errors,observations):
    """planeMarks.equalAreas: the regions of a group have the same area (recomputed here from the peer points) and are drawn in one palette colour that no region
    outside the group uses (read from the final SVG, not from the plan)."""
    groups=marks.get('equalAreas')
    if groups is None:return
    rows={r['id']:r for r in marks.get('regions',[]) if isinstance(r,dict) and 'id' in r}
    if not isinstance(groups,list) or not groups:errors.append('REGION_EQUAL_AREA_INVALID:equalAreas');return
    drawn={}
    for oid in rows:
        nodes=by_mark.get(('region',oid),[])
        if len(nodes)==1 and tag(nodes[0])=='path':drawn[oid]=drawn_fill(nodes[0])
    palette_tints=set(PALETTE_FILLS.values());member_of={}
    for index,group in enumerate(groups):
        if not isinstance(group,list) or len(group)<2:errors.append('REGION_EQUAL_AREA_INVALID:equalAreas.'+str(index));continue
        unknown=[i for i in group if i not in rows]
        if unknown:errors.append('REGION_EQUAL_AREA_UNKNOWN_REGION:'+str(unknown[0]));continue
        for oid in group:
            if oid in member_of:errors.append('REGION_COLOR_GROUP_AMBIGUOUS:'+oid)
            member_of[oid]=index
        try:areas=[region_area(rows[oid],peer_point) for oid in group]
        except (ValueError,KeyError) as error:errors.append(str(error));continue
        if any(abs(a-areas[0])>EQUAL_AREA_TOLERANCE*max(abs(a),abs(areas[0]),1e-12) for a in areas):errors.append('REGION_EQUAL_AREA_MISMATCH:'+'&'.join(group)+':'+','.join('%.6f'%a for a in areas))
        fills=[drawn.get(oid) for oid in group]
        if any(f is None for f in fills) or any(f!=fills[0] for f in fills) or fills[0] not in palette_tints:errors.append('REGION_EQUAL_AREA_COLOR_MISMATCH:'+'&'.join(group))
        observations.append({'id':'equalAreas.'+str(index),'type':'EQUAL_AREA','regions':list(group),'area':areas[0],'exact':exact_text(areas[0])})
    for oid,fill in drawn.items():
        if fill not in palette_tints:continue
        for other,index in member_of.items():
            if other!=oid and drawn.get(other)==fill and member_of.get(oid)!=index:errors.append('REGION_COLOR_GROUP_AMBIGUOUS:'+oid+'&'+other)

def drawn_boundaries(root):
    """[(id, points)] every drawn boundary of the final SVG as ONE polyline: a straight line, an arc or curve (their polyline), a circle (its ring)."""
    found=[]
    for n in root.iter():
        role=n.get('data-role');t=tag(n)
        try:
            if t=='line' and role=='line':found.append((n.get('id'),[(float(n.get('x1')),float(n.get('y1'))),(float(n.get('x2')),float(n.get('y2')))]))
            elif t=='polyline' and role in {'circularArc','curve'}:
                raw=[float(v) for part in n.get('points','').split() for v in part.split(',')]
                found.append((n.get('id'),[(raw[k],raw[k+1]) for k in range(0,len(raw)-1,2)]))
            elif t=='circle' and role=='circle':
                cx,cy,r=float(n.get('cx')),float(n.get('cy')),float(n.get('r'))
                found.append((n.get('id'),[(cx+r*math.cos(k*math.pi/36),cy+r*math.sin(k*math.pi/36)) for k in range(73)]))
        except (TypeError,ValueError):continue
    return [(sid,pts) for sid,pts in found if len(pts)>=2]

LEADER_STRETCH_TOLERANCE=2.5      # svg px: a point of a drawn circle or curve lies on the region's boundary when it is this near it

def closed_whole(points,polygons):
    """True when a drawn closed curve (a circle's ring) is this region's boundary all round (a disk): no ends, so only the distance to it counts."""
    if len(points)<=3 or norm(sub(points[0],points[-1]))>=1e-6:return False
    edges=[(poly[i],poly[(i+1)%len(poly)]) for poly in polygons for i in range(len(poly))]
    return bool(edges) and all(min(point_segment_distance(p,a,b) for a,b in edges)<=LEADER_STRETCH_TOLERANCE for p in points[:-1])

def region_stretch(points,at,polygons):
    """Of a drawn circle or curve, only the stretch that is THIS region's boundary and holds the point `at` (a sector's arc out of the whole circle): a closed circle has no ends, so measured whole,
    every place beside it would lie within 5-95 % of it. A straight 2-point side stays whole."""
    if len(points)<=2:return points
    edges=[(poly[i],poly[(i+1)%len(poly)]) for poly in polygons for i in range(len(poly))]
    if not edges:return points
    closed=norm(sub(points[0],points[-1]))<1e-6
    ring=points[:-1] if closed else list(points);n=len(ring)
    on=[min(point_segment_distance(p,a,b) for a,b in edges)<=LEADER_STRETCH_TOLERANCE for p in ring]
    if not any(on):return points
    near=min((k for k in range(n) if on[k]),key=lambda k:norm(sub(ring[k],at)))
    start=end=near
    while on[(start-1)%n] and (start-1)%n!=end and (closed or start-1>=0):start=(start-1)%n
    while on[(end+1)%n] and (end+1)%n!=start and (closed or end+1<n):end=(end+1)%n
    run=[ring[start]];k=start
    while k!=end:
        k=(k+1)%n;run.append(ring[k])
    return run if len(run)>=2 else [ring[near],ring[(near+1)%n] if closed or near+1<n else ring[near-1]]

def boundary_position(points,p):
    """(fraction of the boundary's length at its point nearest to p, that distance)."""
    total=sum(norm(sub(b,a)) for a,b in zip(points,points[1:]))
    if total<1e-9:return 0.0,norm(sub(p,points[0]))
    best=(float('inf'),0.0);run=0.0
    for a,b in zip(points,points[1:]):
        length=norm(sub(b,a))
        if length>1e-12:
            u=max(0.0,min(1.0,((p[0]-a[0])*(b[0]-a[0])+(p[1]-a[1])*(b[1]-a[1]))/(length*length)))
            d=norm((p[0]-a[0]-u*(b[0]-a[0]),p[1]-a[1]-u*(b[1]-a[1])))
            if d<best[0]:best=(d,run+u*length)
        run+=length
    return best[1]/total,best[0]

LEADER_CIRCLE_TOUCH=1.5          # svg px: a circle touching the region's boundary (an incircle) still lies inside it; a region whose boundary follows the circle all round is that circle

def circles_inside(root,polygons):
    """[(cx,cy,r)] the drawn circles (final SVG) that lie wholly inside this region and are not the region itself: a value or dot standing inside one reads as that circle's area."""
    edges=[(poly[i],poly[(i+1)%len(poly)]) for poly in polygons for i in range(len(poly))]
    found=[]
    for n in root.iter():
        if tag(n)!='circle' or n.get('data-role')!='circle':continue
        try:cx,cy,r=float(n.get('cx')),float(n.get('cy')),float(n.get('r'))
        except (TypeError,ValueError):continue
        if r<=0 or not edges or area_state((cx,cy),polygons)!=1:continue
        if min(point_segment_distance((cx,cy),a,b) for a,b in edges)<r-LEADER_CIRCLE_TOUCH:continue
        ring=[(cx+r*math.cos(k*math.pi/18),cy+r*math.sin(k*math.pi/18)) for k in range(36)]
        if sum(1 for q in ring if min(point_segment_distance(q,a,b) for a,b in edges)<=LEADER_CIRCLE_TOUCH)>=0.9*len(ring):continue
        found.append((cx,cy,r))
    return found

def audit_regions(root,marks,peer_point,forward,by_mark,label_clear,errors,observations,label_boxes=None,leaders=None,leader_ok=None,strokes=None):
    label_boxes=label_boxes or {}
    rows=marks.get('regions',[])
    audit_equal_areas(root,marks,peer_point,by_mark,errors,observations)
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
        if drawn_fill(node)!=planned_fill(row.get('fill','LIGHT')):errors.append('REGION_FILL_MISMATCH:'+oid)
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
    by_id={n.get('id'):n for n in elements if n.get('id')}
    for record in records:
        row=record['row'];oid=record['oid'];box=label_clear(oid+'-label') if row.get('label') is not None else None
        if row.get('label') is None:continue
        if box is None:continue
        corners=[(box[0],box[1]),(box[0]+box[2],box[1]),(box[0]+box[2],box[1]+box[3]),(box[0],box[1]+box[3])]
        centre=(box[0]+box[2]/2,box[1]+box[3]/2)
        probes=[(box[0]+box[2]*i/4,box[1]+box[3]*j/2) for i in range(5) for j in range(3)]
        placement=row.get('labelPlacement','AUTO')
        leader=(leaders or {}).get(oid+'-label')
        # name / unit labels (E32): one plain-text label whose exact text, kind and weight are recomputed here from the plan
        expected=region_label_text(row)
        if expected is None and row.get('labelWeight')=='MATH' and row.get('labelKind')=='TEXT':expected=str(row.get('label'))    # a plain-text region name drawn in the weight of the math labels
        if expected is not None:audit_named_label(by_id.get(oid+'-label'),oid,expected,errors)
        if placement=='LEADER' and leader is None and not (record['ok'] and all(area_state(corner,record['polygons'])==1 for corner in corners)):errors.append('REGION_LABEL_LEADER_MISSING:'+oid)
        elif placement=='AUTO' and leader is not None:errors.append('REGION_LABEL_LEADER_UNEXPECTED:'+oid)
        if leader is not None and record['ok']:
            # the label stands outside every region; its leader starts on this region's boundary and runs away from it, never entering a region or crossing a stroke
            if any(area_state(point,other['polygons'])==1 for other in records if other['ok'] for point in probes):errors.append('REGION_LABEL_NOT_OUTSIDE:'+oid)
            a=(float(leader.get('x1')),float(leader.get('y1')));b=(float(leader.get('x2')),float(leader.get('y2')));length=norm(sub(b,a))
            boundary=lambda q:min(point_segment_distance(q,poly[i],poly[(i+1)%len(poly)]) for poly in record['polygons'] for i in range(len(poly)))<=LEADER_BOUNDARY_TOLERANCE
            # the value's leader starts on a dot INSIDE this region (a leader from the boundary reads as the length of the side or radius it touches): the dot is drawn, lies well inside
            # this region and in no other one, clear of every stroke; the leader leaves the region once through its boundary and never comes back, enters no other region and
            # crosses no stroke except that boundary where it leaves
            if leader_ok is not None:leader_ok(oid+'-label',box,lambda q:True)
            dot=next((n for n in elements if tag(n)=='circle' and n.get('data-role')=='leader-dot' and n.get('data-owner-label')==oid+'-label'),None)
            try:dot_ok=dot is not None and norm(sub((float(dot.get('cx')),float(dot.get('cy'))),a))<=0.3 and LEADER_DOT_RADIUS[0]<=float(dot.get('r'))<=LEADER_DOT_RADIUS[1]
            except (TypeError,ValueError):dot_ok=False
            if not dot_ok:errors.append('REGION_LEADER_DOT_MISSING:'+oid)
            if area_state(a,record['polygons'],1e-6)!=1:errors.append('REGION_LEADER_NOT_FROM_INSIDE:'+oid)
            else:
                clearance=min(point_segment_distance(a,poly[i],poly[(i+1)%len(poly)]) for poly in record['polygons'] for i in range(len(poly)))
                if clearance<LEADER_DOT_CLEAR:errors.append('REGION_LEADER_START_NEAR_BOUNDARY:'+oid)
            if any(area_state(a,other['polygons'])!=-1 for other in records if other is not record and other['ok']):errors.append('REGION_LEADER_START_IN_OTHER_REGION:'+oid)
            if any(point_segment_distance(a,q0,q1)<LEADER_DOT_STROKE for sid,pts in (strokes or []) for q0,q1 in zip(pts,pts[1:])):errors.append('REGION_LEADER_START_ON_STROKE:'+oid)
            if any(math.dist(a,(cx,cy))<r for cx,cy,r in circles_inside(root,record['polygons'])):errors.append('REGION_LEADER_START_IN_INNER_CIRCLE:'+oid)   # the dot would read as the area of the circle inside the region
            if length>1e-9:
                unit=((b[0]-a[0])/length,(b[1]-a[1])/length)
                steps=max(2,int(length//2));left=False;came_back=False
                for k in range(steps+1):
                    d=length*k/steps
                    point=(a[0]+unit[0]*d,a[1]+unit[1]*d)
                    inside_own=area_state(point,record['polygons'])==1
                    if not inside_own and area_state(point,record['polygons'])==-1:left=True
                    elif inside_own and left:came_back=True
                    if d>=LEADER_PROBE and any(area_state(point,other['polygons'])==1 for other in records if other is not record and other['ok']):errors.append('REGION_LEADER_IN_REGION:'+oid);break
                if not left:errors.append('REGION_LEADER_NOT_LEAVING:'+oid)
                else:
                    # where the leader leaves the region: the drawn side it crosses there must not be the one the label stands beside (middle zone)
                    exit_at=next((p for p in ((a[0]+unit[0]*length*k/steps,a[1]+unit[1]*length*k/steps) for k in range(steps+1)) if area_state(p,record['polygons'])==-1),None)
                    # each WHOLE drawn boundary (a straight side, an arc, a curve, a circle) is one side: its length is what a value beside it reads as
                    for sid,pts in ([] if named_value_drawn(row,by_id.get(oid+'-label')) else drawn_boundaries(root)):
                        if exit_at is None or boundary_position(pts,exit_at)[1]>LEADER_BOUNDARY_TOLERANCE+2.0:continue
                        if closed_whole(pts,record['polygons']):
                            if any(boundary_position(pts,(box[0]+box[2]*i/4,box[1]+box[3]*j/2))[1]<=LEADER_SIDE_NEAR for i in range(5) for j in range(3)):errors.append('REGION_LEADER_READS_AS_SIDE:'+oid+':'+str(sid))
                            continue
                        pts=region_stretch(pts,exit_at,record['polygons'])
                        close=[t for t,d in (boundary_position(pts,(box[0]+box[2]*i/4,box[1]+box[3]*j/2)) for i in range(5) for j in range(3)) if d<=LEADER_SIDE_NEAR]
                        if close and max(close)>LEADER_SIDE_SPAN[0] and min(close)<LEADER_SIDE_SPAN[1]:errors.append('REGION_LEADER_READS_AS_SIDE:'+oid+':'+str(sid))
                if came_back:errors.append('REGION_LEADER_ENTERS_REGION:'+oid)
                for sid,pts in (strokes or []):
                    for q0,q1 in zip(pts,pts[1:]):
                        if not properly_cross(a,b,q0,q1):continue
                        u=sub(b,a);v=sub(q1,q0);den=u[0]*v[1]-u[1]*v[0];w=sub(q0,a);t=(w[0]*v[1]-w[1]*v[0])/den
                        hit=(a[0]+u[0]*t,a[1]+u[1]*t)
                        # the one crossing allowed is the leader leaving this region through its own boundary
                        if not boundary(hit):errors.append('REGION_LEADER_CROSSES:'+oid+':'+str(sid))
            observations.append({'id':oid,'type':'REGION_LABEL_LEADER','lengthPx':length})
        else:
            if record['ok'] and not all(area_state(corner,record['polygons'])==1 for corner in corners):errors.append('REGION_LABEL_OUTSIDE:'+oid)
            if record['ok'] and placement in {'LEADER','AUTO_LEADER'} and any(math.dist(centre,(cx,cy))<r for cx,cy,r in circles_inside(root,record['polygons'])):errors.append('REGION_VALUE_IN_INNER_CIRCLE:'+oid)
            if record['ok']:
                for other in records:
                    if other is record or not other['ok']:continue
                    if any(area_state(point,other['polygons'])==1 for point in [*corners,centre]):
                        errors.append('REGION_LABEL_IN_OTHER_REGION:'+oid+':'+other['oid']);break
            # labelAt (E32): the label stands at the place the plan states
            if row.get('labelAt') is not None:
                try:
                    place=peer_point(row['labelAt']) if isinstance(row['labelAt'],str) else tuple(row['labelAt'])
                    target=forward(place)
                    if norm(sub(centre,target))>REGION_LABEL_AT_SLACK:errors.append('REGION_LABEL_NOT_AT_PLACE:'+oid)
                except (KeyError,TypeError,ValueError):errors.append('REGION_LABEL_AT_INVALID:'+oid)
        # a region's own label must not sit right beside another label (a length or an angle): it would read as one text
        for other,obox in label_boxes.items():
            if other==oid+'-label':continue
            gap_x=max(obox[0]-(box[0]+box[2]),box[0]-(obox[0]+obox[2]),0.0);gap_y=max(obox[1]-(box[1]+box[3]),box[1]-(obox[1]+obox[3]),0.0)
            if math.hypot(gap_x,gap_y)<LABEL_GAP:errors.append('REGION_LABEL_CROWDS_LABEL:'+oid+':'+other)
