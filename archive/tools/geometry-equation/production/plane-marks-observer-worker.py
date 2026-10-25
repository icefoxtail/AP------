"""Independent observer of plane-figure marks on the FINAL SVG: no producer geometry or layout imports.
Every fact is recomputed from the Cindy peer's points (not the engine's) and from the drawn primitives; a mark is only as true as that."""
import hashlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from worker import read_request,VERSION
from plane_regions_observer import audit_regions

ANGLE_TOLERANCE=0.5          # degrees: a drawn angle against its stated value
RAY_TOLERANCE=0.05           # degrees: an arc end against the ray it should start on
PERP_TOLERANCE=1.0           # degrees: a tick against its segment's normal, a tangent against its radius' normal
LENGTH_RELATIVE=1e-6
TICK_LENGTH_PX=11.0
LABEL_CLEARANCE=1.0          # px between a label box and any drawn line or mark

def tag(node):return node.tag.split('}')[-1]
def sub(p,q):return (p[0]-q[0],p[1]-q[1])
def norm(v):return math.hypot(v[0],v[1])
def angle_between(a,v,c):
    u,w=sub(a,v),sub(c,v);nu,nw=norm(u),norm(w)
    if nu<=1e-12 or nw<=1e-12:return None
    return math.degrees(math.acos(max(-1.0,min(1.0,(u[0]*w[0]+u[1]*w[1])/(nu*nw)))))
def direction_degrees(v):return math.degrees(math.atan2(v[1],v[0]))
def wrap180(x):return (x+180.0)%360.0-180.0
def point_segment_distance(p,a,b):
    d=sub(b,a);length2=d[0]*d[0]+d[1]*d[1]
    if length2<=1e-18:return norm(sub(p,a))
    t=max(0.0,min(1.0,((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/length2))
    return norm(sub(p,(a[0]+t*d[0],a[1]+t*d[1])))
def segment_box_hit(a,b,box,pad):
    x0,y0,x1,y1=box[0]-pad,box[1]-pad,box[0]+box[2]+pad,box[1]+box[3]+pad
    dx,dy=b[0]-a[0],b[1]-a[1];low,high=0.0,1.0
    for p,q in ((-dx,a[0]-x0),(dx,x1-a[0]),(-dy,a[1]-y0),(dy,y1-a[1])):
        if p==0:
            if q<0:return False
        else:
            t=q/p
            if p<0:low=max(low,t)
            else:high=min(high,t)
            if low>high:return False
    return True

def audit(p):
    root=ET.fromstring(p['svg']);errors=[];observations=[]
    model=p['transform'];ox,oy,sx,sy=[model[k] for k in ('originX','originY','sx','sy')]
    if not all(math.isfinite(v) for v in (ox,oy,sx,sy)) or min(sx,sy)<=0:raise ValueError('INVALID_FRAME')
    if abs(sx-sy)>1e-9:errors.append('UNEQUAL_GEOMETRY_UNITS')
    inverse=lambda x,y:((x-ox)/sx,(oy-y)/sy)
    forward=lambda q:(ox+q[0]*sx,oy-q[1]*sy)   # model -> svg
    elements={n.get('id'):n for n in root.iter() if n.get('id')}
    peer=p['points'];marks=p.get('marks') or {}
    def peer_point(pid):
        if pid not in peer:raise ValueError('MARK_TARGET_UNKNOWN:'+pid)
        return tuple(peer[pid])
    def poly_model(node):
        raw=[float(v) for part in node.get('points','').split() for v in part.split(',')]
        return [inverse(raw[i],raw[i+1]) for i in range(0,len(raw)-1,2)]
    def line_model(node):return [inverse(float(node.get('x1')),float(node.get('y1'))),inverse(float(node.get('x2')),float(node.get('y2')))]
    def drawn_segment(sid):
        n=elements.get(sid)
        if n is None or tag(n)!='line':errors.append('SEGMENT_MISSING:'+sid);return None
        return line_model(n)
    by_mark={}
    for n in root.iter():
        if n.get('data-mark'):by_mark.setdefault((n.get('data-mark'),n.get('data-mark-id')),[]).append(n)
    declared={('angle',r['id']) for r in marks.get('angles',[])}|{('equal',r['id']) for r in marks.get('equalLengths',[])}|{('parallel',r['id']) for r in marks.get('parallels',[])}|{('arc',r['id']) for r in marks.get('arcs',[]) if r.get('highlight',True)}
    declared|={('arrow',s['id']) for s in p.get('segments',[]) if s.get('arrow')}
    declared|={('region',r['id']) for r in marks.get('regions',[])}
    for key in by_mark:
        if key not in declared:errors.append('UNDECLARED_MARK:'+key[0]+':'+str(key[1]))
    label_boxes={}   # label id -> (x,y,w,h) in svg px
    for n in root.iter():
        if tag(n)=='g' and n.get('data-fragment-sha') and n.get('transform'):
            m=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',n.get('transform'))
            inner=next((c for c in n if tag(c)=='svg'),None)
            if m and inner is not None:label_boxes[n.get('id')]=(float(m.group(1)),float(m.group(2)),float(inner.get('width')),float(inner.get('height')))
    leaders={n.get('data-owner-label'):n for n in root.iter() if tag(n)=='line' and n.get('data-role')=='leader' and n.get('data-owner-label')}
    # every drawn stroke a label must keep clear of (svg px): lines, polylines, polygons, circle outlines (sampled), point disks
    strokes=[]
    for n in root.iter():
        role=n.get('data-role');t=tag(n)
        if t=='line' and role in {'line','indicator'}:strokes.append((n.get('id'),[(float(n.get('x1')),float(n.get('y1'))),(float(n.get('x2')),float(n.get('y2')))]))
        elif t in {'polyline','polygon'} and role in {'indicator','circularArc','curve'}:
            raw=[float(v) for part in n.get('points','').split() for v in part.split(',')]
            pts=[(raw[i],raw[i+1]) for i in range(0,len(raw)-1,2)]
            strokes.append((n.get('id'),pts+([pts[0]] if t=='polygon' else [])))
        elif t=='circle' and role=='circle':
            cx,cy,r=float(n.get('cx')),float(n.get('cy')),float(n.get('r'))
            strokes.append((n.get('id'),[(cx+r*math.cos(k*math.pi/36),cy+r*math.sin(k*math.pi/36)) for k in range(73)]))
        elif t=='circle' and role=='point':
            cx,cy,r=float(n.get('cx')),float(n.get('cy')),float(n.get('r'))
            strokes.append((n.get('id'),[(cx-r,cy-r),(cx+r,cy-r),(cx+r,cy+r),(cx-r,cy+r),(cx-r,cy-r)]))
    def label_clear(label_id,own=()):
        box=label_boxes.get(label_id)
        if box is None:errors.append('MARK_LABEL_MISSING:'+label_id);return None
        for sid,pts in strokes:
            if sid in own:continue
            if any(segment_box_hit(a,b,box,LABEL_CLEARANCE) for a,b in zip(pts,pts[1:])):errors.append('MARK_LABEL_OVERLAPS:'+label_id+':'+str(sid))
        for other,obox in label_boxes.items():
            if other!=label_id and box[0]<obox[0]+obox[2] and obox[0]<box[0]+box[2] and box[1]<obox[1]+obox[3] and obox[1]<box[1]+box[3]:errors.append('MARK_LABEL_OVERLAPS_LABEL:'+label_id+':'+other)
        return box
    def leader_ok(label_id,box,anchor_ok):
        """A leader (when the label has one) starts where anchor_ok says (svg px point -> bool) and ends on the label box."""
        node=leaders.get(label_id)
        if node is None:return False
        a=(float(node.get('x1')),float(node.get('y1')));b=(float(node.get('x2')),float(node.get('y2')))
        if not anchor_ok(a):errors.append('MARK_LEADER_NOT_ON_OWNER:'+label_id)
        near=point_segment_distance(b,(box[0],box[1]),(box[0]+box[2],box[1]))
        edges=[((box[0],box[1]),(box[0]+box[2],box[1])),((box[0]+box[2],box[1]),(box[0]+box[2],box[1]+box[3])),((box[0]+box[2],box[1]+box[3]),(box[0],box[1]+box[3])),((box[0],box[1]+box[3]),(box[0],box[1]))]
        if min(point_segment_distance(b,e0,e1) for e0,e1 in edges)>1.5:errors.append('MARK_LEADER_NOT_ON_LABEL:'+label_id)
        return True

    # ---- angle arcs
    drawn_angles={}
    for row in marks.get('angles',[]):
        oid=row['id'];arcs=sorted(by_mark.get(('angle',oid),[]),key=lambda n:int(n.get('data-mark-index','0')))
        a,v,c=[peer_point(r) for r in row['refs']];inner=angle_between(a,v,c)
        if inner is None:errors.append('ANGLE_MARK_DEGENERATE:'+oid);continue
        outer=row.get('side','INNER')=='OUTER';expected=360-inner if outer else inner
        if len(arcs)!=row.get('arcs',1):errors.append('ANGLE_MARK_MISSING:'+oid);continue
        radii=[];sweeps=[];signed=0.0
        for n in arcs:
            pts=poly_model(n)
            if len(pts)<8:errors.append('ANGLE_MARK_MISSING:'+oid);continue
            distances=[norm(sub(q,v)) for q in pts];mean=sum(distances)/len(distances)
            if max(distances)-min(distances)>1e-6*max(1.0,mean):errors.append('ANGLE_ARC_NOT_AT_VERTEX:'+oid)
            first=wrap180(direction_degrees(sub(pts[0],v))-direction_degrees(sub(a,v)));last=wrap180(direction_degrees(sub(pts[-1],v))-direction_degrees(sub(c,v)))
            if abs(first)>RAY_TOLERANCE or abs(last)>RAY_TOLERANCE:errors.append('ANGLE_ARC_RAY_MISMATCH:'+oid)
            total=0.0
            for q0,q1 in zip(pts,pts[1:]):total+=wrap180(direction_degrees(sub(q1,v))-direction_degrees(sub(q0,v)))
            radii.append(mean);sweeps.append(abs(total));signed=total
        if not sweeps:continue
        drawn=sweeps[0]
        if any(abs(s-drawn)>1e-6 for s in sweeps):errors.append('ANGLE_ARC_SWEEPS_DIFFER:'+oid)
        if abs(drawn-expected)>ANGLE_TOLERANCE:errors.append('ANGLE_MARK_FACT_MISMATCH:'+oid+':drawn=%.3f:points=%.3f'%(drawn,expected))
        if row.get('value') is not None and abs(drawn-float(row['value']))>ANGLE_TOLERANCE:errors.append('ANGLE_MARK_FACT_MISMATCH:'+oid+':drawn=%.3f:declared=%s'%(drawn,row['value']))
        if len(radii)>1 and any(r1-r0<=1e-9 for r0,r1 in zip(radii,radii[1:])):errors.append('ANGLE_ARCS_NOT_CONCENTRIC_INCREASING:'+oid)
        drawn_angles[oid]=drawn;observations.append({'id':oid,'type':'ANGLE','drawnDegrees':drawn,'pointsDegrees':expected,'arcs':len(arcs)})
        if row.get('noLabel') is not True and (row.get('label') is not None or row.get('value') is not None):
            box=label_clear(oid+'-label')
            if box is not None:
                centre_model=inverse(box[0]+box[2]/2,box[1]+box[3]/2)
                # inside the angle: seen from the vertex, the label centre lies within the swept wedge, counted from the first ray in the sweep's direction
                offset=((direction_degrees(sub(centre_model,v))-direction_degrees(sub(a,v)))*(1 if signed>0 else -1))%360.0
                inside=0.0<offset<abs(signed)
                def on_arc(q):return any(abs(norm(sub(inverse(*q),v))-r)*sx<=1.5 for r in radii)
                if not inside and not leader_ok(oid+'-label',box,on_arc):errors.append('ANGLE_LABEL_NOT_IN_ANGLE:'+oid)
                elif inside and norm(sub(centre_model,v))*sx<=max(radii)*sx-1:errors.append('ANGLE_LABEL_INSIDE_ARC:'+oid)
    groups={}
    for row in marks.get('angles',[]):
        if row.get('equalGroup') is not None and row['id'] in drawn_angles:groups.setdefault(row['equalGroup'],[]).append(row)
    for group,rows in groups.items():
        values=[drawn_angles[r['id']] for r in rows]
        if max(values)-min(values)>ANGLE_TOLERANCE:errors.append('ANGLE_EQUAL_MARK_MISMATCH:group'+str(group))
        if len({r.get('arcs',1) for r in rows})!=1:errors.append('ANGLE_EQUAL_MARK_ARC_COUNT:group'+str(group))

    # ---- equal-length ticks and parallel arrows
    for field,kind in (('equalLengths','equal'),('parallels','parallel')):
        for row in marks.get(field,[]):
            oid=row['id'];items=by_mark.get((kind,oid),[]);drawn=[]
            for sid in row['segments']:
                seg=drawn_segment(sid)
                if seg is None:continue
                drawn.append(seg);a,b=seg;length=norm(sub(b,a))
                mine=[n for n in items if n.get('data-mark-segment')==sid]
                if len(mine)!=row['count']:errors.append(('EQUAL_MARK_MISSING:' if kind=='equal' else 'PARALLEL_MARK_MISSING:')+oid+':'+sid);continue
                unit=((b[0]-a[0])/length,(b[1]-a[1])/length)
                for n in mine:
                    if kind=='equal':
                        t0,t1=line_model(n);centre=((t0[0]+t1[0])/2,(t0[1]+t1[1])/2);vec=sub(t1,t0)
                        if abs(norm(vec)*sx-TICK_LENGTH_PX)>0.05:errors.append('EQUAL_MARK_TICK_SIZE:'+oid+':'+sid)
                        across=abs((centre[0]-a[0])*unit[1]-(centre[1]-a[1])*unit[0]);along=(centre[0]-a[0])*unit[0]+(centre[1]-a[1])*unit[1]
                        if across*sx>0.01 or not 0.15*length<=along<=0.85*length:errors.append('EQUAL_MARK_NOT_ON_SEGMENT:'+oid+':'+sid)
                        if abs(abs(unit[0]*vec[0]+unit[1]*vec[1])/norm(vec))>math.sin(math.radians(PERP_TOLERANCE)):errors.append('EQUAL_MARK_NOT_PERPENDICULAR:'+oid+':'+sid)
                    else:
                        pts=poly_model(n)
                        if len(pts)!=3:errors.append('PARALLEL_MARK_SHAPE:'+oid+':'+sid);continue
                        tip=pts[1];base=((pts[0][0]+pts[2][0])/2,(pts[0][1]+pts[2][1])/2);axis=sub(tip,base)
                        across=abs((tip[0]-a[0])*unit[1]-(tip[1]-a[1])*unit[0]);along=(tip[0]-a[0])*unit[0]+(tip[1]-a[1])*unit[1]
                        if across*sx>0.01 or not 0.15*length<=along<=0.85*length:errors.append('PARALLEL_MARK_NOT_ON_SEGMENT:'+oid+':'+sid)
                        if norm(axis)<=1e-12 or abs(axis[0]*unit[1]-axis[1]*unit[0])/norm(axis)>math.sin(math.radians(PERP_TOLERANCE)):errors.append('PARALLEL_MARK_ARROW_NOT_ALONG_SEGMENT:'+oid+':'+sid)
            if kind=='equal':
                lengths=[norm(sub(b,a)) for a,b in drawn]
                peer_lengths=[]
                for sid in row['segments']:
                    seg=next((s for s in p.get('segments',[]) if s['id']==sid),None)
                    if seg:peer_lengths.append(norm(sub(peer_point(seg['refs'][1]),peer_point(seg['refs'][0]))))
                for group in (lengths,peer_lengths):
                    if group and any(abs(l-group[0])>LENGTH_RELATIVE*max(1.0,group[0]) for l in group):errors.append('EQUAL_MARK_LENGTH_MISMATCH:'+oid);break
                observations.append({'id':oid,'type':'EQUAL','lengths':lengths})
            else:
                units=[((b[0]-a[0])/norm(sub(b,a)),(b[1]-a[1])/norm(sub(b,a))) for a,b in drawn]
                if any(abs(u[0]*units[0][1]-u[1]*units[0][0])>math.sin(math.radians(ANGLE_TOLERANCE)) for u in units):errors.append('PARALLEL_MARK_NOT_PARALLEL:'+oid)
                observations.append({'id':oid,'type':'PARALLEL','segments':row['segments']})

    # ---- segment expression labels
    segment_lines={sid:drawn_segment(sid) for sid in {s['id'] for s in p.get('segments',[])}}
    for row in marks.get('expressionLabels',[]):
        oid=row['id'];box=label_clear(oid)
        own=segment_lines.get(row['ownerSegment'])
        if box is None or own is None:continue
        centre=(box[0]+box[2]/2,box[1]+box[3]/2);centre_model=inverse(*centre)
        def distance_to(sid):
            seg=segment_lines.get(sid);return point_segment_distance(centre_model,*seg) if seg else math.inf
        mine=distance_to(row['ownerSegment'])
        def anchored(q):
            qm=inverse(*q);return point_segment_distance(qm,*own)*sx<=1.0
        if leader_ok(oid,box,anchored):pass
        elif any(distance_to(sid)+1e-9<mine for sid in segment_lines if sid!=row['ownerSegment']):errors.append('SEGMENT_LABEL_AMBIGUOUS_OWNER:'+oid)
        observations.append({'id':oid,'type':'EXPRESSION_LABEL','ownerSegment':row['ownerSegment'],'distancePx':mine*sx})

    # ---- highlighted circle arcs
    for row in marks.get('arcs',[]):
        oid=row['id'];nodes=by_mark.get(('arc',oid),[])
        if row.get('highlight',True) is not True and row.get('highlight') is not None:continue
        if len(nodes)!=1:errors.append('ARC_MARK_MISSING:'+oid);continue
        center=peer_point(row['center']);start=peer_point(row['from']);end=peer_point(row['to']);radius=norm(sub(start,center))
        if abs(norm(sub(end,center))-radius)>1e-6*max(1.0,radius):errors.append('ARC_ENDPOINT_NOT_ON_CIRCLE:'+row['to'])
        pts=poly_model(nodes[0])
        distances=[norm(sub(q,center)) for q in pts]
        if max(abs(d-radius) for d in distances)>1e-6*max(1.0,radius):errors.append('ARC_NOT_ON_CIRCLE:'+oid)
        first=wrap180(direction_degrees(sub(pts[0],center))-direction_degrees(sub(start,center)));last=wrap180(direction_degrees(sub(pts[-1],center))-direction_degrees(sub(end,center)))
        if abs(first)>RAY_TOLERANCE or abs(last)>RAY_TOLERANCE:errors.append('ARC_ENDPOINT_MISMATCH:'+oid)
        total=sum(wrap180(direction_degrees(sub(q1,center))-direction_degrees(sub(q0,center))) for q0,q1 in zip(pts,pts[1:]))
        ccw=(direction_degrees(sub(end,center))-direction_degrees(sub(start,center)))%360.0
        want={'CCW':ccw,'CW':360.0-ccw}.get(row.get('side'),None)
        if want is None:want=min(ccw,360.0-ccw) if row.get('side','MINOR')=='MINOR' else max(ccw,360.0-ccw)
        if abs(abs(total)-want)>ANGLE_TOLERANCE:errors.append('ARC_SIDE_MISMATCH:'+oid+':drawn=%.3f:expected=%.3f'%(abs(total),want))
        observations.append({'id':oid,'type':'ARC','drawnDegrees':abs(total),'radius':radius})
        if row.get('label') is not None:
            box=label_clear(oid+'-label')
            if box is not None:
                c=inverse(box[0]+box[2]/2,box[1]+box[3]/2)
                if norm(sub(c,center))<=radius:errors.append('ARC_LABEL_INSIDE_CIRCLE:'+oid)
                leader_ok(oid+'-label',box,lambda q:abs(norm(sub(inverse(*q),center))-radius)*sx<=1.5)

    # ---- filled regions (plane_regions_observer.py)
    audit_regions(root,marks,peer_point,forward,by_mark,label_clear,errors,observations,label_boxes)

    # ---- facts read from the drawn primitives only
    for row in marks.get('facts',[]):
        if row['kind']=='ON_CIRCLE':
            node=elements.get(row['circle'])
            if node is None or tag(node)!='circle':errors.append('FACT_TARGET_NOT_DRAWN:'+row['circle']);continue
            centre=inverse(float(node.get('cx')),float(node.get('cy')));radius=float(node.get('r'))/sx
            for pid in row['points']:
                dot=elements.get(pid)
                if dot is None or tag(dot)!='circle':errors.append('FACT_TARGET_NOT_DRAWN:'+pid);continue
                if abs(norm(sub(inverse(float(dot.get('cx')),float(dot.get('cy'))),centre))-radius)>1e-6*max(1.0,radius):errors.append('POINT_NOT_ON_CIRCLE:'+pid)
            observations.append({'type':'ON_CIRCLE','circle':row['circle'],'points':row['points']})
        elif row['kind']=='TANGENT_PERPENDICULAR':
            node=elements.get(row['tangent']);dots={}
            for pid in (row['center'],row['contact']):
                dot=elements.get(pid)
                if dot is None or tag(dot)!='circle':errors.append('FACT_TARGET_NOT_DRAWN:'+pid)
                else:dots[pid]=inverse(float(dot.get('cx')),float(dot.get('cy')))
            if node is None or tag(node)!='line' or len(dots)!=2:errors.append('FACT_TARGET_NOT_DRAWN:'+str(row['tangent']));continue
            a,b=line_model(node);radial=sub(dots[row['contact']],dots[row['center']]);d=sub(b,a)
            if point_segment_distance(dots[row['contact']],a,b)*sx>0.01 and abs((dots[row['contact']][0]-a[0])*d[1]-(dots[row['contact']][1]-a[1])*d[0])/norm(d)*sx>0.01:errors.append('TANGENT_NOT_THROUGH_CONTACT:'+row['tangent'])
            if abs(radial[0]*d[0]+radial[1]*d[1])/(norm(radial)*norm(d))>math.sin(math.radians(0.1)):errors.append('TANGENT_NOT_PERPENDICULAR_TO_RADIUS:'+row['tangent'])
            observations.append({'type':'TANGENT_PERPENDICULAR','tangent':row['tangent']})

    # ---- segment styles: dashes and arrowheads
    for s in p.get('segments',[]):
        node=elements.get(s['id'])
        if node is None:continue
        if s.get('dashed') and not node.get('stroke-dasharray'):errors.append('SEGMENT_DASH_MISSING:'+s['id'])
        if not s.get('dashed') and node.get('stroke-dasharray'):errors.append('SEGMENT_DASH_UNDECLARED:'+s['id'])
        if s.get('arrow'):
            a,b=line_model(node);length=norm(sub(b,a));unit=((b[0]-a[0])/length,(b[1]-a[1])/length)
            wanted=[('start',a,(-unit[0],-unit[1])),('end',b,unit)] if s['arrow']=='BOTH' else [('start',a,(-unit[0],-unit[1]))] if s['arrow']=='START' else [('end',b,unit)]
            heads=[n for n in by_mark.get(('arrow',s['id']),[])]
            if len(heads)!=len(wanted):errors.append('SEGMENT_ARROW_MISSING:'+s['id'])
            for end,tip_expected,out in wanted:
                head=elements.get(s['id']+'-arrow-'+end)
                if head is None or tag(head)!='polygon':errors.append('SEGMENT_ARROW_MISSING:'+s['id']);continue
                pts=poly_model(head);tip=pts[0];base=((pts[1][0]+pts[2][0])/2,(pts[1][1]+pts[2][1])/2);axis=sub(tip,base)
                if norm(sub(tip,tip_expected))*sx>1e-3:errors.append('SEGMENT_ARROW_TIP_OFF_END:'+s['id'])
                if axis[0]*out[0]+axis[1]*out[1]<=0 or abs(axis[0]*unit[1]-axis[1]*unit[0])/norm(axis)>math.sin(math.radians(0.1)):errors.append('SEGMENT_ARROW_NOT_ALONG_SEGMENT:'+s['id'])
    return {'status':'FAIL' if errors else 'PASS','errors':errors,'observations':observations,'finalSvgSha256':'sha256:'+hashlib.sha256(p['svg'].encode('utf-8')).hexdigest(),'strategy':'FINAL_XML_PLANE_MARKS_FROM_PEER_POINTS'}

if __name__=='__main__':
    input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
    try:result,status=audit(payload),'OK'
    except (ValueError,KeyError,TypeError,ET.ParseError,IndexError,ZeroDivisionError) as error:result,status={'code':str(error)},'ERROR'
    print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))
