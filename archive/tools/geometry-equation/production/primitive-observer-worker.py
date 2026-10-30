"""Independent final XML observations; no producer geometry/layout imports."""
import hashlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from worker import read_request,VERSION

def audit(p):
    svg=p['svg'];root=ET.fromstring(svg);errors=[];observations=[]
    ids=[n.get('id') for n in root.iter() if n.get('id')]
    if len(ids)!=len(set(ids)):errors.append('DUPLICATE_SVG_ID')
    model=p['transform'];ox,oy,sx,sy=[model[k] for k in ('originX','originY','sx','sy')]
    if not all(math.isfinite(v) for v in [ox,oy,sx,sy]) or min(sx,sy)<=0:raise ValueError('INVALID_FRAME')
    inverse=lambda x,y:((x-ox)/sx,(oy-y)/sy)
    elements={n.get('id'):n for n in root.iter() if n.get('id')}
    parents={child:parent for parent in root.iter() for child in parent}
    for n in root.iter():
        if n.get('data-role') not in {'point','line','axis','tick','indicator','circle','curve','auxiliary'}:continue
        ancestor=n
        while ancestor is not None:
            if ancestor.get('transform') or any(token in ancestor.get('style','').lower() for token in ('transform','opacity','visibility','display:','url(')):errors.append('UNSUPPORTED_GEOMETRY_TRANSFORM_OR_VISIBILITY')
            ancestor=parents.get(ancestor)
    def style_declarations(node):
        declarations={}
        for part in (node.get('style') or '').split(';'):
            if ':' not in part:continue
            key,value=part.split(':',1)
            declarations[key.strip().lower()]=value.strip()
        return declarations
    def presentation_value(node,name):
        value=node.get(name)
        if value is not None:return value.strip()
        return style_declarations(node).get(name)
    def numeric_value(value):
        if value is None:return None
        try:return float(str(value).strip().rstrip('%'))/(100 if str(value).strip().endswith('%') else 1)
        except (TypeError,ValueError):return None
    def chain(node):
        result=[]
        while node is not None:
            result.append(node);node=parents.get(node)
        return result
    def append_visibility_error(code,node):
        token=f'{code}:{node.get("id") or node.get("data-role") or "anonymous"}'
        if token not in errors:errors.append(token)
    def effect_value(node,name):
        value=presentation_value(node,name)
        return value is not None and str(value).strip().lower() not in {'','none','initial','inherit','unset'}
    geometry_roles={'point','line','axis','tick','indicator','circle','curve','auxiliary'}
    for node in root.iter():
        role=node.get('data-role')
        if role in geometry_roles:
            for ancestor in chain(node):
                opacity=numeric_value(presentation_value(ancestor,'opacity'))
                if opacity is not None and opacity<=0:append_visibility_error('HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE',node)
                if str(presentation_value(ancestor,'display') or '').strip().lower()=='none':append_visibility_error('HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE',node)
                if str(presentation_value(ancestor,'visibility') or '').strip().lower() in {'hidden','collapse'}:append_visibility_error('HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE',node)
                if effect_value(ancestor,'clip-path') or effect_value(ancestor,'mask'):append_visibility_error('UNSUPPORTED_GEOMETRY_CLIPPING_OR_MASK',node)
            if role in {'line','axis','tick'}:
                if str(presentation_value(node,'stroke') or '').strip().lower()=='none':append_visibility_error('HIDDEN_GEOMETRY_STROKE',node)
                stroke_opacity=numeric_value(presentation_value(node,'stroke-opacity'))
                if stroke_opacity is not None and stroke_opacity<=0:append_visibility_error('HIDDEN_GEOMETRY_STROKE',node)
    for wrapper in [node for node in root.iter() if node.get('data-fragment-sha')]:
        for ancestor in chain(wrapper):
            opacity=numeric_value(presentation_value(ancestor,'opacity'))
            if opacity is not None and opacity<=0:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(ancestor,'display') or '').strip().lower()=='none':append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(ancestor,'visibility') or '').strip().lower() in {'hidden','collapse'}:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if effect_value(ancestor,'clip-path') or effect_value(ancestor,'mask'):append_visibility_error('UNSUPPORTED_FRAGMENT_CLIPPING_OR_MASK',wrapper)
        for descendant in wrapper.iter():
            opacity=numeric_value(presentation_value(descendant,'opacity'))
            if opacity is not None and opacity<=0:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(descendant,'display') or '').strip().lower()=='none':append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(descendant,'visibility') or '').strip().lower() in {'hidden','collapse'}:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if effect_value(descendant,'clip-path') or effect_value(descendant,'mask'):append_visibility_error('UNSUPPORTED_FRAGMENT_CLIPPING_OR_MASK',wrapper)
    if 'model-x-axis' in elements:
        a,b=elements['model-x-axis'],elements['model-y-axis']
        if abs(float(a.get('y1'))-float(a.get('y2')))>1e-8 or abs(float(b.get('x1'))-float(b.get('x2')))>1e-8 or abs(float(a.get('y1'))-oy)>1e-8 or abs(float(b.get('x1'))-ox)>1e-8:errors.append('OBSERVED_AXIS_FRAME_MISMATCH')
        for oid,coordinate in [('model-x-unit',(1,0)),('model-y-unit',(0,1))]:
            n=elements[oid];value=inverse(float(n.get('x1')),float(n.get('y1')))
            if math.dist(value,coordinate)>1e-8:errors.append('OBSERVED_UNIT_MISMATCH')
    if p.get('coordinateMode')=='CONSTRUCTED_REALIZATION' and abs(sx-sy)>1e-9:errors.append('UNEQUAL_GEOMETRY_UNITS')
    # unmarkedPoints: point ids the PLAN declares without any marker (hiddenPointStyle NONE on a plane figure). The observer takes them from
    # the plan, never from the engine: such a point has no dot in the final SVG, every other point still must have one.
    unmarked=p.get('unmarkedPoints') or []
    if not isinstance(unmarked,list) or any(not isinstance(v,str) for v in unmarked):raise ValueError('INVALID_UNMARKED_POINTS')
    unmarked=set(unmarked)
    expected_points=p.get('points') or {}
    for oid in sorted(unmarked-set(expected_points)):errors.append('UNMARKED_POINT_UNKNOWN:'+oid)
    if unmarked:
        # Every drawn dot (data-role point, or any small filled circle outside a glyph fragment) belongs to a point that must carry one.
        dots=[]
        for n in root.iter():
            if n.tag.split('}')[-1]!='circle' or any(a.get('data-fragment-sha') for a in chain(n)):continue
            try:r=float(n.get('r'));cx=float(n.get('cx'));cy=float(n.get('cy'))
            except (TypeError,ValueError):continue
            if n.get('data-role')=='point' or (r<=8 and str(presentation_value(n,'fill') or 'none').strip().lower()!='none'):dots.append((n,cx,cy,r))
        for oid in sorted(unmarked&set(expected_points)):
            if oid in elements:errors.append('HIDDEN_POINT_MARKER_PRESENT:'+oid)
            ex,ey=ox+sx*expected_points[oid][0],oy-sy*expected_points[oid][1]
            if any(math.hypot(cx-ex,cy-ey)<=max(1.5,r) for _,cx,cy,r in dots):errors.append('HIDDEN_POINT_MARKER_AT_POINT:'+oid)
        kept={oid for oid in expected_points if oid not in unmarked}
        for n,_,_,_ in dots:
            if n.get('data-role')=='point' and n.get('id') not in kept:errors.append('UNEXPECTED_POINT_MARKER:'+str(n.get('id')))
    for oid,expected in expected_points.items():
        if oid in unmarked:continue
        n=elements.get(oid)
        if n is None or n.tag.split('}')[-1]!='circle' or n.get('data-role')!='point':errors.append('POINT_MISSING:'+oid);continue
        value=inverse(float(n.get('cx')),float(n.get('cy')));delta=math.dist(value,expected)
        observations.append({'id':oid,'expected':expected,'observed':value,'delta':delta,'tolerance':1e-8})
        if delta>1e-8:errors.append('POINT_COORDINATE_MISMATCH:'+oid)
    for segment in p.get('segments',[]):
        n=elements.get(segment['id'])
        if n is None or n.tag.split('}')[-1]!='line':errors.append('SEGMENT_MISSING:'+segment['id']);continue
        actual=[inverse(float(n.get('x1')),float(n.get('y1'))),inverse(float(n.get('x2')),float(n.get('y2')))]
        expected=[p['points'][r] for r in segment['refs']]
        if any(math.dist(a,b)>1e-8 for a,b in zip(actual,expected)):errors.append('SEGMENT_OWNER_MISMATCH:'+segment['id'])
        observations.append({'id':segment['id'],'observedEndpoints':actual,'expectedEndpoints':expected})
    for oid,expected in (p.get('lines') or {}).items():
        n=elements.get(oid)
        if n is None or n.tag.split('}')[-1]!='line' or n.get('data-role')!='line':errors.append('LINE_MISSING:'+oid);continue
        try:coefficients=[float(value) for value in expected];actual=[inverse(float(n.get('x1')),float(n.get('y1'))),inverse(float(n.get('x2')),float(n.get('y2')))]
        except (TypeError,ValueError):errors.append('LINE_FACT_INVALID:'+oid);continue
        a,b,c=coefficients;norm=math.hypot(a,b)
        if norm<=1e-12:errors.append('LINE_FACT_DEGENERATE:'+oid);continue
        residuals=[abs(a*x+b*y+c)/norm for x,y in actual]
        if max(residuals)>1e-7:errors.append('LINE_EQUATION_MISMATCH:'+oid)
        observations.append({'id':oid,'type':'LINE','observedEndpoints':actual,'equationResiduals':residuals})
    for oid,expected in (p.get('circles') or {}).items():
        n=elements.get(oid)
        if n is None or n.tag.split('}')[-1]!='circle' or n.get('data-role')!='circle':errors.append('CIRCLE_MISSING:'+oid);continue
        try:center=expected['center'];radius=float(expected['radius']);observed_center=inverse(float(n.get('cx')),float(n.get('cy')));observed_radius=float(n.get('r'))/sx
        except (KeyError,TypeError,ValueError):errors.append('CIRCLE_FACT_INVALID:'+oid);continue
        center_delta=math.dist(observed_center,center);radius_delta=abs(observed_radius-radius)
        if center_delta>1e-7 or radius_delta>1e-7:errors.append('CIRCLE_GEOMETRY_MISMATCH:'+oid)
        observations.append({'id':oid,'type':'CIRCLE','observedCenter':observed_center,'observedRadius':observed_radius,'centerDelta':center_delta,'radiusDelta':radius_delta})
    for angle in p.get('rightAngles',[]):
        n=elements.get(angle['id'])
        if n is None or n.tag.split('}')[-1]!='polyline':errors.append('RIGHT_ANGLE_MARK_MISSING:'+angle['id']);continue
        values=[float(v) for part in n.get('points','').split() for v in part.split(',')]
        if len(values)!=6:errors.append('INVALID_RIGHT_ANGLE_MARK');continue
        coords=[inverse(values[i],values[i+1]) for i in range(0,6,2)]
        a,v,b=[p['points'][r] for r in angle['refs']]
        u=[a[i]-v[i] for i in range(2)];w=[b[i]-v[i] for i in range(2)]
        norm=math.hypot(*u)*math.hypot(*w)
        if norm<=0 or abs(sum(u[i]*w[i] for i in range(2)))/norm>1e-8:errors.append('SOURCE_RIGHT_ANGLE_NOT_SATISFIED')
        for target,ray in [(coords[0],u),(coords[2],w)]:
            offset=[target[i]-v[i] for i in range(2)]
            if abs(offset[0]*ray[1]-offset[1]*ray[0])>1e-8 or sum(offset[i]*ray[i] for i in range(2))<=0:errors.append('RIGHT_ANGLE_RAY_OWNER_MISMATCH')
        if math.dist(coords[1],[coords[0][i]+coords[2][i]-v[i] for i in range(2)])>1e-8:errors.append('RIGHT_ANGLE_CORNER_MISMATCH')
        observations.append({'id':angle['id'],'ownerPoints':angle['refs'],'observedMarkPoints':coords})
    # ---- line labels (E31): the equation written beside a displayed SOURCE_LINE, read back from the final XML. The plan's own rows say which line owns which label, where
    # along the line it was asked to stand (labelAt) and, for a free text, which glyphs it must show; nothing here comes from the producer.
    line_label_rows=p.get('lineLabels') or []
    if not isinstance(line_label_rows,list):raise ValueError('INVALID_LINE_LABELS')
    if line_label_rows:
        def tag_of(node):return node.tag.split('}')[-1]
        def box_of(group):
            m=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',group.get('transform') or '')
            inner=next((c for c in group if tag_of(c)=='svg'),None)
            return (float(m.group(1)),float(m.group(2)),float(inner.get('width')),float(inner.get('height'))) if m and inner is not None else None
        def seg_distance(q,a,b):
            dx,dy=b[0]-a[0],b[1]-a[1];n2=dx*dx+dy*dy
            if n2<=1e-18:return math.dist(q,a)
            t=max(0.0,min(1.0,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/n2));return math.hypot(q[0]-(a[0]+t*dx),q[1]-(a[1]+t*dy))
        def box_distance(box,a,b):
            samples=[(a[0]+(b[0]-a[0])*i/64,a[1]+(b[1]-a[1])*i/64) for i in range(65)]
            return min(math.hypot(max(box[0]-x,0,x-(box[0]+box[2])),max(box[1]-y,0,y-(box[1]+box[3]))) for x,y in samples)
        def label_codes(text):
            out=[];text=text.replace(' ','')
            for ch in text:
                if ch in '/^':continue
                if ch=='-':out.append({'2212','2D'})
                elif 'a'<=ch<='z':out.append({format(ord(ch),'X'),format(0x210E if ch=='h' else 0x1D44E+ord(ch)-97,'X')})
                elif 'A'<=ch<='Z':out.append({format(ord(ch),'X'),format(0x1D434+ord(ch)-65,'X')})
                else:out.append({format(ord(ch),'X')})
            return out
        def read_free_text(text,values):
            """This observer's own reader of a free line equation (a linear equation in x and y, exact fractions): (A,B,C) of A x + B y + C = 0, None when a letter other than
            x and y has no value (a symbolic text is shown as written), ValueError when it is not an equation or not linear."""
            from fractions import Fraction
            tokens=re.findall(r'\d+(?:\.\d+)?|[A-Za-z]|[=+\-*/().^]',text.replace(' ',''))
            if ''.join(tokens)!=text.replace(' ','') or tokens.count('=')!=1:raise ValueError('LINE_TEXT_INVALID')
            known={k:Fraction(v) for k,v in (values or {}).items()}
            def parse(seq):
                pos=[0]
                def peek():return seq[pos[0]] if pos[0]<len(seq) else None
                def eat():pos[0]+=1;return seq[pos[0]-1]
                def mul(a,b):
                    if a is None or b is None:return None
                    if not a['x'] and not a['y']:return {k:a['c']*v for k,v in b.items()}
                    if not b['x'] and not b['y']:return {k:b['c']*v for k,v in a.items()}
                    raise ValueError('LINE_TEXT_NOT_LINEAR')
                def atom():
                    t=eat()
                    if t=='(':
                        v=expr()
                        if eat()!=')':raise ValueError('LINE_TEXT_INVALID')
                        return v
                    if t[0].isdigit():return {'x':Fraction(0),'y':Fraction(0),'c':Fraction(t)}
                    if t in 'xy' and len(t)==1 and t.isalpha():return {'x':Fraction(int(t=='x')),'y':Fraction(int(t=='y')),'c':Fraction(0)}
                    if len(t)==1 and t.isalpha():return {'x':Fraction(0),'y':Fraction(0),'c':known[t]} if t in known else None
                    raise ValueError('LINE_TEXT_INVALID')
                def power():
                    base=atom()
                    if peek()=='^':
                        eat();e=eat()
                        if e not in ('0','1'):raise ValueError('LINE_TEXT_NOT_LINEAR')
                        return {'x':Fraction(0),'y':Fraction(0),'c':Fraction(1)} if e=='0' else base
                    return base
                def unary():
                    if peek() in ('-','+'):
                        sign=eat();v=unary()
                        return v if sign=='+' or v is None else {k:-w for k,w in v.items()}
                    return power()
                def term():
                    v=unary()
                    while peek() is not None and peek() not in '+-=)^':
                        if peek()=='*':eat();v=mul(v,unary())
                        elif peek()=='/':
                            eat();d=unary()
                            if d is None or v is None:v=None;continue
                            if d['x'] or d['y']:raise ValueError('LINE_TEXT_NOT_LINEAR')
                            if d['c']==0:raise ValueError('LINE_TEXT_INVALID')
                            v={k:w/d['c'] for k,w in v.items()}
                        else:v=mul(v,unary())
                    return v
                def expr():
                    v=term()
                    while peek() in ('+','-'):
                        sign=1 if eat()=='+' else -1;w=term()
                        v=None if v is None or w is None else {k:v[k]+sign*w[k] for k in v}
                    return v
                value=expr()
                if pos[0]!=len(seq):raise ValueError('LINE_TEXT_INVALID')
                return value
            cut=tokens.index('=');left,right=parse(tokens[:cut]),parse(tokens[cut+1:])
            if left is None or right is None:return None
            return tuple(left[k]-right[k] for k in ('x','y','c'))
        drawn_lines={}
        for n in root.iter():
            if tag_of(n)=='line' and n.get('data-role')=='line':
                try:drawn_lines[n.get('id')]=((float(n.get('x1')),float(n.get('y1'))),(float(n.get('x2')),float(n.get('y2'))))
                except (TypeError,ValueError):pass
        leaders={n.get('data-owner-label'):n for n in root.iter() if tag_of(n)=='line' and n.get('data-role')=='leader' and n.get('data-owner-label')}
        for row in line_label_rows:
            lid=row.get('id');owner=row.get('owner');group=elements.get(lid)
            if group is None or tag_of(group)!='g':errors.append('LINE_LABEL_MISSING:'+str(owner));continue
            if group.get('data-owner')!=owner:errors.append('LINE_LABEL_OWNER_MISMATCH:'+str(owner));continue
            own=drawn_lines.get(owner);box=box_of(group)
            if own is None or box is None:errors.append('LINE_LABEL_UNREADABLE:'+str(owner));continue
            codes=[(c.get('data-c') or '').upper() for c in group.iter() if tag_of(c)=='path' and c.get('data-c')]
            if not codes:errors.append('LINE_LABEL_EMPTY:'+str(owner))
            if isinstance(row.get('text'),str):
                want=label_codes(row['text'])
                if len(codes)!=len(want) or any(code not in allowed for code,allowed in zip(codes,want)):errors.append('LINE_LABEL_TEXT_MISMATCH:'+str(owner)+':got='+' '.join(codes))
            if isinstance(row.get('text'),str):
                try:equation=read_free_text(row['text'],row.get('values'))
                except (ValueError,KeyError,ZeroDivisionError) as error:equation=None;errors.append((str(error) if str(error) in ('LINE_TEXT_INVALID','LINE_TEXT_NOT_LINEAR') else 'LINE_TEXT_INVALID').replace('LINE_TEXT','LINE_LABEL_TEXT')+':'+str(owner))
                truth=(p.get('lines') or {}).get(owner)
                if equation is not None and truth is not None:
                    A,B,C=[float(v) for v in equation];a,b,c=[float(v) for v in truth];scale=(abs(A)+abs(B)+abs(C))*(abs(a)+abs(b)+abs(c))
                    if (A==0 and B==0) or abs(A*b-a*B)>1e-9*scale or abs(A*c-a*C)>1e-9*scale or abs(B*c-b*C)>1e-9*scale:errors.append('LINE_LABEL_TEXT_NOT_THE_LINE:'+str(owner))
            leader=leaders.get(lid)
            if leader is not None:
                try:start=(float(leader.get('x1')),float(leader.get('y1')));end=(float(leader.get('x2')),float(leader.get('y2')))
                except (TypeError,ValueError):errors.append('LINE_LABEL_LEADER_UNREADABLE:'+str(owner));continue
                edges=[((box[0],box[1]),(box[0]+box[2],box[1])),((box[0]+box[2],box[1]),(box[0]+box[2],box[1]+box[3])),((box[0]+box[2],box[1]+box[3]),(box[0],box[1]+box[3])),((box[0],box[1]+box[3]),(box[0],box[1]))]
                if leader.get('data-owner')!=owner or seg_distance(start,*own)>1.5:errors.append('LINE_LABEL_LEADER_NOT_ON_OWNER:'+str(owner))
                if min(seg_distance(end,a,b) for a,b in edges)>1.5:errors.append('LINE_LABEL_LEADER_NOT_ON_LABEL:'+str(owner))
                spot=start
            else:
                near=box_distance(box,*own)
                others=[seg for oid,seg in drawn_lines.items() if oid!=owner and not all(seg_distance(q,*own)<=.5 for q in seg)]
                if near>12.5:errors.append('LINE_LABEL_NOT_NEAR_OWNER:'+str(owner))
                elif any(box_distance(box,*seg)<near+12 for seg in others):errors.append('LINE_LABEL_AMBIGUOUS_OWNER:'+str(owner))
                spot=(box[0]+box[2]/2,box[1]+box[3]/2)
            at=row.get('labelAt')
            if at is not None:
                if not (at in ('START','END') or (isinstance(at,(int,float)) and not isinstance(at,bool) and 0<=at<=1)):errors.append('LINE_LABEL_AT_INVALID:'+str(owner));continue
                a,b=sorted(own,key=lambda q:(q[0],-q[1]));d=(b[0]-a[0],b[1]-a[1])
                along=((spot[0]-a[0])*d[0]+(spot[1]-a[1])*d[1])/max(1e-9,d[0]**2+d[1]**2)
                if abs(along-{'START':.08,'END':.92}.get(at,at))>.4:errors.append('LINE_LABEL_NOT_AT:'+str(owner))
            observations.append({'id':lid,'type':'LINE_LABEL','owner':owner,'leader':leader is not None})
    wrappers=[n for n in root.iter() if n.get('data-fragment-sha')]
    if set(n.get('id') for n in wrappers)!=set(p['fragments']):errors.append('FRAGMENT_INVENTORY_MISMATCH')
    for oid,f in p['fragments'].items():
        expected='sha256:'+hashlib.sha256(f['svg'].encode('utf-8')).hexdigest()
        if expected!=f['fragmentSha256'] or svg.count(f['svg'])!=1:errors.append('FRAGMENT_BYTES_MISMATCH:'+oid)
        n=elements.get(oid)
        if n is None or n.get('data-owner')!=f['owner'] or n.get('data-fragment-sha')!=expected:errors.append('FRAGMENT_OWNER_MISMATCH:'+oid)
        def tree(node):return (node.tag,tuple(sorted(node.attrib.items())),node.text or '',tuple(tree(c) for c in node))
        if n is not None and (len(n)!=1 or tree(n[0])!=tree(ET.fromstring(f['svg']))):errors.append('ACTUAL_GLYPH_TREE_MISMATCH:'+oid)
    return {'status':'FAIL' if errors else 'PASS','errors':errors,'observations':observations,'finalSvgSha256':'sha256:'+hashlib.sha256(svg.encode('utf-8')).hexdigest(),'fragmentCount':len(wrappers),'strategy':'FINAL_XML_POINTS_SEGMENTS_LINES_CIRCLES_FRAME_AND_BOUND_GLYPH_BYTES'}

input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
try:result,status=audit(payload),'OK'
except (ValueError,KeyError,TypeError,ET.ParseError) as error:result,status={'code':str(error)},'ERROR'
print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))
