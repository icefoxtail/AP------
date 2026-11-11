"""overlays.points[].marker (FILLED default, OPEN = hollow circle) and overlays.points[].color / overlays.latticePoints.color (the engine's palette groups):
framing (validation, error codes), the model SVG shape, the independent observer (including tampering), and the spec the figure is drawn from."""
import copy
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit,GRAPH_COLOR_LINES
from visual_engine.palette import PALETTE
from visual_engine.semantic_model import validate
sys.path.insert(0,str(Path(__file__).resolve().parent))

BASE={'family':'rational','numerator':['8','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[0.8,9],'viewport':[-0.5,9,-0.5,9],
      'axisTickValues':{'x':[1,2,3,4,5,6,7,8],'y':[1,2,3,4,5,6,7,8]},'displayWindow':[-1,9,-1,9],'formulaLabel':'y=8/x'}
def plan_with(points,lattice=None):
    plan=copy.deepcopy(BASE);plan['overlays']={'points':points}
    if lattice is not None:plan['overlays']['latticePoints']=lattice
    return plan
OPEN_ROSE=[{'id':'c1','curveX':'1','unnamed':True,'marker':'OPEN','color':'ROSE'},{'id':'c2','curveX':'2','unnamed':True,'marker':'OPEN','color':'ROSE'},{'id':'p','x':'5','y':'5','unnamed':True}]
LATTICE={'region':'BELOW_CURVE','xRange':[1,7],'yMin':1,'strict':True,'counts':True,'color':'BLUE'}

def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def circle(svg,ident):
    match=re.search(r'<circle id="'+re.escape(ident)+r'"[^>]*/>',svg);return match.group(0) if match else None
def attr(node,name):
    match=re.search(r'\s'+name+r'="([^"]*)"',node);return match.group(1) if match else None

class Framing(unittest.TestCase):
    def test_marker_and_colour_reach_the_feature_rows(self):
        rows={row['id']:row for row in fitted(plan_with(OPEN_ROSE,LATTICE))['overlaysFeatures']['points']}
        self.assertEqual((rows['c1']['marker'],rows['c1']['color']),('OPEN','ROSE'))
        self.assertNotIn('marker',rows['p']);self.assertNotIn('color',rows['p'])
        self.assertEqual(fitted(plan_with(OPEN_ROSE,LATTICE))['overlaysFeatures']['latticePoints']['color'],'BLUE')

    def test_absent_options_leave_the_rows_as_they_were(self):
        framed=fitted(plan_with([{'id':'c1','curveX':'1','unnamed':True}],{'region':'BELOW_CURVE','xRange':[1,7],'yMin':1}))['overlaysFeatures']
        self.assertEqual(set(framed['points'][0]),{'id','x','y','xExact','yExact','unnamed'})
        self.assertNotIn('color',framed['latticePoints'])

    def test_filled_is_the_plain_dot(self):
        row=fitted(plan_with([{'id':'c1','curveX':'1','unnamed':True,'marker':'FILLED'}]))['overlaysFeatures']['points'][0]
        self.assertNotIn('marker',row)

    def test_unknown_names_are_refused_with_a_clear_code(self):
        def point(**extra):return plan_with([{'id':'c1','curveX':'1','unnamed':True,**extra}])
        self.assertEqual(refused(point(color='rose')),'OVERLAY_COLOR_INVALID:c1.color')      # the palette names are upper case
        self.assertEqual(refused(point(color='TEAL')),'OVERLAY_COLOR_INVALID:c1.color')
        self.assertEqual(refused(point(color=3)),'OVERLAY_COLOR_INVALID:c1.color')
        self.assertEqual(refused(point(marker='HOLLOW')),'OVERLAY_POINT_MARKER_INVALID:c1')
        self.assertEqual(refused(point(marker=True)),'OVERLAY_POINT_MARKER_INVALID:c1')
        self.assertEqual(refused(plan_with([],{**LATTICE,'color':'blue'})),'OVERLAY_COLOR_INVALID:lattice.color')
        self.assertEqual(refused(plan_with([],{**LATTICE,'color':'TEAL'})),'OVERLAY_COLOR_INVALID:lattice.color')

    def test_every_palette_name_is_accepted(self):
        for name in PALETTE:self.assertIsNone(refused(plan_with([{'id':'c1','curveX':'1','unnamed':True,'color':name}],{**LATTICE,'color':name})))

class DrawnShape(unittest.TestCase):
    def setUp(self):
        self.plan=fitted(plan_with(OPEN_ROSE,LATTICE));self.model=produce(self.plan);self.svg=self.model['svg']

    def test_an_open_point_is_a_hollow_ring_of_the_same_size(self):
        open_dot,plain=circle(self.svg,'c1'),circle(self.svg,'p')
        self.assertEqual(attr(open_dot,'fill'),'#fff');self.assertEqual(attr(open_dot,'stroke'),PALETTE['ROSE']['line']);self.assertEqual(attr(open_dot,'data-state'),'OPEN')
        self.assertGreaterEqual(float(attr(open_dot,'stroke-width')),1.4)
        self.assertEqual(attr(open_dot,'r'),attr(plain,'r'))                       # same radius as a filled point
        self.assertEqual((attr(plain,'fill'),attr(plain,'stroke')),('#111','black'))   # an option-less point is the old black dot

    def test_the_lattice_dots_wear_the_colour(self):
        dots=re.findall(r'<circle id="overlay-lattice-[^"]*"[^>]*/>',self.svg);self.assertEqual(len(dots),16)
        for dot in dots:self.assertEqual((attr(dot,'fill'),attr(dot,'stroke'),attr(dot,'r')),(PALETTE['BLUE']['line'],PALETTE['BLUE']['line'],'2.4'))

    def test_an_open_point_without_a_colour_is_a_black_ring(self):
        plan=fitted(plan_with([{'id':'c1','curveX':'1','unnamed':True,'marker':'OPEN'}]));node=circle(produce(plan)['svg'],'c1')
        self.assertEqual((attr(node,'fill'),attr(node,'stroke')),('#fff','black'))

    def test_a_coloured_filled_point_is_a_solid_dot_of_the_colour(self):
        plan=fitted(plan_with([{'id':'c1','curveX':'1','unnamed':True,'color':'VIOLET'}]));node=circle(produce(plan)['svg'],'c1')
        self.assertEqual((attr(node,'fill'),attr(node,'stroke')),(PALETTE['VIOLET']['line'],PALETTE['VIOLET']['line']))

class Observation(unittest.TestCase):
    def setUp(self):
        self.plan=fitted(plan_with(OPEN_ROSE,LATTICE));self.model=produce(self.plan)
    def errors(self,svg):return audit(self.plan,svg,self.model['transform'])['errors']
    def test_the_figure_passes(self):
        result=audit(self.plan,self.model['svg'],self.model['transform']);self.assertEqual(result['status'],'PASS',result['errors'])
    def test_an_open_point_drawn_filled_fails(self):
        node=circle(self.model['svg'],'c1');self.assertIn('OVERLAY_POINT_LOOK_MISMATCH:c1',self.errors(self.model['svg'].replace(node,node.replace('fill="#fff"','fill="#111"'))))
    def test_an_open_point_in_the_wrong_colour_fails(self):
        node=circle(self.model['svg'],'c1');self.assertIn('OVERLAY_POINT_LOOK_MISMATCH:c1',self.errors(self.model['svg'].replace(node,node.replace(GRAPH_COLOR_LINES['ROSE'],GRAPH_COLOR_LINES['BLUE']))))
    def test_a_thin_ring_fails(self):
        node=circle(self.model['svg'],'c1');self.assertIn('OVERLAY_POINT_LOOK_MISMATCH:c1',self.errors(self.model['svg'].replace(node,node.replace('stroke-width="1.8"','stroke-width="0.5"'))))
    def test_an_undeclared_colour_on_a_plain_point_fails(self):
        node=circle(self.model['svg'],'p');self.assertIn('OVERLAY_POINT_LOOK_MISMATCH:p',self.errors(self.model['svg'].replace(node,node.replace('fill="#111"','fill="'+GRAPH_COLOR_LINES['ROSE']+'"'))))
    def test_a_lattice_dot_in_the_wrong_colour_fails(self):
        node=circle(self.model['svg'],'overlay-lattice-x1y1')
        self.assertIn('OVERLAY_LATTICE_DOT_LOOK_MISMATCH:overlay-lattice-x1y1',self.errors(self.model['svg'].replace(node,node.replace(GRAPH_COLOR_LINES['BLUE'],'#111'))))
    def test_lattice_dots_that_should_be_plain_may_not_wear_a_colour(self):
        plan=fitted(plan_with([],{key:value for key,value in LATTICE.items() if key!='color'}));model=produce(plan);node=circle(model['svg'],'overlay-lattice-x1y1')
        self.assertIn('OVERLAY_LATTICE_DOT_LOOK_MISMATCH:overlay-lattice-x1y1',audit(plan,model['svg'].replace(node,node.replace('fill="#111"','fill="'+GRAPH_COLOR_LINES['BLUE']+'"')),model['transform'])['errors'])
    def test_an_unknown_colour_in_the_raw_plan_is_an_audit_error(self):
        plan=copy.deepcopy(self.plan);plan['overlays']['points'][0]['color']='teal'
        result=audit(plan,self.model['svg'],self.model['transform']);self.assertNotEqual(result['status'],'PASS')   # the observer cannot even read the claim

class SpecObjects(unittest.TestCase):
    """The semantic model (the spec every figure is drawn from) takes markerState OPEN and a palette colour on a POINT, and nothing else."""
    def objects(self,**extra):
        import test_plane_marks as pm
        points,objects=pm.parallelogram();return pm.spec_of(points,objects+[{'id':'Zp','kind':'POINT','at':[1,1],'name':'Z',**extra}])
    def test_hollow_and_coloured_points_validate_and_draw(self):
        from visual_engine.engine import build
        for extra in ({'markerState':'OPEN'},{'color':'ROSE'},{'markerState':'OPEN','color':'ROSE'}):
            validate(self.objects(**extra))
        node=circle(build(self.objects(markerState='OPEN',color='ROSE'))['svg'],'Zp')
        self.assertEqual((attr(node,'fill'),attr(node,'stroke'),attr(node,'data-state')),('#fff',PALETTE['ROSE']['line'],'OPEN'))
    def test_other_values_and_kinds_are_refused(self):
        for extra,code in (({'markerState':'FILLED'},'INVALID_POINT_MARKER_STATE'),({'markerState':'OPEN','marker':'NO_DOT'},'INVALID_POINT_MARKER_STATE'),({'color':'TEAL'},'INVALID_COLOR'),({'color':'rose'},'INVALID_COLOR')):
            with self.assertRaises(ValueError) as caught:validate(self.objects(**extra))
            self.assertEqual(str(caught.exception).split(':')[0],code)
        import test_plane_marks as pm
        points,objects=pm.parallelogram()
        with self.assertRaises(ValueError) as caught:validate(pm.spec_of(points,[{**o,'markerState':'OPEN'} if o['id']=='sAB' else o for o in objects]))
        self.assertEqual(str(caught.exception).split(':')[0],'INVALID_POINT_MARKER_STATE')

if __name__=='__main__':unittest.main()
