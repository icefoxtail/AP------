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

def compose(prepared,layout,viewport):
    tokens=load();seen=set();semantic_labels=set();layers=[]
    def element_id(value):
        if value in seen:raise ValueError('DUPLICATE_SVG_ID:'+value)
        seen.add(value);return esc(value)
    for index,p in enumerate(prepared['primitives']):
        oid=element_id(p['id']);kind=p['kind'];token=p.get('token','mainShape')
        stroke=tokens[token] if token in tokens else None
        if not isinstance(stroke,(int,float)):raise ValueError('UNKNOWN_STYLE_TOKEN')
        attrs=f'id="{oid}" data-role="{esc(p.get("role",kind))}" stroke="{tokens["primary"]}" stroke-width="{stroke}" fill="none"'
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
        oid=element_id(label['id']);key=(label['kind'],label.get('target'),label['text'])
        if key in semantic_labels:raise ValueError('DUPLICATE_SEMANTIC_LABEL')
        semantic_labels.add(key)
        if label['kind']=='COORDINATE_LABEL' and re.search(r'\d+\.\d+',label['text']) and not label.get('sourceDecimalEvidence'):
            raise ValueError('INVALID_STUDENT_DECIMAL_LABEL')
        x,y=label['baseline'];font=label['font'];box=label['box']
        attrs=f'id="{oid}" data-label-kind="{esc(label["kind"])}" data-priority="{label.get("priority",2)}" x="{num(x)}" y="{num(y)}" font-size="{num(font)}"'
        if label['kind']=='POINT_NAME':attrs+=' font-style="italic"'
        family=tokens['mathFont'] if label.get('math') or label['kind']=='POINT_NAME' else tokens['textFont']
        attrs+=' font-family="'+esc(family)+'"'
        if label['kind']=='CONDITION_BOX':
            layers.append((88,index,f'<rect id="{oid}-box" data-role="conditionBox" x="{num(box["x"]-6)}" y="{num(box["y"]-6)}" width="{num(box["width"]+12)}" height="{num(box["height"]+12)}" fill="#fff" stroke="#555" stroke-width="0.8"/>'))
            content=''.join(f'<tspan x="{num(x)}" y="{num(box["y"]+font+i*font*1.5)}">{esc(row)}</tspan>' for i,row in enumerate(label.get('lines',[label['text']])))
        else:content=safe_math_markup(label['markup']) if label.get('markup') else esc(label['text'])
        layers.append((90,index,f'<text {attrs}>{content}</text>'))
    model=viewport.model();metadata=prepared.get('factHash','')
    head=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(viewport.width)} {num(viewport.height)}" width="{num(viewport.width)}" height="{num(viewport.height)}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="visual-title visual-desc" data-engine-version="geometry-visual-v1" data-geometry-style-version="{tokens["geometryVersion"]}" data-geometry-preset="GEOMETRY_STANDARD" data-graph-style-version="{tokens["graphVersion"]}" data-geometry-mode="COORDINATE_GEOMETRY_HYBRID" data-axis-scale-mode="{model["aspectPolicy"]}" data-geometry-fact-hash="{esc(metadata)}" data-visual-provenance="independent-facts-python" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">'
    svg=head+f'<title id="visual-title">{esc(prepared.get("title","해설 도형"))}</title><desc id="visual-desc">{esc(prepared.get("description","점과 도형의 관계를 확인한다."))}</desc>'
    svg+=f'<rect width="{num(viewport.width)}" height="{num(viewport.height)}" fill="#fff"/>'
    svg+=''.join(f'<g data-layer="{layer}">{value}</g>' for layer,index,value in sorted(layers))+'</svg>\n'
    ET.fromstring(svg)
    return svg
