"""Deterministic bounded label layout; approximate boxes cannot grant FINAL."""
from dataclasses import dataclass,asdict
import math
from .geometry_model import finite

DIRECTIONS=('N','NE','E','SE','S','SW','W','NW')

@dataclass(frozen=True)
class Box:
    x: float
    y: float
    width: float
    height: float
    def __post_init__(self):
        for v in (self.x,self.y,self.width,self.height):finite(v)
        if self.width<0 or self.height<0:raise ValueError('INVALID_BOX')
    @property
    def right(self):return self.x+self.width
    @property
    def bottom(self):return self.y+self.height
    def expand(self,pad):return Box(self.x-pad,self.y-pad,self.width+2*pad,self.height+2*pad)
    def overlaps(self,b,pad=0):
        a=self.expand(pad)
        return a.x<b.right and b.x<a.right and a.y<b.bottom and b.y<a.bottom
    def contains(self,b):return self.x<=b.x and b.right<=self.right and self.y<=b.y and b.bottom<=self.bottom

def segment_hits_box(p,q,box):
    # Liang-Barsky intersection in screen coordinates.
    dx,dy=q[0]-p[0],q[1]-p[1];low,high=0.,1.
    for a,b in ((-dx,p[0]-box.x),(dx,box.right-p[0]),(-dy,p[1]-box.y),(dy,box.bottom-p[1])):
        if a==0:
            if b<0:return False
        else:
            t=b/a
            if a<0:low=max(low,t)
            else:high=min(high,t)
            if low>high:return False
    return True

def collision(box,obstacle,pad=6):
    kind=obstacle['kind'];geometry=obstacle['geometry'];a=box.expand(pad)
    if kind in {'label','conditionBox','tick','indicator','rectangle'}:return a.overlaps(geometry)
    if kind in {'point','circle'}:
        x,y,r=geometry
        nearest=math.hypot(max(a.x-x,0,x-a.right),max(a.y-y,0,y-a.bottom))
        if kind=='point':return nearest<=r
        farthest=max(math.hypot(cx-x,cy-y) for cx in (a.x,a.right) for cy in (a.y,a.bottom))
        return nearest<=r and farthest>=r
    if kind in {'line','axis','auxiliary','leader','curve'}:
        return any(segment_hits_box(p,q,a) for p,q in zip(geometry,geometry[1:]))
    raise ValueError('UNKNOWN_COLLISION_OBSTACLE')

def approximate_size(text,font=13.25,lines=1):
    if '\n' in text:
        rows=text.split('\n')
        return max(approximate_size(row,font)[0] for row in rows),font*1.5*len(rows)
    width=sum(font*(1.0 if ord(c)>127 and c not in '−√≤≥′' else .66) for c in text)
    return max(font,width),font*1.5*lines

def candidate(at,width,height,direction,gap):
    x,y=at
    dx=1 if 'E' in direction else -1 if 'W' in direction else 0
    dy=1 if 'S' in direction else -1 if 'N' in direction else 0
    return Box(x+gap if dx>0 else x-gap-width if dx<0 else x-width/2,
               y+gap if dy>0 else y-gap-height if dy<0 else y-height/2,width,height)

def layout(labels,obstacles,safe_area,panel=None,measurements=None):
    """P0..P4, 8 candidates, coordinate relocation, suppression, side panel.

    Unsupported further repairs are explicit suggestions, never fake PASS.
    A coordinate side panel includes its point name, so long leaders are not
    needed. Critical point names remain at their marker or require polishing.
    """
    measurements=measurements or {};placed=[];suppressed=[];unresolved=[];trace=[]
    if len({v['id'] for v in labels})!=len(labels):raise ValueError('DUPLICATE_LAYOUT_LABEL')
    occupied=list(obstacles)
    for label in sorted(labels,key=lambda v:(v.get('priority',2),v['id'])):
        priority=label.get('priority',2)
        if not isinstance(priority,int) or not 0<=priority<=4:raise ValueError('INVALID_LABEL_PRIORITY')
        w,h=measurements.get(label['id'],approximate_size(label['text'],label.get('font',13.25)))
        w,h=finite(w),finite(h);chosen=None;method=None
        for gap in (12,20,32,48):
            for direction in DIRECTIONS:
                box=candidate(label['at'],w,h,direction,gap)
                if safe_area.contains(box) and not any(collision(box,o) for o in occupied):
                    chosen=box;method='AUTO_'+direction if gap==12 else 'COORDINATE_RELOCATION_'+direction
                    break
            if chosen:break
        if chosen is None and label.get('allowSuppress',False) and priority>=3:
            suppressed.append(label['id']);trace.append({'id':label['id'],'fallback':'LOW_PRIORITY_SUPPRESSION'});continue
        if chosen is None and panel is not None and label['kind']!='POINT_NAME':
            text=label.get('panelText',label['text'])
            pw,ph=approximate_size(text,label.get('font',13.25))
            pw=max(pw,w);ph=max(ph,h)
            for row in range(0,int(panel.height),24):
                box=Box(panel.x,panel.y+row,pw,ph)
                if panel.contains(box) and safe_area.contains(box) and not any(collision(box,o) for o in occupied):
                    chosen=box;method='SIDE_PANEL';label={**label,'text':text};break
        if chosen is None:
            unresolved.append(label['id'])
            trace.append({'id':label['id'],'fallback':'POLISH_REQUIRED','suggestions':['LEADER_LINE','VIEWPORT_EXPANSION','PANEL_SPLIT']});continue
        placed.append({**label,'box':asdict(chosen),'baseline':[chosen.x,chosen.y+chosen.height*.8],'placement':method})
        occupied.append({'id':label['id'],'kind':'label','geometry':chosen})
        trace.append({'id':label['id'],'fallback':method})
    return {'labels':placed,'suppressed':suppressed,'unresolved':unresolved,'trace':trace,
        'status':'POLISH_REQUIRED' if unresolved else 'PASS','basis':'APPROXIMATE_BUILD_SIDE_ONLY'}
