"""Generate final M3 solution SVGs from Python-computed geometry models."""
from __future__ import annotations
import hashlib, json, math, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from geometry_models import model, TARGETS, unit, dot

ROOT=Path.cwd()
EVID=Path('archive/evidence/visual-upgrade-2025-m3-independent-b')
INV=json.loads((EVID/'inventory.json').read_text(encoding='utf-8'))
TRI=json.loads((EVID/'triage.json').read_text(encoding='utf-8'))
TRI_BY={(r['sourcePath'].split('/')[-1],r['qid']):r for r in TRI['triage']}
EXAM_BY={e['sourcePath'].split('/')[-1]:e for e in INV['exams']}
NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS)
DX,DY=0.0,0.0
WIDTH,HEIGHT=420,300
MATH_FONT='Times New Roman,Cambria Math,serif'
TEXT_FONT='Arial,Malgun Gothic,sans-serif'
DERIVED_COLOR='#3e7773'
def tag(x): return '{%s}%s'%(NS,x)
def fmt(x): return ('%.6f'%float(x)).rstrip('0').rstrip('.')
def sha(b): return 'sha256:'+hashlib.sha256(b).hexdigest()
def physical_blob(b): return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def addxy(p): return (p[0]+DX,p[1]+DY)
def line_id(segments,a,b):
    source=segments.values() if isinstance(segments,dict) else segments
    for sid,p1,p2,_kind in source:
        if (p1==a and p2==b) or (p1==b and p2==a):
            return 'seg-'+sid
    raise ValueError('MISSING_OWNER_SEGMENT:'+a+':'+b)

def build_asset(filename,qid):
    m=model(('왕운' if '왕운' in filename else '풍덕')+'#'+str(qid))
    tri=TRI_BY[(filename,qid)]
    exam=EXAM_BY[filename]
    q=next(x for x in exam['questions'] if x['qid']==qid)
    svg_path='archive/assets/images/'+filename.replace('.js','')+'/q'+str(qid)+'-solution.svg'
    alt=m.get('alt') or ('해설 도형: '+str(q['content'])[:80])
    caption=m.get('caption') or ('해설의 핵심 관계: '+str(tri['decisiveRelation'])[:110])
    root=ET.Element(tag('svg'),{
        'width':str(WIDTH),'height':str(HEIGHT),'viewBox':'0 0 %d %d'%(WIDTH,HEIGHT),
        'preserveAspectRatio':'xMidYMid meet','role':'img','aria-label':alt,
        'data-geometry-style-version':'AP_GEOMETRY_PRINT_V1_0_DRAFT',
        'data-geometry-preset':'CUSTOM_SOLUTION_SLOT_420x300',
        'data-geometry-fact-hash':sha(json.dumps(m['checks'],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()),
        'data-visual-provenance':'SOURCE_SOLUTION_PYTHON_COORDINATE_MODEL',
    })
    if qid==11 and '풍덕' in filename:
        root.set('data-geometry-mode','COORDINATE_GEOMETRY_HYBRID')
    ET.SubElement(root,tag('title')).text=alt
    ET.SubElement(root,tag('desc')).text=caption
    style=ET.SubElement(root,tag('style'))
    style.text='text{font-family:Arial,"Malgun Gothic",sans-serif}.math{font-family:Times New Roman,Cambria Math,serif}.main{stroke:#202124;stroke-width:2.05}.aux{stroke:#59636e;stroke-width:1.35}'
    geom=ET.SubElement(root,tag('g'),{'id':'geometry'})
    markers=ET.SubElement(root,tag('g'),{'id':'markers'})
    labels=ET.SubElement(root,tag('g'),{'id':'labels'})
    points={name:addxy(xy) for name,xy in m['points'].items()}
    # Preserve exact coordinates for unlabelled construction points referenced
    # by angle and other checks without drawing an unnecessary visible marker.
    visible_markers=set(m.get('markerPoints',points.keys()))
    for name,p in points.items():
        if name not in visible_markers and name not in m.get('pointOffsets',{}):
            ET.SubElement(geom,tag('circle'),{'id':'pt-'+name,'cx':fmt(p[0]),'cy':fmt(p[1]),
                'r':'0','display':'none','data-coordinate-reference':'true'})
    segments={s[0]:s for s in m['segments']}
    circles={}
    # Z10: semantic fills, then circle outlines.
    for fill in m.get('fills',[]):
        ps=[points[p] for p in fill['points']]
        ET.SubElement(geom,tag('polygon'),{'id':fill['id'],'points':' '.join('%s,%s'%(fmt(x),fmt(y)) for x,y in ps),
            'fill':fill.get('fill','#888'),'fill-opacity':fmt(fill.get('opacity',.08)),'stroke':'none'})
    for cid,center,radius,kind,dash in m['circles']:
        c=points[center];attrs={'id':'circle-'+cid,'cx':fmt(c[0]),'cy':fmt(c[1]),'r':fmt(radius),
            'fill':'none','stroke':'#202124' if kind=='main' else '#59636e',
            'stroke-width':'2.0' if kind=='main' else '1.15'}
        if dash:attrs['stroke-dasharray']=dash
        ET.SubElement(geom,tag('circle'),attrs);circles[cid]={'center':center,'cx':c[0],'cy':c[1],'r':radius}
    for sid,a,b,kind in m['segments']:
        p=points[a];q=points[b]
        attrs={'id':'seg-'+sid,'x1':fmt(p[0]),'y1':fmt(p[1]),'x2':fmt(q[0]),'y2':fmt(q[1]),
            'fill':'none','stroke':'#202124' if kind=='main' else '#59636e',
            'stroke-width':'2.05' if kind=='main' else '1.35','stroke-linecap':'round','stroke-linejoin':'round'}
        if kind=='extension':attrs['stroke-dasharray']='5 4'
        if kind=='reference':
            attrs.update({'display':'none','stroke':'none','stroke-width':'0','data-coordinate-reference':'true'})
        ET.SubElement(geom,tag('line'),attrs)
    angle_rows=[]
    # Z60: angle arcs from actual owner rays; label positions use the same ray bisector.
    for angle_row in m['angles']:
        if len(angle_row)==7:
            name,v,r1,r2,text,radius,labelradius=angle_row;labelOffsetDeg=0
        else:
            name,v,r1,r2,text,radius,labelradius,labelOffsetDeg=angle_row
        o=points[v];u=(points[r1][0]-o[0],points[r1][1]-o[1]);w=(points[r2][0]-o[0],points[r2][1]-o[1])
        t1=math.atan2(u[1],u[0]);delta=math.atan2(u[0]*w[1]-u[1]*w[0],dot(u,w))
        arc=[]
        for j in range(17):
            t=t1+delta*j/16;arc.append((o[0]+radius*math.cos(t),o[1]+radius*math.sin(t)))
        ET.SubElement(geom,tag('polyline'),{'id':'angle-arc-'+name,
            'data-angle-vertex':'pt-'+v,'data-angle-rays':line_id(segments,v,r1)+' '+line_id(segments,v,r2),
            'points':' '.join('%s,%s'%(fmt(x),fmt(y)) for x,y in arc),'fill':'none','stroke':'#59636e',
            'stroke-width':'1.0','stroke-linecap':'round'})
        mid=t1+delta/2+math.radians(labelOffsetDeg);x=o[0]+labelradius*math.cos(mid);y=o[1]+labelradius*math.sin(mid)
        ET.SubElement(labels,tag('text'),{'id':'label-angle-'+name,'data-label-kind':'angle','data-font-role':'math','class':'math',
            'data-owner-vertex':'pt-'+v,'data-owner-rays':line_id(segments,v,r1)+' '+line_id(segments,v,r2),
            'x':fmt(x),'y':fmt(y),'text-anchor':'middle','font-family':MATH_FONT,
            'font-size':'25px','fill':'#111'}).text=text
        angle_rows.append({'id':'label-angle-'+name,'arcId':'angle-arc-'+name,'text':text,
            'ownerVertex':'pt-'+v,'ownerRays':[line_id(segments,v,r1),line_id(segments,v,r2)],
            'position':[x,y],'expectedAngleDeg':abs(math.degrees(delta)),'arcRadius':radius,
            'labelBisectorOffsetDeg':labelOffsetDeg,
            'arcPoints':[[x,y] for x,y in arc]})
    # Right-angle corners are computed in the local unit-vector frame of their two rays.
    right_rows=[]
    for right in m['rightAngles']:
        if len(right)==3:
            name,v,r1,r2=right[0],right[0],right[1],right[2]
        else:
            name,v,r1,r2=right
        o=points[v];u=unit((points[r1][0]-o[0],points[r1][1]-o[1]));w=unit((points[r2][0]-o[0],points[r2][1]-o[1]));size=m.get('rightAngleSizes',{}).get(name,10)
        a=(o[0]+size*u[0],o[1]+size*u[1]);b=(a[0]+size*w[0],a[1]+size*w[1]);c=(o[0]+size*w[0],o[1]+size*w[1]);ps=[a,b,c]
        ET.SubElement(geom,tag('polyline'),{'id':'right-angle-'+name,'data-owner-vertex':'pt-'+v,
            'data-owner-rays':line_id(segments,v,r1)+' '+line_id(segments,v,r2),
            'points':' '.join('%s,%s'%(fmt(x),fmt(y)) for x,y in ps),'fill':'none','stroke':'#202124',
            'stroke-width':'1.15','stroke-linejoin':'round'})
        right_rows.append({'id':'right-angle-'+name,'vertex':'pt-'+v,'rays':[line_id(segments,v,r1),line_id(segments,v,r2)],
                           'coordinates':[list(x) for x in ps]})
    # Congruence ticks are centered and perpendicular to their actual owner segment.
    tick_rows=[]
    tick_specs=[(sid,count,m.get('tickStyle','GIVEN')) for sid,count in m.get('ticks',[])]
    tick_specs += [(sid,count,'DERIVED_INTERMEDIATE') for sid,count in m.get('derivedTicks',[])]
    for sid,count,role in tick_specs:
        s=segments[sid];a=points[s[1]];b=points[s[2]];v=(b[0]-a[0],b[1]-a[1]);u=unit(v);n=(-u[1],u[0]);spacing=3.5
        fraction=m.get('tickFractions',{}).get(sid,.5)
        for j in range(count):
            along=(j-(count-1)/2)*spacing;mid=(a[0]+fraction*v[0]+along*u[0],a[1]+fraction*v[1]+along*u[1]);p=(mid[0]-n[0]*4,mid[1]-n[1]*4);q=(mid[0]+n[0]*4,mid[1]+n[1]*4);tid='tick-'+sid+'-'+str(j+1)
            attrs={'id':tid,'data-owner-segment':'seg-'+sid,'x1':fmt(p[0]),'y1':fmt(p[1]),
                'x2':fmt(q[0]),'y2':fmt(q[1]),'stroke':'#202124','stroke-width':'1.1'}
            if role=='DERIVED_INTERMEDIATE':
                attrs.update({'data-fact-role':'DERIVED_INTERMEDIATE','stroke':DERIVED_COLOR,'stroke-width':'1.5'})
            else:
                attrs['data-fact-role']='GIVEN'
            ET.SubElement(geom,tag('line'),attrs)
            tick_rows.append({'id':tid,'ownerSegment':'seg-'+sid,'fraction':fraction,'endpoints':[list(p),list(q)]})
    # Point markers are above all lines; point labels are above geometry.
    point_owner_rows=[]
    marker_names=set(m.get('markerPoints',points.keys()))
    for name,p in points.items():
        if name in marker_names:
            ET.SubElement(markers,tag('circle'),{'id':'pt-'+name,'cx':fmt(p[0]),'cy':fmt(p[1]),'r':'2.25','fill':'#202124'})
        offset=m.get('pointOffsets',{}).get(name)
        if offset is not None:
            pos=(p[0]+offset[0],p[1]+offset[1]);lid='label-point-'+name
            ET.SubElement(labels,tag('text'),{'id':lid,'data-label-kind':'point','data-font-role':'math','class':'math',
                'data-owner-point':'pt-'+name,'x':fmt(pos[0]),'y':fmt(pos[1]),'text-anchor':'middle',
                'font-family':MATH_FONT,'font-style':'italic','font-size':'26px','fill':'#111'}).text=name
            point_owner_rows.append({'id':lid,'text':name,'ownerPoint':'pt-'+name,'position':list(pos)})
    length_rows=[]
    for label in m['lengthLabels']:
        name,text,sid,off=label[:4]
        fraction=label[4] if len(label)>=5 else .5
        font_size=label[5] if len(label)>=6 else 16
        s=segments[sid];a=points[s[1]];b=points[s[2]];vec=(b[0]-a[0],b[1]-a[1]);n=unit((-vec[1],vec[0]));pos=(a[0]+fraction*vec[0]+n[0]*off,a[1]+fraction*vec[1]+n[1]*off);lid='label-length-'+name
        ET.SubElement(labels,tag('text'),{'id':lid,'data-label-kind':'length','data-font-role':'math','class':'math',
            'data-owner-segment':'seg-'+sid,'x':fmt(pos[0]),'y':fmt(pos[1]),'text-anchor':'middle',
            'font-family':MATH_FONT,'font-size':fmt(max(25,font_size))+'px','fill':'#111'}).text=text
        length_rows.append({'id':lid,'text':text,'ownerSegment':'seg-'+sid,'position':list(pos),
                            'authoredFontSize':fmt(font_size)+'px'})
    for name,text,x,y,size in m.get('notes',[]):
        ET.SubElement(labels,tag('text'),{'id':'note-'+name,'data-label-kind':'annotation','data-font-role':'math','class':'math',
            'x':fmt(x+DX),'y':fmt(y+DY),'text-anchor':'middle','font-family':MATH_FONT,'font-size':'26px','fill':'#111'}).text=text
    raw=ET.tostring(root,encoding='utf-8',xml_declaration=True)
    Path(svg_path).parent.mkdir(parents=True,exist_ok=True);Path(svg_path).write_bytes(raw)
    return {'questionUid':tri['questionUid'],'qid':qid,'action':tri['action'],
        'oneLineReason':tri['oneLineReason'],'decisiveRelation':tri['decisiveRelation'],
        'sourcePath':tri['sourcePath'],
        'solutionSha256':tri['solutionSha256'],'baselineSourceExamSha256':tri['sourceExamSha256'],
        'svgPath':svg_path,'svgSha256':sha(raw),'physicalSvgGitBlobSha':physical_blob(raw),
        'expectedFacts':tri['expectedFacts'],'structuredExpectedFacts':m['checks'],
        'pythonInputs':m['inputs'],'pythonOutputs':m['computed'],
        'coordinateModel':{'viewBox':root.get('viewBox'),'layoutTranslationPx':[0,0],
            'points':{k:list(v) for k,v in points.items()},'segments':m['segments'],'circles':circles},
        'actualSvgPrimitives':[{'id':e.get('id'),'tag':e.tag.rsplit('}',1)[-1],
            'attributes':{k:v for k,v in e.attrib.items() if k not in ('id','class')}} for e in root.iter()
            if e.tag.rsplit('}',1)[-1] in ('circle','line','polyline','polygon','path')],
        'authoredFontSizes':{'point':'26px','length':'25px','angle':'25px','annotation':'26px'},
        'fontFamilyRoles':{'math':'Times New Roman,Cambria Math,serif','text':'Arial,Malgun Gothic,sans-serif'},
        'pointLabelOwners':point_owner_rows,'lengthLabelOwners':length_rows,'angleLabelOwners':angle_rows,
        'rightAngleMarks':right_rows,'congruenceTickOwners':tick_rows,
        'alt':alt,'caption':caption,'xmlBytes':len(raw)}

if __name__=='__main__':
    outputs=[]
    for filename,qids in TARGETS.items():
        for qid in qids:
            outputs.append(build_asset(filename,qid))
    out={'schemaVersion':'M3_VISUAL_BUILD_OUTPUTS_v1','baseCommit':INV['baseCommit'],
         'generatedAtUtc':datetime.now(timezone.utc).isoformat(),
         'assetCount':len(outputs),'canvas':{'viewBox':'0 0 420 300','preset':'CUSTOM_SOLUTION_SLOT_420x300',
         'safeMarginPx':30,'layoutTranslationPx':[0,0]},'assets':outputs}
    (EVID/'build_outputs.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'assetCount':len(outputs),'out':'archive/evidence/visual-upgrade-2025-m3-independent-b/build_outputs.json',
                      'svgPaths':[x['svgPath'] for x in outputs]},ensure_ascii=False))
