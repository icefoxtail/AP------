"""graphPlan.axisTickLabels {axis:{value:symbol}}: a tick the author names by a letter (a, b, c, alpha, beta) instead of its number, drawn by the common tick layer for every graph
family. Framing keeps the field, the model draws the ticks with the symbol as their text, and the independent observer reads each named tick back from a real composed figure
(tests/tick-label-fixtures: 21_순천여고 수II q10, the time axis of a position graph with the times a, b, c) with tampering. No Chrome here: the typeset figures are exercised by
tests/axis-tick-labels.test.mjs."""
import copy
import json
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

FIXTURES=Path(__file__).resolve().parent/'tick-label-fixtures'

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['4','-5','1']}],'breakpoints':[],
      'sourceDomain':{'kind':'INTERVAL','range':['0','11/2'],'states':['CLOSED','CLOSED']},'requiredPoints':[{'id':'V','x':'5/2','y':'-9/4','marker':'NONE'}],
      'axisTickValues':{'x':[],'y':[]},'axisTickLabels':{'x':{'1':'a','4':'b','11/2':'c'}},'axisTitles':{'x':'t','y':'x(t)'}}
CUBIC={'family':'polynomial','coefficients':['0','-3','0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-4,4],'requiredPoints':[],
       'axisTickValues':{'x':['-1','1','2'],'y':['2']},'axisTickLabels':{'x':{'-1':'α','2':'β'}},'axisTitles':{'x':'t','y':'v(t)'}}
MULTI={'family':'multi-curve','viewport':[-1,6,-2,6],'axisTickValues':{'x':[],'y':[]},'axisTickLabels':{'x':{'2':'a','5':'b'},'y':{'3':'k'}},'axisTitles':{'x':'t','y':'S(t)'},
       'curves':[{'id':'c1','kind':'LINE','coefficients':['1','1'],'domain':['0','5'],'color':'BLUE'}]}

def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']

class TickLabelFraming(unittest.TestCase):
    def test_every_family_keeps_the_field_through_framing(self):
        for name,plan in (('piecewise-polynomial',BASE),('polynomial',CUBIC),('multi-curve',MULTI)):
            self.assertEqual(fitted(plan)['axisTickLabels'],plan['axisTickLabels'],name)
    def test_a_plan_without_the_field_has_none(self):
        plan=copy.deepcopy(BASE);plan.pop('axisTickLabels');self.assertNotIn('axisTickLabels',fitted(plan))

class TickLabelObserverOnTheModel(unittest.TestCase):
    def test_the_model_passes_and_carries_the_ticks(self):
        for name,plan in (('piecewise-polynomial',BASE),('polynomial',CUBIC),('multi-curve',MULTI)):
            plan=fitted(plan);model=produce(plan);result=audit(plan,model['svg'],model['transform'])
            self.assertEqual(result['status'],'PASS',(name,result['errors']))
            self.assertEqual(result.get('errors'),[],name)
    def test_the_plan_is_checked_by_the_observer(self):
        plan=fitted(BASE);model=produce(plan)
        def codes(labels):
            changed={**plan,'axisTickLabels':labels};return audit(changed,model['svg'],model['transform'])['errors']
        self.assertEqual(codes({'z':{'1':'a'}}),['AXIS_TICK_LABELS_INVALID'])
        self.assertEqual(codes({'x':{'1':'ab'}}),['AXIS_TICK_LABEL_SYMBOL_INVALID:x'])
        self.assertEqual(codes({'x':{'0':'a'}}),['AXIS_TICK_LABEL_SYMBOL_INVALID:x'])
        self.assertEqual(codes({'x':{'1':'a','4':'a'}}),['AXIS_TICK_LABELS_DUPLICATE'])
        self.assertEqual(codes({'x':{'1':'a','1.0':'b'}}),['AXIS_TICK_LABELS_DUPLICATE'])
        self.assertEqual(codes({'x':{'one':'a'}}),['AXIS_TICK_LABEL_VALUE_INVALID:x'])

class Fixture:
    """A real composed figure: the final SVG, its fitted graph plan and the observed frame (tests/tick-label-fixtures)."""
    def __init__(self,name='t-axis-abc'):
        data=json.loads((FIXTURES/(name+'.json')).read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,svg=None,plan=None):return audit(plan or self.plan,svg if svg is not None else self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)
    @staticmethod
    def label_of(root,symbol):return next(n for n in root.iter() if n.get('data-tick-symbol')==symbol)

class ComposedFigure(unittest.TestCase):
    """The observer on the real figure of 21_순천여고 수II q10: clean, and each tampering is named."""
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean(self):
        self.assertEqual(self.fx.errors(),[])
        for symbol in 'abc':self.assertIn('data-tick-symbol="%s"'%symbol,self.fx.svg)
        self.assertEqual(self.fx.plan['axisTickLabels'],{'x':{'1':'a','4':'b','11/2':'c'}})
    def test_the_symbol_label_is_changed(self):
        def wrong(root):self.fx.label_of(root,'a').set('data-tick-symbol','d')
        self.assertTrue(any(code.startswith('AXIS_TICK_LABEL_TEXT_MISMATCH:x:a') or code.startswith('AXIS_TICK_LABEL_OWNER:x:a') for code in self.fx.errors(self.fx.edit(wrong))),self.fx.errors(self.fx.edit(wrong)))
        def display(root):self.fx.label_of(root,'b').set('data-tick-display-value','1')
        self.assertIn('AXIS_TICK_LABEL_TEXT_MISMATCH:x:b',self.fx.errors(self.fx.edit(display)))
    def test_a_missing_or_moved_tick_is_named(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('data-role')=='tick' and child.get('data-value') is not None and abs(float(child.get('data-value'))-4)<1e-9:parent.remove(child)
        self.assertIn('AXIS_TICK_LABEL_TICK_MISSING:x:b',self.fx.errors(self.fx.edit(drop)))
        def move(root):
            for node in root.iter():
                if node.get('data-role')=='tick' and node.get('data-value') is not None and abs(float(node.get('data-value'))-4)<1e-9:
                    for key in ('x1','x2'):node.set(key,str(float(node.get(key))+9))
        self.assertIn('AXIS_TICK_LABEL_TICK_POSITION:x:b',self.fx.errors(self.fx.edit(move)))
    def test_a_symbol_the_plan_does_not_name_is_not_a_tick_of_the_plan(self):
        # the plan names c at 11/2; asking for a different symbol there finds the figure's own symbol different
        plan=copy.deepcopy(self.fx.plan);plan['axisTickLabels']={'x':{'1':'a','4':'b','11/2':'d'}}
        self.assertIn('AXIS_TICK_LABEL_TEXT_MISMATCH:x:d',self.fx.errors(plan=plan))
    def test_the_glyph_is_the_letter(self):
        def glyph(root):
            group=self.fx.label_of(root,'c')
            for node in group.iter():
                if node.get('data-c'):node.set('data-c','1D44F');return
        self.assertIn('AXIS_TICK_LABEL_GLYPH_MISMATCH:x:c',self.fx.errors(self.fx.edit(glyph)))

if __name__=='__main__':unittest.main()
