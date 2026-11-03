"""G18c-1/2: multi-curve-figure-v1 shaded regions (between two curves, under a curve, a half-plane / quadrant piece cut by the frame), abs curves (y=|f(x)|) and the y-stretch
axisScale. Framing, the model figure and the independent observer run without Chrome; tamper cases (a moved fill, a fill drawn over a stroke, a lost fold ...) must fail."""
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

# a rational above a line over [3,6] (the band between them), a parabola half under which the x-axis band is shaded, and a half-plane quadrant piece
BAND={'family':'multi-curve','viewport':[-1,8,-2,8],'axisTickValues':{'x':[],'y':[]},'curves':[
    {'id':'f','kind':'RATIONAL','numerator':['1','1'],'denominator':['-1','1'],'domain':['-1','8'],'color':'BLUE','label':'y=f(x)'},
    {'id':'g','kind':'LINE','coefficients':['0','1/4'],'domain':['-1','8'],'label':'y=x/4'}],
    'regions':[{'id':'S','between':['f','g'],'from':'3','to':'5','fill':'LIGHT'}]}
UNDER={'family':'multi-curve','viewport':[-1,6,-1,6],'axisTickValues':{'x':[],'y':[]},'curves':[
    {'id':'p','kind':'Y_OF_X','coefficients':['4','0','-1'],'domain':['-2','2'],'label':'y=4-x^2'},
    {'id':'s','kind':'SQRT','radicand':['0','1'],'domain':['0','5'],'hideLabel':True}],
    'regions':[{'id':'A','under':'p','from':'-1','to':'1','fill':'BLUE','label':'S'}]}
QUADRANT={'family':'multi-curve','viewport':[-3,7,-3,8],'axisTickValues':{'x':[],'y':[]},'curves':[
    {'id':'L','kind':'LINE','coefficients':['6','-3/2'],'domain':['-3','7'],'hideLabel':True}],
    'regions':[{'id':'R','halfPlane':{'x':'<','value':'2'},'and':{'y':'<','value':'3'}}]}
ABS={'family':'multi-curve','viewport':[-6,11,-1,5],'axisTickValues':{'x':[],'y':[]},'curves':[
    {'id':'f','kind':'RATIONAL','numerator':['1','2'],'denominator':['3','-1'],'abs':True,'domain':['-6','11'],'color':'BLUE','hideLabel':True}],
    'overlays':{'lines':[{'id':'k','slope':'0','intercept':'1','label':'y=1','ownership':'NEAREST'}]}}

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

def retouch(node,change):
    """Rewrite every vertex of a fill path (M x,y L x,y ... Z) through change(x,y)."""
    values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?',node.get('d'))]
    points=[change(values[i],values[i+1]) for i in range(0,len(values),2)]
    node.set('d','M'+' L'.join(f'{x},{y}' for x,y in points)+' Z')

class Framing(unittest.TestCase):
    def test_between_two_curves_names_the_upper_and_the_lower(self):
        row=framed(BAND)['multiCurveFeatures']['regions'][0]
        self.assertEqual((row['kind'],row['upper'],row['lower'],row['from'],row['to']),('BETWEEN','f','g','3','5'))
        # the same band with the boundaries named the other way round is the same region
        swapped=copy.deepcopy(BAND);swapped['regions'][0]['between']=['g','f']
        row=framed(swapped)['multiCurveFeatures']['regions'][0];self.assertEqual((row['upper'],row['lower']),('f','g'))

    def test_under_a_curve_is_the_band_to_the_axis(self):
        row=framed(UNDER)['multiCurveFeatures']['regions'][0]
        self.assertEqual((row['upper'],row['lower'],row['fill'],row['label']),('p','axis','BLUE','S'))

    def test_half_plane_runs_to_the_frame(self):
        plan=framed(QUADRANT);row=plan['multiCurveFeatures']['regions'][0];x0,x1,y0,y1=plan['viewport']
        self.assertEqual(row['kind'],'HALF_PLANE');self.assertEqual(row['box'],[x0,2.0,y0,3.0])

    def test_one_curve_is_enough_for_a_region(self):
        self.assertIsNone(refused(QUADRANT))

    def test_refusals(self):
        def with_region(region,base=BAND):
            graph=copy.deepcopy(base);graph['regions']=[region];return refused(graph)
        # f=(1+x)/(x-1) has its pole at 1: a band over [0,5] is not defined there
        self.assertEqual(with_region({'id':'S','between':['f','g'],'from':'0','to':'5'}),'GRAPH_REGION_BOUNDARY_UNDEFINED:S:f')
        # f=(x+1)/(x-1) and g=x/4 cross where x^2-5x-4=0 (x ~ 5.77): the band over [2,8] changes sign
        self.assertEqual(with_region({'id':'S','between':['f','g'],'from':'2','to':'8'}),'GRAPH_REGION_BOUNDARIES_CROSS:S')
        self.assertEqual(with_region({'id':'S','between':['f','nope'],'from':'3','to':'5'}),'GRAPH_REGION_BOUNDARY_UNKNOWN:S:nope')
        self.assertEqual(with_region({'id':'S','between':['f','g'],'from':'5','to':'3'}),'GRAPH_REGION_DOMAIN_INVALID:S')
        self.assertEqual(with_region({'id':'S','between':['f','g'],'from':'3','to':'5','colour':'x'}),'GRAPH_REGION_FIELD_UNKNOWN:colour')
        self.assertEqual(with_region({'id':'S','between':['f','g'],'from':'3','to':'5','fill':'RED'}),'GRAPH_REGION_FILL_UNSUPPORTED:S')
        self.assertEqual(with_region({'id':'S','halfPlane':{'x':'<','value':'20'}},QUADRANT),'GRAPH_REGION_EMPTY:S')
        self.assertEqual(with_region({'id':'S','halfPlane':{'x':'<','value':'2'},'and':{'x':'>','value':'1'}},QUADRANT),'GRAPH_REGION_FIELD_INVALID:S')
        too_many=copy.deepcopy(BAND);too_many['regions']=[{'id':'R'+str(i),'between':['f','g'],'from':'3','to':'5'} for i in range(5)]
        self.assertEqual(refused(too_many),'GRAPH_REGION_COUNT_INVALID')

    def test_abs_curve_row_and_asymptote(self):
        plan=framed(ABS);row=plan['multiCurveFeatures']['curves'][0]
        self.assertTrue(row['abs']);self.assertEqual(row['asymptotes']['horizontal']['y'],'2')   # |2x+1|/|3-x| tends to |2/-1|
        graph=copy.deepcopy(ABS);graph['curves'][0]['abs']='yes';graph['curves'].append({'id':'g','kind':'LINE','coefficients':['0','1'],'domain':['-6','5']})
        self.assertEqual(refused(graph),'MULTI_CURVE_ABS_INVALID:f')

    def test_abs_curve_cannot_be_inverted(self):
        graph=copy.deepcopy(ABS);graph['curves'].append({'id':'g','inverseOf':'f'})
        self.assertEqual(refused(graph),'MULTI_CURVE_INVERSE_UNSUPPORTED:g')

    def test_abs_label_written_with_bars(self):
        graph=copy.deepcopy(ABS);graph['curves'][0].pop('hideLabel');graph['curves'][0]['label']='y=\\left|\\frac{2x+1}{-x+3}\\right|'
        self.assertEqual(framed(graph)['curves'][0]['label'],'y=abs((2x+1)/(-x+3))')

    def test_multi_curve_takes_a_stretched_axis_scale(self):
        graph=copy.deepcopy(ABS);graph['axisScale']={'x':1,'y':2}
        plan=framed(graph);self.assertEqual(plan['axisRatio'],2.0)
        self.assertEqual(observe(plan)['status'],'PASS')

    def test_overlay_line_ownership_value(self):
        graph=copy.deepcopy(ABS);graph['overlays']['lines'][0]['ownership']='LOOSE'
        self.assertEqual(refused(graph),'OVERLAY_LINE_OWNERSHIP_INVALID:k')

class Observer(unittest.TestCase):
    def setUp(self):
        self.plans={name:framed(graph) for name,graph in (('band',BAND),('under',UNDER),('quadrant',QUADRANT),('abs',ABS))}
        self.models={name:produce(plan) for name,plan in self.plans.items()}

    def check(self,name,change=None):
        svg=self.models[name]['svg'] if change is None else edit(self.models[name]['svg'],change)
        return observe(self.plans[name],svg,self.models[name])

    def test_every_figure_passes(self):
        for name in self.plans:
            result=self.check(name);self.assertEqual(result['status'],'PASS',(name,result['errors']))

    def test_a_region_is_painted_beneath_the_strokes(self):
        root=ET.fromstring(self.models['band']['svg']);ids=[node.get('id') for node in root.iter()]
        first_curve=next(node.get('id') for node in root.iter() if node.get('data-role')=='curve')
        self.assertLess(ids.index('region-S'),ids.index(first_curve))

    def test_a_moved_fill_fails(self):
        def move(root):
            retouch(find(root,'region-S'),lambda x,y:(x,y+14))
        self.assertIn('GRAPH_REGION_BOUNDARY_MISMATCH:S',self.check('band',move)['errors'])

    def test_a_missing_fill_fails(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='region-S':parent.remove(child)
        self.assertIn('GRAPH_REGION_MISSING:S',self.check('band',drop)['errors'])

    def test_a_wrong_fill_colour_fails(self):
        self.assertIn('GRAPH_REGION_FILL_MISMATCH:S',self.check('band',lambda root:find(root,'region-S').set('fill','#112233'))['errors'])

    def test_a_fill_painted_over_a_stroke_fails(self):
        def lift(root):
            node=find(root,'region-S');root.remove(node);root.append(node)
        self.assertIn('GRAPH_REGION_NOT_BENEATH_STROKES:S',self.check('band',lift)['errors'])

    def test_an_undeclared_fill_fails(self):
        def add(root):
            ET.SubElement(root,'path',{'id':'region-Z','data-role':'region','data-mark':'graph-region','fill':'#e4e7ec','fill-rule':'evenodd','stroke':'none','d':'M0,0 L10,0 L10,10 Z'})
        self.assertIn('GRAPH_REGION_UNDECLARED:region-Z',self.check('band',add)['errors'])

    def test_a_half_plane_short_of_the_frame_fails(self):
        def shrink(root):
            node=find(root,'region-R');low=min(float(v) for v in re.findall(r'-?\d+(?:\.\d+)?',node.get('d'))[0::2])
            retouch(node,lambda x,y:(x+25 if abs(x-low)<1e-6 else x,y))
        self.assertTrue(any(code.startswith('GRAPH_REGION_BOUNDARY_MISMATCH:R') for code in self.check('quadrant',shrink)['errors']))

    def test_a_region_the_plan_does_not_declare_is_refused_by_the_frozen_rows(self):
        plan=copy.deepcopy(self.plans['band']);plan['multiCurveFeatures']['regions'][0]['upper']='g'
        self.assertIn('GRAPH_REGION_INVENTORY_MISMATCH:S',observe(plan,model=self.models['band'])['errors'])

    def test_the_abs_curve_must_be_folded(self):
        # a left branch drawn below the axis (the unfolded rational) is not y=|f(x)|
        origin=self.models['abs']['transform']['originY']
        def unfold(root):
            node=find(root,'curve-f_l');values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?',node.get('points'))]
            node.set('points',' '.join(f'{values[i]},{2*origin-values[i+1]}' for i in range(0,len(values),2)))
        self.assertEqual(self.check('abs',unfold)['status'],'FAIL')

class DeclaredScale(unittest.TestCase):
    def test_a_declared_axis_scale_frame_is_not_widened_for_the_unit_points(self):
        from graph_observer import _ov_final_window
        window=[-1,7,-0.15,0.6]   # a density graph: the unit point (0,1) is far above the window
        self.assertNotEqual(_ov_final_window(window),window)                       # the old rule widens it (the ratio of the two axes would change)
        self.assertEqual(_ov_final_window(window,{'axisScale':{'x':1,'y':6}}),window)

if __name__=='__main__':
    unittest.main()
