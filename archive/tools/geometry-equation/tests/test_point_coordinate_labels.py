"""E31 (4): coordinates of unnamed points with fractions on a graph (overlays.points[].coordinates:true, integers or fractions: (5/6,1/6), (0,-3/2)) and the independent graph
observer on a real composed figure (tests/e31-fixtures/overlay-fraction-coordinates.json). The coordinate construction's hidden points are read back by
tests/hidden-point-coordinates.test.mjs."""
import copy
import json
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_observer import audit,_ov_int_codes

FIXTURES=Path(__file__).resolve().parent/'e31-fixtures'

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['-3/2','2']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-1,3],'viewport':[-1,3,-3,3],'axisTickValues':{'x':[],'y':[]},
      'overlays':{'lines':[{'id':'g','slope':'-1','intercept':'1'},{'id':'f','slope':'2','intercept':'-3/2'}],
                  'points':[{'id':'P','intersect':['g','f'],'unnamed':True,'coordinates':True,'labelDirection':'E'},{'id':'X','axis':'x','value':'3/4','unnamed':True,'coordinates':True},
                            {'id':'Y','axis':'y','value':'-3/2','unnamed':True,'coordinates':True},{'id':'Z','axis':'y','value':'1','unnamed':True,'coordinates':True}]}}
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_fractions_are_written_as_numerator_over_denominator_text(self):
        rows={row['id']:row for row in fit_overview(copy.deepcopy(BASE))['graphPlan']['overlaysFeatures']['points']}
        self.assertEqual(rows['P']['coordinates'],['5/6','1/6']);self.assertEqual(rows['X']['coordinates'],['3/4','0']);self.assertEqual(rows['Y']['coordinates'],['0','-3/2']);self.assertEqual(rows['Z']['coordinates'],['0','1'])
    def test_an_irrational_coordinate_is_refused_with_its_code(self):
        plan=copy.deepcopy(BASE);plan['overlays']['points'].append({'id':'W','x':'sqrt(2)','y':'1','coordinates':True})
        self.assertEqual(refused(plan),'OVERLAY_COORDINATES_REQUIRE_RATIONALS:W')
    def test_integers_are_written_as_before(self):
        plan=copy.deepcopy(BASE);plan['overlays']['points']=[{'id':'A','x':'1','y':'1','unnamed':True,'coordinates':True}]
        self.assertEqual({row['id']:row['coordinates'] for row in fit_overview(plan)['graphPlan']['overlaysFeatures']['points']},{'A':['1','1']})

class Codes(unittest.TestCase):
    def test_the_observers_glyph_codes_of_a_rational(self):
        self.assertEqual(_ov_int_codes(7),['37']);self.assertEqual(_ov_int_codes(-6),['2212','36'])
        self.assertEqual(_ov_int_codes(__import__('sympy').Rational(5,6)),['35','36']);self.assertEqual(_ov_int_codes(__import__('sympy').Rational(-3,2)),['2212','33','32'])

class Fixture:
    def __init__(self):
        data=json.loads((FIXTURES/'overlay-fraction-coordinates.json').read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,plan=None,svg=None):return audit(plan or self.plan,svg or self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)

class ComposedFigure(unittest.TestCase):
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean(self):
        self.assertEqual(self.fx.errors(),[])
        self.assertIn('P-coordinates-owner-leader',self.fx.svg)               # the intersection's label stands in a free sector on a leader
    def test_a_coordinate_that_is_not_the_points_is_named(self):
        plan=copy.deepcopy(self.fx.plan)
        for point in plan['overlays']['points']:
            if point['id']=='X':point['value']='1/4'                         # the figure still shows (3/4,0) beside the dot that is now the point of x=1/4
        errors=self.fx.errors(plan=plan)
        self.assertTrue(any(e.endswith(':X') and e.startswith('OVERLAY_') for e in errors),errors)
    def test_a_leader_that_does_not_start_on_its_dot_is_named(self):
        def move(root):
            node=self.fx.node(root,'P-coordinates-owner-leader');node.set('x1',str(float(node.get('x1'))+25));node.set('y1',str(float(node.get('y1'))-25))
        self.assertIn('OVERLAY_COORDINATES_LEADER_NOT_ON_OWNER:P',self.fx.errors(svg=self.fx.edit(move)))
    def test_a_leader_that_does_not_end_on_the_label_is_named(self):
        def move(root):
            node=self.fx.node(root,'P-coordinates-owner-leader');node.set('x2',str(float(node.get('x2'))-40))
        self.assertIn('OVERLAY_COORDINATES_LEADER_NOT_ON_LABEL:P',self.fx.errors(svg=self.fx.edit(move)))
    def test_a_digit_of_the_text_is_read_back(self):
        plan=copy.deepcopy(self.fx.plan)
        for point in plan['overlays']['points']:
            if point['id']=='Y':point['value']='-5/2'                        # the label still reads (0,-3/2)
        self.assertTrue(any(e.startswith('OVERLAY_COORDINATES_LABEL_TEXT_MISMATCH:Y') for e in self.fx.errors(plan=plan)),self.fx.errors(plan=plan))

if __name__=='__main__':unittest.main()
