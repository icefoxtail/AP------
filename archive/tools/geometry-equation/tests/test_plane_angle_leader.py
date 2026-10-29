"""angles[].labelPlacement LEADER (E12b): the angle label stands outside its angle on a leader from its own outermost arc even where the angle has room for it.
No Chrome here: the label boxes come from the build's own layout and are written into the SVG as label groups by hand (tests/plane-angle-labels.test.mjs runs the real pipeline)."""
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
from visual_engine.label_layout import point_in_wedge,box_touches_wedge,Box

def observer_module():
    spec=importlib.util.spec_from_file_location('plane_marks_observer',PRODUCTION/'plane-marks-observer-worker.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
OBSERVER=observer_module()

def on(degrees,radius):return (radius*math.cos(math.radians(degrees)),radius*math.sin(math.radians(degrees)))
POINTS={'V':(0.0,0.0),'R':(8.0,0.0),'T':on(70,8.0),'S':on(140,8.0)}
SEGMENTS=[{'id':'sVR','refs':['V','R']},{'id':'sVT','refs':['V','T']},{'id':'sVS','refs':['V','S']}]

def spec_of(points,objects):
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-9,'xMax':9,'yMin':-3,'yMax':9,'width':560,'height':420,'panel':0},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':None,'marker':'NONE'} for k,v in points.items()]+objects}
def seg(identifier,points,a,b):return {'id':identifier,'kind':'SEGMENT','from':list(points[a]),'to':list(points[b])}
def angle(identifier,refs,value,**extra):return {'id':identifier,'kind':'ANGLE_MARK','refs':refs,'value':value,'arcs':1,'labelText':str(value),'labelKind':'DEGREE',**extra}
def objects_of(**extra_a):
    return [seg(s['id'],POINTS,*s['refs']) for s in SEGMENTS]+[angle('aA',['R','V','T'],70,**extra_a),angle('aB',['T','V','S'],70)]

def label_group(label_id,box):
    glyphs=''.join('<path data-c="'+format(ord(ch),'X')+'" d="M0 0 L5 0"/>' for ch in '70')
    return ('<g id="'+label_id+'" data-owner="x" data-fragment-sha="sha256:'+'0'*64+'" transform="translate(%.6f %.6f)">'%(box['x'],box['y'])+
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.3f" height="%.3f" viewBox="0 0 %.3f %.3f">%s</svg></g>'%(box['width'],box['height'],box['width'],box['height'],glyphs))

class Fixture:
    def __init__(self,**extra):
        self.result=build(spec_of(POINTS,objects_of(**extra)));self.transform=self.result['witness']['coordinateModel'];self.layout=self.result['witness']['layout']
        self.rows={row['id']:row for row in self.layout['labels']};self.boxes={k:v['box'] for k,v in self.rows.items()}
        svg=self.result['svg']
        for label_id in ('aA-label','aB-label'):svg=re.sub(r'<text\s[^>]*id="'+label_id+r'"[^>]*>.*?</text>','',svg,flags=re.S)
        self.base=svg
    def svg(self,moved=None,drop_leader=False):
        svg=self.base
        if drop_leader:svg=re.sub(r'<line\s[^>]*data-role="leader"[^>]*data-owner-label="aA-label"[^>]*/>','',svg)
        groups=''.join(label_group(k,(moved or {}).get(k,v)) for k,v in self.boxes.items() if k.startswith('a'))
        return svg.replace('</svg>',groups+'</svg>')
    def audit(self,svg=None,placement=None):
        marks={'angles':[{'id':'aA','refs':['R','V','T'],'value':70,'label':'70',**({'labelPlacement':placement} if placement else {})},{'id':'aB','refs':['T','V','S'],'value':70,'label':'70'}]}
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in POINTS.items()},'marks':marks,'segments':SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]

class LayoutTests(unittest.TestCase):
    def test_without_the_field_the_label_keeps_its_old_place_inside_its_angle(self):
        fixture=Fixture();self.assertEqual(fixture.layout['unresolved'],[])
        self.assertFalse(fixture.rows['aA-label']['placement'].startswith('OWNER_LEADER_'),fixture.rows['aA-label']['placement'])
        self.assertNotIn('forceLeader',fixture.rows['aA-label']['wedgeSearch'])
    def test_leader_puts_the_whole_label_outside_the_wedge_on_a_leader_from_its_own_arc(self):
        fixture=Fixture(labelPlacement='LEADER');self.assertEqual(fixture.layout['unresolved'],[])
        row=fixture.rows['aA-label'];self.assertTrue(row['placement'].startswith('OWNER_LEADER_'),row['placement']);self.assertTrue(row['wedgeSearch']['forceLeader'])
        ws=row['wedgeSearch'];box=row['box'];b=Box(box['x'],box['y'],box['width'],box['height'])
        self.assertFalse(box_touches_wedge(b,ws),'every corner and the centre stand outside the 70 degree wedge')
        leader=next(item for item in fixture.layout['leaders'] if item['ownerLabelId']=='aA-label')
        self.assertAlmostEqual(math.dist(leader['from'],ws['vertex']),ws['arcRadius'],places=6)         # starts on the outermost arc
        theta=math.atan2(leader['from'][1]-ws['vertex'][1],leader['from'][0]-ws['vertex'][0]);along=((theta-ws['start'])*(1 if ws['delta']>0 else -1))%(2*math.pi)
        self.assertLessEqual(along,abs(ws['delta'])+1e-9)
    def test_the_other_angle_at_the_vertex_is_unaffected(self):
        plain=Fixture().rows['aB-label'];forced=Fixture(labelPlacement='LEADER').rows['aB-label']
        self.assertNotIn('forceLeader',forced['wedgeSearch']);self.assertEqual(plain['wedgeSearch'].get('forceLeader'),None)
    def test_the_wedge_helpers(self):
        self.assertTrue(point_in_wedge((5,1),(0,0),0.0,math.radians(30)));self.assertFalse(point_in_wedge((5,-1),(0,0),0.0,math.radians(30)))
        self.assertTrue(point_in_wedge((50,10),(0,0),0.0,math.radians(30)),'the wedge has no radius limit')
        self.assertTrue(point_in_wedge((5,-1),(0,0),0.0,-math.radians(30)),'a negative sweep runs clockwise')
        self.assertTrue(point_in_wedge((0,0),(0,0),0.0,math.radians(30)))
    def test_field_checks(self):
        with self.assertRaises(ValueError) as caught:build(spec_of(POINTS,objects_of(labelPlacement='INSIDE')))
        self.assertEqual(str(caught.exception),'INVALID_ANGLE_LABEL_PLACEMENT')
        with self.assertRaises(ValueError) as caught:build(spec_of(POINTS,[seg('sVR',POINTS,'V','R'),{'id':'s','kind':'SEGMENT','from':[0.0,0.0],'to':[8.0,0.0],'labelPlacement':'LEADER'}]))
        self.assertEqual(str(caught.exception),'INVALID_ANGLE_LABEL_PLACEMENT')

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.fixture=Fixture(labelPlacement='LEADER')
    def test_the_genuine_forced_leader_passes(self):
        self.assertEqual(self.fixture.audit(placement='LEADER')['errors'],[])
    def test_a_missing_leader_is_refused(self):
        self.assertIn('ANGLE_LABEL_LEADER_MISSING',self.fixture.codes(svg=self.fixture.svg(drop_leader=True),placement='LEADER'))
    def test_a_label_inside_its_angle_is_refused(self):
        vertex=(self.fixture.transform['originX'],self.fixture.transform['originY']);box=dict(self.fixture.boxes['aA-label'])
        middle=math.radians(35);r=60.0
        box['x']=vertex[0]+r*math.cos(middle)-box['width']/2;box['y']=vertex[1]-r*math.sin(middle)-box['height']/2
        self.assertIn('ANGLE_LABEL_NOT_OUTSIDE_ANGLE',self.fixture.codes(svg=self.fixture.svg(moved={'aA-label':box}),placement='LEADER'))
    def test_the_observer_without_the_field_is_the_old_observer(self):
        self.assertNotIn('ANGLE_LABEL_NOT_OUTSIDE_ANGLE',self.fixture.codes())
        self.assertNotIn('ANGLE_LABEL_LEADER_MISSING',self.fixture.codes(svg=self.fixture.svg(drop_leader=True)))

if __name__=='__main__':unittest.main()
