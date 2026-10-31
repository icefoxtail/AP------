"""G5b: (1) surd coordinates in graph overlay coordinate labels (p+q*sqrt(r) over a denominator) and exact roots of cubic/quartic pieces through quadratic factors,
read back by the independent graph observer on a composed figure (g5b-fixtures/overlay-surd-coordinates.json: tamper tests)."""
import copy
import json
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

import sympy as S

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview,pp_poly_roots,_overlay_coordinate_text
from graph_observer import audit,_ov_coordinate_codes,_ov_surd_form

FIXTURES=Path(__file__).resolve().parent/'g5b-fixtures'
BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','-3','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},'axisTickValues':{'x':[],'y':[]},
      'requiredPoints':[{'id':'K','x':-1,'y':2},{'id':'L','x':1,'y':-2}],
      'overlays':{'points':[{'id':'P','curveX':'-sqrt(3)','coordinates':True,'unnamed':True},{'id':'M','x':'1/2-sqrt(3)/2','y':'0','coordinates':True,'unnamed':True},
                            {'id':'N','x':'sqrt(3)/3','y':'-8*sqrt(3)/9','coordinates':False}]}}
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_surd_coordinates_are_written_as_one_exact_text(self):
        plan=copy.deepcopy(BASE);plan['overlays']['points'].append({'id':'Q','x':'sqrt(2)','y':'-1+2*sqrt(2)','coordinates':True,'unnamed':True})
        rows={row['id']:row for row in fit_overview(plan)['graphPlan']['overlaysFeatures']['points']}
        self.assertEqual(rows['P']['coordinates'],['-sqrt(3)','0'])
        self.assertEqual(rows['M']['coordinates'],['(1-sqrt(3))/2','0'])
        self.assertEqual(rows['Q']['coordinates'],['sqrt(2)','-1+2*sqrt(2)'])
    def test_a_nested_or_second_radical_is_refused_with_its_code(self):
        for value in (S.sqrt(2)+S.sqrt(3),S.sqrt(1+S.sqrt(2))):
            with self.assertRaises(ValueError) as caught:_overlay_coordinate_text(value,'W')
            self.assertEqual(str(caught.exception),'COORDINATE_SURD_FORM_UNSUPPORTED:W')
        self.assertEqual(refused({**BASE,'overlays':{'points':[{'id':'W','x':'sqrt(1+sqrt(2))','y':'1','coordinates':True}]}}),'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED')   # the exact-value grammar stops it first
    def test_integers_and_fractions_are_written_as_before(self):
        plan=copy.deepcopy(BASE);plan['overlays']['points']=[{'id':'A','x':'1','y':'3/2','unnamed':True,'coordinates':True}]
        self.assertEqual({row['id']:row['coordinates'] for row in fit_overview(plan)['graphPlan']['overlaysFeatures']['points']},{'A':['1','3/2']})

class Roots(unittest.TestCase):
    def roots(self,*coefficients):return pp_poly_roots([S.Integer(c) for c in coefficients])
    def test_a_quartic_with_surd_roots_factors_over_the_rationals(self):
        self.assertEqual([str(v) for v in self.roots(0,0,-2,0,1)],['-sqrt(2)','0','sqrt(2)'])
    def test_a_cubic_with_a_quadratic_factor_gives_its_surd_roots(self):
        self.assertEqual([str(v) for v in self.roots(0,-3,0,1)],['-sqrt(3)','0','sqrt(3)'])
        found=self.roots(-1,-3,-1,1)                                                              # x^3-x^2-3x-1=(x+1)(x^2-2x-1)
        self.assertEqual(len(found),3)
        for value,expected in zip(found,(-1.0,1-2**.5,1+2**.5)):self.assertAlmostEqual(float(value),expected,places=9)
    def test_an_irreducible_cubic_is_still_refused(self):
        with self.assertRaises(ValueError) as caught:self.roots(1,-3,0,1)
        self.assertEqual(str(caught.exception),'PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM')

class Codes(unittest.TestCase):
    def test_the_glyph_codes_of_a_surd_coordinate(self):
        R=S.Rational
        self.assertEqual(_ov_coordinate_codes(-S.sqrt(3)),['2212','33','221A'])                       # the radicand is drawn before the radical sign
        self.assertEqual(_ov_coordinate_codes(1+S.sqrt(2)),['31','2B','32','221A'])
        self.assertEqual(_ov_coordinate_codes(-1+2*S.sqrt(2)),['2212','31','2B','32','32','221A'])
        self.assertEqual(_ov_coordinate_codes((1-S.sqrt(3))/2),['31','2212','33','221A','32'])
        self.assertEqual(_ov_coordinate_codes(R(-3,2)),['2212','33','32'])
    def test_only_one_radical_over_a_denominator_is_a_surd_form(self):
        self.assertTrue(_ov_surd_form(S.sqrt(5)/3));self.assertTrue(_ov_surd_form(R:=S.Rational(1,2)))
        self.assertFalse(_ov_surd_form(S.sqrt(2)+S.sqrt(3)));self.assertFalse(_ov_surd_form(S.sqrt(1+S.sqrt(2))))

class Fixture:
    def __init__(self):
        data=json.loads((FIXTURES/'overlay-surd-coordinates.json').read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,plan=None,svg=None):return audit(plan or self.plan,svg or self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)

class ComposedFigure(unittest.TestCase):
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean(self):
        self.assertEqual(self.fx.errors(),[])
        self.assertIn('M-coordinates-owner-leader',self.fx.svg)               # the surd coordinate with a fraction stands on a leader from its dot
    def test_a_surd_dot_that_moved_is_named(self):
        def move(root):
            node=self.fx.node(root,'P');node.set('cx',str(float(node.get('cx'))+12))
        self.assertIn('OVERLAY_POINT_MISMATCH:P',self.fx.errors(svg=self.fx.edit(move)))
    def test_a_changed_radicand_of_the_label_is_read_back(self):
        plan=copy.deepcopy(self.fx.plan)
        for point in plan['overlays']['points']:
            if point['id']=='M':point['x']='1/2-sqrt(5)/2'                    # the label still reads ((1-sqrt(3))/2,0)
        errors=self.fx.errors(plan=plan)
        self.assertTrue(any(e.startswith('OVERLAY_COORDINATES_LABEL_TEXT_MISMATCH:M') for e in errors),errors)
    def test_a_leader_that_does_not_end_on_the_label_is_named(self):
        def move(root):
            node=self.fx.node(root,'M-coordinates-owner-leader');node.set('y2',str(float(node.get('y2'))-30))
        self.assertIn('OVERLAY_COORDINATES_LEADER_NOT_ON_LABEL:M',self.fx.errors(svg=self.fx.edit(move)))
    def test_a_leader_that_does_not_start_on_its_dot_is_named(self):
        def move(root):
            node=self.fx.node(root,'M-coordinates-owner-leader');node.set('x1',str(float(node.get('x1'))+25));node.set('y1',str(float(node.get('y1'))-25))
        self.assertIn('OVERLAY_COORDINATES_LEADER_NOT_ON_OWNER:M',self.fx.errors(svg=self.fx.edit(move)))

if __name__=='__main__':unittest.main()
