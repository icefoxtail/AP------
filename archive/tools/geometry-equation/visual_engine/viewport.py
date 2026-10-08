"""Geometry has equal units; function graphs explicitly declare unequal units."""
from dataclasses import dataclass
from .geometry_model import finite,point

@dataclass(frozen=True)
class Viewport:
    xMin: float
    xMax: float
    yMin: float
    yMax: float
    width: float=620
    height: float=500
    panel: float=160
    margin: float=32
    equal: bool=True
    topInset: float=0

    def __post_init__(self):
        for key in ('xMin','xMax','yMin','yMax','width','height','panel','margin','topInset'):
            finite(getattr(self,key))
        if self.xMin>=self.xMax or self.yMin>=self.yMax or self.margin<30 or self.panel<0 or self.topInset<0 or self.plotWidth<=0 or self.plotHeight<=0:
            raise ValueError('INVALID_VIEWPORT')
    @property
    def bounds(self):return self.xMin,self.xMax,self.yMin,self.yMax
    @property
    def plotWidth(self):return self.width-2*self.margin-self.panel
    @property
    def plotHeight(self):return self.height-2*self.margin-self.topInset
    @property
    def sx(self):
        x=self.plotWidth/(self.xMax-self.xMin);y=self.plotHeight/(self.yMax-self.yMin)
        return min(x,y) if self.equal else x
    @property
    def sy(self):return self.sx if self.equal else self.plotHeight/(self.yMax-self.yMin)
    @property
    def left(self):return self.margin+(self.plotWidth-self.sx*(self.xMax-self.xMin))/2
    @property
    def top(self):return self.margin+self.topInset+(self.plotHeight-self.sy*(self.yMax-self.yMin))/2
    def screen(self,p):
        x,y=point(p);return (self.left+(x-self.xMin)*self.sx,self.top+(self.yMax-y)*self.sy)
    def contains(self,p):
        x,y=point(p);return self.xMin<=x<=self.xMax and self.yMin<=y<=self.yMax
    def model(self):
        x,y=self.screen((0,0))
        return {'originX':x,'originY':y,'sx':self.sx,'sy':self.sy,'aspectPolicy':'EQUAL_UNIT' if self.equal else 'UNEQUAL_UNIT_DECLARED'}

def for_spec(spec,critical=()):
    v=spec['viewport'];xs=[v['xMin'],v['xMax']];ys=[v['yMin'],v['yMax']]
    for p in critical:
        x,y=point(p);xs.append(x);ys.append(y)
    xmin,xmax,ymin,ymax=min(xs),max(xs),min(ys),max(ys)
    # Only expand when a critical fact would otherwise be on/outside an edge.
    if any(not(v['xMin']<p[0]<v['xMax'] and v['yMin']<p[1]<v['yMax']) for p in critical):
        dx=(xmax-xmin)*.08;dy=(ymax-ymin)*.08;xmin-=dx;xmax+=dx;ymin-=dy;ymax+=dy
    return Viewport(xmin,xmax,ymin,ymax,width=v.get('width',620),height=v.get('height',500),panel=v.get('panel',160),topInset=v.get('topInset',0),equal=spec['visualType'] not in {'function_graph','calculus_graph'})
