"""E31 (1): labelAt (START / END / a fraction) of an overlay line's equation on a graph, the framing that carries it, and the independent observer on a real
composed figure (tests/e31-fixtures/parallel-overlay-lines.json: two parallel lines y=5/2x-1/2 and y=5/2x-3/4 only 0.25 apart, each equation on a leader).
No Chrome here: the coordinate figure's equation labels are read back by tests/line-label-at.test.mjs."""
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
from graph_observer import audit

FIXTURES=Path(__file__).resolve().parent/'e31-fixtures'

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['-1/2','5/2']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,3],'viewport':[-2,3,-6,8],
      'axisTickValues':{'x':[],'y':[]},
      'overlays':{'lines':[{'id':'a','slope':'5/2','intercept':'-1/2','labelAt':'START'},{'id':'b','slope':'5/2','intercept':'-3/4','labelAt':'END'}],
                  'points':[{'id':'P','x':'1','y':'-2','unnamed':True},{'id':'Q','x':'-1','y':'3','unnamed':True}]}}

def with_lines(lines):
    plan=copy.deepcopy(BASE);plan['overlays']['lines']=lines;return plan
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class LabelAtFraming(unittest.TestCase):
    def test_the_stated_place_reaches_the_feature_rows(self):
        rows={row['id']:row for row in fit_overview(copy.deepcopy(BASE))['graphPlan']['overlaysFeatures']['lines']}
        self.assertEqual((rows['a']['lineAt'],rows['b']['lineAt']),('START','END'))
    def test_a_line_without_labelAt_has_no_lineAt(self):
        rows=fit_overview(copy.deepcopy(with_lines([{'id':'a','slope':'5/2','intercept':'-1/2'}])))['graphPlan']['overlaysFeatures']['lines']
        self.assertNotIn('lineAt',rows[0])
    def test_a_fraction_is_accepted(self):
        for value in (0,0.35,1,'START','END'):
            self.assertIsNone(refused(with_lines([{'id':'a','slope':'5/2','intercept':'-1/2','labelAt':value}])),value)
    def test_bad_values_are_refused_with_their_code(self):
        for value in ('MID','middle',-0.1,1.5,True,None,[0.5],'0.5'):
            self.assertEqual(refused(with_lines([{'id':'a','slope':'5/2','intercept':'-1/2','labelAt':value}])),'OVERLAY_LINE_LABEL_AT_INVALID:a',value)

class Fixture:
    def __init__(self):
        data=json.loads((FIXTURES/'parallel-overlay-lines.json').read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,svg=None,plan=None):return audit(plan or self.plan,svg if svg is not None else self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)

class ComposedFigure(unittest.TestCase):
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean_and_both_equations_stand_on_leaders(self):
        self.assertEqual(self.fx.errors(),[])
        self.assertIn('overlay-line-a-equation-owner-leader',self.fx.svg);self.assertIn('overlay-line-b-equation-owner-leader',self.fx.svg)
    def test_the_stated_place_is_read_back_from_the_figure(self):
        plan=copy.deepcopy(self.fx.plan)
        # the same figure, but the plan now asks for the other ends: the labels do not stand where the plan says
        for line in plan['overlays']['lines']:line['labelAt']='END' if line['labelAt']=='START' else 'START'
        errors=self.fx.errors(plan=plan)
        self.assertIn('OVERLAY_LINE_LABEL_NOT_AT:a',errors);self.assertIn('OVERLAY_LINE_LABEL_NOT_AT:b',errors)
    def test_a_fraction_in_the_middle_is_not_where_the_end_labels_stand(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['lines'][0]['labelAt']=0.5
        self.assertEqual([e for e in self.fx.errors(plan=plan) if e.startswith('OVERLAY_LINE_LABEL_NOT_AT')],['OVERLAY_LINE_LABEL_NOT_AT:a'])
    def test_a_bad_value_in_the_plan_is_unsupported_with_its_code(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['lines'][0]['labelAt']='MID'
        result=audit(plan,self.fx.svg,self.fx.transform);self.assertEqual(result['status'],'UNSUPPORTED');self.assertIn('OVERLAY_LINE_LABEL_AT_INVALID',result['errors'])
    def test_a_leader_that_does_not_start_on_its_line_is_named(self):
        leader='overlay-line-b-equation-owner-leader'
        def move(root):
            node=self.fx.node(root,leader);node.set('x1',str(float(node.get('x1'))-30));node.set('y1',str(float(node.get('y1'))+8))
        self.assertIn('OVERLAY_LINE_LEADER_NOT_ON_OWNER:overlay-line-b-equation',self.fx.errors(self.fx.edit(move)))
    def test_a_plan_without_labelAt_still_passes_the_same_figure(self):
        plan=copy.deepcopy(self.fx.plan)
        for line in plan['overlays']['lines']:line.pop('labelAt')
        self.assertEqual(self.fx.errors(plan=plan),[])

if __name__=='__main__':unittest.main()
