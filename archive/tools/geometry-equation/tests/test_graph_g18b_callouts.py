"""G18b-3: callout texts (a coordinate pair, Greek letters, a prime, a root sign; the old Korean limit stays; up to six callouts). Framing runs without Chrome."""
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

class CalloutTexts(unittest.TestCase):
    def test_new_plain_texts_are_accepted(self):
        for text in ('(3,4)','α','β′','√(2a)','x=2,y=3'):
            self.assertIsNone(refused(SQRT,[{'id':'c1','point':'V','text':text}]),text)

    def test_old_limits_stay(self):
        self.assertEqual(refused(SQRT,[{'id':'c1','point':'V','text':'극대극대극대극대극대극'}]),'OVERLAY_CALLOUT_TEXT_INVALID:c1')
        self.assertEqual(refused(SQRT,[{'id':'c1','point':'V','text':'(1234567890,12345678)'}]),'OVERLAY_CALLOUT_TEXT_INVALID:c1')
        # a plain-text (TEXT) callout that carries a comma keeps its 14-character limit (14 passes, 15 is refused); EXT-20261109-b only widened MATH to 20
        self.assertIsNone(refused(SQRT,[{'id':'c1','point':'V','text':'극'*13+',','labelKind':'TEXT'}]))
        self.assertEqual(refused(SQRT,[{'id':'c1','point':'V','text':'극'*14+',','labelKind':'TEXT'}]),'OVERLAY_CALLOUT_TEXT_INVALID:c1')

    def test_up_to_six_callouts(self):
        six=[{'id':'c'+str(i),'point':'V','text':'a'} for i in range(6)]
        self.assertIsNone(refused(SQRT,six))
        self.assertEqual(refused(SQRT,six+[{'id':'c6','point':'V','text':'a'}]),'OVERLAY_TOO_MANY:callouts')

if __name__=='__main__':unittest.main()
