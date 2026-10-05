"""Recompute browser-measured SVG text-box collisions against final primitives.

Browser text boxes come from SVGElement.getBBox() at the same CSS image size
used by the Archive solution renderer. Primitive coordinates come from the
final SVG XML bytes. Line and polyline intersections use Liang-Barsky clipping;
circle strokes use nearest/farthest distance to the measured text rectangle.
"""
import json, math, xml.etree.ElementTree as ET
from pathlib import Path

EVID=Path('archive/evidence/visual-upgrade-2025-m3-independent-b')
BROWSER=json.loads((EVID/'browser_render_evidence.json').read_text(encoding='utf-8'))
NS='{http://www.w3.org/2000/svg}'

def seg_hits_rect(a,b,r,pad):
    box={'x':r['x']-pad,'y':r['y']-pad,'width':r['width']+2*pad,'height':r['height']+2*pad}
    dx=b[0]-a[0];dy=b[1]-a[1]
    p=[-dx,dx,-dy,dy]
    q=[a[0]-box['x'],box['x']+box['width']-a[0],a[1]-box['y'],box['y']+box['height']-a[1]]
    lo=0.0;hi=1.0
    for pp,qq in zip(p,q):
        if abs(pp)<1e-12:
            if qq<0:return False
        else:
            t=qq/pp
            if pp<0:
                if t>hi:return False
                lo=max(lo,t)
            else:
                if t<lo:return False
                hi=min(hi,t)
            if lo>hi:return False
    return True

def shape_segments(el):
    tag=el.tag.rsplit('}',1)[-1]
    if tag=='line':
        return [([float(el.get('x1')),float(el.get('y1'))],[float(el.get('x2')),float(el.get('y2'))])]
    if tag in ('polyline','polygon'):
        vals=[float(x) for x in el.get('points','').replace(',',' ').split()]
        pts=list(zip(vals[::2],vals[1::2]))
        rows=list(zip(pts,pts[1:]))
        if tag=='polygon' and len(pts)>2:rows.append((pts[-1],pts[0]))
        return rows
    return []

def circle_hits_rect(cx,cy,radius,box,pad):
    x1=box['x']-pad;x2=box['x']+box['width']+pad
    y1=box['y']-pad;y2=box['y']+box['height']+pad
    dx=max(x1-cx,0,cx-x2);dy=max(y1-cy,0,cy-y2)
    nearest=math.hypot(dx,dy)
    farthest=max(math.hypot(x-cx,y-cy) for x in (x1,x2) for y in (y1,y2))
    return nearest<=radius+pad and farthest>=max(0,radius-pad)

def main():
    assets=[]
    for rec in BROWSER['changedSvgRenderEvidence']:
        path=Path(rec['assetPath'])
        root=ET.fromstring(path.read_bytes())
        primitive=[el for el in root.iter() if el.tag.rsplit('}',1)[-1] in ('line','polyline','polygon','circle')]
        text_rows=[]
        for label in rec['labels']:
            excluded=set([label.get('ownerPoint'),label.get('ownerSegment'),*label.get('ownerRays',[])])
            box=label['svgBBox']
            candidates=[]
            for el in primitive:
                pid=el.get('id')
                if not pid or pid in excluded:continue
                if el.get('display')=='none':continue
                typ=el.tag.rsplit('}',1)[-1]
                stroke=el.get('stroke','')
                if typ=='polygon' and stroke in ('','none'):continue
                sw=float(el.get('stroke-width') or 0)
                pad=sw/2+0.25
                collision=False
                if typ=='circle':
                    collision=circle_hits_rect(float(el.get('cx')),float(el.get('cy')),float(el.get('r')),box,pad)
                else:
                    collision=any(seg_hits_rect(a,b,box,pad) for a,b in shape_segments(el))
                if collision:candidates.append({'primitiveId':pid,'tag':typ,'strokeWidth':sw,'paddingUserUnits':pad})
            text_rows.append({'labelId':label['id'],'text':label['text'],'ownerPoint':label.get('ownerPoint'),
                'ownerSegment':label.get('ownerSegment'),'ownerVertex':label.get('ownerVertex'),
                'ownerRays':label.get('ownerRays',[]),'browserSvgUserSpaceBBox':box,
                'primitiveStrokeIntersections':candidates,'collisionCount':len(candidates)})
        count=sum(x['collisionCount'] for x in text_rows)
        assets.append({'assetPath':rec['assetPath'],'assetSha256':rec['svgSha256'],'qid':rec['qid'],
            'browserEngineImageCssBox':rec['engineImageCssBox'],'browserLabelBBoxes':text_rows,
            'primitiveStrokeIntersectionCount':count,
            'result':'PASS' if count==0 and rec['clippingCount']==0 and rec['safeMarginViolationCount']==0 and rec['textOverlapCount']==0 else 'REVIEW_REQUIRED'})
    out={'schemaVersion':'M3_BROWSER_LABEL_OVERLAP_RECHECK_v1','capturedAt':BROWSER['capturedAt'],
         'method':'Actual browser getBBox user-space text rectangles versus final serialized SVG primitive coordinates.',
         'assetCount':len(assets),'passCount':sum(x['result']=='PASS' for x in assets),
         'reviewRequiredCount':sum(x['result']!='PASS' for x in assets),'assets':assets}
    (EVID/'browser_overlap_verification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'assetCount':out['assetCount'],'passCount':out['passCount'],
        'reviewRequiredCount':out['reviewRequiredCount'],
        'failures':[{'path':x['assetPath'],'count':x['primitiveStrokeIntersectionCount'],
                     'pairs':[(l['labelId'],[p['primitiveId'] for p in l['primitiveStrokeIntersections']])
                              for l in x['browserLabelBBoxes'] if l['primitiveStrokeIntersections']]}
                   for x in assets if x['result']!='PASS'],
        'out':'archive/evidence/visual-upgrade-2025-m3-independent-b/browser_overlap_verification.json'},ensure_ascii=False))

if __name__=='__main__':main()
