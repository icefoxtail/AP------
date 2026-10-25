"""Region fills: the FILL_REGION semantic object, the engine's even-odd <path>, and the independent region observer with tamper cases.
No Chrome here: region labels are exercised by tests/region-fill.test.mjs."""
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
import plane_regions_observer as regions

def observer_module():
    spec=importlib.util.spec_from_file_location('plane_marks_observer',PRODUCTION/'plane-marks-observer-worker.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
OBSERVER=observer_module()

R=5.0
def on_circle(degrees):return (R*math.cos(math.radians(degrees)),R*math.sin(math.radians(degrees)))
POINTS={'O':(0.0,0.0),'A':on_circle(30),'B':on_circle(150),'C':on_circle(210),'D':on_circle(330)}
def spec_of(regions_):
    xs=[p[0] for p in POINTS.values()];ys=[p[1] for p in POINTS.values()]
    objects=[{'id':k,'kind':'POINT','at':list(v),'name':k} for k,v in POINTS.items()]
    objects.append({'id':'k','kind':'CIRCLE','center':[0.0,0.0],'radius':R})
    for sid,a,b in [('sOA','O','A'),('sOB','O','B'),('sAB','A','B'),('sOC','O','C'),('sOD','O','D')]:
        objects.append({'id':sid,'kind':'SEGMENT','from':list(POINTS[a]),'to':list(POINTS[b])})
    return {'id':'region','visualType':'line_circle_geometry','viewport':{'xMin':-6.5,'xMax':6.5,'yMin':-6.5,'yMax':6.5,'width':520,'height':520,'panel':0,'equalUnits':True},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},'objects':objects+regions_}
SEGMENT_REGION={'id':'rg1','kind':'FILL_REGION','fill':'LIGHT','loops':[
    {'start':'O','steps':[{'to':'A'},{'to':'B','arc':{'center':'O','sweep':'CCW'}},{'to':'O'}]},
    {'start':'O','steps':[{'to':'A'},{'to':'B'},{'to':'O'}]}]}
SECTOR_REGION={'id':'rg2','kind':'FILL_REGION','fill':'MEDIUM','loops':[{'start':'O','steps':[{'to':'C'},{'to':'D','arc':{'center':'O','sweep':'CCW'}},{'to':'O'}]}]}
MARKS={'regions':[
    {'id':'rg1','fill':'LIGHT','shapes':[{'sector':{'center':'O','from':'A','to':'B'}}],'holes':[{'polygon':['O','A','B']}]},
    {'id':'rg2','fill':'MEDIUM','shapes':[{'sector':{'center':'O','from':'C','to':'D'}}]}]}

class SemanticTests(unittest.TestCase):
    def codes(self,region):
        with self.assertRaises(ValueError) as caught:validate(spec_of([region]))
        return str(caught.exception).split(':')[0]
    def test_valid_regions_validate(self):
        result=validate(spec_of([SEGMENT_REGION,SECTOR_REGION]))
        self.assertEqual([r['kind'] for r in result['relations'] if r['id'].startswith('rg')],['FILL_REGION','FILL_REGION'])
    def test_loop_must_close(self):
        self.assertEqual(self.codes({**SECTOR_REGION,'loops':[{'start':'O','steps':[{'to':'C'},{'to':'D'}]}]}),'REGION_NOT_CLOSED')
    def test_arc_endpoints_must_lie_on_the_arc_circle(self):
        bad={**SECTOR_REGION,'loops':[{'start':'A','steps':[{'to':'B'},{'to':'C','arc':{'center':'A','sweep':'CCW'}},{'to':'A'}]}]}
        self.assertEqual(self.codes(bad),'REGION_ARC_ENDPOINT_NOT_ON_CIRCLE')
    def test_unknown_points_unsupported_fill_and_unknown_fields(self):
        self.assertEqual(self.codes({**SECTOR_REGION,'loops':[{'start':'O','steps':[{'to':'Z'},{'to':'O'}]}]}),'REGION_BOUNDARY_UNKNOWN')
        self.assertEqual(self.codes({**SECTOR_REGION,'fill':'HATCH'}),'REGION_FILL_UNSUPPORTED')
        self.assertEqual(self.codes({**SECTOR_REGION,'loops':[{'start':'O','steps':[{'to':'O'},{'to':'C'}],'bogus':1}]}),'REGION_BOUNDARY_UNKNOWN')
        self.assertEqual(self.codes({'id':'rgx','kind':'FILL_REGION','fill':'LIGHT','loops':[{'start':'O','steps':[{'to':'C','arc':{'center':'O','sweep':'SIDEWAYS'}},{'to':'O'}]}]}),'REGION_BOUNDARY_UNKNOWN')

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result=build(spec_of([SEGMENT_REGION,SECTOR_REGION]));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
    def audit(self,svg=None,points=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':points or {k:list(v) for k,v in POINTS.items()},'marks':marks if marks is not None else MARKS,
                               'segments':[{'id':sid,'refs':refs} for sid,refs in [('sOA',['O','A']),('sOB',['O','B']),('sAB',['A','B']),('sOC',['O','C']),('sOD',['O','D'])]],'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def path_tag(self,svg,identifier):return re.search(r'<path\s(?:[^>]*\s)?id="'+identifier+r'"[^>]*/>',svg).group(0)
    def redraw(self,identifier,change):
        tag=self.path_tag(self.svg,identifier);d=re.search(r'\sd="([^"]*)"',tag)
        return self.svg.replace(tag,tag.replace(d.group(0),' d="'+change(d.group(1))+'"'))

    def test_engine_draws_one_even_odd_path_per_region_beneath_the_strokes(self):
        for identifier in ('rg1','rg2'):
            tag=self.path_tag(self.svg,identifier)
            self.assertIn('fill-rule="evenodd"',tag);self.assertIn('stroke="none"',tag);self.assertIn('data-mark="region"',tag)
        self.assertEqual(len(re.findall(r'\sA[\d.]+ [\d.]+ 0 [01] [01] ',self.path_tag(self.svg,'rg1'))),1)
        self.assertLess(self.svg.index('id="rg1"'),self.svg.index('id="k"'));self.assertLess(self.svg.index('id="rg2"'),self.svg.index('id="sOA"'))
    def test_genuine_regions_pass(self):
        report=self.audit();self.assertEqual(report['errors'],[]);rows={r['id']:r for r in report['observations'] if r.get('type')=='REGION'}
        self.assertEqual(rows['rg1']['loops'],2);self.assertEqual(rows['rg2']['loops'],1)
    def test_area_of_the_drawn_loops(self):
        report=self.audit();rows={r['id']:r for r in report['observations'] if r.get('type')=='REGION'}
        scale=self.transform['sx'];sector=0.5*R*R*math.radians(120)*scale*scale
        self.assertAlmostEqual(rows['rg2']['areaPx2'],sector,delta=sector*0.005)             # sector OCD (the polygon sample slightly under-fills the arc)
        triangle=0.5*R*R*math.sin(math.radians(120))*scale*scale
        self.assertAlmostEqual(rows['rg1']['areaPx2'],sector+triangle,delta=sector*0.01)      # the two loops of a region are summed; the even-odd area is their difference
    def test_path_parsing_and_arc_centre(self):
        self.assertEqual(len(regions.parse_path(re.search(r'\sd="([^"]*)"',self.path_tag(self.svg,'rg2')).group(1))),1)
        # round trip: the centre of the drawn arc is the figure's centre O
        forward=lambda q:(self.transform['originX']+q[0]*self.transform['sx'],self.transform['originY']-q[1]*self.transform['sy'])
        path=regions.parse_path(re.search(r'\sd="([^"]*)"',self.path_tag(self.svg,'rg2')).group(1))[0]
        edge=path['edges'][1]
        # edge 0 goes O->C; the arc starts at the end of edge 0
        arc_from=path['edges'][0][1];centre=regions.svg_arc_center(arc_from,edge[1],edge[2],edge[3],edge[4])
        self.assertLess(math.hypot(centre[0]-forward((0,0))[0],centre[1]-forward((0,0))[1]),1e-6)
    def test_tamper_moved_vertex(self):
        moved=self.redraw('rg2',lambda d:re.sub(r'L([-\d.]+) ([-\d.]+)',lambda m:'L%s %s'%(float(m.group(1))+2.5,m.group(2)),d,count=1))
        self.assertIn('REGION_VERTEX_MISMATCH',self.codes(svg=moved))
    def test_tamper_arc_side_and_sweep(self):
        large=self.redraw('rg2',lambda d:re.sub(r'(A[\d.]+ [\d.]+ 0 )([01])',lambda m:m.group(1)+('0' if m.group(2)=='1' else '1'),d,count=1))
        self.assertIn('REGION_ARC_SIDE_MISMATCH',self.codes(svg=large))
        sweep=self.redraw('rg2',lambda d:re.sub(r'(A[\d.]+ [\d.]+ 0 [01] )([01])',lambda m:m.group(1)+('0' if m.group(2)=='1' else '1'),d,count=1))
        self.assertIn('REGION_ARC_SIDE_MISMATCH',self.codes(svg=sweep))
        wrong_marks=json.loads(json.dumps(MARKS));wrong_marks['regions'][1]['shapes'][0]['sector']['side']='MAJOR'
        self.assertIn('REGION_ARC_SIDE_MISMATCH',self.codes(marks=wrong_marks))             # the plan asks for the major sector: the drawn minor one is wrong
    def test_tamper_radius_fill_and_order(self):
        radius=self.redraw('rg2',lambda d:re.sub(r'A([\d.]+) ([\d.]+)',lambda m:'A%s %s'%(float(m.group(1))*1.2,float(m.group(2))*1.2),d,count=1))
        self.assertIn('REGION_ARC_RADIUS_MISMATCH',self.codes(svg=radius))
        wrong_fill=json.loads(json.dumps(MARKS));wrong_fill['regions'][0]['fill']='MEDIUM'
        self.assertIn('REGION_FILL_MISMATCH',self.codes(marks=wrong_fill))
        tag=self.path_tag(self.svg,'rg1');raised=self.svg.replace(tag,'').replace('</svg>',tag+'</svg>')
        self.assertIn('REGION_NOT_BENEATH_STROKES',self.codes(svg=raised))
    def test_tamper_boundary_not_drawn_and_missing_region(self):
        circle=re.search(r'<circle\s(?:[^>]*\s)?id="k"[^>]*/>',self.svg).group(0)
        self.assertIn('REGION_BOUNDARY_NOT_DRAWN',self.codes(svg=self.svg.replace(circle,'')))
        line=re.search(r'<line\s(?:[^>]*\s)?id="sOA"[^>]*/>',self.svg).group(0)
        self.assertIn('REGION_BOUNDARY_NOT_DRAWN',self.codes(svg=self.svg.replace(line,'')))
        tag=self.path_tag(self.svg,'rg2')
        self.assertIn('REGION_MISSING',self.codes(svg=self.svg.replace(tag,'')))
        fewer=json.loads(json.dumps(MARKS));fewer['regions']=fewer['regions'][:1]
        self.assertIn('UNDECLARED_MARK',self.codes(marks=fewer))
    def test_peer_point_elsewhere(self):
        points={k:list(v) for k,v in POINTS.items()};points['B']=[points['B'][0]+0.4,points['B'][1]]
        self.assertIn('REGION_VERTEX_MISMATCH',self.codes(points=points))
    def test_ambiguous_half_circle_side_is_refused(self):
        marks={'regions':[{'id':'rg2','shapes':[{'sector':{'center':'O','from':'A','to':'C'}}]}]}
        self.assertIn('REGION_ARC_SIDE_AMBIGUOUS',self.codes(marks=marks))

if __name__=='__main__':unittest.main()
