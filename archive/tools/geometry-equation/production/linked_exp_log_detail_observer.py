"""Independent plan and final artwork linkage for one inverse-curve detail."""
import math
import re
import xml.etree.ElementTree as ET
from fractions import Fraction

import sympy as S
from graph_observer import GRAPH_COLOR_LINES, _ov_base, _ov_curve_value, _ov_glyph_codes, _ov_length_codes, _piecewise_rational


def need(condition, code):
    if not condition:
        raise ValueError('LINKED_EXP_LOG_DETAIL_' + code)


def rational(value):
    return _piecewise_rational(value, 'LINKED_EXP_LOG_DETAIL_NUMBER')


def only(items, key, value, code):
    rows = [row for row in items if row.get(key) == value]
    need(len(rows) == 1, code)
    return rows[0]


def plan_facts(plan):
    link = plan['linkedExpLogDetail']
    need(set(link) == {'midpoint', 'segment', 'bisector'}, 'SCOPE')
    mid, sid, bid = (link[key] for key in ('midpoint', 'segment', 'bisector'))
    need(all(isinstance(v, str) and re.fullmatch('[A-Z][A-Za-z0-9]{0,7}', v) for v in (mid, sid, bid)), 'SCOPE')
    panels = [row['plan'] for row in plan['panels']]
    need([p['capability'] for p in panels] == ['exp-log-pair-spike-v1', 'multi-curve-figure-v1'], 'SCOPE')
    main, detail = (p['graphPlan'] for p in panels)
    need(main['family'] == 'exp-log-pair' and detail['family'] == 'multi-curve', 'SCOPE')
    shared={'family','curves','axisTickValues','overlays','domain','viewport','shapeIntent','overviewPolicy',
            'equalUnits','axisRatio','overlaysFeatures'}
    need(set(main)<=shared|{'identityLine','expLogPairFeatures','expLogPairPolicy'}
         and set(detail)<=shared|{'plotHeightLimit','plotCanvas','multiCurveFeatures'}, 'SCOPE')
    need(main['identityLine'] is True, 'IDENTITY_LINE')
    main_curves = main['curves']
    need(sorted(row['family'] for row in main_curves) == ['exponential-affine', 'logarithmic-affine'], 'SCOPE')
    need(all(row.get('formulaLabel') == 'NAME' for row in main_curves), 'FORMULA_NAMES')
    exp = only(main_curves, 'family', 'exponential-affine', 'SCOPE')
    log = only(main_curves, 'family', 'logarithmic-affine', 'SCOPE')
    base = _ov_base(exp.get('base'))
    a,k,c = map(rational, exp['coefficients'])
    d,scale,offset,t = map(rational, log['coefficients'])
    shift = rational(exp.get('shiftX','0'))
    need(base>1 and base==_ov_base(log.get('base')) and a>0 and k>0 and scale>0, 'INVERSE_CURVES')
    power = k*(shift-t)
    need(d*k==1 and offset==-c*scale and S.simplify(base**S.Rational(power.numerator,power.denominator)-a*scale)==0, 'INVERSE_CURVES')

    src, zoom = main['overlays'], detail['overlays']
    need(set(src) == {'points', 'segments', 'lines'} and set(zoom) == {'points', 'segments'}, 'SCOPE')
    need(len(src['segments']) == len(zoom['segments']) == len(src['lines']) == 1, 'SCOPE')
    ab = only(src['segments'], 'id', sid, 'SEGMENT')
    zoom_ab = only(zoom['segments'], 'id', sid, 'SEGMENT')
    refs = [ab['from'], mid, ab['to']]
    need(len(set(refs)) == 3 and all(re.fullmatch('[A-Z]', p) for p in refs), 'POINT_IDS')
    need(panels[0].get('pointNames')=={key:key for key in (refs[0],refs[2])}
         and panels[1].get('pointNames')=={key:key for key in refs}, 'POINT_NAMES')
    need([zoom_ab['from'],zoom_ab['to']] == [refs[0],refs[2]], 'SEGMENT')
    need(ab.get('length', False) is False and zoom_ab.get('length') is True, 'LENGTH_OWNER')
    need(not ab.get('dashed') and not zoom_ab.get('dashed'), 'MARK_STYLE')

    point_tables = []
    for panel in (src, zoom):
        need(sorted(row['id'] for row in panel['points']) == sorted(refs), 'POINT_IDS')
        point_tables.append({row['id']: row for row in panel['points']})
    p, q = point_tables
    coords = {key: tuple(rational(p[key][axis]) for axis in ('x', 'y')) for key in refs}
    for key in refs:
        need(coords[key] == tuple(rational(q[key][axis]) for axis in ('x','y')), 'POINT_PARITY:' + key)
        need(q[key].get('coordinates') is True and q[key].get('unnamed',False) is False, 'DETAIL_COORDINATES:' + key)
        need(p[key].get('marker','FILLED') == q[key].get('marker','FILLED') == 'FILLED', 'MARK_STYLE:' + key)
    need(p[mid].get('unnamed') is True and p[mid].get('coordinates',False) is False, 'MAIN_MIDPOINT_MARK')
    need(all(p[key].get('coordinates') is True and p[key].get('unnamed',False) is False for key in (refs[0],refs[2])), 'MAIN_ENDPOINT_LABELS')
    point_color, edge_color = p[mid].get('color'), ab.get('color')
    need(point_color in GRAPH_COLOR_LINES and edge_color in GRAPH_COLOR_LINES and point_color != edge_color, 'MARK_STYLE')
    need(point_color == q[mid].get('color') and edge_color == zoom_ab.get('color'), 'MARK_PARITY')
    a,m,b = (coords[key] for key in refs)
    need(a[0]<b[0] and all(x==y for x,y in (a,m,b)), 'IDENTITY_POINTS')
    need(tuple((x+y)/2 for x,y in zip(a,b)) == m, 'MIDPOINT')
    for key in (refs[0],refs[2]):
        x,y=coords[key]
        sx=S.Rational(x.numerator,x.denominator)
        sy=S.Rational(y.numerator,y.denominator)
        need(all(S.simplify(_ov_curve_value(main,sx,row['id'])-sy)==0 for row in main_curves), 'CURVE_INTERSECTION:' + key)
    bis = only(src['lines'], 'id', bid, 'BISECTOR')
    want = (sum(m),Fraction(-1))
    need((rational(bis['intercept']),rational(bis['slope']))==want, 'BISECTOR')
    lines = detail['curves']
    need(len(lines)==2 and all(row['kind']=='LINE' for row in lines), 'DETAIL_LINES')
    need(sorted(tuple(map(rational,row['coefficients'])) for row in lines)==sorted([(Fraction(0),Fraction(1)),want]), 'DETAIL_LINES')
    for row in lines:
        intercept,slope=map(rational,row['coefficients'])
        text=row.get('label')
        allowed='y=x' if slope==1 else 'x+y='+str(intercept)
        need(text is None or text==allowed, 'DETAIL_LINE_LABEL')
    length_squared=sum((x-y)**2 for x,y in zip(a,b))
    return refs,sid,coords,length_squared


def svg_facts(svgs, refs, sid, squared):
    need(isinstance(svgs,list) and len(svgs)==2, 'SVG_SCOPE')
    fill,stroke=None,None
    for index,svg in enumerate(svgs):
        root=ET.fromstring(svg)
        marked=[]
        by_id={}
        for node in root.iter():
            if node.get('id'):by_id.setdefault(node.get('id'),[]).append(node)
        def primitive(ident,tag):
            nodes=by_id.get(ident,[])
            need(len(nodes)==1 and nodes[0].tag.split('}')[-1]==tag, 'SVG_PRIMITIVE:' + ident)
            return nodes[0]
        for key in refs:
            point=primitive(key,'circle')
            need(point.get('data-role')=='point' and point.get('fill') not in (None,'none','#fff'), 'SVG_POINT:' + key)
            marked.append((float(point.get('cx')),float(point.get('cy'))))
            if key==refs[1]:
                if index==0:fill=point.get('fill')
                else:need(fill==point.get('fill'), 'SVG_MARK_PARITY:' + key)
        edgeid='overlay-segment-'+sid
        edge=primitive(edgeid,'line')
        need(edge.get('data-role')=='line' and edge.get('stroke') not in (None,'none'), 'SVG_SEGMENT')
        drawn=[(float(edge.get('x'+n)),float(edge.get('y'+n))) for n in ('1','2')]
        need(all(math.dist(drawn[i],marked[i*2])<=.02 for i in (0,1)), 'SVG_SEGMENT_ENDPOINTS')
        center=tuple((x+y)/2 for x,y in zip(*drawn))
        need(math.dist(center,marked[1])<=.02, 'SVG_MIDPOINT')
        if index==0:stroke=edge.get('stroke')
        else:need(stroke==edge.get('stroke'), 'SVG_MARK_PARITY:' + sid)
        if index==1:
            for label_id,owner in ((refs[1]+'-coordinates',refs[1]),(edgeid+'-length',edgeid)):
                label=primitive(label_id,'g')
                need(label.get('data-owner')==owner, 'SVG_LABEL_OWNER:' + label_id)
                if owner==edgeid:
                    length=S.sqrt(S.Rational(squared.numerator,squared.denominator))
                    need(_ov_glyph_codes(label)==_ov_length_codes(length), 'SVG_LENGTH_VALUE')
                leader_id=label_id+'-owner-leader'
                # The individual panel observer also accepts direct, unambiguous labels.
                if leader_id not in by_id:continue
                leader=primitive(leader_id,'line')
                need(leader.get('data-owner')==owner and leader.get('data-role')=='leader', 'SVG_LEADER_OWNER:' + label_id)
                head=(float(leader.get('x1')),float(leader.get('y1')))
                if owner==refs[1]:
                    need(math.dist(head,marked[1])<=.02, 'SVG_M_LEADER')
                else:
                    a,b=drawn
                    ux,uy=b[0]-a[0],b[1]-a[1]
                    dx,dy=head[0]-a[0],head[1]-a[1]
                    need(abs(dx*uy-dy*ux)<=.02*math.hypot(ux,uy) and 0<dx*ux+dy*uy<ux*ux+uy*uy, 'SVG_SEGMENT_LEADER')
    return {'midpointFill':fill,'segmentStroke':stroke}


def audit_linked_exp_log_detail(plan, svgs=None):
    refs,sid,coords,length_squared=plan_facts(plan)
    result={'status':'PASS','points':{key:[str(x) for x in coords[key]] for key in refs},
            'segment':sid,'lengthSquared':str(length_squared)}
    if svgs is not None:
        try:result['marks']=svg_facts(svgs,refs,sid,length_squared)
        except ET.ParseError as error:raise ValueError('LINKED_EXP_LOG_DETAIL_SVG_XML') from error
    return result
