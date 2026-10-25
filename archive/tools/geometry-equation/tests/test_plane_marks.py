"""Plane-figure marks: the POLAR_POINT construction op, the engine's mark primitives, and the independent observer with tamper cases.
No Chrome here: labels are exercised by tests/plane-marks.test.mjs."""
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
import construction

def observer_module():
    spec=importlib.util.spec_from_file_location('plane_marks_observer',PRODUCTION/'plane-marks-observer-worker.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
OBSERVER=observer_module()

def integer(value):return {'kind':'integer','value':str(value)}
def source(identifier,x,y):return {'id':identifier,'op':'SOURCE_POINT','inputs':[],'args':{'coordinates':[integer(x),integer(y)]},'outputType':'POINT','factRole':'GIVEN'}
def polar(identifier,center,reference,length,angle,turn='CCW'):return {'id':identifier,'op':'POLAR_POINT','inputs':[center,reference],'args':{'length':integer(length),'angleDeg':integer(angle),'turn':turn},'outputType':'POINT','factRole':'GIVEN'}
def plane(nodes):return {'schemaVersion':'construction-spike-v1','realization':{'recipeId':'PLANE_FIGURE_v1','unit':'source-length','reflectionEquivalent':False},'nodes':nodes}

class PolarPointTests(unittest.TestCase):
    def test_non_special_angle_is_computed_to_high_precision(self):
        model=construction.execute(plane([source('B',0,0),source('C',6,0),polar('A','B','C',4,40)]))
        x,y=model['points']['A']['approximation']
        self.assertAlmostEqual(x,4*math.cos(math.radians(40)),places=14);self.assertAlmostEqual(y,4*math.sin(math.radians(40)),places=14)
        self.assertEqual(model['points']['A']['exact'][0]['kind'],'decimal')   # no short closed form: a 34 digit decimal, never a fake exact value
        self.assertEqual(model['coordinateMode'],'CONSTRUCTED_REALIZATION')
    def test_special_angle_keeps_an_exact_value(self):
        model=construction.execute(plane([source('B',0,0),source('C',6,0),polar('A','B','C',6,30),polar('D','B','C',2,90,'CW')]))
        self.assertEqual(model['points']['A']['exact'][0],{'kind':'expression','op':'mul','args':[{'kind':'integer','value':'3'},{'kind':'expression','op':'sqrt','args':[{'kind':'integer','value':'3'}]}]})
        self.assertEqual(model['points']['D']['exact'],[{'kind':'integer','value':'0'},{'kind':'integer','value':'-2'}])
    def test_turn_direction(self):
        model=construction.execute(plane([source('B',0,0),source('C',6,0),polar('A','B','C',1,40,'CCW'),polar('D','B','C',1,40,'CW')]))
        self.assertGreater(model['points']['A']['approximation'][1],0);self.assertLess(model['points']['D']['approximation'][1],0)
    def test_error_codes(self):
        cases=[(polar('A','B','C',0,40),'INVALID_POLAR_LENGTH'),(polar('A','B','C',4,0),'INVALID_POLAR_ANGLE'),(polar('A','B','C',4,360),'INVALID_POLAR_ANGLE'),
               (polar('A','B','C',4,40,'SIDEWAYS'),'INVALID_POLAR_TURN'),(polar('A','B','B',4,40),'DEGENERATE_POLAR_REFERENCE')]
        for node,code in cases:
            with self.assertRaises(ValueError,msg=code) as caught:construction.execute(plane([source('B',0,0),source('C',6,0),node]))
            self.assertEqual(str(caught.exception),code)
    def test_plane_figure_recipe_rules(self):
        helper={'id':'O','op':'NORMALIZATION_ORIGIN','inputs':[],'args':{},'outputType':'POINT','factRole':'GIVEN'}
        with self.assertRaises(ValueError) as caught:construction.execute(plane([helper,source('B',0,0)]))
        self.assertEqual(str(caught.exception),'PLANE_FIGURE_HAS_FRAME_HELPERS')
        with self.assertRaises(ValueError) as caught:construction.execute(plane([{'id':'H','op':'MIDPOINT','inputs':[],'args':{},'outputType':'POINT','factRole':'GIVEN'}]))
        graph=plane([source('B',0,0)]);graph['realization']['reflectionEquivalent']=True
        with self.assertRaises(ValueError) as caught:construction.execute(graph)
        self.assertEqual(str(caught.exception),'REALIZATION_RECIPE_REQUIRED')

# ---- engine + observer on a hand-made spec (no labels: the label boxes are measured only in Chrome)
def spec_of(points,objects):
    xs=[p[0] for p in points.values()];ys=[p[1] for p in points.values()];pad=max(max(xs)-min(xs),max(ys)-min(ys))*.1
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':min(xs)-pad,'xMax':max(xs)+pad,'yMin':min(ys)-pad,'yMax':max(ys)+pad,'width':520,'height':420,'panel':0},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':k} for k,v in points.items()]+objects}
def seg(identifier,points,a,b,**extra):return {'id':identifier,'kind':'SEGMENT','from':list(points[a]),'to':list(points[b]),**extra}

def parallelogram():
    d=(0.0,0.0);c=(9.0,0.0);a=(6*math.cos(math.radians(70)),6*math.sin(math.radians(70)));b=(a[0]+9,a[1])
    pts={'A':a,'B':b,'C':c,'D':d}
    objects=[seg('sAB',pts,'A','B'),seg('sBC',pts,'B','C'),seg('sCD',pts,'C','D'),seg('sDA',pts,'D','A'),
             {'id':'p1','kind':'PARALLEL_MARK','refs':['sAB','sCD'],'count':1},{'id':'p2','kind':'PARALLEL_MARK','refs':['sBC','sDA'],'count':2},
             {'id':'e1','kind':'EQUAL_MARK','refs':['sBC','sDA'],'count':2},
             {'id':'aD','kind':'ANGLE_MARK','refs':['A','D','C'],'value':70.0,'arcs':1},{'id':'aC','kind':'ANGLE_MARK','refs':['D','C','B'],'value':110.0,'arcs':2},
             {'id':'aOut','kind':'ANGLE_MARK','refs':['A','D','C'],'value':290.0,'arcs':3,'outer':True,'ring':2}]
    return pts,objects
MARKS={'angles':[{'id':'aD','refs':['A','D','C'],'value':70,'noLabel':True},{'id':'aC','refs':['D','C','B'],'value':110,'arcs':2,'noLabel':True},
                 {'id':'aOut','refs':['A','D','C'],'side':'OUTER','value':290,'arcs':3,'ring':2,'noLabel':True}],
       'equalLengths':[{'id':'e1','count':2,'segments':['sBC','sDA']}],
       'parallels':[{'id':'p1','count':1,'segments':['sAB','sCD']},{'id':'p2','count':2,'segments':['sBC','sDA']}]}
SEGMENTS=[{'id':'sAB','refs':['A','B']},{'id':'sBC','refs':['B','C']},{'id':'sCD','refs':['C','D']},{'id':'sDA','refs':['D','A']}]

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.points,objects=parallelogram();cls.result=build(spec_of(cls.points,objects));cls.svg=cls.result['svg']
        cls.transform=cls.result['witness']['coordinateModel']
    def audit(self,svg=None,points=None,marks=None,segments=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':points or {k:list(v) for k,v in self.points.items()},'marks':marks if marks is not None else MARKS,'segments':segments if segments is not None else SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]

    def test_genuine_figure_passes(self):
        report=self.audit();self.assertEqual(report['errors'],[]);self.assertEqual(report['status'],'PASS')
        by_id={row['id']:row for row in report['observations']}
        self.assertAlmostEqual(by_id['aD']['drawnDegrees'],70,places=6);self.assertAlmostEqual(by_id['aOut']['drawnDegrees'],290,places=6)
        self.assertEqual(by_id['aC']['arcs'],2)
    def test_outer_angle_is_the_reflex_side(self):
        wrong=json.loads(json.dumps(MARKS));wrong['angles'][2]['side']='INNER'
        self.assertIn('ANGLE_MARK_FACT_MISMATCH',self.codes(marks=wrong))
    def test_declared_value_must_match_the_drawn_angle(self):
        wrong=json.loads(json.dumps(MARKS));wrong['angles'][0]['value']=75
        self.assertIn('ANGLE_MARK_FACT_MISMATCH',self.codes(marks=wrong))
        near=json.loads(json.dumps(MARKS));near['angles'][0]['value']=70.4
        self.assertEqual(self.codes(marks=near),[])
    def tamper(self,element_id,function):
        """Replace one element's tag by function(tag); the rest of the final SVG is untouched."""
        match=re.search(r'<(?:polyline|line|polygon)\s(?:[^>]*\s)?id="'+re.escape(element_id)+r'"[^>]*/>',self.svg)
        self.assertIsNotNone(match,element_id)
        return self.svg.replace(match.group(0),function(match.group(0)),1)
    def shift_points(self,dx,dy,only_last=False):
        def apply(tag):
            attribute=re.search(r'\spoints="([^"]*)"',tag)
            pairs=[tuple(map(float,part.split(','))) for part in attribute.group(1).split()]
            pairs=[(x+dx,y+dy) if (not only_last or i==len(pairs)-1) else (x,y) for i,(x,y) in enumerate(pairs)]
            return tag.replace(attribute.group(0),' points="'+' '.join('%.9f,%.9f'%p for p in pairs)+'"')
        return apply
    def shift_line(self,dx,dy):
        def apply(tag):
            for name,delta in (('x1',dx),('x2',dx),('y1',dy),('y2',dy)):
                attribute=re.search(r'\s'+name+'="([^"]*)"',tag);tag=tag.replace(attribute.group(0),' %s="%.6f"'%(name,float(attribute.group(1))+delta))
            return tag
        return apply
    def test_tamper_moving_an_angle_arc_off_its_vertex(self):
        self.assertIn('ANGLE_ARC_NOT_AT_VERTEX',self.codes(svg=self.tamper('aD-arc-1',self.shift_points(6,0))))
    def test_tamper_dragging_the_end_of_an_arc_changes_the_measured_angle(self):
        codes=self.codes(svg=self.tamper('aC-arc-1',self.shift_points(0,-9,only_last=True)))
        self.assertTrue({'ANGLE_ARC_RAY_MISMATCH','ANGLE_MARK_FACT_MISMATCH','ANGLE_ARC_NOT_AT_VERTEX'}&set(codes),codes)
    def test_tamper_moving_a_point_changes_the_angle_the_marks_state(self):
        points={k:list(v) for k,v in self.points.items()};points['A']=[points['A'][0]-1.5,points['A'][1]]   # the peer's A moved: arc and rays no longer agree
        self.assertTrue({'ANGLE_MARK_FACT_MISMATCH','ANGLE_ARC_RAY_MISMATCH'}&set(self.codes(points=points)))
    def test_tamper_equal_tick_moved_off_its_segment(self):
        self.assertIn('EQUAL_MARK_NOT_ON_SEGMENT',self.codes(svg=self.tamper('e1-sBC-1',self.shift_line(0,9))))
    def test_unequal_segments_cannot_carry_an_equal_mark(self):
        wrong=json.loads(json.dumps(MARKS));wrong['equalLengths'][0]['segments']=['sBC','sCD']
        self.assertIn('EQUAL_MARK_MISSING',self.codes(marks=wrong))   # the engine drew ticks on sBC and sDA; sCD has none
        points={k:list(v) for k,v in self.points.items()};points['A']=[points['A'][0],points['A'][1]+2]
        self.assertIn('EQUAL_MARK_LENGTH_MISMATCH',self.codes(points=points))
    def test_non_parallel_segments_cannot_carry_a_parallel_mark(self):
        wrong=json.loads(json.dumps(MARKS));wrong['parallels']=[{'id':'p1','count':1,'segments':['sAB','sBC']}]
        codes=self.codes(marks=wrong);self.assertTrue({'PARALLEL_MARK_NOT_PARALLEL','PARALLEL_MARK_MISSING','UNDECLARED_MARK'}&set(codes),codes)
    def test_tamper_parallel_arrow_turned_away_from_its_segment(self):
        self.assertIn('PARALLEL_MARK_ARROW_NOT_ALONG_SEGMENT',self.codes(svg=self.tamper('p1-sAB-1',self.shift_points(0,6,only_last=True))))
    def test_undeclared_mark_is_rejected(self):
        less=json.loads(json.dumps(MARKS));less['parallels']=less['parallels'][:1]
        self.assertIn('UNDECLARED_MARK',self.codes(marks=less))
    def test_dash_and_arrow_styles_are_observed(self):
        pts={'A':(0.0,0.0),'B':(6.0,0.0),'C':(6.0,4.0)}
        objects=[seg('sAB',pts,'A','B',arrow='END'),seg('sBC',pts,'B','C',dash=True)]
        result=build(spec_of(pts,objects));transform=result['witness']['coordinateModel']
        base={'svg':result['svg'],'points':{k:list(v) for k,v in pts.items()},'marks':{},'transform':transform}
        good=OBSERVER.audit({**base,'segments':[{'id':'sAB','refs':['A','B'],'arrow':'END'},{'id':'sBC','refs':['B','C'],'dashed':True}]})
        self.assertEqual(good['errors'],[])
        bad=OBSERVER.audit({**base,'segments':[{'id':'sAB','refs':['A','B'],'arrow':'BOTH'},{'id':'sBC','refs':['B','C']}]})
        self.assertTrue({'SEGMENT_ARROW_MISSING','SEGMENT_DASH_UNDECLARED'}<={e.split(':')[0] for e in bad['errors']},bad['errors'])
        moved=result['svg'].replace('<polygon id="sAB-arrow-end"','<polygon transform-unused="1" id="sAB-arrow-end"')
        shifted=re.sub(r'(<polygon id="sAB-arrow-end"[^>]*points=")([^"]*)(")',lambda m:m.group(1)+' '.join('%.6f,%.6f'%(float(p.split(',')[0])+5,float(p.split(',')[1])) for p in m.group(2).split())+m.group(3),result['svg'])
        again=OBSERVER.audit({**base,'svg':shifted,'segments':[{'id':'sAB','refs':['A','B'],'arrow':'END'},{'id':'sBC','refs':['B','C'],'dashed':True}]})
        self.assertIn('SEGMENT_ARROW_TIP_OFF_END',[e.split(':')[0] for e in again['errors']])

class EngineErrorTests(unittest.TestCase):
    def test_engine_refuses_false_equal_and_parallel_marks(self):
        pts,objects=parallelogram()
        for bad,code in ((lambda o:o.update(refs=['sBC','sCD']) if o['id']=='e1' else None,'EQUAL_MARK_LENGTH_MISMATCH'),(lambda o:o.update(refs=['sAB','sBC']) if o['id']=='p1' else None,'PARALLEL_MARK_NOT_PARALLEL')):
            copy=json.loads(json.dumps(objects))
            for o in copy:bad(o)
            with self.assertRaises(ValueError) as caught:build(spec_of(pts,copy))
            self.assertTrue(str(caught.exception).startswith(code),str(caught.exception))
    def test_engine_refuses_a_false_angle_value(self):
        pts,objects=parallelogram()
        for o in objects:
            if o['id']=='aD':o['value']=75.0
        with self.assertRaises(ValueError) as caught:build(spec_of(pts,objects))
        self.assertTrue(str(caught.exception).startswith('UNVERIFIED_SEMANTIC_MARK'))
    def test_marks_on_a_short_segment_are_refused(self):
        pts={'A':(0.0,0.0),'B':(0.2,0.0),'C':(0.4,0.0),'D':(6.0,4.0)}
        objects=[seg('sAB',pts,'A','B'),seg('sBC',pts,'B','C'),seg('sCD',pts,'C','D'),{'id':'e1','kind':'EQUAL_MARK','refs':['sAB','sBC'],'count':1}]
        with self.assertRaises(ValueError) as caught:build(spec_of(pts,objects))
        self.assertTrue(str(caught.exception).startswith('MARK_SEGMENT_TOO_SHORT'),str(caught.exception))

if __name__=='__main__':unittest.main()
