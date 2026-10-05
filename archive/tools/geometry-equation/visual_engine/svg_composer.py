"""Materialize prepared screen primitives. Computes no mathematical relations."""
import html
import re
import xml.etree.ElementTree as ET
from .style_tokens import load

def esc(value):return html.escape(str(value),quote=True)
def num(value):return f'{value:.9f}'.rstrip('0').rstrip('.') or '0'

def safe_math_markup(value):
    root=ET.fromstring('<text>'+value+'</text>')
    for child in root.iter():
        if child.tag not in {'text','tspan'} or set(child.attrib)-{'font-style','baseline-shift','font-size'}:
            raise ValueError('UNSAFE_MATH_MARKUP')
    return value

def owner_attrs(value):
    fields={'owner':'data-owner','ownerPoints':'data-owner-points','sourceLabel':'data-source-label','annotation':'data-annotation','ownerKind':'data-owner-kind','factRole':'data-fact-role'}
    return ''.join(' '+name+'="'+esc(' '.join(value[key]) if isinstance(value[key],(list,tuple)) else value[key])+'"' for key,name in fields.items() if key in value)

def compose(prepared,layout,viewport,fragments=None):
    tokens=load();seen={'visual-title','visual-desc'};semantic_labels=set();layers=[]
    def element_id(value):
        if value in seen:raise ValueError('DUPLICATE_SVG_ID:'+value)
        seen.add(value);return esc(value)
    for index,p in enumerate(prepared['primitives']):
        oid=element_id(p['id']);kind=p['kind'];token=p.get('token','mainShape')
        stroke=tokens[token] if token in tokens else None
        if not isinstance(stroke,(int,float)):raise ValueError('UNKNOWN_STYLE_TOKEN')
        attrs=f'id="{oid}" data-role="{esc(p.get("role",kind))}" stroke="{tokens["primary"]}" stroke-width="{stroke}" fill="none"'
        attrs+=owner_attrs(p)
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
            layers.append((90,index,f'<g id="{oid}" data-label-kind="{esc(label["kind"])}" data-priority="{label.get("priority",2)}" data-font-px="{num(fragment["fontPx"])}" data-owner="{esc(fragment["owner"])}" data-fragment-sha="{esc(fragment["fragmentSha256"])}" transform="translate({num(box["x"])} {num(box["y"])})">'+fragment['svg']+'</g>'))
            continue
        attrs=f'id="{oid}" data-label-kind="{esc(label["kind"])}" data-priority="{label.get("priority",2)}" x="{num(x)}" y="{num(y)}" font-size="{num(font)}"'
        attrs+=owner_attrs(label)
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
