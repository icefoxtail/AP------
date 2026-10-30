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
SECTOR_FILL='#d9d9d9'        # style SECTOR: the light wedge; must never be one of the region fills
SECTOR_TOLERANCE=0.02        # px: a sector vertex/radius against the vertex and the outermost arc stroke
EMPHASIS_WIDTH=3.0           # px: an emphasized segment's stroke (the default segment stroke is 1.6)
DEFAULT_STROKE='#111'
ACCENT_STROKE='#c0392b'      # emphasis ACCENT: the red of a singled-out segment
ANGLE_GROUP_STROKES={1:'#c0392b',2:'#1f5fa8',3:'#2e7d32'}   # emphasisGroup of an angle: the colour of every arc of the group (red, blue, green)

def tag(node):return node.tag.split('}')[-1]
def sub(p,q):return (p[0]-q[0],p[1]-q[1])
def norm(v):return math.hypot(v[0],v[1])
def angle_between(a,v,c):
    u,w=sub(a,v),sub(c,v);nu,nw=norm(u),norm(w)
    if nu<=1e-12 or nw<=1e-12:return None
    return math.degrees(math.acos(max(-1.0,min(1.0,(u[0]*w[0]+u[1]*w[1])/(nu*nw)))))
def direction_degrees(v):return math.degrees(math.atan2(v[1],v[0]))
def wrap180(x):return (x+180.0)%360.0-180.0
TRACE_LABEL_AT_TOLERANCE=45.0       # degrees: a trace label's direction from the centre against the place its labelAt names
ANGLE_LABEL_MAX_DISTANCE_PX=90.0    # an angle label without a leader stands within this distance of its vertex (its nearest edge: the label reads as that arc's value)
ANGLE_LEADER_END_TOLERANCE=0.5      # degrees: a leader may start at an end of its arc, where the arc meets a ray
ARC_LEADER_SPAN_SLACK_DEGREES=0.8     # degrees: a leader of an arc label (labelPlacement LEADER) starts within the arc's own span, this much slack at the ends

# ---- free text labels (E30): this observer's own copy of the placement rules and of the glyph codes a MATH label shows
TEXT_LABEL_HANGUL=re.compile('[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]')
TEXT_LABEL_ANCHORS=('CENTER','N','NE','E','SE','S','SW','W','NW')
TEXT_LABEL_CENTER_SLACK_PX=18.5   # a centred label may sit this far from its stated place (the engine slides it at most 18 px to find room)
TEXT_LABEL_MAX_GAP_PX=28.0        # a label beside a point has its nearest edge within this distance of the point
def math_label_codes(text):
    """The glyph codes (a set of acceptable hex codes per glyph, in reading order) of a MATH label of letters, digits, spaces and ( ) , < > = + - . : a letter is itself or its
    italic math code, - is the minus sign, <= and >= the single relation glyphs; spaces draw nothing."""
    out=[];text=text.replace(' ','');i=0
    while i<len(text):
        ch=text[i]
        if ch in '<>' and text[i+1:i+2]=='=':out.append({'2264' if ch=='<' else '2265'});i+=2;continue
        if ch=='-':out.append({'2212','2D'})
        elif ch=='\u00b0':out.append({'2218'})
        elif 'a'<=ch<='z':out.append({format(ord(ch),'X'),format(0x210E if ch=='h' else 0x1D44E+ord(ch)-97,'X')})
        elif 'A'<=ch<='Z':out.append({format(ord(ch),'X'),format(0x1D434+ord(ch)-65,'X')})
        else:out.append({format(ord(ch),'X')})
        i+=1
    return out

def properly_cross(a,b,c,d):
    """True when the segments a-b and c-d cross at a point inside both (touching at an end does not count)."""
    u=(b[0]-a[0],b[1]-a[1]);v=(d[0]-c[0],d[1]-c[1]);w=(c[0]-a[0],c[1]-a[1])
    determinant=u[0]*v[1]-u[1]*v[0]
    if abs(determinant)<1e-9:return False
    t=(w[0]*v[1]-w[1]*v[0])/determinant;s=(w[0]*u[1]-w[1]*u[0])/determinant
    return 1e-6<t<1-1e-6 and 1e-6<s<1-1e-6
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

# ---- dimension lines (E7): this observer's own copy of the drawing rules, in svg px; it never imports the engine's constants ------------------------
DIM_SIDE_VECTORS={'BELOW':(0.0,1.0),'ABOVE':(0.0,-1.0),'LEFT':(-1.0,0.0),'RIGHT':(1.0,0.0)}
DIM_SIDE_MIN_DOT=0.2           # the chosen perpendicular points at least this much (cosine) along the named screen side
DIM_FIRST_PX=24.0              # the dimension line's distance from its two points; each further offset level adds DIM_STEP_PX
DIM_STEP_PX=44.0
DIM_EXT_START_PX=4.0           # an extension line starts this far from its point
DIM_BAR_TICK_HALF_PX=4.5       # a BAR tick is 9 px long, centred on the line's end
DIM_ARROW_PAST_PX=3.0          # an ARROW's extension line runs this far past the line
DIM_ARROW_LENGTH_PX=10.0
DIM_ARROW_HALF_WIDTH_PX=3.6
DIM_BRACE_RADIUS_PX=6.0        # a brace: quarter circles of this radius, two ends, a run, a tip twice the radius from the ends
DIM_BRACE_SAMPLES=10
DIM_POSITION_TOLERANCE_PX=0.05
DIM_LABEL_MAX_SLIDE=0.3        # the label's centre lies within this fraction of the dimension's length from the middle of the line
DIM_LABEL_MAX_GAP_PX=30.0      # and its nearest edge within this distance beyond the line (or the brace's tip)
DIM_INLINE_TIP_INSET_PX=5.0    # style INLINE: no line of its own; the arrowheads' tips stand this far inside the two points
DIM_OFFSET_PX_RANGE=(8.0,120.0)
DIM_MAX_TIER=3

def resolve_dimension_tiers(rows,peer_point):
    """{id: tier} of every dimension row: a number is kept, "AUTO" is the lowest tier whose rows on the same line and side do not overlap it (shorter spans first). Own copy of the rule."""
    items=[]
    for row in rows:
        try:a=peer_point(row['from']);b=peer_point(row['to'])
        except (KeyError,ValueError,TypeError):continue
        length=norm(sub(b,a))
        if length>1e-12 and row.get('side') in DIM_SIDE_VECTORS:items.append({'row':row,'a':a,'b':b,'length':length})
    scale=max([1e-9]+[item['length'] for item in items])
    def same_line(p,q):
        d=((p['b'][0]-p['a'][0])/p['length'],(p['b'][1]-p['a'][1])/p['length'])
        if abs(d[0]*(q['b'][1]-q['a'][1])-d[1]*(q['b'][0]-q['a'][0]))>1e-6*q['length']:return False
        return all(abs(d[0]*(pt[1]-p['a'][1])-d[1]*(pt[0]-p['a'][0]))<=1e-6*scale for pt in (q['a'],q['b']))
    groups=[]
    for item in items:
        group=next((g for g in groups if g[0]['row']['side']==item['row']['side'] and same_line(g[0],item)),None)
        if group is None:groups.append([item])
        else:group.append(item)
    out={}
    for group in groups:
        base=group[0];d=((base['b'][0]-base['a'][0])/base['length'],(base['b'][1]-base['a'][1])/base['length'])
        def span(item):
            t=[(pt[0]-base['a'][0])*d[0]+(pt[1]-base['a'][1])*d[1] for pt in (item['a'],item['b'])];return (min(t),max(t))
        taken=[(item['row']['offset'],span(item)) for item in group if isinstance(item['row'].get('offset'),int) and not isinstance(item['row'].get('offset'),bool)]
        for item in sorted([i for i in group if i['row'].get('offset')=='AUTO'],key=lambda i:(i['length'],str(i['row'].get('id')))):
            lo,hi=span(item);tier=1
            while any(t==tier and hi>other[0]+1e-6*scale and other[1]>lo+1e-6*scale for t,other in taken):tier+=1
            out[item['row']['id']]=tier;taken.append((tier,(lo,hi)))
    for item in items:
        o=item['row'].get('offset')
        if isinstance(o,int) and not isinstance(o,bool):out[item['row']['id']]=o
    return out

def dimension_distance(row,style,offset):
    """The px distance of a dimension's line from its two points: none for INLINE, else the first tier (24 px, or offsetPx) plus 44 px per further tier."""
    if style=='INLINE':return 0.0
    first=row.get('offsetPx');first=DIM_FIRST_PX if first is None else float(first)
    return first+DIM_STEP_PX*(offset-1)

def dimension_label_parts(row):
    """(label, unit) of a dimension: a trailing thin-space unit written in the label ("24\\,cm") is the unit, as in the plan's own reading of it."""
    label,unit=row.get('label'),row.get('unit')
    if isinstance(label,str):
        m=re.fullmatch(r'(.*?)\s*\\,\s*(cm|mm|m)',label)
        if m and m.group(1)!='' and unit in (None,m.group(2)):label,unit=m.group(1),m.group(2)
    return label,unit

def brace_expected(length,dist):
    """The brace's (along, across) samples from the end at the first point to the end at the second: ends dist-2r from the points' line (vertical tangent),
    a run at dist-r, the tip at dist in the middle. Written here from the declared rule, not read from the engine."""
    r=DIM_BRACE_RADIUS_PX;start=dist-2*r;half=[]
    for k in range(DIM_BRACE_SAMPLES+1):
        a=math.pi/2*k/DIM_BRACE_SAMPLES;half.append((r-r*math.cos(a),start+r*math.sin(a)))
    for k in range(DIM_BRACE_SAMPLES+1):
        a=-math.pi/2+math.pi/2*k/DIM_BRACE_SAMPLES;half.append((length/2-r+r*math.cos(a),start+2*r+r*math.sin(a)))
    return half+[(length-u,v) for u,v in reversed(half)][1:]

EQUAL_PATH_CLEAR_PX=8.0   # the mark of a whole path stands at least this far (svg px) from every inner joint
TEXT_WEIGHT_STROKE_EM=0.06   # labelWeight MATH on a plain-text label: the outline stroke, in em (this observer's own copy)
EQUAL_CIRCLE_RADIUS_PX=3.6   # markStyle CIRCLE: the radius of an equal-length circle (this observer's own copy)
NEAREST_OWNER_MARGIN_PX=3.0   # ownership NEAREST: a segment label's own segment is nearer than every other one by at least this (svg px)
EQUAL_PATH_MIDDLE_TOLERANCE_PX=0.6   # the centre of the marks of a whole path stands at its middle, this far at most (svg px)
EQUAL_BRACKET_OFFSET_PX=12.0        # the bracket of a path: this far beside it, 8 px end caps (this observer's own copy of the rule)
EQUAL_BRACKET_CAP_HALF_PX=4.0
EQUAL_BRACKET_STRAIGHT_PX=0.6
EQUAL_BRACKET_POSITION_TOLERANCE_PX=0.05

def path_chain(pieces):
    """The polyline of drawn segments (model point pairs) joined end to end, or None when they do not chain: the first piece starts at the end the second does not share."""
    def same(p,q):return norm(sub(p,q))<=1e-6
    first,second=pieces[0],pieces[1]
    shared=next((pt for pt in first if any(same(pt,other) for other in second)),None)
    if shared is None:return None
    chain=[first[1] if same(first[0],shared) else first[0],shared]
    for piece in pieces[1:]:
        tail=chain[-1]
        if same(piece[0],tail):chain.append(piece[1])
        elif same(piece[1],tail):chain.append(piece[0])
        else:return None
    return chain

def box_polyline_distance(box,points):
    """Smallest distance from a label box (0 inside) to a polyline, sampled along every segment."""
    best=math.inf
    for a,b in zip(points,points[1:]):
        for i in range(33):
            x=a[0]+(b[0]-a[0])*i/32;y=a[1]+(b[1]-a[1])*i/32
            best=min(best,math.hypot(max(box[0]-x,0,x-(box[0]+box[2])),max(box[1]-y,0,y-(box[1]+box[3]))))
    return best

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
    declared|={('trace',r['id']) for r in marks.get('traces',[])}
    declared|={('dimension',r['id']) for r in marks.get('dimensions',[])}
    declared|={('arrow',s['id']) for s in p.get('segments',[]) if s.get('arrow')}
    declared|={('region',r['id']) for r in marks.get('regions',[])}
    declared|={('equal-bracket',r['id']) for r in marks.get('equalLengths',[]) if any(isinstance(entry,dict) for entry in r.get('segments',[]))}
    declared|={('region-hatch',r['id']) for r in marks.get('regions',[]) if r.get('pattern')=='HATCH'}
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

    def glyph_codes(node):
        """The MathJax glyph codes (data-c, upper-case hex) of a typeset math label, in reading order; empty for plain text outlines."""
        return [n.get('data-c','').upper() for n in node.iter() if tag(n)=='path' and n.get('data-c')]
    def code_variants(ch):
        """A character's own code and, for a Latin letter, the italic math code MathJax uses for a variable."""
        out={format(ord(ch),'X')}
        if 'a'<=ch<='z':out.add(format(0x210E if ch=='h' else 0x1D44E+ord(ch)-97,'X'))
        if 'A'<=ch<='Z':out.add(format(0x1D434+ord(ch)-65,'X'))
        return out
    def label_content(label_id,kind,text,unit,weight=None):
        """What a plain-text (labelKind TEXT) or unit-bearing label of the plan says, read back from the final SVG. A TEXT label is plain outlines (no math glyphs)
        whose text the typesetting step left on its group as data-text; a unit label is checked glyph by glyph (the unit letters last, a plain number's digits first)
        and, for a simple expression, against the exact TeX spacing: a number takes the unit attached (3cm), a letter one thin space (x cm)."""
        node=elements.get(label_id)
        if node is None:return
        codes=glyph_codes(node)
        if kind=='TEXT':
            if codes or node.get('data-tex') is not None:errors.append('LABEL_KIND_MISMATCH:'+label_id)
            if node.get('data-text')!=str(text):errors.append('LABEL_TEXT_MISMATCH:'+label_id)
            # labelWeight MATH (E32): the outline carries the weight stroke of a math label; without the field it carries none (the old thin face)
            try:font=float(node.get('data-font-px'))
            except (TypeError,ValueError):font=None
            outlines=[n for n in node.iter() if tag(n)=='path']
            if font is not None and outlines:
                stroked=[n for n in outlines if str(n.get('stroke','none')).lower() not in ('none','')]
                if weight=='MATH' and (len(stroked)!=len(outlines) or any(abs(float(n.get('stroke-width','0'))-font*TEXT_WEIGHT_STROKE_EM)>0.01 for n in stroked)):errors.append('LABEL_WEIGHT_MISMATCH:'+label_id)
                if weight!='MATH' and stroked:errors.append('LABEL_WEIGHT_UNDECLARED:'+label_id)
            return
        if node.get('data-text') is not None:errors.append('LABEL_KIND_MISMATCH:'+label_id)
        if not unit:return
        tail=[format(ord(ch),'X') for ch in unit]
        if len(codes)<len(tail)+1 or codes[-len(tail):]!=tail:errors.append('LABEL_UNIT_MISMATCH:'+label_id)
        value=str(text)
        if re.fullmatch(r'[0-9]+(?:\.[0-9]+)?',value):
            if codes!=[format(ord(ch),'X') for ch in value]+tail:errors.append('LABEL_TEXT_MISMATCH:'+label_id)
        elif re.fullmatch(r'[A-Za-z]',value):
            if len(codes)!=1+len(tail) or codes[0] not in code_variants(value):errors.append('LABEL_TEXT_MISMATCH:'+label_id)
        else:return          # any other expression: the unit glyphs above are all this observer can read back
        if node.get('data-tex')!=value+(r'\,' if value[-1].isalpha() else '')+r'\mathrm{'+unit+'}':errors.append('LABEL_UNIT_SPACING_MISMATCH:'+label_id)

    # ---- angle marks: 1-3 stroke arcs and, for style SECTOR (the default), the filled wedge beneath them
    drawn_angles={};angle_geometry={}   # id -> (vertex, first ray direction, signed sweep, outermost arc radius) in model units
    document=list(root.iter());order={id(n):i for i,n in enumerate(document)}
    def stroke_before(node):
        """True when some drawn stroke, point or label comes before the node in the document (a fill would cover it)."""
        mine=order[id(node)]
        for n in document:
            if order[id(n)]>=mine:continue
            t=tag(n)
            if t in {'line','polyline','polygon','circle','path'} and n.get('stroke') not in (None,'none'):return True
            if t=='g' and n.get('data-fragment-sha'):return True
        return False
    for row in marks.get('angles',[]):
        oid=row['id'];nodes=by_mark.get(('angle',oid),[])
        arcs=sorted((n for n in nodes if tag(n)=='polyline'),key=lambda n:int(n.get('data-mark-index','0')))
        sectors=[n for n in nodes if tag(n)=='polygon']
        style=row.get('style','ARC' if row.get('over') else 'SECTOR')
        if style=='SECTOR' and len(sectors)!=1:errors.append('ANGLE_SECTOR_MISSING:'+oid)
        elif style!='SECTOR' and sectors:errors.append('ANGLE_SECTOR_UNEXPECTED:'+oid)
        a,v,c=[peer_point(r) for r in row['refs']];inner=angle_between(a,v,c)
        if inner is None:errors.append('ANGLE_MARK_DEGENERATE:'+oid);continue
        straight=row.get('straight') is True
        if straight and abs(inner-180)>ANGLE_TOLERANCE:errors.append('ANGLE_STRAIGHT_NOT_STRAIGHT:'+oid);continue
        outer=row.get('side','INNER')=='OUTER' and not straight;expected=180.0 if straight else 360-inner if outer else inner
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
        angle_geometry[oid]=(v,direction_degrees(sub(a,v)),signed,max(radii))
        if straight:
            # the semicircle faces the screen side the plan names: the middle of its first arc, seen from the vertex in svg px, points that way
            want_side=DIM_SIDE_VECTORS.get(row.get('side'))
            if want_side is None:errors.append('ANGLE_STRAIGHT_SIDE_REQUIRED:'+oid)
            else:
                first_arc=poly_model(arcs[0]);middle=forward(first_arc[len(first_arc)//2]);vertex_px=forward(v);toward=(middle[0]-vertex_px[0],middle[1]-vertex_px[1])
                if norm(toward)<=1e-9 or (toward[0]*want_side[0]+toward[1]*want_side[1])/norm(toward)<DIM_SIDE_MIN_DOT:errors.append('ANGLE_STRAIGHT_SIDE_MISMATCH:'+oid)
        if any(abs(s-drawn)>1e-6 for s in sweeps):errors.append('ANGLE_ARC_SWEEPS_DIFFER:'+oid)
        if abs(drawn-expected)>ANGLE_TOLERANCE:errors.append('ANGLE_MARK_FACT_MISMATCH:'+oid+':drawn=%.3f:points=%.3f'%(drawn,expected))
        if row.get('value') is not None and abs(drawn-float(row['value']))>ANGLE_TOLERANCE:errors.append('ANGLE_MARK_FACT_MISMATCH:'+oid+':drawn=%.3f:declared=%s'%(drawn,row['value']))
        if len(radii)>1 and any(r1-r0<=1e-9 for r0,r1 in zip(radii,radii[1:])):errors.append('ANGLE_ARCS_NOT_CONCENTRIC_INCREASING:'+oid)
        # emphasisGroup: every arc of the angle is drawn in its group's colour; an angle without a group keeps the default stroke
        group=row.get('emphasisGroup')
        if group is not None and group not in ANGLE_GROUP_STROKES:errors.append('ANGLE_EMPHASIS_GROUP_INVALID:'+oid)
        else:
            want=ANGLE_GROUP_STROKES[group] if group is not None else DEFAULT_STROKE
            for n in arcs:
                if str(n.get('stroke') or '').lower()!=want:errors.append(('ANGLE_EMPHASIS_COLOR_MISMATCH:' if group is not None else 'ANGLE_EMPHASIS_UNDECLARED:')+oid);break
        if sectors:
            node=sectors[0]
            if node.get('stroke') not in (None,'none'):errors.append('ANGLE_SECTOR_STROKE_PRESENT:'+oid)
            if str(node.get('fill','')).lower()!=SECTOR_FILL:errors.append('ANGLE_SECTOR_FILL_MISMATCH:'+oid)
            wedge=poly_model(node)
            if len(wedge)<3:errors.append('ANGLE_SECTOR_MISSING:'+oid)
            else:
                if norm(sub(wedge[0],v))*sx>SECTOR_TOLERANCE:errors.append('ANGLE_SECTOR_NOT_AT_VERTEX:'+oid)
                distances=[norm(sub(q,v)) for q in wedge[1:]];mean=sum(distances)/len(distances)
                if max(distances)-min(distances)>SECTOR_TOLERANCE/sx:errors.append('ANGLE_SECTOR_NOT_AT_VERTEX:'+oid)
                if abs(mean-max(radii))*sx>SECTOR_TOLERANCE:errors.append('ANGLE_SECTOR_RADIUS_MISMATCH:'+oid)
                first=wrap180(direction_degrees(sub(wedge[1],v))-direction_degrees(sub(a,v)));last=wrap180(direction_degrees(sub(wedge[-1],v))-direction_degrees(sub(c,v)))
                if abs(first)>RAY_TOLERANCE or abs(last)>RAY_TOLERANCE:errors.append('ANGLE_SECTOR_RAY_MISMATCH:'+oid)
                total=sum(wrap180(direction_degrees(sub(q1,v))-direction_degrees(sub(q0,v))) for q0,q1 in zip(wedge[1:],wedge[2:]))
                if abs(abs(total)-expected)>ANGLE_TOLERANCE:errors.append('ANGLE_SECTOR_SWEEP_MISMATCH:'+oid+':drawn=%.3f:points=%.3f'%(abs(total),expected))
                if signed!=0 and total*signed<=0:errors.append('ANGLE_SECTOR_SIDE_MISMATCH:'+oid)
                if stroke_before(node):errors.append('ANGLE_SECTOR_NOT_BENEATH_STROKES:'+oid)
                observations.append({'id':oid+'-sector','type':'ANGLE_SECTOR','drawnDegrees':abs(total),'radius':mean,'atVertex':bool(norm(sub(wedge[0],v))*sx<=SECTOR_TOLERANCE)})
        drawn_angles[oid]=drawn;observations.append({'id':oid,'type':'ANGLE','drawnDegrees':drawn,'pointsDegrees':expected,'arcs':len(arcs),'style':style})
        if row.get('noLabel') is not True and (row.get('label') is not None or row.get('value') is not None):
            box=label_clear(oid+'-label')
            if box is not None:
                centre_model=inverse(box[0]+box[2]/2,box[1]+box[3]/2)
                # inside the angle: seen from the vertex, the label centre lies within the swept wedge, counted from the first ray in the sweep's direction
                offset=((direction_degrees(sub(centre_model,v))-direction_degrees(sub(a,v)))*(1 if signed>0 else -1))%360.0
                inside=0.0<offset<abs(signed)
                def on_arc(q):
                    # the leader starts ON one of the angle's own arcs: at an arc's radius AND within its sweep (an end of the arc, where it meets a ray, counts)
                    d=sub(inverse(*q),v)
                    if not any(abs(norm(d)-r)*sx<=1.5 for r in radii):return False
                    along=((direction_degrees(d)-direction_degrees(sub(a,v)))*(1 if signed>0 else -1))%360.0
                    if along>360.0-ANGLE_LEADER_END_TOLERANCE:along-=360.0
                    return -ANGLE_LEADER_END_TOLERANCE<=along<=abs(signed)+ANGLE_LEADER_END_TOLERANCE
                has_leader=oid+'-label' in leaders
                if has_leader:
                    leader_ok(oid+'-label',box,on_arc)
                    # a leader never crosses a drawn stroke (its own arcs excepted, and a ray it starts on)
                    leader=leaders[oid+'-label'];la=(float(leader.get('x1')),float(leader.get('y1')));lb=(float(leader.get('x2')),float(leader.get('y2')))
                    own_arcs={n.get('id') for n in arcs}
                    for sid,pts in strokes:
                        if sid in own_arcs:continue
                        if any(properly_cross(la,lb,p,q) for p,q in zip(pts,pts[1:])):errors.append('ANGLE_LABEL_LEADER_CROSSES:'+oid+':'+str(sid))
                if row.get('labelPlacement')=='LEADER':
                    # labelPlacement LEADER: a visible leader from the angle's own arc, and the whole label outside the wedge the angle sweeps
                    if not has_leader:errors.append('ANGLE_LABEL_LEADER_MISSING:'+oid)
                    def in_wedge(q):
                        d=sub(inverse(*q),v)
                        if norm(d)<=1e-12:return True
                        along=((direction_degrees(d)-direction_degrees(sub(a,v)))*(1 if signed>0 else -1))%360.0
                        return along<=abs(signed)+ANGLE_LEADER_END_TOLERANCE or along>=360.0-ANGLE_LEADER_END_TOLERANCE
                    if any(in_wedge(q) for q in ((box[0]+box[2]/2,box[1]+box[3]/2),(box[0],box[1]),(box[0]+box[2],box[1]),(box[0],box[1]+box[3]),(box[0]+box[2],box[1]+box[3]))):errors.append('ANGLE_LABEL_NOT_OUTSIDE_ANGLE:'+oid)
                elif not inside and not has_leader:errors.append('ANGLE_LABEL_NOT_IN_ANGLE:'+oid)
                elif inside and not has_leader and norm(sub(centre_model,v))*sx<=max(radii)*sx-1:errors.append('ANGLE_LABEL_INSIDE_ARC:'+oid)
                elif inside and not has_leader:
                    vx,vy=forward(v)   # the vertex in svg px; the distance to the label box's nearest point
                    if math.hypot(max(box[0]-vx,0,vx-(box[0]+box[2])),max(box[1]-vy,0,vy-(box[1]+box[3])))>ANGLE_LABEL_MAX_DISTANCE_PX+0.5:errors.append('ANGLE_LABEL_TOO_FAR:'+oid)
    # angles[].over (E32): the whole angle encloses each listed angle at the same vertex (rays inside its wedge, a smaller angle) and its outermost arc lies outside theirs
    over_of={row['id']:set(row.get('over') or ()) for row in marks.get('angles',[]) if isinstance(row,dict) and row.get('over')}
    for row in marks.get('angles',[]):
        if not row.get('over') or row['id'] not in angle_geometry:continue
        oid=row['id'];refs=row['refs'];va=peer_point(refs[1]);mine_first=direction_degrees(sub(peer_point(refs[0]),va))
        mine_sweep=((direction_degrees(sub(peer_point(refs[2]),va))-mine_first+180.0)%360.0)-180.0
        def offset_of(q):return ((direction_degrees(sub(q,va))-mine_first)*(1 if mine_sweep>0 else -1))%360.0
        for child_id in row['over']:
            child=next((r for r in marks.get('angles',[]) if r.get('id')==child_id),None)
            if child is None or child['refs'][1]!=refs[1] or child_id not in angle_geometry:errors.append('ANGLE_OVER_NOT_ENCLOSED:'+oid+':'+str(child_id));continue
            rays=[offset_of(peer_point(child['refs'][0])),offset_of(peer_point(child['refs'][2]))]
            tol=ANGLE_TOLERANCE
            if not all(r<=abs(mine_sweep)+tol or r>=360.0-tol for r in rays) or angle_between(peer_point(child['refs'][0]),va,peer_point(child['refs'][2]))>=angle_between(peer_point(refs[0]),va,peer_point(refs[2]))-1e-6:errors.append('ANGLE_OVER_NOT_ENCLOSED:'+oid+':'+child_id)
            if angle_geometry[oid][3]*sx<=angle_geometry[child_id][3]*sx+2.0:errors.append('ANGLE_OVER_RING_MISMATCH:'+oid+':'+child_id)
    # a label never stands inside another angle mark's sector (the wedge up to that mark's outermost arc): it would read as that angle's value
    for row in marks.get('angles',[]):
        oid=row['id'];box=label_boxes.get(oid+'-label')
        if oid not in angle_geometry or box is None or row.get('noLabel') is True:continue
        centre=inverse(box[0]+box[2]/2,box[1]+box[3]/2)
        for other,(vo,first_o,sweep_o,radius_o) in angle_geometry.items():
            if other==oid:continue
            if oid in over_of.get(other,()):continue       # an angle enclosed by that angle (a half under its whole) may stand inside it
            d=sub(centre,vo)
            if norm(d)*sx>radius_o*sx+2.0 or sweep_o==0:continue
            along=((direction_degrees(d)-first_o)*(1 if sweep_o>0 else -1))%360.0
            if along<=abs(sweep_o):errors.append('ANGLE_LABEL_IN_OTHER_ANGLE:'+oid+':'+other)
    groups={}
    for row in marks.get('angles',[]):
        if row.get('equalGroup') is not None and row['id'] in drawn_angles:groups.setdefault(row['equalGroup'],[]).append(row)
    for group,rows in groups.items():
        values=[drawn_angles[r['id']] for r in rows]
        if max(values)-min(values)>ANGLE_TOLERANCE:errors.append('ANGLE_EQUAL_MARK_MISMATCH:group'+str(group))
        if len({r.get('arcs',1) for r in rows})!=1:errors.append('ANGLE_EQUAL_MARK_ARC_COUNT:group'+str(group))

    def audit_equal_bracket(oid,sid,chain,bracket_nodes,ticks):
        """The bracket of a straight path (E32): a line beside the path, two perpendicular end caps, and the equal ticks centred on the bracket's middle; it crosses no stroke."""
        px=[forward(point) for point in chain];a,b=px[0],px[-1];length=norm(sub(b,a))
        if length<=1e-9:return
        d=((b[0]-a[0])/length,(b[1]-a[1])/length)
        if any(abs((q[0]-a[0])*d[1]-(q[1]-a[1])*d[0])>EQUAL_BRACKET_STRAIGHT_PX+0.05 for q in px):errors.append('EQUAL_MARK_BRACKET_NOT_STRAIGHT:'+oid+':'+sid);return
        parts={}
        for node in bracket_nodes:parts.setdefault(node.get('data-mark-part'),[]).append(node)
        if sorted(parts)!=['cap-from','cap-to','line'] or any(len(v)!=1 for v in parts.values()):errors.append('EQUAL_MARK_BRACKET_PARTS:'+oid+':'+sid);return
        def ends_of(node):return [(float(node.get('x1')),float(node.get('y1'))),(float(node.get('x2')),float(node.get('y2')))]
        def same(p,q):return norm(sub(p,q))<=EQUAL_BRACKET_POSITION_TOLERANCE_PX
        line=ends_of(parts['line'][0]);found=None
        for n in ((-d[1],d[0]),(d[1],-d[0])):
            pa=(a[0]+n[0]*EQUAL_BRACKET_OFFSET_PX,a[1]+n[1]*EQUAL_BRACKET_OFFSET_PX);pb=(b[0]+n[0]*EQUAL_BRACKET_OFFSET_PX,b[1]+n[1]*EQUAL_BRACKET_OFFSET_PX)
            if same(line[0],pa) and same(line[1],pb):found=(n,pa,pb);break
        if found is None:errors.append('EQUAL_MARK_BRACKET_MISMATCH:'+oid+':'+sid+':line');return
        n,pa,pb=found
        for part,base_point in (('cap-from',pa),('cap-to',pb)):
            cap=ends_of(parts[part][0]);want=[(base_point[0]-n[0]*EQUAL_BRACKET_CAP_HALF_PX,base_point[1]-n[1]*EQUAL_BRACKET_CAP_HALF_PX),(base_point[0]+n[0]*EQUAL_BRACKET_CAP_HALF_PX,base_point[1]+n[1]*EQUAL_BRACKET_CAP_HALF_PX)]
            if not ((same(cap[0],want[0]) and same(cap[1],want[1])) or (same(cap[0],want[1]) and same(cap[1],want[0]))):errors.append('EQUAL_MARK_BRACKET_MISMATCH:'+oid+':'+sid+':'+part)
        middle=((pa[0]+pb[0])/2,(pa[1]+pb[1])/2);centres=[]
        for tick in ticks:
            t0=(float(tick.get('x1')),float(tick.get('y1')));t1=(float(tick.get('x2')),float(tick.get('y2')));centre=((t0[0]+t1[0])/2,(t0[1]+t1[1])/2);vec=sub(t1,t0)
            if abs(norm(vec)-TICK_LENGTH_PX)>0.05:errors.append('EQUAL_MARK_TICK_SIZE:'+oid+':'+sid)
            if abs(abs(d[0]*vec[0]+d[1]*vec[1])/norm(vec))>math.sin(math.radians(PERP_TOLERANCE)):errors.append('EQUAL_MARK_NOT_PERPENDICULAR:'+oid+':'+sid)
            if point_segment_distance(centre,pa,pb)>EQUAL_BRACKET_POSITION_TOLERANCE_PX:errors.append('EQUAL_MARK_NOT_ON_SEGMENT:'+oid+':'+sid)
            centres.append(centre)
        if centres and norm(sub((sum(c[0] for c in centres)/len(centres),sum(c[1] for c in centres)/len(centres)),middle))>EQUAL_PATH_MIDDLE_TOLERANCE_PX:errors.append('EQUAL_MARK_PATH_NOT_AT_MIDDLE:'+oid+':'+sid)
        mine_ids={node.get('id') for node in [*bracket_nodes,*ticks]}
        for other_id,pts in strokes:
            if other_id in mine_ids:continue
            for c0,c1 in ((pa,pb),*[ends_of(parts[part][0]) for part in ('cap-from','cap-to')]):
                if any(properly_cross(c0,c1,q0,q1) for q0,q1 in zip(pts,pts[1:])):errors.append('EQUAL_MARK_BRACKET_CROSSES:'+oid+':'+str(other_id));break

    # ---- equal-length ticks and parallel arrows
    for field,kind in (('equalLengths','equal'),('parallels','parallel')):
        for row in marks.get(field,[]):
            oid=row['id'];items=by_mark.get((kind,oid),[]);drawn=[];path_lengths={}
            for entry in row['segments']:
                if isinstance(entry,dict):
                    # E32: one mark for a whole path {"path":[ids]}: the pieces drawn end to end; the ticks stand on the path (on the piece they fall on), clear of its inner joints
                    path_ids=entry.get('path') or [];sid=path_ids[0] if path_ids else '?'
                    pieces=[drawn_segment(pid) for pid in path_ids]
                    if not path_ids or any(piece is None for piece in pieces):continue
                    chain=path_chain(pieces)
                    if chain is None:errors.append('EQUAL_MARK_PATH_NOT_CONNECTED:'+oid+':'+sid);continue
                    path_lengths[sid]=sum(norm(sub(b,a)) for a,b in zip(chain,chain[1:]))
                    mine=[n for n in items if n.get('data-mark-segment')==sid]
                    if len(mine)!=row['count']:errors.append('EQUAL_MARK_MISSING:'+oid+':'+sid);continue
                    brackets=[n for n in by_mark.get(('equal-bracket',oid),[]) if n.get('data-mark-segment')==sid]
                    path_mark=row.get('pathMark','AUTO')
                    if path_mark not in ('AUTO','TICK','BRACKET'):errors.append('EQUAL_MARK_PATH_MARK_INVALID:'+oid);continue
                    if brackets and path_mark=='TICK':errors.append('EQUAL_MARK_PATH_BRACKET_UNEXPECTED:'+oid+':'+sid);continue
                    if not brackets and path_mark=='BRACKET':errors.append('EQUAL_MARK_PATH_NEEDS_BRACKET:'+oid+':'+sid);continue
                    if brackets:
                        # the middle of the path is near an inner joint, so the whole path wears a thin bracket (a straight path only) with the ticks at the bracket's middle
                        audit_equal_bracket(oid,sid,chain,brackets,mine)
                        continue
                    positions=[]
                    for n in mine:
                        t0,t1=line_model(n);centre=((t0[0]+t1[0])/2,(t0[1]+t1[1])/2);vec=sub(t1,t0)
                        if abs(norm(vec)*sx-TICK_LENGTH_PX)>0.05:errors.append('EQUAL_MARK_TICK_SIZE:'+oid+':'+sid)
                        nearest=min(zip(chain,chain[1:]),key=lambda pair:point_segment_distance(centre,*pair))
                        if point_segment_distance(centre,*nearest)*sx>0.01:errors.append('EQUAL_MARK_NOT_ON_SEGMENT:'+oid+':'+sid);continue
                        direction=sub(nearest[1],nearest[0])
                        if abs(abs(direction[0]*vec[0]+direction[1]*vec[1])/(norm(direction)*norm(vec)))>math.sin(math.radians(PERP_TOLERANCE)):errors.append('EQUAL_MARK_NOT_PERPENDICULAR:'+oid+':'+sid)
                        # clear of every inner joint (the point E of B-E-D) by the path-mark clearance
                        along_path=0.0
                        for a0,b0 in zip(chain,chain[1:]):
                            if (a0,b0)==nearest:along_path+=norm(sub(centre,a0));break
                            along_path+=norm(sub(b0,a0))
                        positions.append(along_path)
                        if not 0.15*path_lengths[sid]<=along_path<=0.85*path_lengths[sid]:errors.append('EQUAL_MARK_NOT_ON_SEGMENT:'+oid+':'+sid)
                        if any(norm(sub(centre,joint))*sx<EQUAL_PATH_CLEAR_PX-0.01 for joint in chain[1:-1]):errors.append('EQUAL_MARK_PATH_ON_JOINT:'+oid+':'+sid)
                    # the marks of a whole path stand at its middle (by length): the group's centre is half way along
                    if path_mark=='AUTO' and positions and abs(sum(positions)/len(positions)-0.5*path_lengths[sid])*sx>EQUAL_PATH_MIDDLE_TOLERANCE_PX:errors.append('EQUAL_MARK_PATH_NOT_AT_MIDDLE:'+oid+':'+sid)
                    continue
                sid=entry
                seg=drawn_segment(sid)
                if seg is None:continue
                drawn.append(seg);a,b=seg;length=norm(sub(b,a))
                mine=[n for n in items if n.get('data-mark-segment')==sid]
                if len(mine)!=row['count']:errors.append(('EQUAL_MARK_MISSING:' if kind=='equal' else 'PARALLEL_MARK_MISSING:')+oid+':'+sid);continue
                unit=((b[0]-a[0])/length,(b[1]-a[1])/length)
                for n in mine:
                    if kind=='equal' and row.get('markStyle')=='CIRCLE':
                        # markStyle CIRCLE (E32): open circles of 3.6 px radius centred on the segment, 9 px apart, centred on the segment's chosen spot
                        if tag(n)!='circle':errors.append('EQUAL_MARK_STYLE_MISMATCH:'+oid+':'+sid);continue
                        centre=inverse(float(n.get('cx')),float(n.get('cy')))
                        if abs(float(n.get('r'))-EQUAL_CIRCLE_RADIUS_PX)>0.05 or str(n.get('fill','none')).lower() not in ('none',''):errors.append('EQUAL_MARK_TICK_SIZE:'+oid+':'+sid)
                        across=abs((centre[0]-a[0])*unit[1]-(centre[1]-a[1])*unit[0]);along=(centre[0]-a[0])*unit[0]+(centre[1]-a[1])*unit[1]
                        if across*sx>0.01 or not 0.15*length<=along<=0.85*length:errors.append('EQUAL_MARK_NOT_ON_SEGMENT:'+oid+':'+sid)
                    elif kind=='equal':
                        if tag(n)!='line':errors.append('EQUAL_MARK_STYLE_MISMATCH:'+oid+':'+sid);continue
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
                lengths=[norm(sub(b,a)) for a,b in drawn]+list(path_lengths.values())
                peer_lengths=[]
                for entry in row['segments']:
                    ids=entry.get('path') if isinstance(entry,dict) else [entry]
                    total=0.0;complete=bool(ids)
                    for sid in ids or []:
                        seg=next((s for s in p.get('segments',[]) if s['id']==sid),None)
                        if seg:total+=norm(sub(peer_point(seg['refs'][1]),peer_point(seg['refs'][0])))
                        else:complete=False
                    if complete:peer_lengths.append(total)
                for group in (lengths,peer_lengths):
                    if group and any(abs(l-group[0])>LENGTH_RELATIVE*max(1.0,group[0]) for l in group):errors.append('EQUAL_MARK_LENGTH_MISMATCH:'+oid);break
                observations.append({'id':oid,'type':'EQUAL','lengths':lengths})
            else:
                units=[((b[0]-a[0])/norm(sub(b,a)),(b[1]-a[1])/norm(sub(b,a))) for a,b in drawn]
                if any(abs(u[0]*units[0][1]-u[1]*units[0][0])>math.sin(math.radians(ANGLE_TOLERANCE)) for u in units):errors.append('PARALLEL_MARK_NOT_PARALLEL:'+oid)
                observations.append({'id':oid,'type':'PARALLEL','segments':row['segments']})

    # ---- segment expression labels
    segment_lines={sid:drawn_segment(sid) for sid in {s['id'] for s in p.get('segments',[])}}
    common_rows=[{'id':r['id'],'ownerSegment':r.get('segment'),'text':r.get('text','공통'),'labelKind':'TEXT','labelAt':r.get('labelAt'),'labelWeight':r.get('labelWeight')} for r in marks.get('commonSides',[]) if isinstance(r,dict)]
    for row in [*marks.get('expressionLabels',[]),*common_rows]:
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
        elif any(distance_to(sid)+1e-9<mine+(NEAREST_OWNER_MARGIN_PX/sx if row.get('ownership')=='NEAREST' else 0.0) for sid in segment_lines if sid!=row['ownerSegment']):errors.append('SEGMENT_LABEL_AMBIGUOUS_OWNER:'+oid)
        label_content(oid,row.get('labelKind','MATH'),row['text'],row.get('unit'),row.get('labelWeight'))
        if row.get('labelAt') is not None:
            # labelAt START / END: the label stands nearer the first / second end of its segment than the other end (its projection on the segment, 0 = first end, 1 = second)
            at=row['labelAt']
            if not (at in ('START','MID','END') or (isinstance(at,(int,float)) and not isinstance(at,bool) and 0<=at<=1)):errors.append('SEGMENT_LABEL_AT_INVALID:'+oid)
            else:
                a,b=own;d=sub(b,a);fraction=((centre_model[0]-a[0])*d[0]+(centre_model[1]-a[1])*d[1])/(norm(d)**2)
                # a number 0..1 (E31): the label's centre stands within 0.4 of the segment's length from the stated fraction
                if (at=='START' and fraction>0.3) or (at=='END' and fraction<0.7) or (isinstance(at,(int,float)) and abs(fraction-at)>0.4):errors.append('SEGMENT_LABEL_NOT_AT_END:'+oid)
        observations.append({'id':oid,'type':'EXPRESSION_LABEL','ownerSegment':row['ownerSegment'],'distancePx':mine*sx,**({'labelKind':row['labelKind']} if row.get('labelKind') else {}),**({'unit':row['unit']} if row.get('unit') else {})})

    # ---- angle sums (E30): the equation of two angle marks at one vertex, re-derived here from the plan's own angle rows (values, vertex) and checked as a free math label
    angle_rows={r['id']:r for r in marks.get('angles',[]) if isinstance(r,dict) and 'id' in r}
    sum_rows=[]
    for row in marks.get('angleSums',[]):
        oid=row.get('id');ids=row.get('angles')
        if not (isinstance(ids,list) and len(ids)==2 and ids[0]!=ids[1] and all(i in angle_rows for i in ids)):errors.append('ANGLE_SUM_ANGLES_INVALID:'+str(oid));continue
        first,second=angle_rows[ids[0]],angle_rows[ids[1]]
        if first['refs'][1]!=second['refs'][1]:errors.append('ANGLE_SUM_VERTEX_MISMATCH:'+oid);continue
        if first.get('value') is None or second.get('value') is None:errors.append('ANGLE_SUM_NEEDS_VALUES:'+oid);continue
        total=float(first['value'])+float(second['value'])
        if row.get('label') is not None:
            try:stated=float(str(row['label']).rstrip('\u00b0'))
            except ValueError:stated=None
            if stated is None or abs(stated-total)>ANGLE_TOLERANCE:errors.append('ANGLE_SUM_MISMATCH:'+oid);continue
        number=lambda x:('%.6f'%x).rstrip('0').rstrip('.')
        sum_rows.append({'id':oid,'at':row.get('at',first['refs'][1]),'text':number(float(first['value']))+'\u00b0+'+number(float(second['value']))+'\u00b0='+number(total)+'\u00b0','labelKind':'MATH','anchor':row.get('anchor')})
    # ---- right angle expression labels (E30): beside the square mark inside the right angle, or on a leader from the square
    for row in p.get('rightAngles') or []:
        if row.get('label') is None:continue
        oid=row['id'];lid=oid+'-label';box=label_clear(lid)
        if box is None:continue
        a,v,c=[peer_point(r) for r in row['refs']];node=elements.get(lid)
        want=math_label_codes(str(row['label']));codes=glyph_codes(node) if node is not None else []
        if node is not None and node.get('data-text') is not None:errors.append('LABEL_KIND_MISMATCH:'+lid)
        elif len(codes)!=len(want) or any(code not in allowed for code,allowed in zip(codes,want)):errors.append('LABEL_TEXT_MISMATCH:'+lid)
        centre=inverse(box[0]+box[2]/2,box[1]+box[3]/2);ray_a=direction_degrees(sub(a,v));ray_c=direction_degrees(sub(c,v))
        spread=wrap180(ray_c-ray_a);offset=wrap180(direction_degrees(sub(centre,v))-ray_a)
        inside=(0<offset<spread) if spread>0 else (spread<offset<0)
        square=elements.get(oid)
        if square is not None and tag(square)=='polyline':
            raw=[float(x) for part in square.get('points','').split() for x in part.split(',')];outline=[(raw[i],raw[i+1]) for i in range(0,len(raw)-1,2)]
        else:outline=[]
        if lid in leaders:
            leader_ok(lid,box,lambda q:bool(outline) and min(point_segment_distance(q,s0,s1) for s0,s1 in zip(outline,outline[1:]))<=1.5)
        elif not inside:errors.append('RIGHT_ANGLE_LABEL_NOT_IN_ANGLE:'+oid)
        else:
            vx,vy=forward(v)
            if math.hypot(max(box[0]-vx,0,vx-(box[0]+box[2])),max(box[1]-vy,0,vy-(box[1]+box[3])))>ANGLE_LABEL_MAX_DISTANCE_PX+0.5:errors.append('RIGHT_ANGLE_LABEL_TOO_FAR:'+oid)
        observations.append({'id':oid,'type':'RIGHT_ANGLE_LABEL','label':row['label']})

    # ---- free text labels (E30): a plain Korean or math label at a stated source coordinate, or beside a point on a stated side
    for row in [*marks.get('textLabels',[]),*sum_rows]:
        oid=row.get('id');box=label_clear(oid)
        if box is None:continue
        at=row.get('at');text=str(row.get('text',''))
        if isinstance(at,str):target=forward(peer_point(at))
        elif isinstance(at,list) and len(at)==2 and all(isinstance(v,(int,float)) and not isinstance(v,bool) for v in at):target=forward((float(at[0]),float(at[1])))
        else:errors.append('TEXT_LABEL_AT_INVALID:'+oid);continue
        kind=row.get('labelKind') or ('TEXT' if TEXT_LABEL_HANGUL.search(text) else 'MATH')
        anchor=row.get('anchor') if row.get('anchor') is not None else ('CENTER' if not isinstance(at,str) else None)
        if anchor is not None and anchor not in TEXT_LABEL_ANCHORS:errors.append('TEXT_LABEL_ANCHOR_INVALID:'+oid);continue
        label_content(oid,kind,text,None,row.get('labelWeight'))
        node=elements.get(oid)
        if kind=='MATH' and node is not None:
            want=math_label_codes(text);codes=glyph_codes(node)
            if len(codes)!=len(want) or any(code not in allowed for code,allowed in zip(codes,want)):errors.append('LABEL_TEXT_MISMATCH:'+oid)
        cx,cy=box[0]+box[2]/2,box[1]+box[3]/2;ax,ay=target
        if anchor=='CENTER':
            if math.hypot(cx-ax,cy-ay)>TEXT_LABEL_CENTER_SLACK_PX:errors.append('TEXT_LABEL_NOT_AT_PLACE:'+oid)
        else:
            gap=math.hypot(max(box[0]-ax,0,ax-(box[0]+box[2])),max(box[1]-ay,0,ay-(box[1]+box[3])))
            if gap>TEXT_LABEL_MAX_GAP_PX:errors.append('TEXT_LABEL_TOO_FAR:'+oid)
            if anchor is not None:
                dx=1 if 'E' in anchor else -1 if 'W' in anchor else 0;dy=1 if 'S' in anchor else -1 if 'N' in anchor else 0
                if (dx>0 and box[0]<ax-0.5) or (dx<0 and box[0]+box[2]>ax+0.5) or (dy>0 and box[1]<ay-0.5) or (dy<0 and box[1]+box[3]>ay+0.5):errors.append('TEXT_LABEL_NOT_ON_SIDE:'+oid)
                if (dx==0 and abs(cx-ax)>1.0) or (dy==0 and abs(cy-ay)>1.0):errors.append('TEXT_LABEL_NOT_ON_SIDE:'+oid)
        observations.append({'id':oid,'type':'TEXT_LABEL','labelKind':kind,'anchor':anchor,'distancePx':math.hypot(cx-ax,cy-ay)})

    # ---- dimension lines: the bar, arrows or brace between two displayed points, every part recomputed from the peer points, the label on the outer side
    dimension_lines={}   # id -> the dimension's main polyline in svg px (its line, or the brace) for the label-ownership test
    dimension_rows=[row for row in marks.get('dimensions',[]) if isinstance(row,dict)]
    dimension_tiers=resolve_dimension_tiers(dimension_rows,peer_point)
    dimension_inline=set()
    arc_stroke_ids={n.get('id') for n in root.iter() if n.get('data-role') in ('circularArc','circle') and n.get('id')}
    for row in dimension_rows:
        oid=row['id'];tol=DIM_POSITION_TOLERANCE_PX
        a=forward(peer_point(row['from']));b=forward(peer_point(row['to']));length=norm(sub(b,a))
        if length<=1e-9:errors.append('DIMENSION_POINTS_COINCIDE:'+oid);continue
        side=row.get('side')
        if side not in DIM_SIDE_VECTORS:errors.append('DIMENSION_SIDE_INVALID:'+oid);continue
        d=((b[0]-a[0])/length,(b[1]-a[1])/length);want=DIM_SIDE_VECTORS[side]
        n=max(((-d[1],d[0]),(d[1],-d[0])),key=lambda v:v[0]*want[0]+v[1]*want[1])
        if n[0]*want[0]+n[1]*want[1]<DIM_SIDE_MIN_DOT:errors.append('DIMENSION_SIDE_AMBIGUOUS:'+oid);continue
        style=row.get('style','BAR');offset=dimension_tiers.get(oid) if row.get('offset')=='AUTO' else row.get('offset',1)
        if isinstance(offset,bool) or not isinstance(offset,int) or not 1<=offset<=DIM_MAX_TIER:errors.append('DIMENSION_OFFSET_INVALID:'+oid);continue
        if style not in ('BAR','ARROW','BRACE','INLINE'):errors.append('DIMENSION_STYLE_INVALID:'+oid);continue
        extension=row.get('extension','FULL')
        if extension not in ('FULL','NONE'):errors.append('DIMENSION_EXTENSION_INVALID:'+oid);continue
        if row.get('offsetPx') is not None and not DIM_OFFSET_PX_RANGE[0]<=float(row['offsetPx'])<=DIM_OFFSET_PX_RANGE[1]:errors.append('DIMENSION_OFFSET_PX_INVALID:'+oid);continue
        if row.get('value') is not None:
            drawn_length=norm(sub(peer_point(row['to']),peer_point(row['from'])))
            if abs(drawn_length-float(row['value']))>1e-6*max(1.0,float(row['value'])):errors.append('DIMENSION_FACT_MISMATCH:'+oid+':declared=%s:drawn=%.6f'%(row['value'],drawn_length))
        dist=dimension_distance(row,style,offset)
        frame=lambda q:((q[0]-a[0])*d[0]+(q[1]-a[1])*d[1],(q[0]-a[0])*n[0]+(q[1]-a[1])*n[1])   # (along p->q, across toward the declared side) of an svg point
        parts={}
        for node in by_mark.get(('dimension',oid),[]):parts.setdefault(node.get('data-mark-part'),[]).append(node)
        wanted=['brace'] if style=='BRACE' else ['arrow-from','arrow-to'] if style=='INLINE' else (['ext-from','ext-to'] if extension!='NONE' else [])+['line']+(['tick-from','tick-to'] if style=='BAR' else ['arrow-from','arrow-to'])
        missing=[part for part in wanted if len(parts.get(part,[]))!=1]
        for part in missing:errors.append('DIMENSION_PART_MISSING:'+oid+':'+part)
        for part in parts:
            if part not in wanted:errors.append('DIMENSION_PART_UNEXPECTED:'+oid+':'+str(part))
        if missing:continue
        def line_ends(part):
            node=parts[part][0]
            if tag(node)!='line':errors.append('DIMENSION_PART_SHAPE:'+oid+':'+part);return None
            return [frame((float(node.get('x1')),float(node.get('y1')))),frame((float(node.get('x2')),float(node.get('y2'))))]
        def polygon_points(part):
            node=parts[part][0]
            if tag(node) not in ('polygon','polyline'):errors.append('DIMENSION_PART_SHAPE:'+oid+':'+part);return None
            raw=[float(v) for chunk in node.get('points','').split() for v in chunk.split(',')]
            return [(raw[i],raw[i+1]) for i in range(0,len(raw)-1,2)]
        def near(x,y):return abs(x-y)<=tol
        if style=='BRACE':
            points=polygon_points('brace')
            if points is not None:
                expected=brace_expected(length,dist);observed=[frame(q) for q in points]
                if any(across<-tol for _a,across in observed):errors.append('DIMENSION_SIDE_MISMATCH:'+oid)
                elif len(observed)!=len(expected) or any(not near(o[0],e[0]) or not near(o[1],e[1]) for o,e in zip(observed,expected)):errors.append('DIMENSION_BRACE_MISMATCH:'+oid)
                dimension_lines[oid]=points
        elif style=='INLINE':
            # arrowheads inside the two points, tips on the segment, no line of its own: the segment itself stands for the dimension line
            dimension_inline.add(oid);dimension_lines[oid]=[a,b]
            for part,along,out in (('arrow-from',DIM_INLINE_TIP_INSET_PX,-1.0),('arrow-to',length-DIM_INLINE_TIP_INSET_PX,1.0)):
                points=polygon_points(part)
                if points is None:continue
                if len(points)!=3:errors.append('DIMENSION_ARROW_MISMATCH:'+oid+':'+part);continue
                tip,left,right=[frame(q) for q in points]
                ok=near(tip[0],along) and near(tip[1],0.0)
                ok=ok and near(left[0],along-out*DIM_ARROW_LENGTH_PX) and near(right[0],along-out*DIM_ARROW_LENGTH_PX)
                ok=ok and near(abs(left[1]-right[1]),2*DIM_ARROW_HALF_WIDTH_PX) and near((left[1]+right[1])/2,0.0)
                if not ok:errors.append('DIMENSION_ARROW_MISMATCH:'+oid+':'+part)
        else:
            ends=line_ends('line')
            if ends is not None:
                if any(across<-tol for _a,across in ends):errors.append('DIMENSION_SIDE_MISMATCH:'+oid)
                elif any(not near(across,dist) for _a,across in ends):errors.append('DIMENSION_OFFSET_MISMATCH:'+oid)
                elif not (near(ends[0][0],0.0) and near(ends[1][0],length)):errors.append('DIMENSION_END_MISMATCH:'+oid)
                node=parts['line'][0];dimension_lines[oid]=[(float(node.get('x1')),float(node.get('y1'))),(float(node.get('x2')),float(node.get('y2')))]
            reach=dist-DIM_BAR_TICK_HALF_PX if style=='BAR' else dist+DIM_ARROW_PAST_PX
            for part,along in (('ext-from',0.0),('ext-to',length)):
                if extension=='NONE':continue
                ext=line_ends(part)
                if ext is not None and not (near(ext[0][0],along) and near(ext[1][0],along) and near(ext[0][1],DIM_EXT_START_PX) and near(ext[1][1],reach)):errors.append('DIMENSION_EXTENSION_MISMATCH:'+oid+':'+part)
            if style=='BAR':
                for part,along in (('tick-from',0.0),('tick-to',length)):
                    tick=line_ends(part)
                    if tick is None:continue
                    low,high=sorted(t[1] for t in tick)
                    if not (near(tick[0][0],along) and near(tick[1][0],along) and near(low,dist-DIM_BAR_TICK_HALF_PX) and near(high,dist+DIM_BAR_TICK_HALF_PX)):errors.append('DIMENSION_TICK_MISMATCH:'+oid+':'+part)
            else:
                for part,along,out in (('arrow-from',0.0,-1.0),('arrow-to',length,1.0)):
                    points=polygon_points(part)
                    if points is None:continue
                    if len(points)!=3:errors.append('DIMENSION_ARROW_MISMATCH:'+oid+':'+part);continue
                    tip,left,right=[frame(q) for q in points]
                    ok=near(tip[0],along) and near(tip[1],dist)
                    ok=ok and near(left[0],along-out*DIM_ARROW_LENGTH_PX) and near(right[0],along-out*DIM_ARROW_LENGTH_PX)
                    ok=ok and near(abs(left[1]-right[1]),2*DIM_ARROW_HALF_WIDTH_PX) and near((left[1]+right[1])/2,dist)
                    if not ok:errors.append('DIMENSION_ARROW_MISMATCH:'+oid+':'+part)
        observations.append({'id':oid,'type':'DIMENSION','style':style,'side':side,'offset':offset,'lengthPx':length,'distancePx':dist})
    for row in dimension_rows:
        oid=row['id']
        if oid not in dimension_lines:continue
        a=forward(peer_point(row['from']));b=forward(peer_point(row['to']));length=norm(sub(b,a));d=((b[0]-a[0])/length,(b[1]-a[1])/length)
        want=DIM_SIDE_VECTORS[row['side']];n=max(((-d[1],d[0]),(d[1],-d[0])),key=lambda v:v[0]*want[0]+v[1]*want[1])
        dist=dimension_distance(row,row.get('style','BAR'),dimension_tiers.get(oid) if row.get('offset')=='AUTO' else row.get('offset',1))
        frame=lambda q:((q[0]-a[0])*d[0]+(q[1]-a[1])*d[1],(q[0]-a[0])*n[0]+(q[1]-a[1])*n[1])
        box=label_clear(oid+'-label')
        if box is not None:
            corners=[(box[0],box[1]),(box[0]+box[2],box[1]),(box[0],box[1]+box[3]),(box[0]+box[2],box[1]+box[3])]
            along,_across=frame((box[0]+box[2]/2,box[1]+box[3]/2));near_edge=min(frame(q)[1] for q in corners)
            if near_edge<dist-0.5:errors.append('DIMENSION_LABEL_NOT_OUTSIDE:'+oid)
            elif near_edge-dist>DIM_LABEL_MAX_GAP_PX:errors.append('DIMENSION_LABEL_TOO_FAR:'+oid)
            if abs(along-length/2)>DIM_LABEL_MAX_SLIDE*length:errors.append('DIMENSION_LABEL_OFF_CENTER:'+oid)
            mine=box_polyline_distance(box,dimension_lines[oid])
            for other,line in dimension_lines.items():
                if other!=oid and box_polyline_distance(box,line)+1e-9<mine:errors.append('DIMENSION_LABEL_AMBIGUOUS_OWNER:'+oid+':'+other)
        label,unit=dimension_label_parts(row)
        label_content(oid+'-label',row.get('labelKind','MATH'),label,unit,row.get('labelWeight'))
        # the dimension line itself (or the brace) never crosses a drawn stroke: its own parts and another dimension's extension lines excepted
        line=dimension_lines[oid]
        if oid in dimension_inline:continue      # an inline dimension has no line of its own: the segment it stands on is drawn anyway
        for sid,pts in strokes:
            sid=str(sid)
            if sid.startswith(oid+'-') or re.fullmatch(r'.+-ext-(?:from|to)',sid):continue
            if row.get('crossArcs') is True and sid in arc_stroke_ids:continue      # crossArcs: the dimension line may cross circular arcs
            if any(properly_cross(c,e,q0,q1) for c,e in zip(line,line[1:]) for q0,q1 in zip(pts,pts[1:])):errors.append('DIMENSION_CROSSES_STROKE:'+oid+':'+sid)

    # ---- path total-length labels: one label for a bent path (consecutive drawn segments), tied to the path by a visible leader that starts on it
    for row in marks.get('pathLabels',[]):
        oid=row['id'];ids=row.get('points') or []
        if len(ids)<3 or len(set(ids))!=len(ids):errors.append('PATH_LABEL_POINTS_INVALID:'+oid);continue
        if row.get('closed') is not None and row.get('closed') is not True:errors.append('PATH_LABEL_CLOSED_INVALID:'+oid)
        closed=row.get('closed') is True;ring_ids=ids+ids[:1] if closed else ids      # closed: a perimeter, the last point joins back to the first
        path=[forward(peer_point(pid)) for pid in ring_ids];owned=[]
        for a_id,b_id in zip(ring_ids,ring_ids[1:]):
            hit=next((s for s in p.get('segments',[]) if set(s.get('refs') or [])=={a_id,b_id}),None)
            if hit is None or drawn_segment(hit['id']) is None:errors.append('PATH_LABEL_SEGMENT_NOT_DRAWN:'+oid+':'+a_id+'-'+b_id)
            else:owned.append(hit['id'])
        total=sum(norm(sub(peer_point(b_id),peer_point(a_id))) for a_id,b_id in zip(ring_ids,ring_ids[1:]))
        if row.get('value') is not None and abs(total-float(row['value']))>1e-6*max(1.0,float(row['value'])):errors.append('PATH_LABEL_FACT_MISMATCH:'+oid+':declared=%s:drawn=%.6f'%(row['value'],total))
        box=label_clear(oid+'-label')
        if box is not None:
            node=leaders.get(oid+'-label')
            if node is None:errors.append('PATH_LABEL_LEADER_MISSING:'+oid)
            else:
                leader_ok(oid+'-label',box,lambda q:min(point_segment_distance(q,c,d) for c,d in zip(path,path[1:]))<=1.0)
                la=(float(node.get('x1')),float(node.get('y1')));lb=(float(node.get('x2')),float(node.get('y2')))
                for sid,pts in strokes:
                    if closed and sid in ids:continue      # a perimeter leader may leave from a corner: that corner's own dot is where it starts
                    if any(properly_cross(la,lb,q0,q1) for q0,q1 in zip(pts,pts[1:])):errors.append('PATH_LABEL_LEADER_CROSSES:'+oid+':'+str(sid))
                if closed:
                    # a perimeter label stands outside the figure, its leader never enters it
                    ring=path[:-1]
                    def inside(q):
                        hit=False
                        for (ax,ay),(bx,by) in zip(ring,ring[1:]+ring[:1]):
                            if (ay>q[1])!=(by>q[1]) and q[0]<(bx-ax)*(q[1]-ay)/(by-ay)+ax:hit=not hit
                        return hit
                    if any(inside((box[0]+box[2]*i/4,box[1]+box[3]*j/2)) for i in range(5) for j in range(3)):errors.append('PATH_LABEL_NOT_OUTSIDE:'+oid)
                    span=norm(sub(lb,la))
                    if span>1e-9:
                        steps=max(2,int(span//4))
                        if any(inside((la[0]+(lb[0]-la[0])*k/steps,la[1]+(lb[1]-la[1])*k/steps)) for k in range(steps+1) if span*k/steps>=3.0):errors.append('PATH_LABEL_LEADER_ENTERS:'+oid)
        label,unit=dimension_label_parts(row)
        label_content(oid+'-label',row.get('labelKind','MATH'),label,unit,row.get('labelWeight'))
        observations.append({'id':oid,'type':'PATH_LABEL','points':ids,'lengthModel':total,'segments':owned,**({'closed':True} if closed else {})})

    # ---- highlighted circle arcs
    def arc_span(row):
        """(centre, radius, start direction in degrees, signed sweep in degrees) of a declared arc, from the peer points and the declared side only."""
        center=peer_point(row['center']);start=peer_point(row['from']);end=peer_point(row['to'])
        ccw=(direction_degrees(sub(end,center))-direction_degrees(sub(start,center)))%360.0
        side=row.get('side')
        counter=side=='CCW' or (side not in ('CW',) and (ccw<180.0)==((side or 'MINOR')=='MINOR'))
        return center,norm(sub(start,center)),direction_degrees(sub(start,center)),ccw if counter else -(360.0-ccw)
    def arc_gap(row,angle):
        """Degrees from a direction (seen from the arc's centre) to the arc's span: 0 inside it."""
        _c,_r,first,sweep=arc_span(row)
        offset=((angle-first)*(1 if sweep>0 else -1))%360.0
        return 0.0 if offset<=abs(sweep) else min(offset-abs(sweep),360.0-offset)
    def audit_arc_label(row):
        oid=row['id'];center,radius,_first,_sweep=arc_span(row)
        box=label_clear(oid+'-label')
        if box is None:return
        c=inverse(box[0]+box[2]/2,box[1]+box[3]/2)
        if row.get('labelPlacement')=='LEADER':
            # labelPlacement LEADER (E32): anywhere free (inside or outside the circle) on a leader that starts ON this arc (within its span), crossing no other stroke
            node=leaders.get(oid+'-label')
            if node is None:errors.append('ARC_LABEL_LEADER_MISSING:'+oid)
            else:
                def on_own_arc(q):
                    point=inverse(*q)
                    return abs(norm(sub(point,center))-radius)*sx<=1.5 and arc_gap(row,direction_degrees(sub(point,center)))<=ARC_LEADER_SPAN_SLACK_DEGREES
                leader_ok(oid+'-label',box,on_own_arc)
                la=(float(node.get('x1')),float(node.get('y1')));lb=(float(node.get('x2')),float(node.get('y2')))
                own={oid}|{n.get('id') for n in root.iter() if tag(n)=='circle' and n.get('data-role')=='circle' and abs(float(n.get('r'))-radius*sx)<=0.6 and norm(sub(inverse(float(n.get('cx')),float(n.get('cy'))),center))*sx<=0.6}
                for sid,pts in strokes:
                    if sid in own:continue
                    if any(properly_cross(la,lb,q0,q1) for q0,q1 in zip(pts,pts[1:])):errors.append('ARC_LABEL_LEADER_CROSSES:'+oid+':'+str(sid))
        else:
            if norm(sub(c,center))<=radius:errors.append('ARC_LABEL_INSIDE_CIRCLE:'+oid)
            if not leader_ok(oid+'-label',box,lambda q:abs(norm(sub(inverse(*q),center))-radius)*sx<=1.5):
                # no leader: the label must be nearer its own arc than another arc of the same circle
                angle=direction_degrees(sub(c,center));mine=arc_gap(row,angle)
                if any(other is not row and other.get('circle')==row.get('circle') and other.get('center')==row.get('center') and arc_gap(other,angle)+1e-9<mine for other in marks.get('arcs',[])):errors.append('ARC_LABEL_AMBIGUOUS_OWNER:'+oid)
        kind=row.get('labelKind','MATH' if row.get('unit') else 'DEGREE')
        if kind=='TEXT' or row.get('unit'):label_content(oid+'-label',kind,row['label'],row.get('unit'),row.get('labelWeight'))
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
        if row.get('label') is not None:audit_arc_label(row)
    # a label on an arc that is only part of the drawn circle (highlight false) still stands beside its own arc
    for row in marks.get('arcs',[]):
        if row.get('highlight',True) is False and row.get('label') is not None:audit_arc_label(row)

    # ---- construction traces: thin solid compass arcs around the declared intersections
    for row in marks.get('traces',[]):
        oid=row['id'];nodes=by_mark.get(('trace',oid),[])
        center=peer_point(row['center'])
        radius_spec=row.get('radius') or {}
        if 'point' in radius_spec:
            radius=norm(sub(peer_point(radius_spec['point']),center))
        else:
            sid=radius_spec.get('segment');seg=next((s for s in p.get('segments',[]) if s['id']==sid),None)
            if seg is None:errors.append('TRACE_RADIUS_MISSING:'+oid);continue
            radius=norm(sub(peer_point(seg['refs'][1]),peer_point(seg['refs'][0])))
        through=list(row.get('through') or [])
        span=float(row.get('spanDeg',24))
        join=row.get('span')=='JOIN' and len(through)>1
        if row.get('span') not in (None,'JOIN'):errors.append('TRACE_SPAN_INVALID:'+oid);continue
        if not nodes:errors.append('TRACE_ARC_MISSING:'+oid);continue
        if len(nodes)!=(1 if join else len(through)):errors.append('TRACE_ARC_COUNT_MISMATCH:'+oid);continue
        arcs=sorted(nodes,key=lambda n:int(n.get('data-mark-index','0')))
        if join:
            # span JOIN: one continuous arc, counter-clockwise, from spanDeg/2 before the first stated intersection to spanDeg/2 past the last one; the smallest arc that holds them all
            points=poly_model(arcs[0])
            if len(points)<8:errors.append('TRACE_ARC_MISSING:'+oid);continue
            if max(abs(norm(sub(q,center))-radius) for q in points)>1e-6*max(1.0,radius):errors.append('TRACE_ARC_RADIUS_MISMATCH:'+oid)
            targets=sorted(direction_degrees(sub(peer_point(pid),center))%360.0 for pid in through)
            gaps=[(targets[(i+1)%len(targets)]-targets[i])%360.0 or 360.0 for i in range(len(targets))]
            largest=max(range(len(gaps)),key=lambda i:gaps[i])
            want_start=targets[(largest+1)%len(targets)]-span/2;want_sweep=360.0-gaps[largest]+span
            drawn_start=direction_degrees(sub(points[0],center))
            drawn_sweep=sum(wrap180(direction_degrees(sub(q1,center))-direction_degrees(sub(q0,center))) for q0,q1 in zip(points,points[1:]))
            if abs(wrap180(drawn_start-want_start))>1.0 or abs(drawn_sweep-want_sweep)>1.0:errors.append('TRACE_JOIN_SPAN_MISMATCH:'+oid+':drawn=%.2f+%.2f:expected=%.2f+%.2f'%(drawn_start,drawn_sweep,want_start,want_sweep))
            for pid in through:
                offset=(direction_degrees(sub(peer_point(pid),center))-drawn_start)%360.0
                if drawn_sweep<=0 or offset>drawn_sweep+RAY_TOLERANCE:errors.append('TRACE_ARC_DOES_NOT_PASS_THROUGH:'+oid+':'+pid)
            if arcs[0].get('stroke-dasharray'):errors.append('TRACE_ARC_DASHED:'+oid+':'+through[0])
            try:width=float(arcs[0].get('stroke-width'))
            except (TypeError,ValueError):width=math.inf
            if width>1.2:errors.append('TRACE_ARC_TOO_THICK:'+oid+':'+through[0])
            if str(arcs[0].get('fill','none')).lower() not in ('none',''):errors.append('TRACE_ARC_HAS_FILL:'+oid+':'+through[0])
            arcs_to_check=[]
        else:arcs_to_check=list(zip(arcs,through))
        for arc,pid in arcs_to_check:
            points=poly_model(arc)
            if len(points)<8:errors.append('TRACE_ARC_MISSING:'+oid);continue
            distances=[norm(sub(q,center)) for q in points]
            if max(abs(d-radius) for d in distances)>1e-6*max(1.0,radius):errors.append('TRACE_ARC_RADIUS_MISMATCH:'+oid+':'+pid)
            target=peer_point(pid)
            if abs(norm(sub(target,center))-radius)>1e-6*max(1.0,radius):errors.append('TRACE_TARGET_NOT_ON_ARC:'+pid)
            theta=direction_degrees(sub(target,center))
            offsets=[wrap180(direction_degrees(sub(q,center))-theta) for q in points]
            if min(offsets)>RAY_TOLERANCE or max(offsets)<-RAY_TOLERANCE:errors.append('TRACE_ARC_DOES_NOT_PASS_THROUGH:'+oid+':'+pid)
            drawn_span=max(offsets)-min(offsets)
            if abs(drawn_span-span)>1.0:errors.append('TRACE_ARC_SPAN_MISMATCH:'+oid+':'+pid)
            if arc.get('stroke-dasharray'):errors.append('TRACE_ARC_DASHED:'+oid+':'+pid)
            try:width=float(arc.get('stroke-width'))
            except (TypeError,ValueError):width=math.inf
            if width>1.2:errors.append('TRACE_ARC_TOO_THICK:'+oid+':'+pid)
            if str(arc.get('fill','none')).lower() not in ('none',''):errors.append('TRACE_ARC_HAS_FILL:'+oid+':'+pid)
        observations.append({'id':oid,'type':'TRACE','center':row['center'],'radius':radius,'arcs':len(arcs),'through':through,'spanDeg':span,**({'span':'JOIN'} if join else {})})
        if row.get('label') is not None:
            box=label_clear(oid+'-label')
            if box is not None:
                middle=inverse(box[0]+box[2]/2,box[1]+box[3]/2)
                if norm(sub(middle,center))<radius:errors.append('TRACE_LABEL_INSIDE_CIRCLE:'+oid)
                if row.get('labelAt') is not None:
                    # labelAt: the label's direction from the centre is near the declared place round the circle (the start / middle / end of the DRAWN first arc, or the stated direction)
                    pts=poly_model(arcs[0]);first=direction_degrees(sub(pts[0],center))
                    sweep=sum(wrap180(direction_degrees(sub(q1,center))-direction_degrees(sub(q0,center))) for q0,q1 in zip(pts,pts[1:]))
                    at=row['labelAt'];anchor=first if at=='START' else first+sweep if at=='END' else first+sweep/2 if at=='MID' else float(at)
                    if abs(wrap180(direction_degrees(sub(middle,center))-anchor))>TRACE_LABEL_AT_TOLERANCE:errors.append('TRACE_LABEL_NOT_AT_ANCHOR:'+oid)
                leader_ok(oid+'-label',box,lambda q:abs(norm(sub(inverse(*q),center))-radius)*sx<=1.5)
            if row.get('labelKind')=='TEXT' or row.get('unit'):label_content(oid+'-label',row.get('labelKind','MATH'),row['label'],row.get('unit'),row.get('labelWeight'))
            else:
                node=elements.get(oid+'-label')
                codes=[] if node is None else glyph_codes(node)
                want=[format(ord(ch),'X') for ch in str(row['label'])]
                if codes and codes!=want:errors.append('TRACE_LABEL_MISMATCH:'+oid)

    # ---- filled regions (plane_regions_observer.py)
    audit_regions(root,marks,peer_point,forward,by_mark,label_clear,errors,observations,label_boxes,leaders=leaders,leader_ok=leader_ok,strokes=strokes)

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

    # ---- segment emphasis: exactly the declared segments are heavy (BOLD) or heavy and red (ACCENT); every other segment keeps the default style
    segment_ids={s['id'] for s in p.get('segments',[])}
    drawn_lines=[]   # (a, b) in svg px of every axis and every drawn line that is not one of the plan's segments: a segment lying on one is painted heavier by the engine
    for n in root.iter():
        if tag(n)=='line' and (n.get('data-role')=='axis' or (n.get('data-role')=='line' and n.get('id') not in segment_ids)):
            drawn_lines.append(((float(n.get('x1')),float(n.get('y1'))),(float(n.get('x2')),float(n.get('y2')))))
    def lies_on_drawn_line(node):
        ends=[(float(node.get('x1')),float(node.get('y1'))),(float(node.get('x2')),float(node.get('y2')))]
        for a,b in drawn_lines:
            d=sub(b,a)
            if norm(d)>1e-9 and all(abs((q[0]-a[0])*d[1]-(q[1]-a[1])*d[0])/norm(d)<=0.5 for q in ends):return True
        return False
    for s in p.get('segments',[]):
        node=elements.get(s['id'])
        if node is None:continue
        try:width=float(node.get('stroke-width'))
        except (TypeError,ValueError):width=0.0
        stroke=str(node.get('stroke') or '').lower();emphasis=s.get('emphasis')
        if emphasis in ('BOLD','ACCENT'):
            if width<EMPHASIS_WIDTH:errors.append('SEGMENT_EMPHASIS_MISSING:'+s['id'])
            if stroke!=(ACCENT_STROKE if emphasis=='ACCENT' else DEFAULT_STROKE):errors.append('SEGMENT_EMPHASIS_COLOR_MISMATCH:'+s['id'])
            observations.append({'id':s['id'],'type':'SEGMENT_EMPHASIS','emphasis':emphasis,'strokeWidth':width,'stroke':stroke})
        elif emphasis is not None:errors.append('SEGMENT_EMPHASIS_INVALID:'+s['id'])
        elif stroke!=DEFAULT_STROKE or (width>=EMPHASIS_WIDTH and not lies_on_drawn_line(node)):errors.append('SEGMENT_EMPHASIS_UNDECLARED:'+s['id'])

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
