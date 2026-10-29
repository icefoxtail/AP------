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
from visual_engine.semantic_model import validate
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
    def test_default_style_is_a_light_sector_under_the_strokes(self):
        report=self.audit();by_id={row['id']:row for row in report['observations']}
        for oid,degrees in (('aD',70),('aC',110),('aOut',290)):
            self.assertIn(oid+'-sector',by_id)
            self.assertEqual(by_id[oid+'-sector']['type'],'ANGLE_SECTOR');self.assertTrue(by_id[oid+'-sector']['atVertex'])
            self.assertAlmostEqual(by_id[oid+'-sector']['drawnDegrees'],degrees,places=6)
        for oid,arcs in (('aD',1),('aC',2),('aOut',3)):
            wedge=re.search(r'<polygon\s(?:[^>]*\s)?id="'+oid+r'-sector"[^>]*/>',self.svg)
            self.assertIsNotNone(wedge);tag=wedge.group(0)
            self.assertIn('data-role="angleSector"',tag);self.assertIn('fill="#d9d9d9"',tag);self.assertIn('stroke="none"',tag)
            self.assertLess(self.svg.index('id="'+oid+'-sector"'),self.svg.index('id="'+oid+'-arc-1"'))
            # the fill boundary is exactly the outermost arc stroke
            outer=re.search(r'<polyline\s(?:[^>]*\s)?id="'+oid+r'-arc-'+str(arcs)+r'"[^>]*/>',self.svg)
            wedge_pairs=[tuple(map(float,part.split(','))) for part in re.search(r'\spoints="([^"]*)"',tag).group(1).split()]
            outer_pairs=[tuple(map(float,part.split(','))) for part in re.search(r'\spoints="([^"]*)"',outer.group(0)).group(1).split()]
            self.assertEqual(wedge_pairs[1:],outer_pairs)
            vertex=wedge_pairs[0];radius=math.dist(vertex,outer_pairs[0])
            self.assertTrue(all(abs(math.dist(vertex,p)-radius)<1e-6 for p in wedge_pairs[1:]))
    def test_style_arc_is_stroke_only_and_the_declared_style_must_match(self):
        _,objects=parallelogram()
        for row in objects:
            if row['kind']=='ANGLE_MARK':row['style']='ARC'
        arc=build(spec_of(self.points,objects));transform=arc['witness']['coordinateModel']
        self.assertNotIn('-sector"',arc['svg'])
        base={'points':{k:list(v) for k,v in self.points.items()},'segments':SEGMENTS}
        missing=OBSERVER.audit({**base,'svg':arc['svg'],'marks':MARKS,'transform':transform})
        self.assertIn('ANGLE_SECTOR_MISSING',[error.split(':')[0] for error in missing['errors']])
        unexpected=OBSERVER.audit({**base,'svg':self.svg,'marks':dict(MARKS,angles=[{**row,'style':'ARC'} for row in MARKS['angles']]),'transform':self.transform})
        self.assertIn('ANGLE_SECTOR_UNEXPECTED',[error.split(':')[0] for error in unexpected['errors']])
    def rewrite_sector(self,identifier,change):
        """Rewrite the sector polygon's points: change([(x,y),...]) -> [(x,y),...] (screen px)."""
        match=re.search(r'<polygon\s(?:[^>]*\s)?id="'+re.escape(identifier)+r'"[^>]*/>',self.svg)
        self.assertIsNotNone(match,identifier);tag=match.group(0)
        attribute=re.search(r'\spoints="([^"]*)"',tag)
        pairs=[tuple(map(float,part.split(','))) for part in attribute.group(1).split()]
        return self.svg.replace(tag,tag.replace(attribute.group(0),' points="'+' '.join('%.9f,%.9f'%p for p in change(pairs))+'"'),1)
    def test_tamper_a_rotated_sector_leaves_its_rays(self):
        def rotate(pairs):
            (vx,vy),t=pairs[0],math.radians(8)
            return [pairs[0]]+[(vx+(x-vx)*math.cos(t)-(y-vy)*math.sin(t),vy+(x-vx)*math.sin(t)+(y-vy)*math.cos(t)) for x,y in pairs[1:]]
        self.assertIn('ANGLE_SECTOR_RAY_MISMATCH',self.codes(svg=self.rewrite_sector('aD-sector',rotate)))
    def test_tamper_a_sector_on_the_wrong_side_fills_between_the_wrong_rays(self):
        flipped=self.rewrite_sector('aC-sector',lambda pairs:[pairs[0]]+pairs[1:][::-1])
        codes=self.codes(svg=flipped);self.assertTrue({'ANGLE_SECTOR_SIDE_MISMATCH','ANGLE_SECTOR_RAY_MISMATCH'}&set(codes),codes)
    def test_tamper_a_sector_of_the_wrong_radius_is_refused(self):
        def scale(pairs):
            (vx,vy)=pairs[0];return [pairs[0]]+[(vx+(x-vx)*1.25,vy+(y-vy)*1.25) for x,y in pairs[1:]]
        self.assertIn('ANGLE_SECTOR_RADIUS_MISMATCH',self.codes(svg=self.rewrite_sector('aOut-sector',scale)))
    def test_tamper_a_sector_drawn_over_a_stroke_is_refused(self):
        match=re.search(r'<polygon\s(?:[^>]*\s)?id="aD-sector"[^>]*/>',self.svg);tag=match.group(0)
        raised=self.svg.replace(tag,'',1).replace('</svg>',tag+'</svg>')
        self.assertIn('ANGLE_SECTOR_NOT_BENEATH_STROKES',self.codes(svg=raised))
    def test_right_angle_square_is_unchanged_and_has_no_sector(self):
        pts={'A':(0.0,0.0),'B':(6.0,0.0),'C':(6.0,4.0)}
        objects=[seg('sAB',pts,'A','B'),seg('sBC',pts,'B','C'),{'id':'r1','kind':'ANGLE_MARK','refs':['A','B','C'],'value':90.0}]
        spec=spec_of(pts,objects);spec['displayFacts']={'squareAngleIds':['r1']}
        result=build(spec)
        self.assertIsNotNone(re.search(r'<polyline\s(?:[^>]*\s)?id="r1"',result['svg']))
        self.assertNotIn('r1-sector',result['svg'])
    def test_engine_refuses_an_unknown_angle_style(self):
        _,objects=parallelogram()
        for row in objects:
            if row['id']=='aD':row['style']='FILL'
        with self.assertRaises(ValueError) as caught:build(spec_of(self.points,objects))
        self.assertTrue(str(caught.exception).startswith('ANGLE_MARK_STYLE_INVALID'),str(caught.exception))
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

class TraceTests(unittest.TestCase):
    """Construction traces: a thin arc of one declared radius around each intersection, checked by the independent observer."""
    def setUp(self):
        self.points={'A':(0.0,0.0),'B':(5.0,0.0),'P':(3.0,4.0)}
        self.objects=[{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'B','through':['P'],'spanDeg':30}]
        self.result=build(spec_of(self.points,self.objects));self.svg=self.result['svg'];self.transform=self.result['witness']['coordinateModel']
        self.marks={'traces':[{'id':'tr','center':'A','radius':{'point':'B'},'through':['P'],'spanDeg':30}]}
    def audit(self,svg=None,points=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':points or {k:list(v) for k,v in self.points.items()},'marks':marks if marks is not None else self.marks,'segments':[],'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def tag(self,identifier):return re.search(r'<polyline\s(?:[^>]*\s)?id="'+re.escape(identifier)+r'"[^>]*/>',self.svg).group(0)
    def rewrite(self,identifier,change):
        tag=self.tag(identifier);attribute=re.search(r'\spoints="([^"]*)"',tag)
        pairs=[tuple(map(float,part.split(','))) for part in attribute.group(1).split()]
        return self.svg.replace(tag,tag.replace(attribute.group(0),' points="'+' '.join('%.9f,%.9f'%p for p in change(pairs))+'"'),1)
    def test_genuine_trace_passes_and_the_arc_is_thin_and_undashed(self):
        report=self.audit();self.assertEqual(report['errors'],[]);self.assertEqual(report['status'],'PASS')
        row=next(item for item in report['observations'] if item['type']=='TRACE')
        self.assertEqual(row['id'],'tr');self.assertAlmostEqual(row['radius'],5.0,places=9);self.assertEqual(row['through'],['P'])
        self.assertIn('stroke-width="1',self.svg);self.assertNotIn('stroke-dasharray',self.tag('tr-1'))
    def test_tamper_an_arc_of_the_wrong_radius_or_off_its_intersection(self):
        def scale(pairs):
            (cx,cy)=pairs[0]
            return [(cx+(x-cx)*1.2,cy+(y-cy)*1.2) for x,y in pairs]
        self.assertIn('TRACE_ARC_RADIUS_MISMATCH',self.codes(svg=self.rewrite('tr-1',scale)))
        center=(self.transform['originX']+self.points['A'][0]*self.transform['sx'],self.transform['originY']-self.points['A'][1]*self.transform['sy'])
        def rotate(pairs):
            (cx,cy)=center;t=math.radians(25)
            return [(cx+(x-cx)*math.cos(t)-(y-cy)*math.sin(t),cy+(x-cx)*math.sin(t)+(y-cy)*math.cos(t)) for x,y in pairs]
        codes=self.codes(svg=self.rewrite('tr-1',rotate));self.assertTrue({'TRACE_ARC_DOES_NOT_PASS_THROUGH','TRACE_ARC_RADIUS_MISMATCH'}&set(codes),codes)
    def test_tamper_dashed_thick_or_missing_arc(self):
        self.assertIn('TRACE_ARC_DASHED',self.codes(svg=self.svg.replace('<polyline id="tr-1"','<polyline id="tr-1" stroke-dasharray="4 3"')))
        self.assertIn('TRACE_ARC_TOO_THICK',self.codes(svg=re.sub(r'stroke-width="1(?:\.0)?"','stroke-width="3"',self.svg)))
        self.assertIn('TRACE_ARC_MISSING',self.codes(svg=self.svg.replace(self.tag('tr-1'),'')))
    def test_tamper_a_false_radius_or_an_undeclared_trace(self):
        wider={'traces':[{'id':'tr','center':'A','radius':{'segment':'sAB'},'through':['P'],'spanDeg':30}]}
        self.assertIn('TRACE_RADIUS_MISSING',self.codes(marks=wider))     # no such segment is passed
        points={k:list(v) for k,v in self.points.items()};points['P']=[4.0,4.0]
        self.assertIn('TRACE_TARGET_NOT_ON_ARC',self.codes(points=points))
        self.assertIn('UNDECLARED_MARK',self.codes(marks={'traces':[]}))
    def test_engine_refuses_a_trace_that_does_not_match_its_points(self):
        off=dict(self.points);off['Q']=(4.0,4.0)
        with self.assertRaises(ValueError) as caught:build(spec_of(off,[{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'B','through':['Q']}]))
        self.assertEqual(str(caught.exception),'TRACE_TARGET_NOT_ON_ARC:Q')
        cases=[([{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'B','through':['A'],'spanDeg':30}],'TRACE_TARGETS_DEGENERATE:tr'),
               ([{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'A','through':['P'],'spanDeg':30}],'TRACE_ARC_RADIUS_REQUIRED:tr'),
               ([{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'B','through':['P'],'spanDeg':200}],'TRACE_SPAN_INVALID:tr'),
               ([{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'B','radiusSegment':'sAB','through':['P']}],'TRACE_ARC_RADIUS_REQUIRED:tr'),
               ([{'id':'tr','kind':'TRACE_ARC','centerPoint':'A','radiusPoint':'B','through':'P'}],'TRACE_ARC_POINT_REFS_REQUIRED:tr')]
        for objects,code in cases:
            with self.assertRaises(ValueError,msg=code) as caught:build(spec_of(self.points,objects))
            self.assertEqual(str(caught.exception),code)

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

# ---- visible region markers on the FINAL SVG: a real hatch clipped to its region, and a label owned by one region (no Chrome: label boxes are
# synthetic fragment groups, glyph shapes are covered by tests/visible-region-markers.test.mjs)
def rect_loop(a,b,c,d):return {'start':a,'steps':[{'to':b},{'to':c},{'to':d},{'to':a}]}
HATCH_LINE=re.compile(r'<line id="ring-hatch-\d+"[^>]*data-mark="region-hatch"[^>]*/>')

class HatchPatternTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.points={'A':(0.0,-3.0),'B':(8.0,-3.0),'C':(8.0,3.0),'D':(0.0,3.0),'E':(2.0,-1.0),'F':(5.0,-1.0),'G':(5.0,1.0),'H':(2.0,1.0)}
        segments=[('sAB','A','B'),('sBC','B','C'),('sCD','C','D'),('sDA','D','A'),('sEF','E','F'),('sFG','F','G'),('sGH','G','H'),('sHE','H','E')]
        objects=[seg(i,cls.points,a,b) for i,a,b in segments]
        objects.append({'id':'ring','kind':'FILL_REGION','fill':'LIGHT','pattern':'HATCH','loops':[rect_loop('A','B','C','D'),rect_loop('E','F','G','H')]})
        cls.result=build(spec_of(cls.points,objects));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
        cls.segments=[{'id':i,'refs':[a,b]} for i,a,b in segments]
        cls.marks={'regions':[{'id':'ring','fill':'LIGHT','pattern':'HATCH','shapes':[{'polygon':['A','B','C','D']}],'holes':[{'polygon':['E','F','G','H']}]}]}
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':{k:list(v) for k,v in self.points.items()},
                               'marks':marks if marks is not None else self.marks,'segments':self.segments,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def test_hatch_is_a_real_clipped_pattern_above_its_fill(self):
        report=self.audit();self.assertEqual(report['errors'],[])
        rows={row['id']:row for row in report['observations'] if row['type']=='REGION_HATCH'}
        self.assertGreaterEqual(rows['ring']['strokes'],3)
        tags=HATCH_LINE.findall(self.svg);self.assertEqual(len(tags),rows['ring']['strokes'])
        self.assertTrue(all('stroke-width="0.8"' in tag for tag in tags))
        self.assertLess(self.svg.index(tags[0]),self.svg.index('id="sAB"'))
        self.assertGreater(self.svg.index(tags[0]),self.svg.index('id="ring"'))
    def test_tamper_missing_outside_uneven_dashed_or_covered_hatch(self):
        tags=HATCH_LINE.findall(self.svg)
        stripped=self.svg
        for tag in tags:stripped=stripped.replace(tag,'')
        self.assertIn('REGION_HATCH_MISSING',self.codes(svg=stripped))
        # one stroke's start pushed far outside the region
        shifted=self.svg.replace(tags[1],re.sub(r'y1="([-\d.]+)"',lambda m:'y1="%s"'%(float(m.group(1))+400),tags[1]))
        self.assertIn('REGION_HATCH_OUTSIDE',self.codes(svg=shifted))
        # one stroke translated across its neighbours: every gap is no longer the same
        uneven=self.svg.replace(tags[1],re.sub(r'(y[12])="([-\d.]+)"',lambda m:'%s="%s"'%(m.group(1),float(m.group(2))+2),tags[1]))
        self.assertIn('REGION_HATCH_UNEVEN',self.codes(svg=uneven))
        dashed=self.svg.replace(tags[0],tags[0].replace('/>',' stroke-dasharray="4 3"/>'))
        self.assertIn('REGION_HATCH_DASHED',self.codes(svg=dashed))
        fill=re.search(r'<path id="ring"[^>]*/>',self.svg).group(0)
        sunk=stripped.replace(fill,''.join(tags)+fill)
        self.assertIn('REGION_HATCH_COVERED_BY_FILL',self.codes(svg=sunk))
    def test_engine_refuses_an_unknown_pattern_and_a_pattern_outside_a_region(self):
        pts,objects=parallelogram()
        objects.append({'id':'rg','kind':'FILL_REGION','fill':'LIGHT','pattern':'DOTS','loops':[rect_loop('A','B','C','A')]})
        with self.assertRaises(ValueError) as caught:build(spec_of(pts,objects))
        self.assertEqual(str(caught.exception),'REGION_PATTERN_UNSUPPORTED:rg')
        pts,objects=parallelogram()
        objects[0]['pattern']='HATCH'
        with self.assertRaises(ValueError) as caught:build(spec_of(pts,objects))
        self.assertEqual(str(caught.exception),'UNKNOWN_OR_MISSING_COMPONENT_FIELD')

class RegionLabelOwnershipTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.points={'A':(0.0,-2.0),'B':(4.0,-2.0),'C':(4.0,2.0),'D':(0.0,2.0),'E':(6.0,-2.0),'F':(10.0,-2.0),'G':(10.0,2.0),'H':(6.0,2.0)}
        segments=[('sAB','A','B'),('sBC','B','C'),('sCD','C','D'),('sDA','D','A'),('sEF','E','F'),('sFG','F','G'),('sGH','G','H'),('sHE','H','E')]
        objects=[seg(i,cls.points,a,b) for i,a,b in segments]
        objects.append({'id':'rLeft','kind':'FILL_REGION','fill':'LIGHT','loops':[rect_loop('A','B','C','D')]})
        objects.append({'id':'rRight','kind':'FILL_REGION','fill':'MEDIUM','loops':[rect_loop('E','F','G','H')]})
        result=build(spec_of(cls.points,objects));cls.svg=result['svg'];cls.transform=result['witness']['coordinateModel']
        cls.segments=[{'id':i,'refs':[a,b]} for i,a,b in segments]
        cls.marks={'regions':[{'id':'rLeft','fill':'LIGHT','label':'x','shapes':[{'polygon':['A','B','C','D']}]},
                              {'id':'rRight','fill':'MEDIUM','label':'y','shapes':[{'polygon':['E','F','G','H']}]}]}
    def at(self,point,width=30.0,height=14.0):
        m=self.transform;ox,oy,sx,sy=m['originX'],m['originY'],m['sx'],m['sy']
        return (ox+point[0]*sx-width/2,oy-point[1]*sy-height/2)
    def fragment(self,label_id,owner,point):
        x,y=self.at(point)
        return ('<g id="'+label_id+'" data-owner="'+owner+'" data-fragment-sha="sha256:'+'0'*64+'" transform="translate('+('%.3f'%x)+' '+('%.3f'%y)+')">'
                '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="14" viewBox="0 0 30 14"><path d="M0 0 L10 0"/></svg></g>')
    def svg_with(self,left_at,right_at):
        groups=self.fragment('rLeft-label','rLeft',left_at)+self.fragment('rRight-label','rRight',right_at)
        return self.svg.replace('</svg>',groups+'</svg>')
    def codes(self,svg):return [error.split(':')[0] for error in OBSERVER.audit({'svg':svg,'points':{k:list(v) for k,v in self.points.items()},'marks':self.marks,'segments':self.segments,'transform':self.transform})['errors']]
    def test_each_label_belongs_to_its_own_region(self):
        self.assertEqual([code for code in self.codes(self.svg_with((2.0,0.0),(8.0,0.0))) if code.startswith('REGION_LABEL')],[])
    def test_tamper_a_label_moved_into_the_other_region(self):
        codes=self.codes(self.svg_with((8.0,0.0),(8.0,0.0)))
        self.assertIn('REGION_LABEL_OUTSIDE',codes)
        self.assertIn('REGION_LABEL_IN_OTHER_REGION',codes)

class UnmarkedPointTests(unittest.TestCase):
    """A POINT with marker NONE (a plane figure's hiddenPointStyle NONE) stays in the geometry but draws neither a dot nor a name."""
    points={'F':(0.0,0.0),'R':(6.0,0.0),'T':(3.0,4.0)}
    def objects(self,marker=None):
        points=self.points
        rows=[{'id':k,'kind':'POINT','at':list(v),'name':None,**({'marker':marker} if marker else {})} for k,v in points.items()]
        return rows+[seg('sFR',points,'F','R'),seg('sFT',points,'F','T'),{'id':'aF','kind':'ANGLE_MARK','refs':['R','F','T'],'value':53.13010235415598,'arcs':1}]
    def svg(self,objects):
        spec=spec_of(self.points,[])
        spec['objects']=objects
        return build(spec)['svg']
    def circles(self,svg):return re.findall(r'<circle\s(?:[^>]*\s)?id="([^"]+)"',svg)
    def test_default_hidden_point_is_a_bare_dot(self):
        self.assertEqual(sorted(self.circles(self.svg(self.objects()))),['F','R','T'])
    def test_marker_none_draws_no_dot_and_the_marks_still_stand(self):
        svg=self.svg(self.objects('NONE'))
        self.assertEqual(self.circles(svg),[])
        self.assertIn('id="sFR"',svg);self.assertIn('id="sFT"',svg);self.assertIn('data-mark="angle"',svg)
    def test_marker_none_on_some_points_keeps_the_others(self):
        rows=self.objects()
        for row in rows:
            if row['id']=='T':row['marker']='NONE'
        self.assertEqual(sorted(self.circles(self.svg(rows))),['F','R'])
    def test_marker_contract(self):
        rows=self.objects();rows[0].pop('at');rows[0].update({'kind':'LINE','coefficients':[1,0,0],'marker':'NONE'})   # only a POINT carries a marker
        with self.assertRaisesRegex(ValueError,'INVALID_POINT_MARKER'):validate(spec_of(self.points,[])|{'objects':rows})
        for bad in ('DOT','none',True,None):
            rows=self.objects();rows[0]['marker']=bad
            with self.assertRaisesRegex(ValueError,'INVALID_POINT_MARKER'):validate(spec_of(self.points,[])|{'objects':rows})
        rows=self.objects();rows[0]['marker']='NONE';rows[0]['name']='F'   # a markerless point cannot carry a name
        with self.assertRaisesRegex(ValueError,'INVALID_POINT_MARKER'):validate(spec_of(self.points,[])|{'objects':rows})
        rows=self.objects();rows[0]['marker']='NONE';del rows[0]['name']
        with self.assertRaisesRegex(ValueError,'INVALID_POINT_MARKER'):validate(spec_of(self.points,[])|{'objects':rows})
        rows=self.objects();rows[0]['marker']='NONE'
        self.assertEqual(validate(spec_of(self.points,[])|{'objects':rows})['semanticStatus'],'PASS')

if __name__=='__main__':unittest.main()
