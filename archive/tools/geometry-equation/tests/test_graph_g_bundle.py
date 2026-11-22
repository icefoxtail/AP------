"""G bundle (2026-11-23): graph fixes that stop a plan from drawing, found by re-rendering the corpus.

2a-N05  a coordinate label of a point on the curve whose exact y is a rational only once expanded (7-10x+2x^2 at x=(5-sqrt(11))/2 is 0) was written 0*sqrt(None)
2a-N02  multi-curve-figure-v1 takes one curve (a line, an exponential, a logarithm, x as a function of y) with its points, label and axis names
2a-EQ   a squeezed frame (the plan records axisRatio other than 1) is never widened for the unit points: the independent observer reads that rule on its own

The generator (graph_framing) and the observer (graph_observer) do not share these rules: each test names the side it checks. Pure functions only (no browser)."""
import copy
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
import graph_framing
import graph_observer
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit
from sympy import Rational, sqrt

N05_PLAN={'family':'piecewise-polynomial','pieces':[{'coefficients':['7','-10','2']}],'domain':[0,5],'sourceDomain':{'kind':'ALL_REALS'},
          'requiredPoints':[{'id':'L','x':'0','y':'7'},{'id':'V','x':'5/2','y':'-11/2'},{'id':'R','x':'5','y':'7'}],
          'overlays':{'points':[{'id':'A','curveX':'(5-sqrt(11))/2','coordinates':True,'unnamed':True},{'id':'B','curveX':'(5+sqrt(11))/2','coordinates':True,'unnamed':True}]},
          'formula':'(7) + (-10)*x + (2)*x^2'}

ONE_CURVE={
    'LINE':{'family':'multi-curve','curves':[{'id':'f0','kind':'LINE','coefficients':['91/2','1/6'],'domain':['0','40'],'label':'y=x/6+91/2','color':'BLUE'}],
            'overlays':{'points':[{'id':'P','x':'36','y':'103/2','coordinates':True}]},'axisTitles':{'x':'x(C)'}},
    'EXPONENTIAL':{'family':'multi-curve','viewport':[-1,8,-1,11],'curves':[{'id':'f','kind':'EXPONENTIAL','base':'2','shiftX':'3','coefficients':['1','1','0'],'domain':['0','13/2'],'color':'BLUE','label':'f'}],
                   'axisTickValues':{'x':['1','2'],'y':['1','2']},'overlays':{'points':[{'id':'A','x':'1','y':'1/4','coordinates':True}]}},
    'LOGARITHMIC':{'family':'multi-curve','viewport':[-2,7,-4,4],'curves':[{'id':'up','kind':'LOGARITHMIC','base':'2','coefficients':['1','1','0','0'],'domain':['1/8','6'],'color':'BLUE','label':'f'}],
                   'axisTickValues':{'x':[],'y':[]},'overlays':{'points':[{'id':'P','x':'1','y':'0','coordinates':True}]}},
    'X_OF_Y':{'family':'multi-curve','viewport':[-1,3,-2,2],'curves':[{'id':'f','kind':'X_OF_Y','coefficients':['-2/5','0','1/5'],'domain':['-1','1'],'color':'GREEN','label':'x=(y^2-2)/5'}],
              'axisTickValues':{'x':[],'y':[]}},
}


def refused(graph):
    try:fit_overview(copy.deepcopy(graph))
    except ValueError as error:return str(error)
    return None


class N05CoordinateOfAnUnexpandedValue(unittest.TestCase):
    """Generator side: graph_framing._overlay_coordinate_text."""

    def test_an_unexpanded_rational_value_is_written_as_the_number(self):
        x=(5-sqrt(11))/2
        y=7-10*x+2*x**2           # sympy keeps this as -18 + 2*(5/2 - sqrt(11)/2)**2 + 5*sqrt(11): not is_Rational until expanded
        self.assertFalse(y.is_Rational)
        self.assertEqual(graph_framing._overlay_coordinate_text(y,'A'),'0')

    def test_surd_values_keep_their_form(self):
        self.assertEqual(graph_framing._overlay_coordinate_text((5-sqrt(11))/2,'A'),'(5-sqrt(11))/2')
        self.assertEqual(graph_framing._overlay_coordinate_text(1+sqrt(2),'A'),'1+sqrt(2)')
        self.assertEqual(graph_framing._overlay_coordinate_text(Rational(-3,2),'A'),'-3/2')

    def test_a_second_radical_is_still_refused(self):
        with self.assertRaises(ValueError) as caught:graph_framing._overlay_coordinate_text(sqrt(2)+sqrt(3),'A')
        self.assertIn('COORDINATE_SURD_FORM_UNSUPPORTED',str(caught.exception))

    def test_the_two_roots_of_a_quadratic_are_labelled_through_the_framer(self):
        points={row['id']:row for row in fit_overview(copy.deepcopy(N05_PLAN))['graphPlan']['overlaysFeatures']['points']}
        self.assertEqual(points['A']['coordinates'],['(5-sqrt(11))/2','0'])
        self.assertEqual(points['B']['coordinates'],['(5+sqrt(11))/2','0'])
        self.assertFalse(any('None' in text for row in points.values() for text in row['coordinates']))


class N02OneCurveFigure(unittest.TestCase):
    """Generator (graph_framing.multi_curve_source) and observer (graph_observer) each hold their own reading of the 1..6 rule."""

    def test_one_curve_of_each_kind_is_a_figure(self):
        for kind,graph in ONE_CURVE.items():
            with self.subTest(kind=kind):
                self.assertIsNone(refused(graph))

    def test_no_curve_and_seven_curves_are_refused(self):
        for kind,graph in ONE_CURVE.items():
            with self.subTest(kind=kind,count=0):
                zero=copy.deepcopy(graph);zero['curves']=[]
                self.assertEqual(refused(zero),'MULTI_CURVE_COUNT_INVALID')
            with self.subTest(kind=kind,count=7):
                seven=copy.deepcopy(graph);seven['curves']=[{**copy.deepcopy(graph['curves'][0]),'id':'c%d'%i} for i in range(7)]
                self.assertEqual(refused(seven),'MULTI_CURVE_COUNT_INVALID')

    def test_the_observer_reads_the_rule_for_itself(self):
        source=Path(graph_observer.__file__).read_text(encoding='utf-8')
        self.assertNotIn('MULTI_CURVE_MIN_CURVES',source)   # no constant shared with the framer
        for kind,graph in ONE_CURVE.items():
            with self.subTest(kind=kind):
                plan=fit_overview(copy.deepcopy(graph))['graphPlan']
                model=produce(plan)
                self.assertEqual(audit(plan,model['svg'],model['transform'])['status'],'PASS')
                # the observer itself refuses a plan with no curve (tamper: the figure is the one-curve figure, the plan lists none)
                tampered=copy.deepcopy(plan);tampered['curves']=[]
                result=audit(tampered,model['svg'],model['transform'])
                self.assertNotEqual(result['status'],'PASS')
                self.assertIn('MULTI_CURVE_COUNT_INVALID',list(result.get('errors',[]))+list(result.get('unsupported',[])))

    def test_two_curve_plans_frame_as_before(self):
        pair=copy.deepcopy(ONE_CURVE['LINE']);pair['curves'].append({'id':'f1','kind':'LINE','coefficients':['50','0'],'domain':['0','40'],'label':'y=50','color':'WARM'})
        self.assertIsNone(refused(pair))


class EqualUnitSqueezedFrame(unittest.TestCase):
    """Observer side: graph_observer._ov_final_window mirrors the engine's widening rule on its own, from the plan."""
    WINDOW=[-4.43,0.43,-3.87,5.87]       # stops short of x=1: the unit point (1,0) lies outside

    def test_a_squeezed_frame_is_not_widened(self):
        self.assertEqual(graph_observer._ov_final_window(self.WINDOW,{'axisRatio':0.5}),self.WINDOW)
        self.assertEqual(graph_observer._ov_final_window(self.WINDOW,{'axisRatio':2/3}),self.WINDOW)

    def test_an_equal_unit_frame_still_widens(self):
        widened=graph_observer._ov_final_window(self.WINDOW,{'axisRatio':1})
        self.assertNotEqual(widened,self.WINDOW)
        self.assertEqual(graph_observer._ov_final_window(self.WINDOW,{}),widened)
        self.assertLess(widened[0],self.WINDOW[0])
        self.assertGreater(widened[1],1.0)

    def test_a_window_that_holds_the_unit_points_is_never_widened(self):
        inside=[-3.0,3.0,-3.0,3.0]
        for plan in ({},{'axisRatio':1},{'axisRatio':0.5}):
            self.assertEqual(graph_observer._ov_final_window(inside,plan),inside)


if __name__=='__main__':
    unittest.main()
