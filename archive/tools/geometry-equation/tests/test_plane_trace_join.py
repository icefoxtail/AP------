"""Construction traces (E8b): span JOIN draws one continuous arc through the stated intersections, labelAt puts the order label at the start / middle / end of the
arc or in a stated direction; the independent observer reads both back from the final SVG. No Chrome here: label boxes come from the build's own layout and are
written into the SVG as label groups by hand (tests/plane-trace-join.test.mjs runs the real pipeline)."""
import importlib.util
import json
import math
import re
import sys
import unittest
from pathlib import Path

GEOMETRY=Path(__file__).resolve().parents[1]
PRODUCTION=GEOMETRY/'production'
sys.path.insert(0,str(GEOMETRY))
sys.path.insert(0,str(PRODUCTION))
from visual_engine.engine import build

def observer_module():
    spec=importlib.util.spec_from_file_location('plane_marks_observer',PRODUCTION/'plane-marks-observer-worker.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
OBSERVER=observer_module()

def spec_of(points,objects):
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-9,'xMax':9,'yMin':-9,'yMax':9,'width':520,'height':420,'panel':0},   # the whole circle and room for a label round it
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':None,'marker':'NONE'} for k,v in points.items()]+objects}

def on_circle(degrees,radius=5.0):return (radius*math.cos(math.radians(degrees)),radius*math.sin(math.radians(degrees)))
POINTS={'A':(0.0,0.0),'R':on_circle(0),'S':on_circle(65)}

def text_group(label_id,box,text):
    return ('<g id="'+label_id+'" data-owner="x" data-fragment-sha="sha256:'+'0'*64+'" data-text="'+text+'" transform="translate(%.6f %.6f)">'%(box['x'],box['y'])+
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.3f" height="%.3f" viewBox="0 0 %.3f %.3f"><path d="M0 0 L5 0" fill="#111"/></svg></g>'%(box['width'],box['height'],box['width'],box['height']))

class Fixture:
    def __init__(self,points,objects,label_text='2 ㉤'):
        self.points=points;self.result=build(spec_of(points,objects));self.transform=self.result['witness']['coordinateModel']
        self.layout=self.result['witness']['layout'];self.boxes={row['id']:row['box'] for row in self.layout['labels']}
        self.base=re.sub(r'<text\s[^>]*id="tr-label"[^>]*>.*?</text>','',self.result['svg'],flags=re.S);self.text=label_text
    def svg(self,box=None):
        if 'tr-label' not in self.boxes and box is None:return self.base
        return self.base.replace('</svg>',text_group('tr-label',box or self.boxes['tr-label'],self.text)+'</svg>')
    def audit(self,svg=None,marks=None,points=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in (points or self.points).items()},'marks':marks,'segments':[],'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]

def trace_object(**extra):
    return {'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'R','through':['R','S'],'spanDeg':30,**extra}
def trace_mark(**extra):
    return {'traces':[{'id':'tr','center':'A','radius':{'point':'R'},'through':['R','S'],'spanDeg':30,**extra}]}

def polyline_points(svg,identifier):
    node=re.search(r'<polyline\s(?:[^>]*\s)?id="'+re.escape(identifier)+r'"[^>]*/>',svg).group(0)
    return node,[tuple(map(float,pair.split(','))) for pair in re.search(r'\spoints="([^"]*)"',node).group(1).split()]
def degrees_from(centre,q):return math.degrees(math.atan2(-(q[1]-centre[1]),q[0]-centre[0]))    # svg y grows downward: flip to model degrees

class JoinTests(unittest.TestCase):
    def setUp(self):
        self.fixture=Fixture(POINTS,[trace_object(span='JOIN')])
        m=self.fixture.transform;self.centre=(m['originX'],m['originY']);self.sx=m['sx']
    def test_join_draws_one_continuous_arc_that_covers_every_intersection_with_half_the_span_past_each_end(self):
        svg=self.fixture.result['svg'];self.assertNotIn('id="tr-2"',svg)
        _node,pts=polyline_points(svg,'tr-1')
        self.assertAlmostEqual(degrees_from(self.centre,pts[0]),-15.0,places=6)       # 15 degrees before R (0)
        self.assertAlmostEqual(degrees_from(self.centre,pts[-1]),80.0,places=6)        # 15 degrees past S (65)
        for q in pts:self.assertAlmostEqual(math.dist(q,self.centre),5.0*self.sx,places=6)
        self.assertIn('data-mark-count="1"',_node)
    def test_without_join_each_intersection_keeps_its_own_short_arc(self):
        plain=build(spec_of(POINTS,[trace_object()]))['svg']
        self.assertIn('id="tr-1"',plain);self.assertIn('id="tr-2"',plain)
        _node,pts=polyline_points(plain,'tr-1');self.assertAlmostEqual(degrees_from(self.centre,pts[0]),-15.0,places=6);self.assertAlmostEqual(degrees_from(self.centre,pts[-1]),15.0,places=6)
    def test_the_arc_runs_the_short_way_round_even_when_the_points_straddle_the_x_axis_cut(self):
        points={'A':(0.0,0.0),'R':on_circle(-40),'S':on_circle(50)}
        fixture=Fixture(points,[trace_object(span='JOIN',spanDeg=20)])
        _node,pts=polyline_points(fixture.result['svg'],'tr-1')
        m=fixture.transform;centre=(m['originX'],m['originY'])
        self.assertAlmostEqual(degrees_from(centre,pts[0]),-50.0,places=6);self.assertAlmostEqual(degrees_from(centre,pts[-1]),60.0,places=6)
    def test_the_genuine_join_passes_the_observer(self):
        report=self.fixture.audit(marks=trace_mark(span='JOIN'))
        self.assertEqual(report['errors'],[],report['errors'])
        row=next(item for item in report['observations'] if item['type']=='TRACE');self.assertEqual(row['span'],'JOIN');self.assertEqual(row['arcs'],1)
    def test_a_join_declared_but_two_short_arcs_drawn_is_refused(self):
        plain=Fixture(POINTS,[trace_object()])
        self.assertIn('TRACE_ARC_COUNT_MISMATCH',plain.codes(marks=trace_mark(span='JOIN')))
        self.assertIn('TRACE_ARC_COUNT_MISMATCH',self.fixture.codes(marks=trace_mark()))           # and the other way round
    def rewrite(self,change):
        svg=self.fixture.svg();node,pts=polyline_points(svg,'tr-1')
        return svg.replace(node,re.sub(r'(\spoints=")[^"]*(")',lambda m:m.group(1)+' '.join('%.9f,%.9f'%p for p in change(pts))+m.group(2),node),1)
    def test_tamper_a_join_arc_cut_short_or_started_late_or_off_the_circle(self):
        cut=self.rewrite(lambda pts:pts[:len(pts)//2])
        self.assertTrue({'TRACE_JOIN_SPAN_MISMATCH','TRACE_ARC_DOES_NOT_PASS_THROUGH'}&set(self.fixture.codes(svg=cut,marks=trace_mark(span='JOIN'))))
        late=self.rewrite(lambda pts:pts[len(pts)//5:])
        self.assertIn('TRACE_JOIN_SPAN_MISMATCH',self.fixture.codes(svg=late,marks=trace_mark(span='JOIN')))
        def grow(pts):
            cx,cy=self.centre;return [(cx+(x-cx)*1.15,cy+(y-cy)*1.15) for x,y in pts]
        self.assertIn('TRACE_ARC_RADIUS_MISMATCH',self.fixture.codes(svg=self.rewrite(grow),marks=trace_mark(span='JOIN')))
    def test_tamper_a_wider_spanDeg_than_declared(self):
        self.assertIn('TRACE_JOIN_SPAN_MISMATCH',self.fixture.codes(marks=trace_mark(span='JOIN',spanDeg=60)))
    def test_a_one_point_join_is_the_ordinary_trace(self):
        single={'A':(0.0,0.0),'R':on_circle(0)}
        svg=build(spec_of(single,[{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'R','through':['R'],'spanDeg':30,'span':'JOIN'}]))['svg']
        _node,pts=polyline_points(svg,'tr-1');self.assertGreater(len(pts),8)
    def test_refusals(self):
        far={'A':(0.0,0.0),**{name:on_circle(60*k) for k,name in enumerate('RSTUVW')}}     # six points round the circle: no gap larger than 60 degrees to leave out
        cases=[([{**trace_object(span='JOIN',through=list('RSTUVW'),spanDeg=24)}],far,'TRACE_JOIN_TOO_WIDE:tr'),
               ([trace_object(span='LONG')],POINTS,'TRACE_SPAN_INVALID:tr'),
               ([trace_object(labelAt='MIDDLE',labelText='1',labelKind='TEXT')],POINTS,'TRACE_LABEL_AT_INVALID:tr'),
               ([trace_object(labelAt=True,labelText='1',labelKind='TEXT')],POINTS,'TRACE_LABEL_AT_INVALID:tr'),
               ([trace_object(labelAt='END')],POINTS,'TRACE_LABEL_AT_NEEDS_LABEL:tr')]
        for objects,points,code in cases:
            with self.assertRaises(ValueError,msg=code) as caught:build(spec_of(points,objects))
            self.assertEqual(str(caught.exception),code)

class LabelAtTests(unittest.TestCase):
    """The order label stands outside the circle at the named place round it."""
    def fixture(self,**extra):return Fixture(POINTS,[trace_object(span='JOIN',labelText='2 ㉤',labelKind='TEXT',**extra)])
    def direction_of_label(self,fixture):
        m=fixture.transform;box=fixture.boxes['tr-label'];centre=(m['originX'],m['originY'])
        return degrees_from(centre,(box['x']+box['width']/2,box['y']+box['height']/2))
    def distance_of_label(self,fixture,angle):
        return abs(((self.direction_of_label(fixture)-angle)+180)%360-180)
    def test_start_mid_end_and_a_direction_put_the_label_near_that_place(self):
        for at,angle in (('START',-15.0),('MID',32.5),('END',80.0),(200.0,200.0),(-90,-90.0)):
            fixture=self.fixture(labelAt=at)
            self.assertEqual(fixture.layout['unresolved'],[],at)
            self.assertLess(self.distance_of_label(fixture,angle),40.0,(at,self.direction_of_label(fixture)))
            m=fixture.transform;box=fixture.boxes['tr-label'];centre=(m['originX'],m['originY'])
            self.assertGreater(math.dist(centre,(box['x']+box['width']/2,box['y']+box['height']/2)),5.0*m['sx'],'outside the circle')
    def test_a_joined_arc_without_labelAt_labels_its_middle(self):
        fixture=self.fixture();self.assertLess(self.distance_of_label(fixture,32.5),40.0)
    def test_the_old_default_is_unchanged_without_join_or_labelAt(self):
        a=build(spec_of(POINTS,[trace_object(labelText='2 ㉤',labelKind='TEXT')]))
        b=build(spec_of(POINTS,[trace_object(labelText='2 ㉤',labelKind='TEXT')]))
        self.assertEqual(a['svg'],b['svg'])
        label=next(row for row in a['witness']['layout']['labels'] if row['id']=='tr-label');self.assertEqual(tuple(label['directions']),('E','NE','N','SE','S','NW','W','SW'))
    def test_the_observer_checks_the_label_against_its_named_place(self):
        fixture=self.fixture(labelAt='START');marks=trace_mark(span='JOIN',labelAt='START',label='2 ㉤',labelKind='TEXT')
        self.assertEqual(fixture.audit(marks=marks)['errors'],[])
        self.assertIn('TRACE_LABEL_NOT_AT_ANCHOR',fixture.codes(marks=trace_mark(span='JOIN',labelAt='END',label='2 ㉤',labelKind='TEXT')))
        self.assertIn('TRACE_LABEL_NOT_AT_ANCHOR',fixture.codes(marks=trace_mark(span='JOIN',labelAt=150,label='2 ㉤',labelKind='TEXT')))
        self.assertEqual(fixture.audit(marks=trace_mark(span='JOIN',labelAt=-20,label='2 ㉤',labelKind='TEXT'))['errors'],[])
    def test_tamper_a_label_moved_to_the_other_end(self):
        fixture=self.fixture(labelAt='START');marks=trace_mark(span='JOIN',labelAt='START',label='2 ㉤',labelKind='TEXT')
        other=self.fixture(labelAt='END').boxes['tr-label']
        self.assertIn('TRACE_LABEL_NOT_AT_ANCHOR',fixture.codes(svg=fixture.svg(other),marks=marks))

if __name__=='__main__':unittest.main()
