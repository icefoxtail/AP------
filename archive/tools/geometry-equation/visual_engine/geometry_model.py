"""Finite canonical geometry; display strings belong to another layer."""
from __future__ import annotations
from dataclasses import dataclass, field
import math
import math

EPS = 1e-9

def finite(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError('FINITE_NUMBER_REQUIRED')
    return float(value)

def point(value):
    if not isinstance(value, (list, tuple)) or len(value) != 2:
        raise ValueError('POINT_PAIR_REQUIRED')
    return tuple(finite(v) for v in value)

@dataclass(frozen=True)
class Line:
    a: float
    b: float
    c: float

    def __post_init__(self):
        a,b,c = (finite(v) for v in (self.a,self.b,self.c))
        scale = max(abs(a),abs(b))
        if scale == 0:
            raise ValueError('DEGENERATE_LINE')
        # Scale first to avoid overflow/underflow during normalization.
        a,b,c = a/scale,b/scale,c/scale
        norm = math.hypot(a,b)
        sign = -1 if (a < 0 or (a == 0 and b < 0)) else 1
        for name,val in zip(('a','b','c'), (a,b,c)):
            object.__setattr__(self,name,finite(sign*val/norm))

    def coefficients(self):
        return self.a,self.b,self.c

@dataclass(frozen=True)
class Circle:
    center: tuple
    radius: float

    def __post_init__(self):
        object.__setattr__(self,'center',point(self.center))
        object.__setattr__(self,'radius',finite(self.radius))
        if self.radius <= 0:
            raise ValueError('DEGENERATE_CIRCLE')

@dataclass(frozen=True)
class CircularArc:
    center: tuple
    start: tuple
    end: tuple
    sweep: str
    radius: float = field(init=False)
    start_angle: float = field(init=False)
    sweep_radians: float = field(init=False)

    def __post_init__(self):
        center, start, end = point(self.center), point(self.start), point(self.end)
        radius = math.dist(center, start)
        end_radius = math.dist(center, end)
        if radius <= EPS or abs(radius-end_radius) > EPS*max(1.,radius,end_radius):
            raise ValueError('CIRCULAR_ARC_ENDPOINT_RADIUS_MISMATCH')
        if self.sweep not in {'CW','CCW'}:
            raise ValueError('CIRCULAR_ARC_SWEEP_INVALID')
        start_angle = math.atan2(start[1]-center[1], start[0]-center[0])
        end_angle = math.atan2(end[1]-center[1], end[0]-center[0])
        delta = ((end_angle-start_angle)%(2*math.pi) if self.sweep=='CCW'
                 else -((start_angle-end_angle)%(2*math.pi)))
        if abs(delta) <= EPS or abs(delta) >= 2*math.pi-EPS:
            raise ValueError('CIRCULAR_ARC_SWEEP_RANGE_INVALID')
        object.__setattr__(self,'center',center)
        object.__setattr__(self,'start',start)
        object.__setattr__(self,'end',end)
        object.__setattr__(self,'radius',radius)
        object.__setattr__(self,'start_angle',start_angle)
        object.__setattr__(self,'sweep_radians',delta)

    @property
    def degrees(self):
        return math.degrees(abs(self.sweep_radians))

    def sample_points(self):
        count=max(32, math.ceil(self.degrees/2.8125))
        return [point((self.center[0]+self.radius*math.cos(self.start_angle+self.sweep_radians*i/count),
                       self.center[1]+self.radius*math.sin(self.start_angle+self.sweep_radians*i/count)))
                for i in range(count+1)]

    def critical_points(self):
        points=[self.start,self.end]
        for angle in (0,math.pi/2,math.pi,3*math.pi/2):
            delta=((angle-self.start_angle)%(2*math.pi) if self.sweep_radians>0
                   else -((self.start_angle-angle)%(2*math.pi)))
            if 1e-12 < abs(delta) < abs(self.sweep_radians)-1e-12:
                points.append((self.center[0]+self.radius*math.cos(angle),
                               self.center[1]+self.radius*math.sin(angle)))
        return points

def line_from_two_points(p,q):
    x1,y1=point(p); x2,y2=point(q)
    if p == q or (x1 == x2 and y1 == y2):
        raise ValueError('COINCIDENT_POINTS')
    return Line(y1-y2,x2-x1,x1*y2-x2*y1)

def line_intersection(l,m):
    det=l.a*m.b-m.a*l.b
    if abs(det) <= EPS:
        raise ValueError('NO_UNIQUE_INTERSECTION')
    return point(((l.b*m.c-m.b*l.c)/det,(l.c*m.a-m.c*l.a)/det))

def parallel_check(l,m):
    return abs(l.a*m.b-m.a*l.b) <= EPS

def perpendicular_check(l,m):
    return abs(l.a*m.a+l.b*m.b) <= EPS

def point_line_distance(p,l):
    x,y=point(p)
    return finite(abs(l.a*x+l.b*y+l.c))

def point_on_line(p,l):
    return point_line_distance(p,l) <= EPS

def foot_of_perpendicular(p,l):
    x,y=point(p); d=l.a*x+l.b*y+l.c
    return point((x-l.a*d,y-l.b*d))

def midpoint(p,q):
    p,q=point(p),point(q)
    return point(tuple(a/2+b/2 for a,b in zip(p,q)))

def internal_division(p,q,m,n):
    p,q=point(p),point(q); m,n=finite(m),finite(n)
    if m <= 0 or n <= 0:
        raise ValueError('POSITIVE_RATIO_REQUIRED')
    return point(tuple((n*a+m*b)/(m+n) for a,b in zip(p,q)))

def external_division(p,q,m,n):
    p,q=point(p),point(q); m,n=finite(m),finite(n)
    if m <= 0 or n <= 0 or abs(m-n) <= EPS*max(m,n):
        raise ValueError('DEGENERATE_EXTERNAL_DIVISION')
    return point(tuple((m*b-n*a)/(m-n) for a,b in zip(p,q)))

def circle_line_intersections(circle,line):
    foot=foot_of_perpendicular(circle.center,line)
    d=point_line_distance(circle.center,line); r=circle.radius
    if d > r+EPS:
        return []
    if abs(d-r) <= EPS:
        return [foot]
    h=math.sqrt(max(0,(r-d)*(r+d)))
    return sorted([point((foot[0]+s*h*line.b,foot[1]-s*h*line.a)) for s in (-1,1)])

def circle_circle_intersections(c1,c2):
    x1,y1=c1.center; x2,y2=c2.center
    dx,dy=x2-x1,y2-y1; d=math.hypot(dx,dy)
    if d <= EPS:
        if abs(c1.radius-c2.radius) <= EPS:
            raise ValueError('COINCIDENT_CIRCLES')
        return []
    if d > c1.radius+c2.radius+EPS or d < abs(c1.radius-c2.radius)-EPS:
        return []
    a=(c1.radius**2-c2.radius**2+d*d)/(2*d)
    h2=c1.radius**2-a*a
    if h2 < -EPS:
        raise ValueError('UNSTABLE_CIRCLE_INTERSECTION')
    mid=(x1+a*dx/d,y1+a*dy/d)
    if abs(h2) <= EPS:
        return [point(mid)]
    h=math.sqrt(h2)
    return sorted([point((mid[0]-s*h*dy/d,mid[1]+s*h*dx/d)) for s in (-1,1)])

def tangent_check(circle,line,at=None):
    if abs(point_line_distance(circle.center,line)-circle.radius) > EPS:
        return False
    if at is None:
        return True
    at=point(at)
    return point_on_line(at,line) and math.dist(at,foot_of_perpendicular(circle.center,line)) <= EPS

def clip_line(line,bounds):
    """Intersect the infinite line with the viewport, including vertical lines."""
    xmin,xmax,ymin,ymax=bounds
    hits=[]
    for edge in (Line(1,0,-xmin),Line(1,0,-xmax),Line(0,1,-ymin),Line(0,1,-ymax)):
        if parallel_check(line,edge):
            continue
        p=line_intersection(line,edge)
        if xmin-EPS <= p[0] <= xmax+EPS and ymin-EPS <= p[1] <= ymax+EPS and not any(math.dist(p,q)<EPS for q in hits):
            hits.append(p)
    return sorted(hits)[:2]
