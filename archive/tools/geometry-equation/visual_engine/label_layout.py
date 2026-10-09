"""Deterministic bounded label layout; approximate boxes cannot grant FINAL."""
from dataclasses import dataclass,asdict
import heapq
import math
import html
from .geometry_model import finite

DIRECTIONS=('N','NE','E','SE','S','SW','W','NW')
OWNER_BOUND_POINT_LABELS={'POINT_NAME','COORDINATE_LABEL'}
POINT_OWNER_DISTANCE_TOLERANCE_PX2=1e-6
MEASURED_OWNER_REPAIR_GAPS=(64,80,96,128)
TICK_LABEL_ALIGNMENT_TOLERANCE=4.0
TICK_LABEL_MAX_EDGE_GAP=16.0
TICK_LABEL_GAPS=(8,12,16)

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
    return max(font*.5,width),font*1.5*lines

def candidate(at,width,height,direction,gap):
    x,y=at
    dx=1 if 'E' in direction else -1 if 'W' in direction else 0
    dy=1 if 'S' in direction else -1 if 'N' in direction else 0
    return Box(x+gap if dx>0 else x-gap-width if dx<0 else x-width/2,
               y+gap if dy>0 else y-gap-height if dy<0 else y-height/2,width,height)

def owner_leader_endpoint(box,start,center):
    dx,dy=center[0]-start[0],center[1]-start[1]
    if math.hypot(dx,dy)<=1e-9:raise ValueError('TICK_LABEL_CALLOUT_ZERO_LENGTH')
    tx=math.inf if abs(dx)<=1e-12 else (box.width/2)/abs(dx)
    ty=math.inf if abs(dy)<=1e-12 else (box.height/2)/abs(dy)
    fraction=min(tx,ty)
    return [center[0]-dx*fraction,center[1]-dy*fraction]

def point_segment_distance(point,start,end):
    dx,dy=end[0]-start[0],end[1]-start[1]
    length2=dx*dx+dy*dy
    if length2<=1e-18:return math.dist(point,start)
    t=max(0.0,min(1.0,((point[0]-start[0])*dx+(point[1]-start[1])*dy)/length2))
    return math.hypot(point[0]-(start[0]+t*dx),point[1]-(start[1]+t*dy))

def segment_segment_distance(a,b,c,d):
    if segment_hits_box(a,b,Box(min(c[0],d[0]),min(c[1],d[1]),abs(d[0]-c[0]),abs(d[1]-c[1]))):
        # The bounding-box test is only a fast filter; use orientations to
        # distinguish crossing segments from disjoint diagonals.
        cross=lambda u,v:u[0]*v[1]-u[1]*v[0]
        ab=(b[0]-a[0],b[1]-a[1]);cd=(d[0]-c[0],d[1]-c[1]);ac=(c[0]-a[0],c[1]-a[1]);ad=(d[0]-a[0],d[1]-a[1]);ca=(a[0]-c[0],a[1]-c[1]);cb=(b[0]-c[0],b[1]-c[1])
        if cross(ab,ac)*cross(ab,ad)<=1e-12 and cross(cd,ca)*cross(cd,cb)<=1e-12:return 0.0
    return min(point_segment_distance(a,c,d),point_segment_distance(b,c,d),point_segment_distance(c,a,b),point_segment_distance(d,a,b))

def leader_clear(start,end,obstacles,owner_ids,clearance=6.0):
    def intersection_points(a,b,c,d):
        cross=lambda u,v:u[0]*v[1]-u[1]*v[0]
        r=(b[0]-a[0],b[1]-a[1]);s=(d[0]-c[0],d[1]-c[1]);den=cross(r,s);q=(c[0]-a[0],c[1]-a[1])
        if abs(den)<=1e-12:return []
        t=cross(q,s)/den;u=cross(q,r)/den
        return [[a[0]+t*r[0],a[1]+t*r[1]]] if -1e-9<=t<=1+1e-9 and -1e-9<=u<=1+1e-9 else []
    for obstacle in obstacles:
        kind=obstacle.get('kind');geometry=obstacle.get('geometry');owner=obstacle.get('id') in owner_ids
        if kind in {'label','conditionBox','rectangle'}:
            box=geometry if isinstance(geometry,Box) else Box(**geometry) if isinstance(geometry,dict) and {'x','y','width','height'}<=set(geometry) else None
            if box is not None and segment_hits_box(start,end,box.expand(clearance)):return False
            continue
        if kind in {'point','circle'}:
            x,y,radius=geometry;distance=point_segment_distance((x,y),start,end)
            if kind=='point' and owner and math.dist(start,(x,y))<=radius+1e-4:continue
            if kind=='point' and distance<=radius+clearance:return False
            if kind=='circle':
                start_radius=math.dist(start,(x,y));end_radius=math.dist(end,(x,y))
                starts_on_owner=owner and abs(start_radius-radius)<=1e-4
                if starts_on_owner:
                    # A leader may leave its source circle at the exact owner
                    # point, but it may not exit through the circle again.
                    if end_radius>radius+clearance and distance<radius-clearance:return False
                elif ((start_radius-radius)*(end_radius-radius)<=0 or
                      (start_radius>radius and end_radius>radius and distance<radius+clearance)):
                    return False
            continue
        if kind not in {'line','axis','auxiliary','leader','curve','tick','indicator'} or not isinstance(geometry,(list,tuple)) or len(geometry)<2:continue
        segments=list(zip(geometry,geometry[1:]))
        if owner:
            points=[point for c,d in segments for point in intersection_points(start,end,c,d)]
            if any(math.dist(point,start)>1e-4 for point in points):return False
            continue
        if any(segment_segment_distance(start,end,c,d)<=clearance for c,d in segments):return False
    return True


def find_clear_leader_path(start,end,obstacles,owner_ids,safe_area,clearance=6.0):
    """Find a bounded polyline route around line and marker obstacles.

    The first segment may leave the exact source owner. Subsequent segments
    must clear all geometry, labels, and previously placed leaders.
    """
    start=(finite(start[0]),finite(start[1]));end=(finite(end[0]),finite(end[1]))
    owner_ids=set(owner_ids or ())

    def in_safe(point):
        return safe_area.x<=point[0]<=safe_area.right and safe_area.y<=point[1]<=safe_area.bottom

    def path_is_clear(points):
        for index,(a,b) in enumerate(zip(points,points[1:])):
            owners=owner_ids if index==0 else set()
            if not leader_clear(a,b,obstacles,owners,clearance):
                return False
        return True

    direct=[start,end]
    if path_is_clear(direct):
        return [list(start),list(end)]

    candidates=set()
    for elbow in ((start[0],end[1]),(end[0],start[1])):
        if in_safe(elbow):candidates.add(elbow)
    for obstacle in obstacles:
        kind=obstacle.get('kind');geometry=obstacle.get('geometry')
        vertices=[]
        offsets=(clearance+8,clearance+16)
        if kind in {'line','axis','auxiliary','leader','curve','tick','indicator'} and isinstance(geometry,(list,tuple)):
            vertices=[tuple(point) for point in geometry]
        elif kind=='point' and isinstance(geometry,(list,tuple)) and len(geometry)>=2:
            vertices=[(geometry[0],geometry[1])];offsets=(geometry[2]+clearance+2,geometry[2]+clearance+12)
        elif kind=='circle' and isinstance(geometry,(list,tuple)) and len(geometry)>=3:
            cx,cy,radius=geometry[:3]
            for radial in (max(0.0,radius-clearance-10),radius+clearance+10):
                for index in range(16):
                    angle=2*math.pi*index/16
                    candidate=(cx+radial*math.cos(angle),cy+radial*math.sin(angle))
                    if in_safe(candidate):candidates.add(candidate)
        elif kind in {'label','conditionBox','rectangle'}:
            box=geometry if isinstance(geometry,Box) else Box(**geometry) if isinstance(geometry,dict) and {'x','y','width','height'}<=set(geometry) else None
            if box is not None:
                vertices=[(box.x,box.y),(box.right,box.y),(box.right,box.bottom),(box.x,box.bottom)]
        for vertex in vertices:
            for distance in offsets:
                for index in range(8):
                    angle=index*math.pi/4
                    candidate=(vertex[0]+distance*math.cos(angle),vertex[1]+distance*math.sin(angle))
                    if in_safe(candidate):candidates.add(candidate)

    routes=[]
    for waypoint in candidates:
        route=[start,waypoint,end]
        if path_is_clear(route):
            routes.append(route)
    if routes:
        chosen=min(routes,key=lambda route:(sum(math.dist(a,b) for a,b in zip(route,route[1:])),route[1]))
        return [list(point) for point in chosen]

    # If a one-bend detour is not enough, try a small set of page-aligned
    # corridors. They keep the route deterministic and stay inside the view.
    step=max(12.0,clearance*2)
    corridor_y=[]
    y=safe_area.y+step
    while y<safe_area.bottom-step:
        corridor_y.append(y);y+=step
    corridor_x=[]
    x=safe_area.x+step
    while x<safe_area.right-step:
        corridor_x.append(x);x+=step
    for y in corridor_y:
        route=[start,(start[0],y),(end[0],y),end]
        if path_is_clear(route):routes.append(route)
    for x in corridor_x:
        route=[start,(x,start[1]),(x,end[1]),end]
        if path_is_clear(route):routes.append(route)
    if not routes:
        # A* on a bounded visibility grid handles multiple intersecting
        # segments where a single elbow or page-aligned corridor cannot pass.
        step=12.0
        origin_x=safe_area.x+step/2;origin_y=safe_area.y+step/2
        nx=max(0,int((safe_area.width-step)//step)+1)
        ny=max(0,int((safe_area.height-step)//step)+1)
        nodes={(ix,iy):(origin_x+ix*step,origin_y+iy*step) for ix in range(nx) for iy in range(ny)}
        starts=[];goals={}
        for key,point in nodes.items():
            distance=math.dist(start,point)
            if distance<=step*2 and leader_clear(start,point,obstacles,owner_ids,clearance):starts.append((key,distance))
            distance=math.dist(end,point)
            if distance<=step*2 and leader_clear(point,end,obstacles,set(),clearance):goals[key]=distance
        if not starts or not goals:return None
        cost_by_node={};previous={};queue=[]
        for key,cost in starts:
            if cost<cost_by_node.get(key,float('inf')):
                cost_by_node[key]=cost;previous[key]=None
                heapq.heappush(queue,(cost+math.dist(nodes[key],end),cost,key))
        found=None
        directions=((-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1))
        while queue:
            _,cost,key=heapq.heappop(queue)
            if cost>cost_by_node.get(key,float('inf'))+1e-9:continue
            if key in goals:
                found=key;break
            point=nodes[key]
            for dx,dy in directions:
                neighbor=(key[0]+dx,key[1]+dy)
                if neighbor not in nodes:continue
                target=nodes[neighbor]
                if not leader_clear(point,target,obstacles,set(),clearance):continue
                next_cost=cost+math.dist(point,target)
                if next_cost<cost_by_node.get(neighbor,float('inf'))-1e-9:
                    cost_by_node[neighbor]=next_cost;previous[neighbor]=key
                    heapq.heappush(queue,(next_cost+math.dist(target,end),next_cost,neighbor))
        if found is None:return None
        grid_path=[];cursor=found
        while cursor is not None:
            grid_path.append(nodes[cursor]);cursor=previous[cursor]
        grid_path.reverse();chosen=[start,*grid_path,end]
    else:
        chosen=min(routes,key=lambda route:(sum(math.dist(a,b) for a,b in zip(route,route[1:])),tuple(route[1])))
    # Remove redundant collinear waypoints after a safe route is selected.
    simplified=list(chosen)
    index=1
    while index<len(simplified)-1:
        previous,current,following=simplified[index-1:index+2]
        owners=owner_ids if index==1 else set()
        if leader_clear(previous,following,obstacles,owners,clearance):
            simplified.pop(index)
        else:index+=1
    return [list(point) for point in simplified]

def point_box_has_unambiguous_owner(box,owner,competitors):
    """Require every measured box corner to stay inside its owner's Voronoi cell."""
    ox,oy=owner['geometry'][:2]
    for x,y in ((box.x,box.y),(box.right,box.y),(box.x,box.bottom),(box.right,box.bottom)):
        owner_distance2=(x-ox)**2+(y-oy)**2
        for marker in competitors:
            cx,cy=marker['geometry'][:2]
            competitor_distance2=(x-cx)**2+(y-cy)**2
            if owner_distance2+POINT_OWNER_DISTANCE_TOLERANCE_PX2>=competitor_distance2:return False
    return True

def tick_box_respects_owner(box,at,axis):
    """Keep a tick label on an axis-normal side of its actual owner tick."""
    x,y=at
    if axis=='x':
        aligned=abs((box.x+box.width/2)-x)<=TICK_LABEL_ALIGNMENT_TOLERANCE
        gaps=(y-box.bottom,box.y-y)
    elif axis=='y':
        aligned=abs((box.y+box.height/2)-y)<=TICK_LABEL_ALIGNMENT_TOLERANCE
        gaps=(x-box.right,box.x-x)
    else:return False
    return aligned and any(-.01<=gap<=TICK_LABEL_MAX_EDGE_GAP for gap in gaps)

def _segment_intersection(a,b):
    if len(a)!=2 or len(b)!=2:return None
    u=(a[1][0]-a[0][0],a[1][1]-a[0][1]);v=(b[1][0]-b[0][0],b[1][1]-b[0][1]);w=(b[0][0]-a[0][0],b[0][1]-a[0][1])
    cross=lambda p,q:p[0]*q[1]-p[1]*q[0]
    determinant=cross(u,v)
    if abs(determinant)<1e-12:return None
    t=cross(w,v)/determinant;s=cross(w,u)/determinant
    if not -1e-8<=t<=1+1e-8 or not -1e-8<=s<=1+1e-8:return None
    return (a[0][0]+t*u[0],a[0][1]+t*u[1])

def layout(labels,obstacles,safe_area,panel=None,measurements=None,require_measurements=False):
    """P0..P4, 8 candidates, coordinate relocation, suppression, side panel.

    Unsupported further repairs are explicit suggestions, never fake PASS.
    A coordinate side panel includes its point name, so long leaders are not
    needed. Critical point names remain at their marker or require polishing.
    """
    if require_measurements and not isinstance(measurements,dict):raise ValueError('BROWSER_MEASUREMENTS_REQUIRED')
    measurements=measurements or {};placed=[];suppressed=[];unresolved=[];trace=[];repairs=[];leaders=[]
    if len({v['id'] for v in labels})!=len(labels):raise ValueError('DUPLICATE_LAYOUT_LABEL')
    occupied=list(obstacles)
    for label in sorted(labels,key=lambda v:(v.get('priority',2),v['id'])):
        priority=label.get('priority',2)
        if not isinstance(priority,int) or not 0<=priority<=4:raise ValueError('INVALID_LABEL_PRIORITY')
        tick_owner=None
        if label.get('kind')=='TICK_LABEL':
            axis=label.get('tickAxis');tick_id=label.get('tickId');value=label.get('tickValue')
            if (axis not in {'x','y'} or not isinstance(tick_id,str) or not tick_id or
                isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or
                not isinstance(label.get('tickDisplayValue'),str) or label.get('text')!=label.get('tickDisplayValue')):
                raise ValueError('TICK_LABEL_OWNER_BINDING_REQUIRED:'+label['id'])
            matches=[o for o in obstacles if o.get('id')==tick_id and o.get('role')=='tick' and o.get('axis')==axis and isinstance(o.get('value'),(int,float)) and abs(o['value']-value)<=1e-9]
            axes=[o for o in obstacles if o.get('id')==axis+'-axis' and o.get('role')=='axis']
            if len(matches)!=1 or len(axes)!=1:raise ValueError('TICK_LABEL_OWNER_TICK_REQUIRED:'+label['id'])
            tick_owner=matches[0]
            intersection=_segment_intersection(axes[0]['geometry'],tick_owner['geometry'])
            if intersection is None or math.dist(tuple(label.get('at',())),intersection)>1e-4:raise ValueError('TICK_LABEL_SOURCE_POSITION_MISMATCH:'+label['id'])
        owner_marker=None;competing_markers=[]
        if require_measurements and label.get('kind') in OWNER_BOUND_POINT_LABELS:
            owner_id=label.get('target')
            if not isinstance(owner_id,str) or not owner_id:raise ValueError('POINT_LABEL_OWNER_REQUIRED:'+label['id'])
            markers=[obstacle for obstacle in obstacles if obstacle.get('kind')=='point']
            matches=[marker for marker in markers if marker.get('id')==owner_id]
            if len(matches)!=1:raise ValueError('POINT_LABEL_OWNER_MARKER_REQUIRED:'+label['id'])
            owner_marker=matches[0];competing_markers=[marker for marker in markers if marker.get('id')!=owner_id]
        if require_measurements:
            if label['id'] not in measurements:raise ValueError('BROWSER_LABEL_MEASUREMENT_REQUIRED:'+label['id'])
            measured=measurements[label['id']]
            if not isinstance(measured,(list,tuple)) or len(measured)!=2:raise ValueError('INVALID_BROWSER_LABEL_MEASUREMENT:'+label['id'])
            try:w,h=finite(measured[0]),finite(measured[1])
            except ValueError:raise ValueError('INVALID_BROWSER_LABEL_MEASUREMENT:'+label['id']) from None
            if w<=0 or h<=0:raise ValueError('INVALID_BROWSER_LABEL_MEASUREMENT:'+label['id'])
        else:
            w,h=measurements.get(label['id'],approximate_size(label.get('layoutText',label['text']),label.get('font',13.25)))
            w,h=finite(w),finite(h)
        chosen=None;method=None;tick_callout=label.get('tickLabelCallout');leader_fallbacks=[]
        if tick_callout is not None:
            if (tick_owner is None or not isinstance(tick_callout,dict)
                or set(tick_callout)!={'schemaVersion','tickId','axis','value','sourceAt','offsetUser'}
                or tick_callout.get('schemaVersion')!='TICK_LABEL_OWNER_LEADER_v1'
                or tick_callout.get('tickId')!=tick_owner.get('id') or tick_callout.get('axis')!=label.get('tickAxis')
                or tick_callout.get('value')!=label.get('tickValue') or tick_callout.get('sourceAt')!=list(label['at'])
                or tick_callout.get('offsetUser')!=[28,-22]):
                raise ValueError('TICK_LABEL_CALLOUT_BINDING_INVALID:'+label['id'])
        def acceptable(box):
            return (safe_area.contains(box) and not any(collision(box,o) for o in occupied)
                and (owner_marker is None or point_box_has_unambiguous_owner(box,owner_marker,competing_markers))
                and (tick_owner is None or tick_callout is not None or tick_box_respects_owner(box,label['at'],label['tickAxis'])))
        preferred=label.get('preferred');directions=((preferred,) if preferred in DIRECTIONS else ())+tuple(v for v in label.get('directions', DIRECTIONS) if v!=preferred)
        if tick_owner is not None:
            allowed=('N','S') if label['tickAxis']=='x' else ('W','E')
            directions=((preferred,) if preferred in allowed else ())+tuple(v for v in allowed if v!=preferred)
            default_gaps=TICK_LABEL_GAPS
        else:default_gaps=() if 'candidateCenters' in label or 'candidateBaselines' in label else tuple(label.get('gaps',(12,8,20,32,48)))
        if tick_callout is not None:
            offset=tick_callout['offsetUser'];center=[label['at'][0]+offset[0],label['at'][1]+offset[1]]
            box=Box(center[0]-w/2,center[1]-h/2,w,h)
            if acceptable(box):
                chosen=box;method='OWNER_BOUND_TICK_LEADER'
                end=owner_leader_endpoint(box,label['at'],center)
                owner_ids={tick_owner['id'],label['tickAxis']+'-axis'}
                if not leader_clear(label['at'],end,occupied,owner_ids):
                    chosen=None;method=None
                    trace.append({'id':label['id'],'fallback':'POLISH_REQUIRED','suggestions':['OWNER_LEADER_CLEARANCE']})
                    unresolved.append(label['id'])
                    continue
                leader_id=label['id']+'-owner-leader'
                leaders.append({'schemaVersion':'TICK_LABEL_OWNER_LEADER_v1','id':leader_id,
                    'from':list(label['at']),'to':end,'ownerLabelId':label['id'],'tickId':tick_owner['id'],
                    'axis':label['tickAxis'],'value':label['tickValue']})
                occupied.append({'id':leader_id,'kind':'leader','geometry':[list(label['at']),end]})
        else:
            if 'candidateBaselines' in label:
                for x, y in label['candidateBaselines']:
                    box=Box(x,y-h*.8,w,h)
                    if acceptable(box):
                        if label.get('leaderRequiresClearPath'):
                            center=(box.x+box.width/2,box.y+box.height/2)
                            start=label['leaderFrom'];end=owner_leader_endpoint(box,start,center)
                            if math.dist(start,end)>label.get('leaderMaxLength',label.get('font',13.25)*6):continue
                            if not leader_clear(start,end,occupied,set(label.get('leaderOwnerIds',()))):
                                leader_fallbacks.append((box,center,'FROZEN_OWNER_BASELINE'))
                                continue
                            label['_selectedLeaderPath']=[list(start),list(end)]
                        chosen=box;method='FROZEN_OWNER_BASELINE';break
            if 'candidateCenters' in label:
                from .publication import box_owned
                for x, y in label['candidateCenters']:
                    box = Box(x-w/2, y-h/2, w, h)
                    if not acceptable(box) or not box_owned(label, box):
                        continue
                    if label.get('leaderRequiresClearPath'):
                        start = label['leaderFrom']
                        end = owner_leader_endpoint(box,start,(x,y))
                        if math.dist(start,end)>label.get('leaderMaxLength',label.get('font',13.25)*6):continue
                        if not leader_clear(start,end,occupied,set(label.get('leaderOwnerIds',()))):
                            leader_fallbacks.append((box,(x,y),'OWNER_BOUND_RELOCATION'))
                            continue
                        label['_selectedLeaderPath']=[list(start),list(end)]
                    if acceptable(box) and box_owned(label, box):
                        chosen=box;method='OWNER_BOUND_RELOCATION';break
            if chosen is None and leader_fallbacks and label.get('leaderRequiresClearPath'):
                start=label['leaderFrom'];owner_ids=set(label.get('leaderOwnerIds',()))
                max_length=label.get('leaderMaxLength',label.get('font',13.25)*6)
                for box,center,route_method in leader_fallbacks:
                    end=owner_leader_endpoint(box,start,center)
                    route=find_clear_leader_path(start,end,occupied,owner_ids,safe_area)
                    if route is None:continue
                    route_length=sum(math.dist(a,b) for a,b in zip(route,route[1:]))
                    if route_length>max_length:continue
                    chosen=box;method=route_method;label['_selectedLeaderPath']=route;break
            for gap in default_gaps:
                for direction in directions:
                    box=candidate(label['at'],w,h,direction,gap)
                    if acceptable(box):
                        chosen=box;method='AUTO_'+direction if gap==12 else 'COORDINATE_RELOCATION_'+direction
                        break
                if chosen:break
        repair=None
        if (chosen is None and require_measurements and owner_marker is not None and label['kind'] in OWNER_BOUND_POINT_LABELS
            and not label.get('candidateCenters') and isinstance(label.get('measuredFragmentSha256'),str)
            and len(label['measuredFragmentSha256'])==71 and label['measuredFragmentSha256'].startswith('sha256:')
            and isinstance(label.get('measuredFragmentOwner'),str) and label['measuredFragmentOwner']==label.get('target')
            and label.get('measuredFactRole') in {'GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'}):
            for gap in MEASURED_OWNER_REPAIR_GAPS:
                for direction in directions:
                    box=candidate(label['at'],w,h,direction,gap)
                    if acceptable(box):
                        chosen=box;method='MEASURED_OWNER_SAFE_RELOCATION'
                        repair={'schemaVersion':'MEASURED_OWNER_SAFE_LABEL_RELOCATION_v1','failureClass':'OWNER_LABEL_NO_DEFAULT_CANDIDATE',
                            'labelId':label['id'],'labelKind':label['kind'],'ownerId':label['target'],'factRole':label['measuredFactRole'],
                            'sourceAt':list(label['at']),'ownerPoint':list(owner_marker['geometry']),
                            'competingPoints':[{'id':marker['id'],'geometry':list(marker['geometry'])} for marker in sorted(competing_markers,key=lambda item:item['id'])],
                            'measuredFragmentSha256':label['measuredFragmentSha256'],'measuredBox':{'width':w,'height':h},
                            'defaultSearch':{'directions':list(directions),'gaps':list(default_gaps)},
                            'supportedExtendedGaps':list(MEASURED_OWNER_REPAIR_GAPS),
                            'selected':{'direction':direction,'gap':gap,'box':asdict(box)},
                            'ownerPolicy':'EXACT_POINT_VORONOI_BOX_CORNERS','tolerancePxSquared':POINT_OWNER_DISTANCE_TOLERANCE_PX2}
                        repairs.append(repair);break
                if chosen:break
        if chosen is None and tick_owner is None and label.get('allowSuppress',False) and priority>=3:
            suppressed.append(label['id']);trace.append({'id':label['id'],'fallback':'LOW_PRIORITY_SUPPRESSION'});continue
        if chosen is None and tick_owner is None and panel is not None and panel.width>0 and label['kind']!='POINT_NAME' and label.get('allowPanel', True):
            text=label.get('panelText',label['text'])
            if require_measurements:
                if text!=label['text'] or label.get('panelPrefix'):raise ValueError('BROWSER_PANEL_VARIANT_MEASUREMENT_REQUIRED:'+label['id'])
                pw,ph=w,h
            else:pw,ph=approximate_size(text,label.get('font',13.25))
            pw=max(pw,w);ph=max(ph,h)
            for row in range(0,int(panel.height),24):
                box=Box(panel.x,panel.y+row,pw,ph)
                if panel.contains(box) and acceptable(box):
                    chosen=box;method='SIDE_PANEL';label={**label,'text':text,'markup':html.escape(label.get('panelPrefix',''))+label['markup'] if label.get('markup') else None};break
        if chosen is None:
            unresolved.append(label['id'])
            trace.append({'id':label['id'],'fallback':'POLISH_REQUIRED','suggestions':['LEADER_LINE','VIEWPORT_EXPANSION','PANEL_SPLIT']});continue
        placed_label={**label,'box':asdict(chosen),'baseline':([chosen.x+chosen.width/2, chosen.y+chosen.height/2] if label.get('centered') else [chosen.x,chosen.y+chosen.height*.8]),'placement':method}
        placed.append(placed_label)
        occupied.append({'id':label['id'],'kind':'label','geometry':chosen})
        if 'leaderFrom' in placed_label and '_selectedLeaderPath' in placed_label:
            occupied.append({'id':label.get('leaderId',label['id']+'-leader'),'kind':'leader',
                             'geometry':placed_label['_selectedLeaderPath']})
        trace_row={'id':label['id'],'fallback':method}
        if repair is not None:trace_row['repair']=repair
        trace.append(trace_row)
    return {'labels':placed,'suppressed':suppressed,'unresolved':unresolved,'trace':trace,'repairs':repairs,'leaders':leaders,
        'status':'POLISH_REQUIRED' if unresolved else 'PASS','basis':'APPROXIMATE_BUILD_SIDE_ONLY'}
