"""angles[].over (E32): a whole angle over its halves (72 degrees over two 36 degree halves at one vertex) and ownership NEAREST for a segment label in a crowded corner.
The engine's placement (the halves' labels may stand inside the whole angle, the whole angle's label goes outside its outer ring on a leader) and the independent observer
with tamper cases. No Chrome here: the label boxes come from the build's own layout and are written into the SVG as label groups by hand."""
import importlib.util
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
from visual_engine.label_layout import line_label_unambiguous,Box

def observer_module():
    spec=importlib.util.spec_from_file_location('plane_marks_observer',PRODUCTION/'plane-marks-observer-worker.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
OBSERVER=observer_module()

def on(degrees,radius):return (radius*math.cos(math.radians(degrees)),radius*math.sin(math.radians(degrees)))
# a vertex D with the ray DA to the left, the bisector DE at 36 degrees below it and the ray DC at 72 degrees below it
POINTS={'D':(0.0,0.0),'A':on(180,9.0),'E':on(216,9.0),'C':on(252,9.0)}
SEGMENTS=[{'id':'sDA','refs':['D','A']},{'id':'sDE','refs':['D','E']},{'id':'sDC','refs':['D','C']}]
def spec_of(objects):
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-11,'xMax':3,'yMin':-11,'yMax':3,'width':560,'height':520,'panel':0},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':None,'marker':'NONE'} for k,v in POINTS.items()]+objects}
def seg(row):return {'id':row['id'],'kind':'SEGMENT','from':list(POINTS[row['refs'][0]]),'to':list(POINTS[row['refs'][1]])}
def angle(identifier,refs,value,**extra):return {'id':identifier,'kind':'ANGLE_MARK','refs':refs,'value':value,'arcs':1,'labelText':str(value),'labelKind':'DEGREE',**extra}
def objects_of(**whole):
    return [seg(s) for s in SEGMENTS]+[angle('aH1',['A','D','E'],36,style='SECTOR'),angle('aH2',['E','D','C'],36,style='SECTOR'),
                                       angle('aW',['A','D','C'],72,ring=2,style='ARC',over=['aH1','aH2'],labelPlacement='LEADER',**whole)]
MARKS={'angles':[{'id':'aH1','refs':['A','D','E'],'value':36,'label':'36'},{'id':'aH2','refs':['E','D','C'],'value':36,'label':'36'},
                 {'id':'aW','refs':['A','D','C'],'value':72,'label':'72','over':['aH1','aH2'],'ring':2}]}

def label_group(label_id,box,value):
    glyphs=''.join('<path data-c="'+format(ord(ch),'X')+'" d="M0 0 L5 0"/>' for ch in value)
    return ('<g id="'+label_id+'" data-owner="x" data-fragment-sha="sha256:'+'0'*64+'" transform="translate(%.6f %.6f)">'%(box['x'],box['y'])+
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.3f" height="%.3f" viewBox="0 0 %.3f %.3f">%s</svg></g>'%(box['width'],box['height'],box['width'],box['height'],glyphs))

class Fixture:
    def __init__(self,objects=None):
        self.result=build(spec_of(objects or objects_of()),measurements={'aH1-label':[46.0,24.0],'aH2-label':[46.0,24.0],'aW-label':[46.0,24.0]})
        self.transform=self.result['witness']['coordinateModel'];self.layout=self.result['witness']['layout']
        self.rows={row['id']:row for row in self.layout['labels']};self.boxes={k:v['box'] for k,v in self.rows.items()}
        svg=self.result['svg']
        for label_id in ('aH1-label','aH2-label','aW-label'):svg=re.sub(r'<text\s[^>]*id="'+label_id+r'"[^>]*>.*?</text>','',svg,flags=re.S)
        self.base=svg
    def svg(self):
        values={'aH1-label':'36','aH2-label':'36','aW-label':'72'}
        return self.base.replace('</svg>',''.join(label_group(k,self.boxes[k],values[k]) for k in values if k in self.boxes)+'</svg>')
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in POINTS.items()},'marks':marks if marks is not None else MARKS,'segments':SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]

class EngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.fixture=Fixture()
    def test_every_label_is_placed(self):
        self.assertEqual(self.fixture.layout['unresolved'],[])
    def test_the_whole_angle_label_stands_outside_its_wedge_on_a_leader_and_the_halves_inside_it(self):
        rows=self.fixture.rows;self.assertTrue(rows['aW-label']['placement'].startswith('OWNER_LEADER_'),rows['aW-label']['placement'])
        ws=rows['aW-label']['wedgeSearch'];box=rows['aH1-label']['box']
        centre=(box['x']+box['width']/2,box['y']+box['height']/2);d=(centre[0]-ws['vertex'][0],centre[1]-ws['vertex'][1])
        theta=math.atan2(d[1],d[0]);along=((theta-ws['start'])*(1 if ws['delta']>0 else -1))%(2*math.pi)
        self.assertLessEqual(along,abs(ws['delta']),'a half angle label may stand inside the whole angle')
    def test_the_whole_angle_is_drawn_on_an_outer_ring_with_arcs_only(self):
        svg=self.fixture.result['svg']
        self.assertNotIn('id="aW-sector"',svg);self.assertIn('id="aW-arc-1"',svg)
        radius=lambda arc:max(math.hypot(float(x)-self.fixture.transform['originX'],float(y)-self.fixture.transform['originY']) for x,y in (p.split(',') for p in re.search(r'id="'+arc+r'"[^>]*points="([^"]+)"',svg).group(1).split()))
        self.assertGreater(radius('aW-arc-1'),radius('aH1-arc-1')+4.0)
    def test_observer_accepts_the_genuine_figure(self):
        report=self.fixture.audit();self.assertEqual(report['errors'],[],report['errors'])

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.fixture=Fixture()
    def test_tamper_the_listed_angle_is_not_enclosed(self):
        marks={'angles':[*MARKS['angles'][:2],{**MARKS['angles'][2],'refs':['A','D','E'],'value':36}]}
        self.assertIn('ANGLE_OVER_NOT_ENCLOSED',self.fixture.codes(marks=marks))
    def test_tamper_the_outer_ring_is_not_outside(self):
        flat=Fixture([*objects_of()[:3],angle('aH1',['A','D','E'],36,style='SECTOR'),angle('aH2',['E','D','C'],36,style='SECTOR'),
                      angle('aW',['A','D','C'],72,ring=1,style='ARC',labelPlacement='LEADER')])
        self.assertIn('ANGLE_OVER_RING_MISMATCH',flat.codes(marks={'angles':[*MARKS['angles'][:2],{**MARKS['angles'][2],'over':['aH1','aH2']}]}))
    def test_a_half_label_inside_the_whole_sector_is_allowed_only_for_a_declared_over(self):
        fixture=self.fixture;m=fixture.transform
        centre=(m['originX']+33.0*math.cos(math.radians(198)),m['originY']-33.0*math.sin(math.radians(198)))   # between the half arcs (28 px) and the outer ring (37 px), on the bisector of the first half
        box=dict(fixture.boxes['aH1-label']);box.update(x=centre[0]-box['width']/2,y=centre[1]-box['height']/2)
        original=fixture.boxes['aH1-label'];fixture.boxes['aH1-label']=box
        try:
            declared=fixture.codes();undeclared=fixture.codes(marks={'angles':[MARKS['angles'][0],MARKS['angles'][1],{**{k:v for k,v in MARKS['angles'][2].items() if k!='over'},'style':'ARC'}]})
        finally:fixture.boxes['aH1-label']=original
        self.assertNotIn('ANGLE_LABEL_IN_OTHER_ANGLE',declared)
        self.assertIn('ANGLE_LABEL_IN_OTHER_ANGLE',undeclared)

class OwnershipTests(unittest.TestCase):
    def test_relaxed_ownership_accepts_a_box_that_the_strict_margin_refuses(self):
        owner={'id':'s0','kind':'line','geometry':[(0.0,0.0),(100.0,0.0)]};other={'id':'s1','kind':'line','geometry':[(0.0,0.0),(50.0,-80.0)]}
        box=Box(40.0,-20.0,30.0,14.0)      # 6 px over its own line, 15 px from the other line
        self.assertFalse(line_label_unambiguous(box,owner,[other]))
        self.assertTrue(line_label_unambiguous(box,owner,[other],14.0,4.0))

class RelaxedLabelTests(unittest.TestCase):
    """A label on the middle ray of a narrow fan: strict ownership asks 24 px of margin to the other rays, NEAREST only 4."""
    FAN={'V':(0.0,0.0),'R':(14.0,0.0),'T':on(18,14.0),'S':on(-18,14.0)}
    def placement(self,**extra):
        spec={'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-2,'xMax':16,'yMin':-9,'yMax':9,'width':560,'height':420,'panel':0},'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
              'objects':[{'id':k,'kind':'POINT','at':list(v),'name':None,'marker':'NONE'} for k,v in self.FAN.items()]+[
                  {'id':'sVR','kind':'SEGMENT','from':list(self.FAN['V']),'to':list(self.FAN['R'])},{'id':'sVT','kind':'SEGMENT','from':list(self.FAN['V']),'to':list(self.FAN['T'])},
                  {'id':'sVS','kind':'SEGMENT','from':list(self.FAN['V']),'to':list(self.FAN['S'])},
                  {'id':'t1','kind':'EQUATION_LABEL','target':'sVR','text':'12','at':[7.0,0.0],'lineOwned':True,'alternateAt':[[4.9,0.0]],'gaps':[8,6,10,20,32,48],'priority':1,**extra}]}
        result=build(spec,measurements={'t1':[34.0,18.0]});rows={row['id']:row for row in result['witness']['layout']['labels']}
        return rows.get('t1'),result['witness']['layout']['unresolved']
    def test_nearest_ownership_places_the_label_beside_its_ray_where_strict_ownership_needs_a_leader(self):
        strict,strict_unresolved=self.placement();relaxed,unresolved=self.placement(ownership='NEAREST')
        self.assertEqual(strict_unresolved,[]);self.assertTrue(strict['placement'].startswith('OWNER_LEADER_'),strict['placement'])
        self.assertEqual(unresolved,[]);self.assertFalse(relaxed['placement'].startswith('OWNER_LEADER_'),relaxed['placement'])

if __name__=='__main__':unittest.main()
