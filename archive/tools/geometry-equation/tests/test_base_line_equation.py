"""E31 (7): the equation of the drawn base line written beside it (overlays.names[] with labelKind MATH at curveX) and the independent graph observer on a real composed figure
(tests/e31-fixtures/base-line-equation.json: the base line x+y-4=0 with its own equation, the overlay line 2x-3y+2=0 with a free label, a shaded triangle)."""
import copy
import json
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_observer import audit

FIXTURES=Path(__file__).resolve().parent/'e31-fixtures'

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['4','-1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,6],'viewport':[-3,6,-2,5],'axisTickValues':{'x':[],'y':[]},
      'overlays':{'lines':[{'id':'h','slope':'2/3','intercept':'2/3','label':'2x-3y+2=0'}],
                  'points':[{'id':'A','axis':'x','value':'4','unnamed':True},{'id':'B','axis':'x','value':'-1','unnamed':True},{'id':'P','curveX':'2','unnamed':True}],
                  'names':[{'id':'nb','text':'x+y-4=0','labelKind':'MATH','curveX':'0'}]}}
def with_name(**change):
    plan=copy.deepcopy(BASE);plan['overlays']['names'][0].update(change);return plan
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_the_example_is_accepted_and_keeps_its_kind(self):
        row=fit_overview(copy.deepcopy(BASE))['graphPlan']['overlaysFeatures']['names'][0]
        self.assertEqual((row['id'],row['text'],row['labelKind'],row['kind']),('nb','x+y-4=0','MATH','CURVE'))
    def test_a_plain_name_has_no_labelKind_row(self):
        plan=copy.deepcopy(BASE);plan['overlays']['names']=[{'id':'n','text':'직선 l','curveX':'0'}]
        self.assertNotIn('labelKind',fit_overview(plan)['graphPlan']['overlaysFeatures']['names'][0])
    def test_equivalent_forms_and_symbolic_texts_are_accepted(self):
        for text in ('y=-x+4','y=4-x','2x+2y=8','y=-ax+4','y=a-x'):self.assertIsNone(refused(with_name(text=text)),text)
        self.assertIsNone(refused(with_name(text='y=-ax+4',labelValues={'a':'1'})))
    def test_a_text_that_is_not_the_drawn_line_is_refused(self):
        for text,values in (('y=x+4',None),('x+y-5=0',None),('y=-ax+4',{'a':'2'})):
            plan=with_name(text=text)
            if values:plan['overlays']['names'][0]['labelValues']=values
            self.assertEqual(refused(plan),'OVERLAY_NAME_NOT_THE_CURVE:nb',text)
    def test_refusals_have_their_own_codes(self):
        cases=(({'text':'y=x^2'},'OVERLAY_NAME_NOT_LINEAR:nb'),({'text':'열세글자를$'},'OVERLAY_NAME_TEXT_INVALID:nb'),({'labelKind':'FORMULA'},'OVERLAY_NAME_INVALID:nb'),
               ({'labelValues':{'a':'x'},'text':'y=-ax+4'},'OVERLAY_NAME_VALUES_INVALID:nb'))
        for change,code in cases:self.assertEqual(refused(with_name(**change)),code,change)
        plan=copy.deepcopy(BASE);plan['overlays']['names']=[{'id':'nb','text':'x+y-4=0','labelKind':'MATH','line':'h'}];self.assertEqual(refused(plan),'OVERLAY_NAME_INVALID:nb')
        plan=copy.deepcopy(BASE);plan['overlays']['names']=[{'id':'nb','text':'직선','labelValues':{'a':'1'},'curveX':'0'}];self.assertEqual(refused(plan),'OVERLAY_NAME_INVALID:nb')

class Fixture:
    def __init__(self):
        data=json.loads((FIXTURES/'base-line-equation.json').read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,svg=None,plan=None):return audit(plan or self.plan,svg or self.svg,self.transform)['errors']
    def named(self,**change):
        plan=copy.deepcopy(self.plan);plan['overlays']['names'][0].update(change);return plan

class ComposedFigure(unittest.TestCase):
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean(self):self.assertEqual(self.fx.errors(),[])
    def test_the_glyphs_are_read_back(self):
        self.assertIn('OVERLAY_NAME_LABEL_TEXT_MISMATCH:nb',self.fx.errors(plan=self.fx.named(text='x+y-5=0')))
        self.assertIn('OVERLAY_NAME_LABEL_TEXT_MISMATCH:nb',self.fx.errors(plan=self.fx.named(text='y=-x+4')))
    def test_a_text_that_is_not_the_base_line_is_named_by_the_observer_itself(self):
        # the plan's base line is another one than the label says: the equation itself is read, not only its glyphs
        self.assertIn('OVERLAY_NAME_NOT_THE_CURVE:nb',self.fx.errors(plan=self.swapped()))
    def swapped(self):
        plan=copy.deepcopy(self.fx.plan);plan['pieces']=[{'coefficients':['5','-1']}];return plan
    def test_a_name_that_is_not_math_is_not_read_as_math(self):
        # the figure's label is typeset math: a plan that calls it a plain name (data-text expected) disagrees
        self.assertIn('OVERLAY_NAME_LABEL_TEXT_MISMATCH:nb',self.fx.errors(plan=self.fx.named(labelKind='TEXT',text='직선 l')))

if __name__=='__main__':unittest.main()
