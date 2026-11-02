"""G18b-1: graphPlan.equalUnits on a linear-over-linear rational and on a square-root curve. Framing, the model figure and the independent observer run without Chrome.
Without the field nothing changes (the plan keeps its unequal frame and carries no plotCanvas); with it one x unit and one y unit are the same length."""
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

# 25 효천고 고1 q12 style: y=(-4x-4)/(x-1), horizontal asymptote -4, pole 1
RATIONAL={'family':'rational','numerator':['-4','-4'],'denominator':['-1','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-6,8],'viewport':[-6,8,-12,4],'axisTickValues':{'x':[],'y':[]}}
SQRT={'family':'sqrt-affine','radicand':['-3','1'],'sourceDomain':{'kind':'NATURAL_SQRT_AFFINE'},'domain':[3,8],'viewport':[1,8,-1,3],'axisTickValues':{'x':[],'y':[]}}
SQRT_GENERAL={**SQRT,'amplitude':'2','sign':-1,'offset':'1'}

def framed(plan,**extra):
    return fit_overview({**copy.deepcopy(plan),**extra})['graphPlan']

def refused(plan,**extra):
    try:fit_overview({**copy.deepcopy(plan),**extra})
    except ValueError as error:return str(error)
    return None

def observe(plan):
    model=produce(plan)
    return audit(plan,model['svg'],model['transform']),model

class EqualUnits(unittest.TestCase):
    def test_default_frames_are_untouched(self):
        for plan in (RATIONAL,SQRT,SQRT_GENERAL):
            fitted=framed(plan)
            self.assertNotIn('equalUnits',fitted);self.assertNotIn('plotCanvas',fitted)

    def test_rational_one_scale(self):
        plan=framed(RATIONAL,equalUnits=True)
        self.assertTrue(plan['equalUnits']);self.assertEqual(plan['axisRatio'],1.0);self.assertEqual(plan['plotCanvas']['width'],448)
        result,model=observe(plan);self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertAlmostEqual(model['transform']['sx'],model['transform']['sy'],places=6)
        x0,x1,y0,y1=plan['viewport'];self.assertTrue(x0<0<x1 and y0<0<y1 and y1>1)

    def test_rational_unequal_scale_is_refused_by_the_observer(self):
        plan=framed(RATIONAL,equalUnits=True)
        model=produce(plan);transform={**model['transform'],'sy':model['transform']['sy']*1.4}
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit(plan,model['svg'],transform)['errors'])

    def test_sqrt_both_forms(self):
        for plan in (SQRT,SQRT_GENERAL):
            fitted=framed(plan,equalUnits=True);result,model=observe(fitted)
            self.assertEqual(result['status'],'PASS',result['errors'])
            self.assertAlmostEqual(model['transform']['sx'],model['transform']['sy'],places=6)
            x0,x1,y0,y1=fitted['viewport'];self.assertTrue(x0<0<x1 and y0<0<y1)

    def test_too_wide_window_is_refused(self):
        far={**RATIONAL,'numerator':['1','1'],'denominator':['-900','1']}
        self.assertEqual(refused(far,equalUnits=True),'EQUAL_UNITS_WINDOW_TOO_WIDE')

    def test_field_must_be_true(self):
        self.assertEqual(refused(RATIONAL,equalUnits=False),'EQUAL_UNITS_INVALID')
        self.assertEqual(refused(SQRT,equalUnits='yes'),'EQUAL_UNITS_INVALID')

if __name__=='__main__':unittest.main()
