"""graphPlan.regions of an inverse proportion (rational-spike-v1, y=k/(d0+d1*x)): the area between the curve and the x-axis, closed along the plot window's top (or bottom) edge where
the curve leaves the window beside the asymptote. Framing, the model figure and the independent observer run without Chrome; tamper cases (an empty wedge, a fill leaking out of the
window or past the curve, a fill drawn over a stroke) must fail. The final composed figure is covered by rational-regions-render-plan.test.mjs."""
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

# 26 왕운중 중1 2학기 중간 q14: y=a/x (a hidden) in the first quadrant, the area under the curve and right of the y-axis
Q14={'family':'rational','numerator':['8','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-1,11],'viewport':[-1,11,-1,7],'displayWindow':[-1,11,-1,7],
     'axisTickValues':{'x':[],'y':[]},'formulaLabel':'y=a/x','regions':[{'id':'S','under':'f','from':'0','to':'11','fill':'MEDIUM'}]}

def graph(**changes):
    plan=copy.deepcopy(Q14);plan.update(changes);return plan

def framed(plan):
    return fit_overview(copy.deepcopy(plan))['graphPlan']

def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

def observe(plan,svg=None,model=None):
    model=model or produce(plan)
    return audit(plan,svg if svg is not None else model['svg'],model['transform'])

def edit(svg,change):
    root=ET.fromstring(svg);change(root);return ET.tostring(root,encoding='unicode')

def region_points(svg,ident='region-S'):
    root=ET.fromstring(svg);node=next(node for node in root.iter() if node.get('id')==ident)
    values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',node.get('d'))]
    return [(values[i],values[i+1]) for i in range(0,len(values),2)]

class RationalRegionTest(unittest.TestCase):
    def test_q14_region_is_closed_along_the_top_edge_inside_the_window(self):
        plan=framed(graph());model=produce(plan);transform=model['transform']
        result=observe(plan,model=model)
        self.assertEqual(result['errors'],[],result['errors'])
        points=region_points(model['svg'])
        to_model=lambda px,py:((px-transform['originX'])/transform['sx'],(transform['originY']-py)/transform['sy'])
        data=[to_model(*point) for point in points]
        eps=1e-6
        top_y=plan['viewport'][3]   # the window [-1,11]x[-1,7] is widened by less than a pixel to a whole pixel height
        self.assertAlmostEqual(top_y,7,delta=0.02)
        # inside the plot window and right of the y-axis (x=0), above the x-axis (y=0)
        self.assertTrue(all(-eps<=x<=11+eps and -eps<=y<=top_y+eps for x,y in data),data)
        self.assertAlmostEqual(min(x for x,_ in data),0,places=6);self.assertAlmostEqual(max(x for x,_ in data),11,places=6)
        self.assertAlmostEqual(min(y for _,y in data),0,places=6);self.assertAlmostEqual(max(y for _,y in data),top_y,places=6)
        # the corner at the asymptote: (0,top) is a vertex, and the next vertex is where 8/x reaches the top edge, (8/top,top): the fill follows the edge between them (no diagonal wedge)
        top=[(x,y) for x,y in data if abs(y-top_y)<1e-6]
        self.assertTrue(any(abs(x-0)<1e-6 for x,_ in top) and any(abs(x-8/top_y)<2e-2 for x,_ in top),top)
        # the lower side runs along the x-axis from the asymptote to x=11, and the curve side ends at (11,8/11) above it
        self.assertTrue(any(abs(x-11)<1e-6 and abs(y)<1e-6 for x,y in data) and any(abs(x-11)<1e-6 and abs(y-8/11)<1e-3 for x,y in data))

    def test_region_is_declared_in_the_frozen_inventory(self):
        plan=framed(graph())
        row=plan['graphRegionFeatures']['regions'][0]
        self.assertEqual((row['id'],row['kind'],row['upper'],row['lower'],row['from'],row['to'],row['fill']),('S','UNDER','f','axis','0','11','MEDIUM'))

    def test_negative_constant_shades_between_the_axis_and_the_curve_below_it(self):
        plan=framed(graph(numerator=['-8','0'],viewport=[-1,11,-7,1],displayWindow=[-1,11,-7,1]))
        self.assertEqual((plan['graphRegionFeatures']['regions'][0]['upper'],plan['graphRegionFeatures']['regions'][0]['lower']),('axis','f'))
        model=produce(plan);self.assertEqual(observe(plan,model=model)['errors'],[])
        data=[((px-model['transform']['originX'])/model['transform']['sx'],(model['transform']['originY']-py)/model['transform']['sy']) for px,py in region_points(model['svg'])]
        self.assertAlmostEqual(min(y for _,y in data),plan['viewport'][2],places=6);self.assertAlmostEqual(max(y for _,y in data),0,places=6)

    def test_region_beside_a_shifted_asymptote_and_on_the_left_branch(self):
        for pole_plan,start,end in ((graph(denominator=['-2','1'],regions=[{'id':'S','under':'f','from':'2','to':'9'}]),'2','9'),(graph(numerator=['3','0'],denominator=['-5','1'],regions=[{'id':'S','under':'f','from':'-1','to':'5'}]),'-1','5')):
            plan=framed(pole_plan);result=observe(plan)
            self.assertEqual(result['errors'],[],(start,end,result['errors']))

    def test_pole_strictly_inside_the_interval_is_refused(self):
        self.assertEqual(refused(graph(regions=[{'id':'S','under':'f','from':'-1','to':'11'}])),'GRAPH_REGION_BOUNDARY_UNDEFINED:S:f')
        self.assertEqual(refused(graph(denominator=['-5','1'],regions=[{'id':'S','under':'f','from':'2','to':'8'}])),'GRAPH_REGION_BOUNDARY_UNDEFINED:S:f')

    def test_other_refusals(self):
        self.assertEqual(refused(graph(regions=[{'id':'S','under':'f','from':'0','to':'12'}])),'GRAPH_REGION_DOMAIN_INVALID:S')
        self.assertEqual(refused(graph(regions=[{'id':'S','under':'g','from':'0','to':'11'}])),'GRAPH_REGION_BOUNDARY_UNKNOWN:S:g')
        self.assertEqual(refused(graph(regions=[{'id':'S','upper':'f','lower':'axis','from':'0','to':'11'}])),'GRAPH_REGION_FIELD_UNKNOWN:lower')
        self.assertEqual(refused(graph(regions=[{'id':'S','under':'f','from':'0','to':'11','fill':'PINK'}])),'GRAPH_REGION_FILL_UNSUPPORTED:S')
        self.assertEqual(refused(graph(regions=[{'id':'S','under':'f','from':'0','to':'1/100'}])),'GRAPH_REGION_CURVE_NOT_VISIBLE:S')
        linear=graph(numerator=['1','2'],denominator=['3','-1'],regions=[{'id':'S','under':'f','from':'4','to':'8'}]);linear.pop('displayWindow');linear.pop('formulaLabel')
        self.assertEqual(refused(linear),'GRAPH_REGION_REQUIRES_INVERSE_PROPORTION')

    def test_observer_rejects_a_wedge_a_leak_and_a_fill_over_a_stroke(self):
        plan=framed(graph());model=produce(plan);svg=model['svg']
        top_left=min((point for point in region_points(svg)),key=lambda point:(point[1],point[0]))   # the (0,7) corner: smallest screen y, then smallest x
        def replace_d(transform):
            def change(root):
                node=next(node for node in root.iter() if node.get('id')=='region-S');points=transform(region_points(svg))
                node.set('d','M'+' L'.join(f'{x:.6g},{y:.6g}' for x,y in points)+' Z')
            return change
        # 1. the corner on the asymptote side is dropped: a diagonal wedge appears beside the y-axis
        wedge=observe(plan,edit(svg,replace_d(lambda points:[point for point in points if point!=top_left])),model)
        self.assertEqual(wedge['status'],'FAIL');self.assertTrue(any(code.startswith('GRAPH_REGION_INTERIOR_MISSING') for code in wedge['errors']),wedge['errors'])
        # 2. the fill reaches above the window (leaks into the frame margin)
        leak=observe(plan,edit(svg,replace_d(lambda points:[(x,y-30) if (x,y)==top_left else (x,y) for x,y in points])),model)
        self.assertEqual(leak['status'],'FAIL');self.assertTrue(any(code.startswith('GRAPH_REGION_OUTSIDE_WINDOW') for code in leak['errors']),leak['errors'])
        # 3. the fill passes the curve (the whole rectangle under the window's top is shaded)
        box=lambda points:[(min(x for x,_ in points),min(y for _,y in points)),(max(x for x,_ in points),min(y for _,y in points)),(max(x for x,_ in points),max(y for _,y in points)),(min(x for x,_ in points),max(y for _,y in points))]
        spill=observe(plan,edit(svg,replace_d(box)),model)
        self.assertEqual(spill['status'],'FAIL');self.assertTrue(any(code.startswith('GRAPH_REGION_OUTSIDE_BOUNDARY') for code in spill['errors']),spill['errors'])
        # 4. painted after (over) the strokes
        def move_last(root):
            node=next(node for node in root.iter() if node.get('id')=='region-S');root.remove(node);root.append(node)
        over=observe(plan,edit(svg,move_last),model)
        self.assertEqual(over['status'],'FAIL');self.assertTrue(any(code.startswith('GRAPH_REGION_NOT_BENEATH_STROKES') for code in over['errors']),over['errors'])
        # 5. no fill drawn at all
        def drop(root):
            node=next(node for node in root.iter() if node.get('id')=='region-S')
            next(parent for parent in root.iter() if node in list(parent)).remove(node)
        gone=observe(plan,edit(svg,drop),model)
        self.assertTrue(any(code.startswith('GRAPH_REGION_MISSING') for code in gone['errors']),gone['errors'])

    def test_plans_without_regions_are_unchanged(self):
        plain=graph();plain.pop('regions')
        plan=framed(plain);self.assertNotIn('graphRegionFeatures',plan)
        self.assertNotIn('data-mark="graph-region"',produce(plan)['svg'])

if __name__=='__main__':unittest.main()
