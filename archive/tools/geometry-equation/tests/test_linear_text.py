"""E31 (2): the exact reader of a free line-equation text (production/linear_text.py) and its use on graph overlay lines (graphPlan.overlays.lines[].label with labelValues)."""
import copy
import sys
import unittest
from fractions import Fraction as F
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from linear_text import read_equation,same_line,read_values
from graph_framing import fit_overview

def code(text,values=None):
    try:read_equation(text,values)
    except ValueError as error:return str(error)
    return None

class Reader(unittest.TestCase):
    def test_numeric_equations_are_read_exactly(self):
        self.assertEqual(read_equation('y=-2x+6'),(F(2),F(1),F(-6)))
        self.assertEqual(read_equation('x-1=0'),(F(1),F(0),F(-1)))
        self.assertEqual(read_equation('y=-3/4x+6'),(F(3,4),F(1),F(-6)))
        self.assertEqual(read_equation('y=-3/4*x+6'),(F(3,4),F(1),F(-6)))
        self.assertEqual(read_equation('2(x-1)+y=0'),(F(2),F(1),F(-2)))
        self.assertEqual(read_equation('y=1.5x'),(F(-3,2),F(1),F(0)))
        self.assertEqual(read_equation('x=3'),(F(1),F(0),F(-3)))
    def test_a_letter_without_a_value_makes_the_text_symbolic(self):
        for text in ('y=ax+6','ax+y+4=0','y=-1/2x+a','y=(a/b)x-a','x=k'):self.assertIsNone(read_equation(text),text)
    def test_values_make_it_exact(self):
        self.assertEqual(read_equation('y=ax+6',{'a':'3/2'}),(F(-3,2),F(1),F(-6)))
        self.assertEqual(read_equation('y=-ax-1',{'a':'-2'}),(F(-2),F(1),F(1)))
        self.assertIsNone(read_equation('y=ax+b',{'a':'1'}))
    def test_same_line_is_proportionality(self):
        line=(F(3),F(-2),F(12))
        for text,values in (('y=ax+6',{'a':'3/2'}),('3x-2y+12=0',None),('-6x+4y=24',None),('y=3/2x+6',None)):self.assertTrue(same_line(read_equation(text,values),line),text)
        for text,values in (('y=ax+6',{'a':'2'}),('y=3/2x+7',None),('y=-3/2x+6',None),('x=1',None)):self.assertFalse(same_line(read_equation(text,values),line),text)
        self.assertFalse(same_line((F(0),F(0),F(1)),line))
    def test_refusals_have_their_own_codes(self):
        self.assertEqual(code('y=x^2'),'LINE_TEXT_NOT_LINEAR');self.assertEqual(code('xy=1'),'LINE_TEXT_NOT_LINEAR');self.assertEqual(code('y=1/x'),'LINE_TEXT_NOT_LINEAR')
        for text in ('y','y=','=y','y=x=1','y=(x','y=x)','x$=1','y=1/0','',' ','y='+'x'*41):self.assertEqual(code(text),'LINE_TEXT_INVALID',text)
        self.assertEqual(code('y=ax',{'a':'1/0'}),'LINE_TEXT_VALUES_INVALID')
        for values in ({'x':'1'},{'ab':'1'},{'a':1},{'a':'1.5'},[1],'a'):self.assertEqual(code('y=ax',values),'LINE_TEXT_VALUES_INVALID',values)

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['-3/2','2']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,3],'viewport':[-2,3,-6,6],'axisTickValues':{'x':[],'y':[]},
      'overlays':{'lines':[{'id':'g','slope':'2','intercept':'-1','label':'y=-ax-1','labelValues':{'a':'-2'}},{'id':'v','x':'1','label':'x-1=0'}],
                  'points':[{'id':'A','x':'0','y':'-1','unnamed':True},{'id':'B','x':'0','y':'-3/2','unnamed':True}]}}
def with_lines(lines):
    plan=copy.deepcopy(BASE);plan['overlays']['lines']=lines;return plan
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class OverlayLabels(unittest.TestCase):
    def test_the_example_is_accepted_and_keeps_its_text(self):
        rows={row['id']:row for row in fit_overview(copy.deepcopy(BASE))['graphPlan']['overlaysFeatures']['lines']}
        self.assertEqual((rows['g']['text'],rows['v']['text']),('y=-ax-1','x-1=0'));self.assertEqual(rows['g']['labelValues'],{'a':'-2'})
    def test_a_symbolic_text_needs_no_values(self):
        self.assertIsNone(refused(with_lines([{'id':'g','slope':'2','intercept':'-1','label':'y=-ax-1'}])))
        self.assertIsNone(refused(with_lines([{'id':'v','x':'1','label':'x=k'}])))
    def test_a_name_without_an_equals_sign_is_kept_as_before(self):
        self.assertIsNone(refused(with_lines([{'id':'g','slope':'2','intercept':'-1','label':'l'}])))
    def test_a_text_that_is_not_the_drawn_line_is_refused(self):
        for line in ({'id':'g','slope':'2','intercept':'-1','label':'y=2x+1'},{'id':'g','slope':'2','intercept':'-1','label':'y=-ax-1','labelValues':{'a':'2'}},
                     {'id':'v','x':'1','label':'x-2=0'},{'id':'v','x':'1','label':'y=1'}):
            self.assertEqual(refused(with_lines([line])),'OVERLAY_LABEL_NOT_THE_LINE:'+line['id'],line)
    def test_equivalent_forms_of_the_same_line_are_accepted(self):
        for line in ({'id':'g','slope':'2','intercept':'-1','label':'2x-y-1=0'},{'id':'g','slope':'2','intercept':'-1','label':'y+1=2x'},{'id':'v','x':'1','label':'x=1'},{'id':'v','x':'1','label':'2x=2'}):
            self.assertIsNone(refused(with_lines([line])),line)
    def test_refusals_have_their_own_codes(self):
        cases=(({'id':'g','slope':'2','intercept':'-1','label':'y=x^2'},'OVERLAY_LABEL_NOT_LINEAR:g'),({'id':'g','slope':'2','intercept':'-1','label':'xy=2'},'OVERLAY_LABEL_NOT_LINEAR:g'),
               ({'id':'g','slope':'2','intercept':'-1','label':'y=-ax-1','labelValues':{'a':'x'}},'OVERLAY_LABEL_VALUES_INVALID:g'),
               ({'id':'g','slope':'2','intercept':'-1','label':'y=-ax-1','labelValues':{'b':'1'}},'OVERLAY_LABEL_VALUES_UNUSED:g'),
               ({'id':'g','slope':'2','intercept':'-1','labelValues':{'a':'1'}},'OVERLAY_LABEL_VALUES_WITHOUT_LABEL:g'),
               ({'id':'g','slope':'2','intercept':'-1','label':'l','labelValues':{'a':'1'}},'OVERLAY_LABEL_VALUES_WITHOUT_EQUATION:g'),
               ({'id':'g','slope':'2','intercept':'-1','label':'y=2x$'},'OVERLAY_LABEL_INVALID:g'))
        for line,expected in cases:self.assertEqual(refused(with_lines([line])),expected,line)

if __name__=='__main__':unittest.main()
