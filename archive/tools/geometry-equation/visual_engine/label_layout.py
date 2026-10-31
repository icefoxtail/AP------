"""Deterministic bounded label layout; approximate boxes cannot grant FINAL."""
from dataclasses import dataclass,asdict
import copy
import heapq
import math
import html
from .geometry_model import finite

DIRECTIONS=('N','NE','E','SE','S','SW','W','NW')
PATH_LABEL_SIDE_MIN_DOT=0.5   # E37: a direction counts as on a path's side when its cosine with that side's normal is at least this (45 degrees either way is 0.707)
OWNER_BOUND_POINT_LABELS={'POINT_NAME','COORDINATE_LABEL'}
POINT_OWNER_DISTANCE_TOLERANCE_PX2=1e-6
MEASURED_OWNER_REPAIR_GAPS=(64,80,96,128)
POINT_NAME_RING_RADII=(12,16,20,26,32,40,48,56,64,72,80,96,112,128,144,160,180,210,240,270,300)
NEAR_RELOCATION_LEADER_MIN_GAP=20
# A wedge narrower than twice the 15-degree leader/line tolerance keeps its bisector leaders hidden under a ray (visible_owner_leader rejects them).
NARROW_WEDGE_MAX_DEGREES=30.0
TICK_LABEL_ALIGNMENT_TOLERANCE=4.0
TICK_LABEL_MAX_EDGE_GAP=16.0
TICK_LABEL_GAPS=(8,12,16)
TICK_LABEL_SLIDES=(-2.0,2.0,-3.5,3.5)   # px along its axis a tick label may move when no centred box is clear (inside TICK_LABEL_ALIGNMENT_TOLERANCE)
# Gaps tried from each alternate anchor of a lineFallback label (nearest first; from NEAR_RELOCATION_LEADER_MIN_GAP on, a visible leader is needed).
LINE_FALLBACK_GAPS=(8,6,10,20,32,48)
# The wide search of a line-owned label (E31): when no ordinary anchor found room, anchors are sampled over the whole drawn chord of the line.
WIDE_LINE_GAPS=(8,6,10,14,20,28,38,50,64)
WIDE_LINE_STEPS=24                 # anchors at t = 1/(steps+1) ... steps/(steps+1) along the drawn line, the ones nearest the preferred anchor first
LEADER_NEAR_START_MIN_PX=1.5       # a leader starting beside a parallel neighbour keeps at least this far from it (near_start leaders)

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

def leader_along(start,end,c,d,max_degrees=15.0):
    """True when the leader start->end is within max_degrees of the direction of segment c-d (either way)."""
    u=(end[0]-start[0],end[1]-start[1]);v=(d[0]-c[0],d[1]-c[1]);nu=math.hypot(*u);nv=math.hypot(*v)
    if nu<=1e-9 or nv<=1e-9:return False
    return abs(u[0]*v[1]-u[1]*v[0])/(nu*nv)<=math.sin(math.radians(max_degrees))

def leader_hides_along(start,end,c,d,max_degrees=15.0):
    """True when the leader start->end runs within max_degrees along a part of segment c-d that leaves the point. A segment that ends at the point
    occupies one direction only, so a leader pointing away from it is not hidden."""
    u=(end[0]-start[0],end[1]-start[1]);nu=math.hypot(*u)
    if nu<=1e-9:return False
    for q in (c,d):
        v=(q[0]-start[0],q[1]-start[1]);nv=math.hypot(*v)
        if nv>1e-6 and u[0]*v[0]+u[1]*v[1]>0 and abs(u[0]*v[1]-u[1]*v[0])/(nu*nv)<=math.sin(math.radians(max_degrees)):return True
    return False

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

def leader_clear(start,end,obstacles,owner_ids,clearance=6.0,near_start=False,start_tolerance=1e-4):
    """near_start (E31): a leader that starts on its own line right beside a parallel neighbour (closer than `clearance`) may leave it when it only moves
    away from that neighbour: the closest approach to the neighbour is its start, which keeps at least LEADER_NEAR_START_MIN_PX from it, and it never crosses it."""
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
            if any(math.dist(point,start)>start_tolerance for point in points):return False
            continue
        if near_start:
            for c,d in segments:
                gap=segment_segment_distance(start,end,c,d)
                if gap>clearance:continue
                start_gap=point_segment_distance(start,c,d)
                if start_gap<LEADER_NEAR_START_MIN_PX or gap<start_gap-1e-6:return False
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

def box_segment_distance(box,a,b,samples=32):
    """Smallest distance from the box (0 inside) to the segment a-b, sampled."""
    best=math.inf
    for i in range(samples+1):
        x=a[0]+(b[0]-a[0])*i/samples;y=a[1]+(b[1]-a[1])*i/samples
        best=min(best,math.hypot(max(box.x-x,0,x-box.right),max(box.y-y,0,y-box.bottom)))
    return best

LINE_LABEL_OWN_MAX=10.0
LINE_LABEL_OTHER_MARGIN=24.0

# ownership NEAREST (E32): a label in a crowded corner (the side of a small triangle among its other sides) names its line when that line is the nearest one by this much only
RELAXED_LINE_LABEL_OWN_MAX=14.0
RELAXED_LINE_LABEL_MARGIN=4.0

def line_label_unambiguous(box,own,others,own_max=LINE_LABEL_OWN_MAX,margin=LINE_LABEL_OTHER_MARGIN):
    """A label box names its line without a leader only when its own drawn line is the nearest by a clear margin."""
    pairs=lambda o:list(zip(o["geometry"],o["geometry"][1:]))
    own_distance=min(box_segment_distance(box,c,d) for c,d in pairs(own))
    if own_distance>own_max:return False
    return all(min(box_segment_distance(box,c,d) for c,d in pairs(o))>=own_distance+margin for o in others)

def segment_on_line(owner,c,d,tolerance=0.5):
    """True when the segment c-d lies on the (infinite) line through the drawn segment `owner`: a polygon edge or a segment drawn over the line it
    labels is the same line, not another line."""
    (ax,ay),(bx,by)=owner['geometry'][0],owner['geometry'][-1];length=math.hypot(bx-ax,by-ay)
    if length<=1e-9:return False
    return all(abs((bx-ax)*(ay-p[1])-(ax-p[0])*(by-ay))/length<=tolerance for p in (c,d))

def competing_lines(owner,obstacles):
    """The other drawn lines a label could be mistaken for, with the pieces drawn over the owner's own line left out (a polygon's other edges stay)."""
    rows=[]
    for o in obstacles:
        if o.get('kind')!='line' or o is owner or not isinstance(o.get('geometry'),(list,tuple)) or len(o['geometry'])<2:continue
        pieces=[[c,d] for c,d in zip(o['geometry'],o['geometry'][1:]) if not segment_on_line(owner,c,d)]
        rows.extend({**o,'geometry':piece} for piece in pieces)
    return rows

def owner_line_incident_ids(owner,start,occupied):
    """The line a label names and every other drawn line with a piece over it that passes through the anchor: a leader may touch these only there."""
    return {owner['id']}|{o.get('id') for o in occupied if o.get('kind') in {'line','curve'} and o is not owner and isinstance(o.get('geometry'),(list,tuple)) and len(o['geometry'])>=2
        and any(segment_on_line(owner,c,d) and point_segment_distance(start,c,d)<=1e-3 for c,d in zip(o['geometry'],o['geometry'][1:]))}

def owner_incident_ids(start,owner_marker,occupied):
    """The point itself and every line, curve, circle or other label's leader through it: a leader may touch these only at the point."""
    incident={owner_marker['id']}|{o.get('id') for o in occupied if o.get('kind') in {'line','axis','auxiliary','curve','leader'}
        and isinstance(o.get('geometry'),(list,tuple)) and len(o['geometry'])>=2
        and any(point_segment_distance(start,c,d)<=1e-3 for c,d in zip(o['geometry'],o['geometry'][1:]))}
    incident|={o.get('id') for o in occupied if o.get('kind')=='circle' and abs(math.dist(start,o['geometry'][:2])-o['geometry'][2])<=1e-3}
    return incident

def line_between(start,box,occupied,incident):
    """(E31 lineBarrier) True when a line, axis or curve that does not pass through the anchor crosses the straight way from the anchor to the box: the label would read as sitting beyond it."""
    center=(box.x+box.width/2,box.y+box.height/2)
    if math.hypot(center[0]-start[0],center[1]-start[1])<=1e-9:return False
    end=owner_leader_endpoint(box,start,center)
    return any(o.get('kind') in {'line','axis','auxiliary','curve'} and o.get('id') not in incident and isinstance(o.get('geometry'),(list,tuple)) and len(o['geometry'])>=2
               and any(segment_segment_distance(start,end,c,d)<=1.0 for c,d in zip(o['geometry'],o['geometry'][1:])) for o in occupied)

def visible_owner_leader(start,box,occupied,incident,near_start=False,start_tolerance=1e-4):
    """End of a leader from the point to the label box, or None when it would touch other geometry or hide along a line through the point."""
    end=owner_leader_endpoint(box,start,(box.x+box.width/2,box.y+box.height/2))
    if not leader_clear(start,end,occupied,incident,near_start=near_start,start_tolerance=start_tolerance):return None
    # A leader running along a line through the point (within 15 degrees) hides under that line: not a visible leader.
    if any(o.get('id') in incident and o.get('kind') in {'line','axis','auxiliary','curve','leader'} and isinstance(o.get('geometry'),(list,tuple))
           and any(point_segment_distance(start,c,d)<=1e-3 and leader_hides_along(start,end,c,d) for c,d in zip(o['geometry'],o['geometry'][1:]))
           for o in occupied):return None
    return end

def point_box_has_unambiguous_owner(box,owner,competitors):
    """Require every measured box corner to stay inside its owner's Voronoi cell."""
    ox,oy=owner['geometry'][:2]
    for x,y in ((box.x,box.y),(box.right,box.y),(box.x,box.bottom),(box.right,box.bottom)):
        owner_distance2=(x-ox)**2+(y-oy)**2
        for marker in competitors:
            cx,cy=marker['geometry'][:2]
            if (cx-ox)**2+(cy-oy)**2<1e-6:continue   # a second marker on the very same place is no competitor (G6c: a hidden construction dot under a named point)
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

# ---- angle labels outside their angle (E12) -----------------------------------------------------------------------------------------------
# An angle label belongs to its own arc. It never stands inside another angle mark's sector (the wedge up to that mark's outermost arc), and when the
# angle holds no room for it (a narrow wedge crowded with lines, a vertex with several angles) it goes outside the angle on a visible leader that starts
# ON its own outermost arc: at the arc's middle or, for a narrow angle, at an end of the arc (on a ray) leaving across that ray. A leader never crosses a line.
ANGLE_OUTSIDE_LEADER_LENGTHS=(14,20,28,38,50,64,80,100,125)
ANGLE_OUTSIDE_LEADER_STEP_DEGREES=15
ANGLE_OUTSIDE_LEADER_ARC_FRACTIONS=(0.5,0.3,0.7,0.15,0.85,0.0,1.0)   # where along the outermost arc (from its first ray to its last) the leader may start
ANGLE_LEADER_RAY_CROSSING_MIN_SIN=0.5      # a leader leaving an arc end points 30 degrees or more away from the ray (never grazes along it)
ANGLE_LEADER_OWN_RAY_CLEARANCE=3.0         # while it does not cross the ray, the leader keeps this far from it

def sector_contains(point,sector,margin=2.0):
    """True when the point lies inside the sector (vertex, start direction, signed sweep, radius): within the swept wedge and within radius+margin."""
    (vx,vy),start,delta,radius=sector
    dx,dy=point[0]-vx,point[1]-vy
    if math.hypot(dx,dy)>radius+margin:return False
    if math.hypot(dx,dy)<=1e-9:return True
    theta=math.atan2(dy,dx)
    return ((theta-start) if delta>0 else (start-theta))%(2*math.pi)<=abs(delta)+1e-9

def box_point_distance(box,point):
    """Distance from the point to the nearest point of the box (0 inside)."""
    return math.hypot(max(box.x-point[0],0,point[0]-box.right),max(box.y-point[1],0,point[1]-box.bottom))

def box_in_other_sectors(box,sectors):
    """True when the box centre lies inside some other angle mark's sector."""
    center=(box.x+box.width/2,box.y+box.height/2)
    return any(sector_contains(center,sector) for sector in sectors)

def point_in_wedge(point,vertex,start,delta,slack_degrees=0.5):
    """True when the point lies within the angular range an angle mark sweeps (vertex, start direction, signed sweep), at any distance from the vertex."""
    dx,dy=point[0]-vertex[0],point[1]-vertex[1]
    if math.hypot(dx,dy)<=1e-9:return True
    offset=((math.atan2(dy,dx)-start) if delta>0 else (start-math.atan2(dy,dx)))%(2*math.pi)
    slack=math.radians(slack_degrees)
    return offset<=abs(delta)+slack or offset>=2*math.pi-slack

def box_touches_wedge(box,wedge):
    """True when the box centre or any corner lies within the wedge an angle mark sweeps (labelPlacement LEADER keeps the whole label outside its angle)."""
    points=((box.x+box.width/2,box.y+box.height/2),(box.x,box.y),(box.right,box.y),(box.x,box.bottom),(box.right,box.bottom))
    return any(point_in_wedge(point,wedge['vertex'],wedge['start'],wedge['delta']) for point in points)

def lines_through_vertex(occupied,vertex,start,delta):
    """(own rays, other lines through the vertex): the drawn segments of the angle's two rays, and every other drawn line that also meets the vertex
    (a dashed line splitting the angle, a third ray). Each entry is (obstacle, segment start, segment end)."""
    own,other=[],[]
    for obstacle in occupied:
        geometry=obstacle.get('geometry')
        if obstacle.get('kind') not in {'line','auxiliary'} or not isinstance(geometry,(list,tuple)) or len(geometry)<2:continue
        for c,d in zip(geometry,geometry[1:]):
            if point_segment_distance(vertex,c,d)>1e-3:continue
            along=any(leader_along(vertex,(vertex[0]+math.cos(direction),vertex[1]+math.sin(direction)),c,d,0.5) for direction in (start,start+delta))
            (own if along else other).append((obstacle,c,d))
    return own,other

def angle_leader_clear(start,end,occupied,owner_ids,rays,through,outward=None):
    """leader_clear for a leader that starts on an angle's outermost arc. A line through the vertex that is not one of the angle's rays may run close
    to the start (it splits the arc) but is never crossed. The angle's own rays keep the leader clear; when the leader starts at an END of the arc
    (on a ray) it must leave across that ray's outside: `outward` is the ray's outward normal, and the leader then points at least 30 degrees away from
    the ray and touches it only at its start (a leader never crosses a drawn line: the rendered-layout verifier rejects any crossing)."""
    skipped={id(obstacle) for obstacle,_c,_d in rays}
    through_ids={obstacle.get('id') for obstacle,_c,_d in through}
    if not leader_clear(start,end,[o for o in occupied if id(o) not in skipped],set(owner_ids)|through_ids):return False
    u=(end[0]-start[0],end[1]-start[1]);length=math.hypot(*u)
    for _obstacle,c,d in rays:
        if outward is not None and point_segment_distance(start,c,d)<=1e-3:
            if length<=1e-9 or (u[0]*outward[0]+u[1]*outward[1])/length<ANGLE_LEADER_RAY_CROSSING_MIN_SIN:return False
        elif segment_segment_distance(start,end,c,d)<=ANGLE_LEADER_OWN_RAY_CLEARANCE:return False
    return True

def angle_outside_leader(label,w,h,occupied,acceptable,owner_ids):
    """A box for an angle label beside its angle, with a leader that starts on the angle's outermost arc: (box, leader start, leader end, direction)
    or None. Shorter leaders first; for one length the arc's middle first, then points nearer each ray, then the two ends of the arc (where the arc
    meets a ray: the only place from which a leader reaches the outside of a narrow angle without crossing a line); at one start the directions
    nearest to the perpendicular of the nearer ray come first."""
    ws=label['wedgeSearch'];vertex=ws['vertex'];radius=ws['arcRadius'];first=ws['start'];delta=ws['delta']
    sign=1 if delta>0 else -1
    own,through=lines_through_vertex(occupied,vertex,first,delta)
    normals=(first-sign*math.pi/2,first+delta+sign*math.pi/2)          # outward normal of the first ray / of the last ray
    steps=int(360/ANGLE_OUTSIDE_LEADER_STEP_DEGREES)
    for length in ANGLE_OUTSIDE_LEADER_LENGTHS:
        for fraction in ANGLE_OUTSIDE_LEADER_ARC_FRACTIONS:
            angle=first+delta*fraction
            start=(vertex[0]+radius*math.cos(angle),vertex[1]+radius*math.sin(angle))
            near=normals[0] if fraction<=0.5 else normals[1]
            outward=None
            if fraction<=0.0:outward=(math.cos(normals[0]),math.sin(normals[0]))
            elif fraction>=1.0:outward=(math.cos(normals[1]),math.sin(normals[1]))
            directions=sorted((near+2*math.pi*k/steps for k in range(steps)),key=lambda theta:(round(abs((theta-near+math.pi)%(2*math.pi)-math.pi),9),theta%(2*math.pi)))
            for theta in directions:
                ux,uy=math.cos(theta),math.sin(theta)
                end=[start[0]+length*ux,start[1]+length*uy]
                tx=math.inf if abs(ux)<=1e-12 else (w/2)/abs(ux)
                ty=math.inf if abs(uy)<=1e-12 else (h/2)/abs(uy)
                reach=min(tx,ty);center=(end[0]+ux*reach,end[1]+uy*reach)
                box=Box(center[0]-w/2,center[1]-h/2,w,h)
                if not acceptable(box):continue
                if not angle_leader_clear(start,end,occupied,owner_ids,own,through,outward):continue
                return box,start,owner_leader_endpoint(box,start,center),('E','SE','S','SW','W','NW','N','NE')[int(((math.degrees(theta)%360)+22.5)%360//45)]
    return None

def angle_labels_first_order(label):
    """The second-pass order: at one priority the angle labels go first, the narrowest angle first (a label inside a nested angle is placed before the
    wider angle whose sector contains it), then every other label as in the first pass."""
    wedge=label.get('wedgeSearch')
    return (label.get('priority',2),0 if wedge else 1,abs(wedge['delta']) if wedge else 0.0,label['id'])

# ---- region labels on a leader (E32) ------------------------------------------------------------------------------------------------------------------
# A region whose label does not fit inside it (or that a drawn line cuts into small cells) writes the label OUTSIDE, on a straight leader that starts on the region's outer
# boundary and runs away from it. The label box stays out of this region and every other filled region (and off their boundaries), and the leader crosses no stroke and enters
# no filled region.
REGION_LEADER_CLEARANCE_PX=3.0
REGION_LEADER_MIN_ALIGNMENT=0.3     # a compass box direction must point at least this much (cosine) along the anchor's outward normal
REGION_LEADER_SAMPLE_STEP_PX=4.0

def point_in_even_odd(point,polygons):
    inside=False
    for poly in polygons:
        for (ax,ay),(bx,by) in zip(poly,poly[1:]+poly[:1]):
            if (ay>point[1])!=(by>point[1]) and point[0]<(bx-ax)*(point[1]-ay)/(by-ay)+ax:inside=not inside
    return inside

def box_outside_regions(box,region_polygons):
    """True when no part of the box lies in any of the regions (each an even-odd list of screen polygons) or within REGION_LEADER_CLEARANCE_PX of their boundaries."""
    probes=[(box.x+box.width*i/4,box.y+box.height*j/2) for i in range(5) for j in range(3)]
    padded=box.expand(REGION_LEADER_CLEARANCE_PX)
    for polygons in region_polygons:
        if any(point_in_even_odd(p,polygons) for p in probes):return False
        if any(segment_hits_box(a,b,padded) for poly in polygons for a,b in zip(poly,poly[1:]+poly[:1])):return False
    return True

def leader_avoids_regions(start,end,region_polygons,skip=3.0):
    """True when the leader enters none of the regions after its first `skip` px (it starts on the boundary of its own region)."""
    length=math.dist(start,end)
    if length<=1e-9:return False
    steps=max(2,int(length//REGION_LEADER_SAMPLE_STEP_PX))
    for k in range(steps+1):
        d=length*k/steps
        if d<skip:continue
        point=(start[0]+(end[0]-start[0])*d/length,start[1]+(end[1]-start[1])*d/length)
        if any(point_in_even_odd(point,polygons) for polygons in region_polygons):return False
    return True

def region_leader_placement(label,w,h,occupied,acceptable):
    """(box, leader start, leader end, direction) for a region label standing outside its region on a leader from the region's boundary, or None."""
    site=label['regionLeader'];own=site['polygons']
    all_regions=[own]+[row['polygons'] for row in site.get('regions',[]) if row.get('id')!=label.get('target')]
    anchors=list(site['anchors']);near=site.get('near')
    if near is not None:anchors.sort(key=lambda row:math.dist(row['at'],near))
    for row in anchors:
        start=tuple(row['at']);normal=tuple(row['normal'])
        incident={o.get('id') for o in occupied if o.get('kind') in {'line','axis','auxiliary','curve'} and isinstance(o.get('geometry'),(list,tuple)) and len(o['geometry'])>=2
                  and any(point_segment_distance(start,c,d)<=0.5 for c,d in zip(o['geometry'],o['geometry'][1:]))}
        incident|={o.get('id') for o in occupied if o.get('kind')=='circle' and abs(math.dist(start,o['geometry'][:2])-o['geometry'][2])<=0.5}
        support=abs(normal[0])*w/2+abs(normal[1])*h/2
        for gap in site['gaps']:
            reach=gap+support;center=(start[0]+normal[0]*reach,start[1]+normal[1]*reach)
            boxes=[Box(center[0]-w/2,center[1]-h/2,w,h)]
            for direction in DIRECTIONS:
                dx=1 if 'E' in direction else -1 if 'W' in direction else 0;dy=1 if 'S' in direction else -1 if 'N' in direction else 0
                if (dx*normal[0]+dy*normal[1])/math.hypot(dx,dy)<REGION_LEADER_MIN_ALIGNMENT:continue
                boxes.append(candidate(start,w,h,direction,gap))
            for box in boxes:
                if not acceptable(box,owner_check=False) or not box_outside_regions(box,all_regions):continue
                end=visible_owner_leader(start,box,occupied,incident)
                if end is None or not leader_avoids_regions(start,end,all_regions):continue
                theta=math.degrees(math.atan2(end[1]-start[1],end[0]-start[0]))%360
                return box,start,end,('E','SE','S','SW','W','NW','N','NE')[int(((theta+22.5)%360)//45)]
    return None

def arc_leader_placement(label,w,h,occupied,acceptable):
    """(box, leader start, leader end, direction) for an arc label on a leader from its own arc (E32): the outer side of the arc first (every anchor, the shortest leader first), the
    inner side only when no outside place is free (a label inside a lens would take the room of the lens's own value); every box clear of the marks and the leader clear of every
    stroke but the arc it starts on."""
    site=label['arcLeader'];owner_ids=set(site['ownerIds'])
    for sign in (1,-1):
        for row in site['anchors']:
            start=tuple(row['at']);normal=tuple(row['normal'])
            incident=owner_ids|{o.get('id') for o in occupied if o.get('kind') in {'line','axis','auxiliary','curve'} and isinstance(o.get('geometry'),(list,tuple)) and len(o['geometry'])>=2
                                and any(point_segment_distance(start,c,d)<=0.5 for c,d in zip(o['geometry'],o['geometry'][1:]))}
            incident|={o.get('id') for o in occupied if o.get('kind')=='circle' and abs(math.dist(start,o['geometry'][:2])-o['geometry'][2])<=0.5}
            direction_vector=(normal[0]*sign,normal[1]*sign);support=abs(direction_vector[0])*w/2+abs(direction_vector[1])*h/2
            for gap in site['gaps']:
                reach=gap+support;center=(start[0]+direction_vector[0]*reach,start[1]+direction_vector[1]*reach)
                boxes=[Box(center[0]-w/2,center[1]-h/2,w,h)]
                for name in DIRECTIONS:
                    dx=1 if 'E' in name else -1 if 'W' in name else 0;dy=1 if 'S' in name else -1 if 'N' in name else 0
                    if (dx*direction_vector[0]+dy*direction_vector[1])/math.hypot(dx,dy)<REGION_LEADER_MIN_ALIGNMENT:continue
                    boxes.append(candidate(start,w,h,name,gap))
                for box in boxes:
                    if not acceptable(box,owner_check=False):continue
                    end=visible_owner_leader(start,box,occupied,incident)
                    if end is None:continue
                    theta=math.degrees(math.atan2(end[1]-start[1],end[0]-start[0]))%360
                    return box,start,end,('E','SE','S','SW','W','NW','N','NE')[int(((theta+22.5)%360)//45)]
    return None

def layout(labels,obstacles,safe_area,panel=None,measurements=None,require_measurements=False):
    """The placement pass, and - only when some angle label found no place in it - a second pass that places the angle labels narrowest angle first
    (a vertex with several nested angles); the second result replaces the first only when it leaves fewer labels unresolved, so a layout that
    resolved at the first pass is never changed."""
    result=layout_pass(labels,obstacles,safe_area,panel,measurements,require_measurements)
    if any(any(label['id']==label_id and 'wedgeSearch' in label for label in labels) for label_id in result['unresolved']):
        retry=layout_pass(copy.deepcopy(labels),obstacles,safe_area,panel,measurements,require_measurements,angle_labels_first_order)
        if len(retry['unresolved'])<len(result['unresolved']):return retry
    if any(any(label['id']==label_id and label.get('kind')=='TICK_LABEL' for label in labels) for label_id in result['unresolved']):
        # A tick number beside a point name (the O of the origin and the tick 3 right next to it) found no room because the name took its place first
        # (equal priority, ordered by id): the second pass places the tick numbers first, so the point name moves to the free side instead.
        retry=layout_pass(copy.deepcopy(labels),obstacles,safe_area,panel,measurements,require_measurements,tick_labels_first_order)
        if len(retry['unresolved'])<len(result['unresolved']):return retry
    return result

def tick_labels_first_order(label):
    """The tick-label retry order: at one priority the tick numbers go first (each is bound to its axis tick and may stand on two sides only), then every other label as in the first pass."""
    return (label.get('priority',2),0 if label.get('kind')=='TICK_LABEL' else 1,label['id'])

def layout_pass(labels,obstacles,safe_area,panel=None,measurements=None,require_measurements=False,order=None):
    """P0..P4, 8 candidates, coordinate relocation, suppression, side panel.

    Unsupported further repairs are explicit suggestions, never fake PASS.
    A coordinate side panel includes its point name, so long leaders are not
    needed. Critical point names remain at their marker or require polishing.
    """
    if require_measurements and not isinstance(measurements,dict):raise ValueError('BROWSER_MEASUREMENTS_REQUIRED')
    measurements=measurements or {};placed=[];suppressed=[];unresolved=[];trace=[];repairs=[];leaders=[]
    if len({v['id'] for v in labels})!=len(labels):raise ValueError('DUPLICATE_LAYOUT_LABEL')
    occupied=list(obstacles)
    for label in sorted(labels,key=order or (lambda v:(v.get('priority',2),v['id']))):
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
        if require_measurements and (label.get('kind') in OWNER_BOUND_POINT_LABELS or (label.get('kind')=='EQUATION_LABEL' and label.get('ringLeader') is True)):
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
        chosen=None;method=None;tick_callout=label.get('tickLabelCallout');leader_fallbacks=[];far_choice=None
        if tick_callout is not None:
            if (tick_owner is None or not isinstance(tick_callout,dict)
                or set(tick_callout)!={'schemaVersion','tickId','axis','value','sourceAt','offsetUser'}
                or tick_callout.get('schemaVersion')!='TICK_LABEL_OWNER_LEADER_v1'
                or tick_callout.get('tickId')!=tick_owner.get('id') or tick_callout.get('axis')!=label.get('tickAxis')
                or tick_callout.get('value')!=label.get('tickValue') or tick_callout.get('sourceAt')!=list(label['at'])
                or tick_callout.get('offsetUser')!=[28,-22]):
                raise ValueError('TICK_LABEL_CALLOUT_BINDING_INVALID:'+label['id'])
        # lineOwned: an equation written beside its displayed line (kind 'line', id == target); no other label kind takes this path.
        line_owner=next((o for o in obstacles if label.get('lineOwned') and o.get('kind')=='line' and o.get('id')==label.get('target')),None)
        if label.get('lineOwned') and line_owner is None:raise ValueError('LINE_LABEL_OWNER_LINE_REQUIRED:'+label['id'])
        # collinearOwners: a polygon edge or segment drawn over the labelled line is that line, not a competitor, and a leader may start on it.
        collinear_owners=bool(label.get('collinearOwners'))
        other_lines=(competing_lines(line_owner,obstacles) if collinear_owners else [o for o in obstacles if o.get('kind')=='line' and o is not line_owner]) if line_owner is not None else []
        owner_limits=(RELAXED_LINE_LABEL_OWN_MAX,RELAXED_LINE_LABEL_MARGIN) if label.get('ownership')=='NEAREST' else (LINE_LABEL_OWN_MAX,LINE_LABEL_OTHER_MARGIN)
        # leaderOwned: ids of the marks (angle arcs, highlighted arcs) a label names; beyond the near gaps a visible leader from its anchor ties it to them.
        leader_owned_ids=set(label.get('leaderOwned',()))
        other_sectors=label.get('wedgeSearch',{}).get('others',())
        def acceptable(box,owner_check=True):
            return (safe_area.contains(box) and not any(collision(box,o,label['labelGap']) if o['kind']=='label' and 'labelGap' in label else collision(box,o) for o in occupied)
                and not (other_sectors and box_in_other_sectors(box,other_sectors))
                and (line_owner is None or not owner_check or line_label_unambiguous(box,line_owner,other_lines,*owner_limits))
                and (owner_marker is None or not owner_check or point_box_has_unambiguous_owner(box,owner_marker,competing_markers))
                and (owner_marker is None or not owner_check or not label.get('lineBarrier') or not line_between(tuple(label['at']),box,occupied,owner_incident_ids(tuple(label['at']),owner_marker,occupied)))
                and (tick_owner is None or tick_callout is not None or tick_box_respects_owner(box,label['at'],label['tickAxis'])))
        def tie_to_owner(end):
            leader_id=label['id']+'-owner-leader'
            leaders.append({'schemaVersion':'OWNER_LABEL_LEADER_v1','id':leader_id,'from':list(label['at']),'to':end,'ownerLabelId':label['id'],'ownerId':label['target']})
            occupied.append({'id':leader_id,'kind':'leader','geometry':[list(label['at']),end]})
        preferred=label.get('preferred');directions=((preferred,) if preferred in DIRECTIONS else ())+tuple(v for v in label.get('directions', DIRECTIONS) if v!=preferred)
        if tick_owner is not None:
            allowed=('N','S') if label['tickAxis']=='x' else ('W','E')
            directions=((preferred,) if preferred in allowed else ())+tuple(v for v in allowed if v!=preferred)
            default_gaps=TICK_LABEL_GAPS
        else:default_gaps=() if 'candidateCenters' in label or 'candidateBaselines' in label else tuple(label.get('gaps',(12,8,20,32,48)))
        # labelPlacement LEADER on an angle mark (E12b): no search inside the angle and no box beside the arc; only the outside leader from its own arc, with the whole box outside the wedge.
        force_leader=bool(label.get('wedgeSearch',{}).get('forceLeader'))
        if force_leader:default_gaps=()
        if label.get('regionLeader',{}).get('only'):default_gaps=()
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
            if 'wedgeSearch' in label and not force_leader:
                # An angle label inside its angle: slide the box out along the bisector until it clears the marks and stays within the two rays.
                from .publication import box_owned
                ws=label['wedgeSearch'];vertex=ws['vertex'];radius=ws['rMin']
                # A narrow wedge only clears a label of this size well away from the vertex: the fixed outer+44 cap is a guess that is too small
                # there, so the inside limit also covers the distance the two rays need to diverge past the label box (still inside the angle).
                half=abs(ws['delta'])/2
                inside_limit=ws['rMax'] if half<=1e-6 else max(ws['rMax'],min(ws.get('rFar',ws['rMax']),(w/2+6)/math.sin(half)+h))
                while radius<=ws.get('rFar',ws['rMax']) and chosen is None:
                    # On the bisector first, then slid to either side of it (a segment that lies on the bisector would otherwise block every radius).
                    for lateral in (0,w/2+6,-(w/2+6),w/2+14,-(w/2+14)):
                        center=(vertex[0]+radius*math.cos(ws['bisector'])-lateral*math.sin(ws['bisector']),vertex[1]+radius*math.sin(ws['bisector'])+lateral*math.cos(ws['bisector']))
                        box=Box(center[0]-w/2,center[1]-h/2,w,h)
                        if not (acceptable(box) and box_owned({'ownerWedge':[vertex,ws['start'],ws['delta'],ws.get('rFar',ws['rMax'])+max(w,h)]},box)):continue
                        if (ws.get('farDistance') is not None and (radius<=inside_limit or abs(ws['delta'])<=math.radians(NARROW_WEDGE_MAX_DEGREES))
                                and box_point_distance(box,vertex)>ws['farDistance']):
                            # Too far from its vertex and arc to read as that arc's label, and no leader ties it back: kept only as the last resort,
                            # after the leader placements (inside the angle, then outside it) have been tried.
                            if far_choice is None:far_choice=(box,'ANGLE_WEDGE_INSIDE' if radius<=inside_limit else 'ANGLE_WEDGE_INSIDE_FAR')
                            continue
                        if radius<=inside_limit:chosen=box;method='ANGLE_WEDGE_INSIDE';default_gaps=();break
                        if abs(ws['delta'])<=math.radians(NARROW_WEDGE_MAX_DEGREES):
                            # A narrow wedge cannot hold the box near the arc, and a leader from the arc would run within the line-hiding
                            # tolerance of both rays (so visible_owner_leader refuses it). The label goes farther out inside the same angle,
                            # where it is still unambiguously inside it.
                            chosen=box;method='ANGLE_WEDGE_INSIDE_FAR';default_gaps=();break
                        # Farther than a reader associates with the arc: a visible leader from the arc to the label.
                        # The leader leaves the outer arc in the direction of the label (a segment lying on the bisector would block one that leaves at the bisector).
                        phi=math.atan2(center[1]-vertex[1],center[0]-vertex[0]);start=(vertex[0]+ws['arcRadius']*math.cos(phi),vertex[1]+ws['arcRadius']*math.sin(phi))
                        end=visible_owner_leader(start,box,occupied,leader_owned_ids)
                        if end is not None:
                            label={**label,'at':list(start)};tie_to_owner(end);chosen=box;default_gaps=()
                            theta=math.degrees(ws['bisector'])%360;method='OWNER_LEADER_'+('E','SE','S','SW','W','NW','N','NE')[int(((theta+22.5)%360)//45)];break
                    radius+=2
            if 'pathOwned' in label:
                # A path total-length label (E7): off the path, on a visible leader from a point of the path; the leader touches only the path's own segments, at its start.
                default_gaps=()
                site=label['pathOwned'];owner_ids=set(site['ids'])
                for anchor_index,anchor in enumerate(site['anchors']):
                    for gap in site['gaps']:
                        for direction in DIRECTIONS:
                            if site.get('sideNormals'):
                                # E37: only the directions that point to the declared side of the path (a path label with side LEFT / RIGHT)
                                dx=1 if 'E' in direction else -1 if 'W' in direction else 0;dy=1 if 'S' in direction else -1 if 'N' in direction else 0
                                normal=site['sideNormals'][anchor_index]
                                if (dx*normal[0]+dy*normal[1])/math.hypot(dx,dy)<PATH_LABEL_SIDE_MIN_DOT:continue
                            box=candidate(anchor,w,h,direction,gap)
                            if not acceptable(box,owner_check=False):continue
                            if site.get('outside') and not box_outside_regions(box,[[[tuple(p) for p in site['outside']]]]):continue     # closed path: the label stands outside the perimeter
                            end=visible_owner_leader(tuple(anchor),box,occupied,owner_ids)
                            if end is None:continue
                            if site.get('outside') and not leader_avoids_regions(tuple(anchor),end,[[[tuple(p) for p in site['outside']]]]):continue
                            label={**label,'at':list(anchor)};tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction;break
                        if chosen is not None:break
                    if chosen is not None:break
            if 'dimensionPlacement' in label:
                # A dimension line's length label (E7): the box stands on the outer side of the line (of the brace's tip), touching none of it, centred on the
                # line or slid along it; no other place would read as that dimension's value, so there is no leader and no fallback search.
                default_gaps=()
                site=label['dimensionPlacement'];normal=site['normal'];tangent=site['tangent'];anchor=site['anchor']
                support=abs(normal[0])*w/2+abs(normal[1])*h/2
                for slide in site['slides']:
                    for gap in site['gaps']:
                        reach=gap+support;along=slide*site['length']
                        center=(anchor[0]+tangent[0]*along+normal[0]*reach,anchor[1]+tangent[1]*along+normal[1]*reach)
                        box=Box(center[0]-w/2,center[1]-h/2,w,h)
                        if acceptable(box):chosen=box;method='DIMENSION_OUTSIDE';break
                    if chosen is not None:break
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
            if 'arcLeader' in label and chosen is None:
                # labelPlacement LEADER on a circular arc (E32): on a leader from the arc, outside or inside its circle
                default_gaps=()
                found=arc_leader_placement(label,w,h,occupied,acceptable)
                if found is not None:
                    box,start,end,direction=found
                    label={**label,'at':list(start)};tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction
            if 'regionLeader' in label and chosen is None:
                # labelPlacement LEADER / AUTO_LEADER on a filled region (E32): outside the region on a leader from its outer boundary
                found=region_leader_placement(label,w,h,occupied,acceptable)
                if found is not None:
                    box,start,end,direction=found
                    label={**label,'at':list(start)};tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction
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
                    if (line_owner is not None or leader_owned_ids) and gap>=NEAR_RELOCATION_LEADER_MIN_GAP:
                        # Too far to read as beside its line: a visible leader from the anchor on the line ties it back; it may touch only that line
                        # (or, for a mark label, only the mark it names).
                        if not acceptable(box,owner_check=False):continue
                        start=tuple(label['at']);end=visible_owner_leader(start,box,occupied,(owner_line_incident_ids(line_owner,start,occupied) if collinear_owners else {line_owner['id']}) if line_owner is not None else leader_owned_ids)
                        if end is None:continue
                        tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction;break
                    if not acceptable(box):continue
                    if owner_marker is not None and gap>=NEAR_RELOCATION_LEADER_MIN_GAP:
                        # A point label this far from its point is tied back to it by a visible leader; without one the next candidate is tried.
                        start=tuple(label['at']);end=visible_owner_leader(start,box,occupied,owner_incident_ids(start,owner_marker,occupied))
                        if end is None:continue
                        tie_to_owner(end)
                    chosen=box;method='AUTO_'+direction if gap==12 else 'COORDINATE_RELOCATION_'+direction
                    break
                if chosen:break
            if chosen is None and tick_owner is not None and tick_callout is None:
                # Two tick labels meeting near the origin (x=-1 and y=1) can leave one of them no clean box on its axis-normal sides. It may then slide along its
                # axis by up to the owner-alignment tolerance (it still names its own tick); the nearest slide that clears every other label and mark wins.
                for gap in default_gaps:
                    for direction in directions:
                        base=candidate(label['at'],w,h,direction,gap)
                        for slide in TICK_LABEL_SLIDES:
                            box=Box(base.x+slide,base.y,w,h) if label['tickAxis']=='x' else Box(base.x,base.y+slide,w,h)
                            if acceptable(box):chosen=box;method='TICK_SLIDE_'+direction;break
                        if chosen:break
                    if chosen:break
            if chosen is None and owner_marker is not None:
                # With another point close by, a box straight above/below/beside its point can reach into that point's cell. On those four
                # sides the box may slide along the side, in eighths of its size, at the near gaps that need no leader.
                for gap in (value for value in default_gaps if value<NEAR_RELOCATION_LEADER_MIN_GAP):
                    for direction in (value for value in directions if value in ('N','S','E','W')):
                        base=candidate(label['at'],w,h,direction,gap)
                        for k in (1,-1,2,-2,3,-3,4,-4):
                            box=Box(base.x+k*w/8,base.y,w,h) if direction in ('N','S') else Box(base.x,base.y+k*h/8,w,h)
                            if acceptable(box):chosen=box;method='SLIDE_'+direction;break
                        if chosen:break
                    if chosen:break
            if chosen is None and owner_marker is not None:
                # Last near resort, before the 64 px+ repair: a box whose only fault is a corner nearer another point. A visible leader from
                # its own point names the owner instead; the leader keeps clear of every other marker, line and label.
                start=tuple(label['at']);incident=None
                for gap in (value for value in default_gaps if value>=NEAR_RELOCATION_LEADER_MIN_GAP):
                    for direction in directions:
                        box=candidate(label['at'],w,h,direction,gap)
                        if not acceptable(box,owner_check=False):continue
                        incident=incident or owner_incident_ids(start,owner_marker,occupied)
                        end=visible_owner_leader(start,box,occupied,incident)
                        if end is None:continue
                        tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction;break
                    if chosen:break
        if chosen is None and 'wedgeSearch' in label and tick_callout is None:
            # No room inside the angle or beside its arc: outside the angle, on a leader from the middle of its own outermost arc.
            found=angle_outside_leader(label,w,h,occupied,(lambda box:acceptable(box) and not box_touches_wedge(box,label['wedgeSearch'])) if force_leader else acceptable,leader_owned_ids)
            if found is not None:
                box,start,end,direction=found
                label={**label,'at':list(start)};tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction
        if chosen is None and far_choice is not None:chosen,method=far_choice
        if chosen is None and line_owner is not None:
            # The first anchor found no room: the same line may be written from other anchors on it (nearer boxes need no leader, farther ones a visible one).
            for alternate in label.get('alternateAt',()):
                for gap in default_gaps:
                    for direction in directions:
                        box=candidate(alternate,w,h,direction,gap)
                        if gap<NEAR_RELOCATION_LEADER_MIN_GAP:
                            if not acceptable(box):continue
                            label={**label,'at':list(alternate)};chosen=box;method='AUTO_'+direction;break
                        if not acceptable(box,owner_check=False):continue
                        end=visible_owner_leader(tuple(alternate),box,occupied,owner_line_incident_ids(line_owner,tuple(alternate),occupied) if collinear_owners else {line_owner['id']})
                        if end is None:continue
                        label={**label,'at':list(alternate)};tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction;break
                    if chosen:break
                if chosen:break
        if chosen is None and line_owner is not None:
            # Wide search (E31): no anchor the author's list names found room. The drawn line is sampled end to end (the anchors nearest the preferred one
            # first), the nearer places that need no leader before the leader ones; when the line has a parallel neighbour so close that no leader may start
            # beside it, the leader that starts on its own line and only moves away from that neighbour (near_start) is tried in a second pass.
            geometry_line=line_owner['geometry'];chord_a,chord_b=geometry_line[0],geometry_line[-1]
            # wideRange: the band of the drawn line the author asked the label to stand in, counted along the line as drawn (from its first point), or
            # from its left (lower) end when wideLeftFirst (lineAt).
            if label.get('wideLeftFirst') and (chord_b[0],-chord_b[1])<(chord_a[0],-chord_a[1]):chord_a,chord_b=chord_b,chord_a
            chord=(chord_b[0]-chord_a[0],chord_b[1]-chord_a[1]);chord2=chord[0]**2+chord[1]**2
            if chord2>1e-9:
                preferred=max(0.0,min(1.0,((label['at'][0]-chord_a[0])*chord[0]+(label['at'][1]-chord_a[1])*chord[1])/chord2))
                band=label.get('wideRange') or (0.0,1.0)
                fractions=sorted((t for t in (k/(WIDE_LINE_STEPS+1) for k in range(1,WIDE_LINE_STEPS+1)) if band[0]-1e-9<=t<=band[1]+1e-9),key=lambda t:(round(abs(t-preferred),9),t))
                wide_anchors=[(chord_a[0]+chord[0]*t,chord_a[1]+chord[1]*t) for t in fractions]
                for near_start in (False,True):
                    for gap in WIDE_LINE_GAPS:
                        for anchor in wide_anchors:
                            for direction in DIRECTIONS:
                                base=candidate(anchor,w,h,direction,gap)
                                # the box straight out from the anchor, then slid sideways along its side (a box above a crowded end between two strokes is rarely centred on the anchor)
                                slides=((0,0),)+(tuple((k*w/4,0) for k in (-1,1,-2,2)) if direction in ('N','S') else tuple((0,k*h/2) for k in (-1,1,-2,2)) if direction in ('E','W') else ())
                                for dx,dy in slides:
                                    box=base if not (dx or dy) else Box(base.x+dx,base.y+dy,w,h)
                                    if gap<NEAR_RELOCATION_LEADER_MIN_GAP:
                                        if near_start or not acceptable(box):continue
                                        label={**label,'at':list(anchor)};chosen=box;method='AUTO_'+direction;break
                                    if not acceptable(box,owner_check=False):continue
                                    end=visible_owner_leader(anchor,box,occupied,owner_line_incident_ids(line_owner,anchor,occupied) if collinear_owners else {line_owner['id']},near_start=near_start)
                                    if end is None:continue
                                    label={**label,'at':list(anchor)};tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction;break
                                if chosen:break
                            if chosen:break
                        if chosen:break
                    if chosen:break
        if chosen is None and line_owner is None and label.get('lineFallback') and label.get('alternateAt'):
            # lineFallback: a label that was placed the ordinary way (no ownership rule) and found no room; the same line may be written from the other
            # anchors on it, now under the line-owned rules (its own line clearly the nearest, or a visible leader from the anchor on the line).
            # Labels that already fit never get here, so their placement is exactly the ordinary one.
            fallback_owner=next((o for o in obstacles if o.get('kind')=='line' and o.get('id')==label.get('target')),None)
            if fallback_owner is not None:
                fallback_others=competing_lines(fallback_owner,obstacles) if collinear_owners else [o for o in obstacles if o.get('kind')=='line' and o is not fallback_owner]
                def acceptable_fallback(box,owner_check=True):
                    return (safe_area.contains(box) and not any(collision(box,o,label['labelGap']) if o['kind']=='label' and 'labelGap' in label else collision(box,o) for o in occupied)
                        and (not owner_check or line_label_unambiguous(box,fallback_owner,fallback_others,*owner_limits)))
                for alternate in label['alternateAt']:
                    for gap in LINE_FALLBACK_GAPS:
                        for direction in DIRECTIONS:
                            box=candidate(alternate,w,h,direction,gap)
                            if gap<NEAR_RELOCATION_LEADER_MIN_GAP:
                                if not acceptable_fallback(box):continue
                                label={**label,'at':list(alternate)};chosen=box;method='AUTO_'+direction;break
                            if not acceptable_fallback(box,owner_check=False):continue
                            end=visible_owner_leader(tuple(alternate),box,occupied,owner_line_incident_ids(fallback_owner,tuple(alternate),occupied) if collinear_owners else {fallback_owner['id']})
                            if end is None:continue
                            label={**label,'at':list(alternate)};tie_to_owner(end);chosen=box;method='OWNER_LEADER_'+direction;break
                        if chosen:break
                    if chosen:break
        repair=None
        if (chosen is None and require_measurements and owner_marker is not None and label['kind'] in OWNER_BOUND_POINT_LABELS
            and not label.get('candidateCenters') and isinstance(label.get('measuredFragmentSha256'),str)
            and len(label['measuredFragmentSha256'])==71 and label['measuredFragmentSha256'].startswith('sha256:')
            and isinstance(label.get('measuredFragmentOwner'),str) and label['measuredFragmentOwner']==label.get('target')
            and label.get('measuredFactRole') in {'GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'}):
            # A label moved this far is tied back to its point by a leader. The leader may touch the geometry through the point only
            # at the point itself and must clear every other line, label and mark; otherwise the next candidate is tried.
            start=tuple(label['at']);incident=owner_incident_ids(start,owner_marker,occupied)
            for gap in MEASURED_OWNER_REPAIR_GAPS:
                for direction in directions:
                    box=candidate(label['at'],w,h,direction,gap)
                    if acceptable(box):
                        end=visible_owner_leader(start,box,occupied,incident)
                        if end is None:continue
                        tie_to_owner(end)
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
        if (chosen is None and ((label['kind']=='POINT_NAME' and not label.get('directions') and not label.get('gaps') and label.get('preferred') is None)
                or (label['kind'] in {'COORDINATE_LABEL','EQUATION_LABEL'} and owner_marker is not None and label.get('ringLeader')))):
            # (E31) The same last resort for the coordinates of an unnamed point (ringLeader: an overlay point with unnamed+coordinates, a hidden construction point that writes its coordinates):
            # a box in the nearest free sector, on a visible leader from the point.
            # A point where several strokes meet (the centre of a circle with its radii) leaves no free cardinal direction for its name: the name
            # goes into the nearest free sector around the point, closest to it first. When that sector is outside the point's Voronoi cell (a long
            # name, a narrow sector) a visible leader from the point ties the name back to it.
            at=tuple(label['at']);ring=None;ring_method=None;incident=None
            for radius in POINT_NAME_RING_RADII:
                for step in range(48):
                    angle=math.radians(step*7.5)
                    box=Box(at[0]+radius*math.cos(angle)-w/2,at[1]+radius*math.sin(angle)-h/2,w,h)
                    if acceptable(box):ring=box;ring_method='POINT_NAME_RING';break
                    if owner_marker is None or not acceptable(box,owner_check=False):continue
                    incident=incident or owner_incident_ids(at,owner_marker,occupied)
                    end=visible_owner_leader(at,box,occupied,incident)
                    if end is None:continue
                    tie_to_owner(end);ring=box
                    ring_method='OWNER_LEADER_'+('E','SE','S','SW','W','NW','N','NE')[int(((step*7.5+22.5)%360)//45)];break
                if ring is not None:break
            if ring is None and label['kind'] in {'COORDINATE_LABEL','EQUATION_LABEL'} and label.get('ringLeader'):
                # (G6c) Nothing outside the strokes is free for a wide coordinate label: the leader may then cross the point's own circle (never another stroke, label or point)
                # to reach the nearest free box. The leader still starts on its own dot and ends on the label box, which the observer ties back to the owner.
                crossing=[o for o in occupied if not (o.get('kind')=='circle' and o.get('id') in incident_ids)] if (incident_ids:=owner_incident_ids(at,owner_marker,occupied)) is not None else occupied
                for radius in POINT_NAME_RING_RADII:
                    for step in range(48):
                        angle=math.radians(step*7.5)
                        box=Box(at[0]+radius*math.cos(angle)-w/2,at[1]+radius*math.sin(angle)-h/2,w,h)
                        if not acceptable(box,owner_check=False):continue
                        end=visible_owner_leader(at,box,crossing,incident_ids,start_tolerance=2e-3)
                        if end is None:continue
                        tie_to_owner(end);ring=box;ring_method='OWNER_LEADER_'+('E','SE','S','SW','W','NW','N','NE')[int(((step*7.5+22.5)%360)//45)];break
                    if ring is not None:break
            if ring is not None:chosen=ring;method=ring_method
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
