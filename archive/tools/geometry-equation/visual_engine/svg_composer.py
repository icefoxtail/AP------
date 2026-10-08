"""Materialize prepared screen primitives. Computes no mathematical relations."""
import html
import math
import re
import xml.etree.ElementTree as ET
from .style_tokens import load

def esc(value):return html.escape(str(value),quote=True)
def num(value):return f'{value:.9f}'.rstrip('0').rstrip('.') or '0'

def callout_leader_end(box,start,center):
    dx,dy=center[0]-start[0],center[1]-start[1]
    if math.hypot(dx,dy)<=1e-9:raise ValueError('TICK_LABEL_OWNER_LEADER_BINDING_INVALID')
    tx=math.inf if abs(dx)<=1e-12 else (box['width']/2)/abs(dx)
    ty=math.inf if abs(dy)<=1e-12 else (box['height']/2)/abs(dy)
    fraction=min(tx,ty)
    return [center[0]-dx*fraction,center[1]-dy*fraction]

def safe_math_markup(value):
    root=ET.fromstring('<text>'+value+'</text>')
    for child in root.iter():
        if child.tag not in {'text','tspan'} or set(child.attrib)-{'font-style','baseline-shift','font-size'}:
            raise ValueError('UNSAFE_MATH_MARKUP')
    return value

def owner_attrs(value):
    fields={'owner':'data-owner','ownerPoints':'data-owner-points','sourceLabel':'data-source-label','annotation':'data-annotation','ownerKind':'data-owner-kind','factRole':'data-fact-role','state':'data-state','branch':'data-branch','featureKind':'data-feature-kind','poleSide':'data-pole-side'}
    return ''.join(' '+name+'="'+esc(' '.join(value[key]) if isinstance(value[key],(list,tuple)) else value[key])+'"' for key,name in fields.items() if key in value)

def validate_fragment_font(root,font_px):
    """Reject box compaction before rendering; keep frozen font coordinates."""
    def number(value):
        try:result=float(str(value).removesuffix('px'))
        except (TypeError,ValueError):raise ValueError('FROZEN_FRAGMENT_FONT_SCALE_INVALID') from None
        if not math.isfinite(result) or result<=0:raise ValueError('FROZEN_FRAGMENT_FONT_SCALE_INVALID')
        return result
    width=number(root.get('width'));height=number(root.get('height'))
    if root.get('data-outline-width') is not None:
        expected_w=number(root.get('data-outline-width'));expected_h=number(root.get('data-outline-height'))
        if abs(width-expected_w)>1e-6 or abs(height-expected_h)>1e-6:raise ValueError('FROZEN_FRAGMENT_FONT_SCALE_CHANGED')
    vb=list(map(float,root.get('viewBox','').split()))
    if len(vb)!=4 or vb[:2]!=[0,0] or abs(vb[2]-width)>1e-6 or abs(vb[3]-height)>1e-6:raise ValueError('FROZEN_FRAGMENT_FONT_SCALE_CHANGED')
    # Legacy MathJax fragments have a second SVG viewport. Its font-unit
    # scale must equal the requested font, even when its outer box was edited.
    for node in root.iter():
        if node is root or node.tag.split('}')[-1]!='svg':continue
        if not any(child.get('data-mml-node')=='math' for child in node.iter()):continue
        view=list(map(float,node.get('viewBox','').split()))
        if len(view)!=4:raise ValueError('FROZEN_FRAGMENT_FONT_SCALE_INVALID')
        scales=(number(node.get('width'))/number(view[2]),number(node.get('height'))/number(view[3]))
        if any(abs(scale-font_px/1000)>1e-6 for scale in scales):raise ValueError('FROZEN_FRAGMENT_FONT_SCALE_CHANGED')

def compose(prepared,layout,viewport,fragments=None):
    tokens=load();seen={'visual-title','visual-desc'};semantic_labels=set();layers=[]
    if any('tickLabelKnockout' in row for row in layout.get('labels',[])) or any('tickLabelKnockout' in row for row in layout.get('trace',[])):
        raise ValueError('TICK_LABEL_CURVE_MASK_FORBIDDEN')
    def element_id(value):
        if value in seen:raise ValueError('DUPLICATE_SVG_ID:'+value)
        seen.add(value);return esc(value)
    for index,p in enumerate(prepared['primitives']):
        oid=element_id(p['id']);kind=p['kind'];token=p.get('token','mainShape')
        stroke=tokens[token] if token in tokens else None
        if not isinstance(stroke,(int,float)):raise ValueError('UNKNOWN_STYLE_TOKEN')
        attrs=f'id="{oid}" data-role="{esc(p.get("role",kind))}" stroke="{tokens["primary"]}" stroke-width="{stroke}" fill="none"'
        attrs+=owner_attrs(p)
        if p.get('role') in {'axis','tick'}:
            attrs+=' data-axis="'+esc(p['axis'])+'"'
        if p.get('role')=='tick':attrs+=' data-value="'+esc(p['value'])+'"'
        if p.get('requiredLabelId'):attrs+=' data-required-label-id="'+esc(p['requiredLabelId'])+'"'
        if p.get('fill'):attrs=attrs.replace('fill="none"','fill="'+esc(p['fill'])+'"')
        if p.get('noStroke'):attrs=attrs.replace('stroke="'+tokens['primary']+'"','stroke="none"')
        if p.get('dash'):attrs+=' stroke-dasharray="'+esc(p['dash'])+'"'
        if kind=='circle':
            if p.get('role')=='point':attrs=attrs.replace('fill="none"','fill="#111"')
            svg=f'<circle {attrs} cx="{num(p["at"][0])}" cy="{num(p["at"][1])}" r="{num(p["radius"])}"/>'
        elif kind=='line':
            svg=f'<line {attrs} x1="{num(p["from"][0])}" y1="{num(p["from"][1])}" x2="{num(p["to"][0])}" y2="{num(p["to"][1])}"/>'
        elif kind in {'polyline','polygon'}:
            svg=f'<{kind} {attrs} points="'+ ' '.join(num(x)+','+num(y) for x,y in p['points'])+'"/>'
        elif kind=='path':svg=f'<path {attrs} d="{esc(p["d"])}"/>'
        else:raise ValueError('UNKNOWN_COMPOSER_PRIMITIVE')
        layers.append((p['layer'],index,svg))
    for index,leader in enumerate(layout.get('leaders',[])):
        owner=next((value for value in layout['labels'] if value.get('id')==leader.get('ownerLabelId')),None)
        tick=next((value for value in prepared['primitives'] if value.get('id')==leader.get('tickId')),None)
        binding=owner.get('tickLabelCallout') if owner else None
        if (leader.get('schemaVersion')!='TICK_LABEL_OWNER_LEADER_v1'
            or set(leader)!={'schemaVersion','id','from','to','ownerLabelId','tickId','axis','value'}
            or not owner or owner.get('kind')!='TICK_LABEL' or not binding
            or binding.get('schemaVersion')!='TICK_LABEL_OWNER_LEADER_v1'
            or binding.get('tickId')!=leader.get('tickId') or binding.get('axis')!=leader.get('axis')
            or binding.get('value')!=leader.get('value') or binding.get('sourceAt')!=leader.get('from')
            or list(owner.get('at',[]))!=leader.get('from') or not tick or tick.get('role')!='tick'
            or tick.get('axis')!=leader.get('axis') or abs(float(tick.get('value'))-float(leader.get('value')))>1e-9
            or not isinstance(leader.get('from'),list) or len(leader['from'])!=2
            or not isinstance(leader.get('to'),list) or len(leader['to'])!=2):
            raise ValueError('TICK_LABEL_OWNER_LEADER_BINDING_INVALID')
        try:x1,y1,x2,y2=(*(float(value) for value in leader['from']),*(float(value) for value in leader['to']))
        except (TypeError,ValueError):raise ValueError('TICK_LABEL_OWNER_LEADER_COORDINATE_INVALID') from None
        if not all(math.isfinite(value) for value in (x1,y1,x2,y2)) or math.hypot(x2-x1,y2-y1)<=1e-6 or math.hypot(x2-x1,y2-y1)>48:
            raise ValueError('TICK_LABEL_OWNER_LEADER_COORDINATE_INVALID')
        offset=binding.get('offsetUser')
        if offset!=[28,-22] or not isinstance(owner.get('box'),dict):raise ValueError('TICK_LABEL_OWNER_LEADER_BINDING_INVALID')
        center=[leader['from'][0]+offset[0],leader['from'][1]+offset[1]]
        box=owner['box']
        expected_box={'x':center[0]-box['width']/2,'y':center[1]-box['height']/2,'width':box['width'],'height':box['height']}
        if any(abs(expected_box[key]-box[key])>1e-6 for key in ('x','y','width','height')):raise ValueError('TICK_LABEL_OWNER_LEADER_LABEL_CENTER_INVALID')
        expected_end=callout_leader_end(box,leader['from'],center)
        if math.hypot(expected_end[0]-x2,expected_end[1]-y2)>1e-6:raise ValueError('TICK_LABEL_OWNER_LEADER_ENDPOINT_INVALID')
        oid=element_id(leader['id'])
        svg=(f'<line id="{oid}" data-role="leader" data-owner-label="{esc(leader["ownerLabelId"])}" '
             f'data-tick-owner="{esc(leader["tickId"])}" data-tick-axis="{esc(leader["axis"])}" '
             f'data-tick-value="{esc(leader["value"])}" x1="{num(x1)}" y1="{num(y1)}" '
             f'x2="{num(x2)}" y2="{num(y2)}" stroke="#666" stroke-width="0.8" fill="none"/>')
        layers.append((85,index,svg))
    for index,label in enumerate(layout['labels']):
        oid=element_id(label['id']);key=(label['kind'],label.get('owner',label.get('target')),label['text'])
        if key in semantic_labels:raise ValueError('DUPLICATE_SEMANTIC_LABEL')
        semantic_labels.add(key)
        if label['kind']=='COORDINATE_LABEL' and re.search(r'\d+\.\d+',label['text']) and not label.get('sourceDecimalEvidence'):
            raise ValueError('INVALID_STUDENT_DECIMAL_LABEL')
        x,y=label['baseline'];font=label['font'];box=label['box']
        if fragments is not None:
            fragment=fragments.get(label['id'])
            if not fragment or fragment.get('labelId')!=label['id']:raise ValueError('FROZEN_FRAGMENT_INVENTORY_MISSING')
            if abs(fragment['intrinsic']['width']-box['width'])>.05 or abs(fragment['intrinsic']['height']-box['height'])>.05:raise ValueError('FRAGMENT_MEASUREMENT_LAYOUT_MISMATCH')
            root=ET.fromstring(fragment['svg'])
            if root.tag.split('}')[-1]!='svg' or any(n.tag.split('}')[-1] not in {'svg','g','path','rect','defs','title','desc'} for n in root.iter()):raise ValueError('UNSAFE_FROZEN_FRAGMENT')
            validate_fragment_font(root,fragment['fontPx'])
            binding=''
            if label['kind']=='TICK_LABEL':binding=(f' data-tick-owner="{esc(label["tickId"])}" data-tick-axis="{esc(label["tickAxis"])}" data-tick-value="{esc(label["tickValue"])}" data-tick-display-value="{esc(label["tickDisplayValue"])}" data-tick-source-x="{num(label["at"][0])}" data-tick-source-y="{num(label["at"][1])}"'+(f' data-tick-callout="{esc(label["tickLabelCallout"]["schemaVersion"])}"' if label.get('tickLabelCallout') else ''))
            role=' data-visual-role="tick-label"' if label['kind']=='TICK_LABEL' else ''
            layers.append((90,index,f'<g id="{oid}" data-label-kind="{esc(label["kind"])}"{role} data-priority="{label.get("priority",2)}" data-font-px="{num(fragment["fontPx"])}" data-owner="{esc(fragment["owner"])}" data-fragment-sha="{esc(fragment["fragmentSha256"])}"{binding} transform="translate({num(box["x"])} {num(box["y"])})">'+fragment['svg']+'</g>'))
            continue
        attrs=f'id="{oid}" data-label-kind="{esc(label["kind"])}" data-priority="{label.get("priority",2)}" x="{num(x)}" y="{num(y)}" font-size="{num(font)}"'
        attrs+=owner_attrs(label)
        if label['kind']=='TICK_LABEL':
            attrs+=f' data-visual-role="tick-label" data-tick-owner="{esc(label["tickId"])}" data-tick-axis="{esc(label["tickAxis"])}" data-tick-value="{esc(label["tickValue"])}" data-tick-display-value="{esc(label["tickDisplayValue"])}" data-tick-source-x="{num(label["at"][0])}" data-tick-source-y="{num(label["at"][1])}"'
            if label.get('tickLabelCallout'):attrs+=f' data-tick-callout="{esc(label["tickLabelCallout"]["schemaVersion"])}"'
        if label.get('centered'):attrs+=' text-anchor="middle" dominant-baseline="central"'
        if label.get('math') or label.get('hasMath'):attrs+=' data-math="true"'
        if label['kind']=='POINT_NAME':attrs+=' font-style="italic"'
        family=tokens['mathFont'] if label.get('math') or label['kind']=='POINT_NAME' else tokens['textFont']
        attrs+=' font-family="'+esc(family)+'"'
        if label['kind']=='CONDITION_BOX':
            bid=element_id(label['id']+'-box')
            layers.append((88,index,f'<rect id="{bid}" data-role="conditionBox" x="{num(box["x"]-6)}" y="{num(box["y"]-6)}" width="{num(box["width"]+12)}" height="{num(box["height"]+12)}" fill="#fff" stroke="#555" stroke-width="0.8"/>'))
            rows=label.get('renderedLines',[{'text':row,'math':False} for row in label.get('lines',[label['text']])])
            content=''.join(f'<tspan x="{num(x)}" y="{num(box["y"]+font+i*font*1.5)}" font-family="{esc(tokens["mathFont"] if row["math"] else tokens["textFont"])}">{safe_math_markup(row["markup"]) if row.get("markup") else esc(row["text"])}</tspan>' for i,row in enumerate(rows))
        else:content=safe_math_markup(label['markup']) if label.get('markup') else esc(label['text'])
        layers.append((90,index,f'<text {attrs}>{content}</text>'))
    model=viewport.model();metadata=prepared.get('factHash','')
    head=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(viewport.width)} {num(viewport.height)}" width="{num(viewport.width)}" height="{num(viewport.height)}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="visual-title visual-desc" data-engine-version="geometry-visual-v1" data-geometry-style-version="{tokens["geometryVersion"]}" data-geometry-preset="GEOMETRY_STANDARD" data-graph-style-version="{tokens["graphVersion"]}" data-geometry-mode="COORDINATE_GEOMETRY_HYBRID" data-axis-scale-mode="{model["aspectPolicy"]}" data-geometry-fact-hash="{esc(metadata)}" data-visual-provenance="independent-facts-python" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">'
    if prepared.get('publicationProfile'):
        head=head[:-1]+' data-publication-profile="'+esc(prepared['publicationProfile'])+'">'
    elif prepared.get('fragmentProfile'):
        head=head[:-1]+' data-publication-profile="'+esc(prepared['fragmentProfile'])+'" data-safe-margin="12">'
    svg=head+f'<title id="visual-title">{esc(prepared.get("title","해설 도형"))}</title><desc id="visual-desc">{esc(prepared.get("description","점과 도형의 관계를 확인한다."))}</desc>'
    svg+=f'<rect width="{num(viewport.width)}" height="{num(viewport.height)}" fill="#fff"/>'
    svg+=''.join(f'<g data-layer="{layer}">{value}</g>' for layer,index,value in sorted(layers))+'</svg>\n'
    ET.fromstring(svg)
    return svg
