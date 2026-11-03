"""G18a-1: a linear-over-linear rational with k<0 (left branch above, right branch below its horizontal asymptote), for example y=5/(3-x)-2 or y=-x/(x-1),
used to fail STATIC_GRAPH_AUDIT_FAIL (every asymptote line, the branch ends and UNCLIPPED_CURVE). The drawing engine adds (0,0), (1,0) and (0,1) to the frame as axis
facts and widens the whole frame by 8% when one of them is not strictly inside; the planned frame ended below y=1, so the drawn frame and the planned frame differed.
The fix keeps (0,1) inside the planned frame. No Chrome here: the engine's own frame rule (visual_engine.viewport.for_spec) is applied to the planned frame."""
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit
from visual_engine.viewport import for_spec

AXIS_FACTS=[(0,0),(1,0),(0,1)]

def rational(numerator,denominator,**kwargs):
    return {'family':'rational','numerator':numerator,'denominator':denominator,'sourceDomain':{'kind':'ALL_REALS'},'domain':[-5,9],'viewport':[-5,9,-6,6],'axisTickValues':{'x':[],'y':[]},**kwargs}

def drawn_frame(plan):
    """The frame the engine draws: the planned viewport, widened by 8% when an axis fact is not strictly inside it."""
    v=plan['viewport']
    return for_spec({'visualType':'function_graph','viewport':{'xMin':v[0],'xMax':v[1],'yMin':v[2],'yMax':v[3]}},AXIS_FACTS).bounds

class NegativeKRational(unittest.TestCase):
    def check(self,numerator,denominator):
        plan=fit_overview(rational(numerator,denominator))['graphPlan']
        x0,x1,y0,y1=plan['viewport']
        self.assertTrue(x0<0<x1 and y0<0<y1 and x0<1<x1 and y1>1,plan['viewport'])
        # the engine draws exactly the planned frame (it widens a frame only when an axis fact is outside it)
        self.assertEqual(tuple(drawn_frame(plan)),tuple(plan['viewport']))
        model=produce(plan)
        self.assertEqual(audit(plan,model['svg'],model['transform'])['status'],'PASS')
        return plan

    def test_5_over_3_minus_x_minus_2(self):
        # y=5/(3-x)-2=(1-2x)/(x-3): k=-5, asymptotes x=3, y=-2 (25 팔마고 2학기 기말 고1 q4); the old frame ended at y=0.99
        self.check(['1','-2'],['-3','1'])

    def test_minus_x_over_x_minus_1(self):
        # y=-x/(x-1)=-1-1/(x-1): k=-1, asymptotes x=1, y=-1, the numerator's root is the origin (25 제일고 2학기 기말 고1 q13)
        self.check(['0','-1'],['-1','1'])

    def test_a_positive_k_rational_keeps_its_frame(self):
        # y=(x+1)/(x-1): the old frame already held (0,1) with room; it must not change
        plan=fit_overview(rational(['1','1'],['-1','1']))['graphPlan']
        self.assertGreater(plan['viewport'][3],1.0+.06*(plan['viewport'][3]-plan['viewport'][2]))
        self.assertEqual(tuple(drawn_frame(plan)),tuple(plan['viewport']))

if __name__=='__main__':
    unittest.main()
