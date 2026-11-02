"""G18b-2: overlays on a square root: the window holds the axes and every declared point (so both axes show and an overlay line is cut by the window the observer recomputes), and a
curveX point lies on the general curve offset + sign*amplitude*sqrt(radicand). Framing, the model figure and the independent observer run without Chrome."""
import copy
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

# 24 강남여고 고1 q2: y=-sqrt(2x-4)+3, its end point (2,3) and a point on the curve at x=6 (y=-sqrt(8)+3)
SQRT={'family':'sqrt-affine','radicand':['-4','2'],'amplitude':'1','sign':-1,'offset':'3','sourceDomain':{'kind':'NATURAL_SQRT_AFFINE'},'domain':[2,10],'viewport':[1,11,-3,6],'axisTickValues':{'x':[],'y':[]},
      'overlays':{'points':[{'id':'V','x':'2','y':'3','unnamed':True},{'id':'Q','curveX':'4','unnamed':True}],'callouts':[{'id':'c1','point':'V','text':'y=3'}]}}

def framed(plan,**fields):
    plan=copy.deepcopy(plan);plan.update(fields);return fit_overview(plan)['graphPlan']

def refused(plan,callouts):
    plan=copy.deepcopy(plan);plan['overlays']['callouts']=callouts
    try:fit_overview(plan)
    except ValueError as error:return str(error)
    return None

class SquareRootOverlays(unittest.TestCase):
    def test_window_holds_the_axes_and_the_declared_points(self):
        plan=framed(SQRT);x0,x1,y0,y1=plan['viewport']
        for x,y in ((0,0),(1,0),(0,1),(2,3),(4,3-2**.5*1.0*2**.5)):self.assertTrue(x0<x<x1 and y0<y<y1,(x,y,plan['viewport']))

    def test_curve_x_point_is_on_the_general_curve(self):
        plan=framed(SQRT);point=next(row for row in plan['overlaysFeatures']['points'] if row['id']=='Q')
        self.assertAlmostEqual(point['y'],3-(2*4-4)**.5,places=9)   # offset 3, sign -1, sqrt(2*4-4)=2

    def test_observer_reads_the_same_point(self):
        plan=framed(SQRT);model=produce(plan);result=audit(plan,model['svg'],model['transform'])
        self.assertNotIn('OVERLAY_POINT_MISMATCH:Q',result.get('errors',[]));self.assertNotIn('OVERLAY_POINT_MISSING:Q',result.get('errors',[]))

    def test_plan_without_overlays_keeps_its_window(self):
        plan=copy.deepcopy(SQRT);del plan['overlays'];fitted=fit_overview(plan)['graphPlan']
        self.assertNotIn('clipRefine',fitted)

if __name__=='__main__':unittest.main()
