"""G18a-2: multi-curve-figure-v1 with a LINE, RATIONAL and SQRT curve, two curves, per-curve colour / weight / style / label, and inverse pairs (inverseOf).
Framing, the model figure and the independent observer run without Chrome; tamper cases (a moved curve, a missing asymptote, a lost dash ...) must fail."""
import copy
import re
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

# 24 제일고 2학기 기말 고1 q21: f(x)=(2x+3)/(4x-5), its inverse and the line y=x
PAIR={'family':'multi-curve','viewport':[-4,5,-3,4],'axisTickValues':{'x':[],'y':[]},'curves':[
    {'id':'f','kind':'RATIONAL','numerator':['3','2'],'denominator':['-5','4'],'domain':['-4','5'],'color':'BLUE','label':'y=f(x)'},
    {'id':'g','inverseOf':'f','color':'WARM','label':'y=g(x)'},
    {'id':'yx','kind':'LINE','coefficients':['0','1'],'domain':['-3','4'],'style':'DASHED','label':'y=x'}]}
# a square root, a bold square root, the inverse (a parabola half) of one of them, and a rational with hidden labels
MIX={'family':'multi-curve','viewport':[-6,6,-6,6],'axisTickValues':{'x':[],'y':[]},'curves':[
    {'id':'f','kind':'RATIONAL','numerator':['2','1'],'denominator':['-1','1'],'domain':['-6','6'],'color':'BLUE','hideLabels':['asymptotes']},
    {'id':'s','kind':'SQRT','radicand':['0','1'],'domain':['0','4'],'weight':'BOLD','hideLabel':True},
    {'id':'t','inverseOf':'s','hideLabels':['formula']},
    {'id':'p','kind':'Y_OF_X','coefficients':['0','0','1'],'domain':['0','2'],'hideLabel':True},
    {'id':'r','inverseOf':'p','hideLabels':['formula']}]}

def framed(graph):
    return fit_overview(copy.deepcopy(graph))['graphPlan']

def refused(graph):
    try:fit_overview(copy.deepcopy(graph))
    except ValueError as error:return str(error)
    return None

def observe(plan,svg=None,model=None):
    model=model or produce(plan)
    return audit(plan,svg if svg is not None else model['svg'],model['transform'])

def edit(svg,change):
    root=ET.fromstring(svg);change(root);return ET.tostring(root,encoding='unicode')

def find(root,ident):
    return next(node for node in root.iter() if node.get('id')==ident)

class Framing(unittest.TestCase):
    def test_two_curves_a_line_a_rational_and_the_inverse_of_it(self):
        plan=framed(PAIR);rows={row['id']:row for row in plan['multiCurveFeatures']['curves']}
        self.assertEqual([row['kind'] for row in rows.values()],['RATIONAL','RATIONAL','LINE'])
        # f=(3+2x)/(-5+4x): pole 5/4, horizontal 1/2; the inverse g=(-3-5x... ) has pole 1/2 and horizontal 5/4 (the asymptotes swap)
        self.assertEqual((rows['f']['asymptotes']['vertical']['x'],rows['f']['asymptotes']['horizontal']['y']),('5/4','1/2'))
        self.assertEqual((rows['g']['asymptotes']['vertical']['x'],rows['g']['asymptotes']['horizontal']['y']),('1/2','5/4'))
        self.assertEqual([branch['side'] for branch in rows['f']['branches']],['LEFT','RIGHT'])
        self.assertEqual(rows['g']['inverseOf'],'f');self.assertEqual((rows['f']['color'],rows['g']['color'],rows['yx']['style']),('BLUE','WARM','DASHED'))
        # the plan that travels on names every draw interval (the observer reads it)
        self.assertEqual(plan['curves'][1]['domain'],['-4','5']);self.assertTrue(plan['equalUnits'])
        x0,x1,y0,y1=plan['viewport'];self.assertTrue(x0<-4 and x1>5 and y0<-3 and y1>4 and y1>1)

    def test_a_quadratic_half_and_a_square_root_are_each_others_inverse(self):
        rows={row['id']:row for row in framed(MIX)['multiCurveFeatures']['curves']}
        # y=sqrt(x) on [0,4]: its inverse is y=x^2 on [0,2]; y=x^2 on [0,2]: its inverse is y=sqrt(x) on [0,4]
        self.assertEqual((rows['t']['kind'],rows['t']['coefficients'],rows['t']['interval']),('Y_OF_X',['0','0','1'],['0','2']))
        self.assertEqual((rows['r']['kind'],rows['r']['radicand'],rows['r']['amplitude'],rows['r']['interval']),('SQRT',['0','1'],'1',['0','4']))
        self.assertTrue(rows['s']['start']['drawn'])

    def test_a_tex_label_is_written_as_the_ascii_formula(self):
        graph=copy.deepcopy(PAIR);graph['curves'][0]['label']='-\\frac{8}{x-1}-4'
        self.assertEqual(framed(graph)['curves'][0]['label'],'-8/(x-1)-4')

    def test_refusals(self):
        def mutated(change):
            graph=copy.deepcopy(PAIR);change(graph);return refused(graph)
        self.assertEqual(mutated(lambda g:g.update(curves=g['curves'][:1])),'MULTI_CURVE_COUNT_INVALID')
        self.assertEqual(mutated(lambda g:g.pop('viewport')),'MULTI_CURVE_WINDOW_REQUIRED:f')
        self.assertEqual(mutated(lambda g:g.update(viewport=[1,0,0,1])),'MULTI_CURVE_WINDOW_INVALID')
        self.assertEqual(mutated(lambda g:g['curves'][0].update(color='RED')),'MULTI_CURVE_COLOR_INVALID:f')
        self.assertEqual(mutated(lambda g:g['curves'][0].update(weight='HEAVY')),'MULTI_CURVE_WEIGHT_INVALID:f')
        self.assertEqual(mutated(lambda g:g['curves'][0].update(style='DOTTED')),'MULTI_CURVE_STYLE_INVALID:f')
        self.assertEqual(mutated(lambda g:g['curves'][0].update(hideLabels=['colour'])),'MULTI_CURVE_HIDE_LABELS_INVALID:f')
        # a hole (the numerator is zero at the pole) is not a pole
        self.assertEqual(mutated(lambda g:g['curves'][0].update(numerator=['-5','4'])),'MULTI_CURVE_RATIONAL_DEGENERATE:f')
        # the inverse of a curve that does not come first, or of an inverse
        self.assertEqual(mutated(lambda g:g['curves'][1].update(inverseOf='yx')),'MULTI_CURVE_INVERSE_UNSUPPORTED:g')   # only an earlier curve
        self.assertEqual(mutated(lambda g:g['curves'][2].update(inverseOf='g')),'MULTI_CURVE_INVERSE_UNSUPPORTED:yx')
        self.assertEqual(mutated(lambda g:g['curves'][1].update(inverseOf='nobody')),'MULTI_CURVE_INVERSE_UNSUPPORTED:g')
        # a parabola that is not one-sided has no inverse
        parabola={'family':'multi-curve','viewport':[-3,3,-3,5],'curves':[{'id':'p','kind':'Y_OF_X','coefficients':['0','0','1'],'domain':['-2','2']},{'id':'q','inverseOf':'p'}]}
        self.assertEqual(refused(parabola),'MULTI_CURVE_INVERSE_UNSUPPORTED:q')

class Observer(unittest.TestCase):
    def setUp(self):
        self.pair=framed(PAIR);self.pair_model=produce(self.pair)
        self.mix=framed(MIX);self.mix_model=produce(self.mix)

    def test_the_model_figures_pass(self):
        for plan,model in ((self.pair,self.pair_model),(self.mix,self.mix_model)):
            result=observe(plan,model=model);self.assertEqual((result['status'],result['errors']),('PASS',[]),result)
        self.assertEqual(observe(self.pair,model=self.pair_model)['branchCount'],5)

    def tamper(self,plan_model,change):
        plan,model=plan_model
        return observe(plan,edit(model['svg'],change),model)

    def test_a_moved_curve_is_wrong(self):
        def move(root):
            node=find(root,'curve-f_l');first=node.get('points').split(' ');x,y=first[0].split(',');first[0]=x+','+str(float(y)+6);node.set('points',' '.join(first))
        self.assertIn('MULTI_CURVE_WRONG_CURVE:CURVE_f_L',self.tamper((self.pair,self.pair_model),move)['errors'])

    def test_an_inverse_that_is_not_the_mirror_image_is_wrong(self):
        # the model draws the true inverse; swap in the unreflected source curve under the inverse's tag
        def swap(root):
            source=find(root,'curve-f_l');target=find(root,'curve-g_l');target.set('points',source.get('points'))
        errors=self.tamper((self.pair,self.pair_model),swap)['errors']
        self.assertTrue(any(code.startswith('MULTI_CURVE_WRONG_CURVE:CURVE_g_L') or code.startswith('MULTI_CURVE_INVERSE_MISMATCH') for code in errors),errors)

    def test_a_missing_or_moved_asymptote_is_found(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='asymptote-f-v':parent.remove(child)
        self.assertIn('MULTI_CURVE_ASYMPTOTE_INVENTORY_MISMATCH',self.tamper((self.pair,self.pair_model),drop)['errors'])
        def move(root):
            node=find(root,'asymptote-f-h');node.set('y1',str(float(node.get('y1'))+6))
        self.assertIn('MULTI_CURVE_ASYMPTOTE_GEOMETRY_MISMATCH:ASYM_f_H',self.tamper((self.pair,self.pair_model),move)['errors'])

    def test_look_changes_are_found(self):
        self.assertIn('MULTI_CURVE_STYLE_MISMATCH:CURVE_yx',self.tamper((self.pair,self.pair_model),lambda root:find(root,'curve-yx').attrib.pop('stroke-dasharray'))['errors'])
        self.assertIn('MULTI_CURVE_COLOR_MISMATCH:CURVE_f_L',self.tamper((self.pair,self.pair_model),lambda root:find(root,'curve-f_l').set('stroke','black'))['errors'])
        self.assertIn('MULTI_CURVE_COLOR_MISMATCH:CURVE_g_R',self.tamper((self.pair,self.pair_model),lambda root:find(root,'curve-g_r').set('stroke','#1f5fa8'))['errors'])
        errors=self.tamper((self.mix,self.mix_model),lambda root:find(root,'curve-s').attrib.pop('stroke-width'))['errors']
        self.assertIn('MULTI_CURVE_WEIGHT_MISMATCH:CURVE_s',errors)

    def test_a_lost_start_dot_and_a_cut_short_line_are_found(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='curve-s-start':parent.remove(child)
        self.assertIn('MULTI_CURVE_START_DOT_INVENTORY_MISMATCH',self.tamper((self.mix,self.mix_model),drop)['errors'])
        def cut(root):
            node=find(root,'curve-yx');points=node.get('points').split(' ');node.set('points',' '.join(points[:len(points)//2]))
        self.assertIn('MULTI_CURVE_COVERAGE_FAIL:CURVE_yx',self.tamper((self.pair,self.pair_model),cut)['errors'])

if __name__=='__main__':
    unittest.main()
