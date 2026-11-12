"""multi-curve-figure-v1, a RATIONAL curve with a quadratic numerator y=(c2x^2+c1x+c0)/(d0+d1x): one vertical asymptote and an oblique one (not drawn by the
curve: the author draws y=qx+r as a LINE curve or an overlay line). A linear numerator keeps its horizontal asymptote exactly as before.
Framing, the model figure and the independent observer run without Chrome."""
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

def oblique(numerator=('16','2','1'),denominator=('2','1'),extra=None):
    """y=x+16/(x+2) for x>-2 (an open end at the pole) with its oblique asymptote y=x as a dashed line."""
    curve={'id':'f','kind':'RATIONAL','numerator':list(numerator),'denominator':list(denominator),'domain':['-2','9'],'domainStates':['OPEN','NONE'],'color':'BLUE'}
    curve.update(extra or {})
    return {'family':'multi-curve','viewport':[-4,10,-2,12],'axisTickValues':{'x':[],'y':[]},'curves':[
        curve,{'id':'g','kind':'LINE','coefficients':['0','1'],'domain':['-4','10'],'style':'DASHED'}]}

def framed(graph):
    return fit_overview(copy.deepcopy(graph))['graphPlan']

def refused(graph):
    try:fit_overview(copy.deepcopy(graph))
    except ValueError as error:return str(error)
    return None

class ObliqueRational(unittest.TestCase):
    def test_a_quadratic_numerator_is_framed_with_one_vertical_asymptote_and_no_horizontal_one(self):
        plan=framed(oblique())
        row=next(row for row in plan['multiCurveFeatures']['curves'] if row['id']=='f')
        self.assertEqual(row['numerator'],['16','2','1'])
        self.assertEqual(row['asymptotes']['vertical'],{'x':'-2','drawn':True})
        self.assertEqual(row['asymptotes']['horizontal']['drawn'],False)

    def test_the_model_figure_is_observed_and_the_curve_follows_the_formula(self):
        plan=framed(oblique());model=produce(plan)
        self.assertEqual(audit(plan,model['svg'],model['transform'])['status'],'PASS')
        # the curve is one right branch (the pole is the open end of the domain) and only the vertical asymptote is a dashed line
        self.assertIn('data-branch="CURVE_f_R"',model['svg'])
        self.assertNotIn('data-branch="ASYM_f_H"',model['svg'])
        self.assertIn('data-branch="ASYM_f_V"',model['svg'])

    def test_a_linear_numerator_keeps_its_horizontal_asymptote(self):
        plan=framed(oblique(numerator=('16','2'),denominator=('2','1')))
        row=next(row for row in plan['multiCurveFeatures']['curves'] if row['id']=='f')
        self.assertEqual(row['asymptotes']['horizontal'],{'y':'2','drawn':True})
        model=produce(plan)
        self.assertEqual(audit(plan,model['svg'],model['transform'])['status'],'PASS')

    def test_a_zero_x_squared_coefficient_is_not_a_quadratic_numerator(self):
        self.assertEqual(refused(oblique(numerator=('16','2','0'))),'MULTI_CURVE_COEFFICIENT_INVALID:f')

    def test_a_numerator_of_four_terms_is_refused(self):
        self.assertEqual(refused(oblique(numerator=('16','2','1','1'))),'MULTI_CURVE_COEFFICIENT_INVALID:f')

    def test_a_hole_is_still_degenerate(self):
        # (x-1)(x+2)=x^2+x-2 over x+2 has a hole at -2, not a pole
        self.assertEqual(refused(oblique(numerator=('-2','1','1'))),'MULTI_CURVE_RATIONAL_DEGENERATE:f')

    def test_the_absolute_value_of_an_oblique_rational_is_refused(self):
        self.assertEqual(refused(oblique(extra={'abs':True})),'MULTI_CURVE_COEFFICIENT_INVALID:f')

    def test_the_inverse_of_an_oblique_rational_is_refused(self):
        graph=oblique();graph['curves'].append({'id':'h','kind':'RATIONAL','inverseOf':'f'})
        self.assertEqual(refused(graph),'MULTI_CURVE_INVERSE_UNSUPPORTED:h')

if __name__=='__main__':unittest.main()
