"""G18a-4: multi-curve emphasis (a heavier, coloured stretch of a curve with open / closed end dots) and the {from,to} form of a curve's domain. Framing, the model figure and the
independent observer run without Chrome; tamper cases (a moved or missing stretch, a wrong dot, a lost weight) must fail."""
import copy
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

# 25 팔마고 q20 style: f(x)=-(x-2)^2+4 on [-1,4], the part x<=2 emphasised with a closed dot at x=2, the line y=x; a square root with a coloured stretch, a rational with a stretch
GRAPH={'family':'multi-curve','viewport':[-2,8,-6,5],'axisTickValues':{'x':[],'y':[]},'curves':[
    {'id':'f','kind':'Y_OF_X','coefficients':['0','4','-1'],'domain':{'from':'-1','to':'4'},'emphasis':[{'to':'2','toState':'CLOSED'}],'hideLabel':True},
    {'id':'d','kind':'LINE','coefficients':['0','1'],'domain':['-1','4'],'style':'DASHED'},
    {'id':'s','kind':'SQRT','radicand':['-2','3'],'offset':'2','domain':['2/3','6'],'emphasis':[{'from':'2/3','fromState':'CLOSED','to':'2','toState':'OPEN','color':'GREEN'}],'hideLabels':['formula','start']},
    {'id':'r','kind':'RATIONAL','numerator':['-1','4'],'denominator':['1','1'],'domain':['-1/2','6'],'emphasis':[{'from':'0','fromState':'CLOSED','to':'4','toState':'CLOSED'}],'hideLabels':['asymptotes']}]}

def framed(graph):return fit_overview(copy.deepcopy(graph))['graphPlan']
def refused(graph):
    try:fit_overview(copy.deepcopy(graph))
    except ValueError as error:return str(error)
    return None
def edit(svg,change):
    root=ET.fromstring(svg);change(root);return ET.tostring(root,encoding='unicode')
def find(root,ident):return next(node for node in root.iter() if node.get('id')==ident)
def with_curve(index,**fields):
    graph=copy.deepcopy(GRAPH);graph['curves'][index].update(fields);return graph

class Framing(unittest.TestCase):
    def test_emphasis_is_frozen_exactly_with_defaults(self):
        rows={row['id']:row for row in framed(GRAPH)['multiCurveFeatures']['curves']}
        self.assertEqual(rows['f']['emphasis'],[{'from':'-1','to':'2','color':'WARM','fromState':'NONE','toState':'CLOSED'}])
        self.assertEqual(rows['s']['emphasis'],[{'from':'2/3','to':'2','color':'GREEN','fromState':'CLOSED','toState':'OPEN'}])
        self.assertNotIn('emphasis',rows['d'])

    def test_a_domain_written_as_from_to_is_the_same_domain(self):
        plan=framed(GRAPH);self.assertEqual(plan['curves'][0]['domain'],['-1','4'])
        self.assertEqual({row['id']:row for row in plan['multiCurveFeatures']['curves']}['f']['interval'],['-1','4'])

    def test_one_curve_is_a_figure_when_it_carries_an_emphasis(self):
        graph={'family':'multi-curve','curves':[{'id':'p','kind':'Y_OF_X','coefficients':['0','-4','1'],'domain':['-1','6'],'emphasis':[{'from':'4','fromState':'CLOSED'}]}],'axisTickValues':{'x':['2'],'y':[]}}
        self.assertEqual([row['emphasis'][0]['to'] for row in framed(graph)['multiCurveFeatures']['curves']],['6'])
        graph['curves'][0].pop('emphasis');self.assertEqual(refused(graph),'MULTI_CURVE_COUNT_INVALID')

    def test_refusals(self):
        self.assertEqual(refused(with_curve(0,emphasis=[{'from':'-5','to':'2'}])),'MULTI_CURVE_EMPHASIS_INVALID:f')   # outside the curve's own interval
        self.assertEqual(refused(with_curve(0,emphasis=[{'from':'2','to':'1'}])),'MULTI_CURVE_EMPHASIS_INVALID:f')
        self.assertEqual(refused(with_curve(0,emphasis=[{'to':'2','toState':'FILLED'}])),'MULTI_CURVE_EMPHASIS_INVALID:f')
        self.assertEqual(refused(with_curve(0,emphasis=[{'to':'2','width':3}])),'MULTI_CURVE_EMPHASIS_INVALID:f')
        self.assertEqual(refused(with_curve(0,emphasis=[{'to':'2','color':'RED'}])),'MULTI_CURVE_COLOR_INVALID:f')
        self.assertEqual(refused(with_curve(0,emphasis=[])),'MULTI_CURVE_EMPHASIS_INVALID:f')
        self.assertEqual(refused(with_curve(0,emphasis=[{'to':'1'},{'from':'0','to':'2'}])),'MULTI_CURVE_EMPHASIS_INVALID:f')   # overlapping
        # a rational's stretch never crosses its pole (x=-1 is outside the stretch [-1/2,6] here, so use another pole)
        self.assertEqual(refused(with_curve(3,domain=['-3','6'],emphasis=[{'from':'-2','to':'3'}])),'MULTI_CURVE_EMPHASIS_ACROSS_POLE:r')
        sideways={'family':'multi-curve','curves':[{'id':'a','kind':'X_OF_Y','coefficients':['2','0','-1'],'domain':['-1','1'],'emphasis':[{'from':'0'}]},{'id':'b','kind':'Y_OF_X','coefficients':['0','0','1'],'domain':['-1','1']}],'axisTickValues':{'x':['1'],'y':[]}}
        self.assertEqual(refused(sideways),'MULTI_CURVE_EMPHASIS_UNSUPPORTED:a')

class Observer(unittest.TestCase):
    def setUp(self):
        self.plan=framed(GRAPH);self.model=produce(self.plan)

    def run_edit(self,change):
        return audit(self.plan,edit(self.model['svg'],change),self.model['transform'])

    def test_the_model_passes(self):
        result=audit(self.plan,self.model['svg'],self.model['transform']);self.assertEqual((result['status'],result['errors']),('PASS',[]),result)

    def test_a_moved_or_missing_stretch_is_found(self):
        def move(root):
            node=find(root,'emph-f-1');points=node.get('points').split(' ');x,y=points[1].split(',');points[1]=x+','+str(float(y)+7);node.set('points',' '.join(points))
        self.assertIn('MULTI_CURVE_EMPHASIS_WRONG_CURVE:EMPH_f_1',self.run_edit(move)['errors'])
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='emph-s-1':parent.remove(child)
        self.assertIn('MULTI_CURVE_EMPHASIS_INVENTORY_MISMATCH',self.run_edit(drop)['errors'])

    def test_a_stretch_that_runs_past_its_end_or_stops_short_is_found(self):
        def short(root):
            node=find(root,'emph-r-1');points=node.get('points').split(' ');node.set('points',' '.join(points[:len(points)//2]))
        self.assertTrue(any(code.startswith('MULTI_CURVE_EMPHASIS_COVERAGE_FAIL') for code in self.run_edit(short)['errors']))
        def long(root):
            # the model's emphasis of f is replaced by the whole curve: it runs past x=2
            find(root,'emph-f-1').set('points',find(root,'curve-f').get('points'))
        self.assertIn('MULTI_CURVE_EMPHASIS_OUTSIDE_STRETCH:EMPH_f_1',self.run_edit(long)['errors'])

    def test_weight_colour_and_dots_are_checked(self):
        self.assertIn('MULTI_CURVE_EMPHASIS_LOOK_MISMATCH:EMPH_f_1',self.run_edit(lambda root:find(root,'emph-f-1').set('stroke-width','1.7'))['errors'])
        self.assertIn('MULTI_CURVE_EMPHASIS_LOOK_MISMATCH:EMPH_s_1',self.run_edit(lambda root:find(root,'emph-s-1').set('stroke','#b85c00'))['errors'])
        self.assertIn('MULTI_CURVE_EMPHASIS_DOT_MISMATCH:emphasis-s-1-to',self.run_edit(lambda root:find(root,'emphasis-s-1-to').set('fill','#111'))['errors'])   # an open dot drawn filled
        self.assertIn('MULTI_CURVE_EMPHASIS_DOT_MISMATCH:emphasis-f-1-to',self.run_edit(lambda root:find(root,'emphasis-f-1-to').set('cx',str(float(find(root,'emphasis-f-1-to').get('cx'))+9)))['errors'])
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='emphasis-r-1-from':parent.remove(child)
        self.assertIn('MULTI_CURVE_EMPHASIS_DOT_INVENTORY_MISMATCH',self.run_edit(drop)['errors'])

if __name__=='__main__':
    unittest.main()
