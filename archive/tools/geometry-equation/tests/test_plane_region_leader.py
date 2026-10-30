"""Region labels on a leader and named region labels (E32): the engine's outside placement from the region's outer boundary, labelAt, and the independent observer with tamper cases.
No Chrome here: the label boxes come from the build's own layout and are written into the SVG as typeset-looking label groups by hand
(the real MathJax / outline fragments are exercised by tests/plane-region-leader.test.mjs)."""
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

# a rhombus ABCD with its diagonals and the segment AP to the midpoint P of BC: the shape of 26 팔마중 q7
POINTS={'A':(0.0,2.0),'B':(-3.0,0.0),'C':(0.0,-2.0),'D':(3.0,0.0),'O':(0.0,0.0),'P':(-1.5,-1.0)}
SEGMENTS=[('sAB','A','B'),('sBP','B','P'),('sPC','P','C'),('sCD','C','D'),('sDA','D','A'),('sAO','A','O'),('sOC','O','C'),('sBO','B','O'),('sOD','O','D'),('sAP','A','P')]
POLYGON=['A','B','P','C','O']
def region_object(**extra):
    steps=[{'to':name} for name in POLYGON[1:]+POLYGON[:1]]
    return {'id':'rABC','kind':'FILL_REGION','fill':'LIGHT','loops':[{'start':POLYGON[0],'steps':steps}],**extra}
def spec_of(objects,width=600,height=420):
    xs=[p[0] for p in POINTS.values()];ys=[p[1] for p in POINTS.values()]
    base=[{'id':k,'kind':'POINT','at':list(v),'name':k} for k,v in POINTS.items()]
    base+=[{'id':sid,'kind':'SEGMENT','from':list(POINTS[a]),'to':list(POINTS[b])} for sid,a,b in SEGMENTS]
    return {'id':'region','visualType':'line_circle_geometry','viewport':{'xMin':min(xs)-1.6,'xMax':max(xs)+1.6,'yMin':min(ys)-1.3,'yMax':max(ys)+1.3,'width':width,'height':height,'panel':0,'equalUnits':True},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},'objects':base+objects}
TEXT='△ABC=6cm²'
def label_object(placement,**extra):
    extra.setdefault('labelText',TEXT)
    return region_object(labelKind='TEXT',labelWeight='MATH',**({'labelPlacement':placement} if placement!='AUTO' else {}),**extra)
MARKS={'segments':None}
def marks_of(**extra):
    row={'id':'rABC','fill':'LIGHT','label':'6','labelName':'△ABC','unit':'cm^2','labelPlacement':'LEADER','shapes':[{'polygon':POLYGON}],**extra}
    return {'regions':[row]}

def label_group(label_id,box,text,font=24.0,weight=True):
    """A plain-text label group at the layout's box, in the shape the observer reads (position from the transform, size from the inner svg, the text on the group)."""
    stroke=' stroke="#111" stroke-width="%.4f"'%(font*0.06) if weight else ''
    return ('<g id="'+label_id+'" data-owner="x" data-fragment-sha="sha256:'+'0'*64+'" data-text="'+text+'" data-font-px="%.1f"'%font+' transform="translate(%.6f %.6f)">'%(box['x'],box['y'])+
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.3f" height="%.3f" viewBox="0 0 %.3f %.3f"><path d="M0 0 L5 0" fill="#111"%s/></svg></g>'%(box['width'],box['height'],box['width'],box['height'],stroke))

class Fixture:
    """A built figure whose label is replaced by a hand-written label group at the box the layout chose, ready for the observer."""
    def __init__(self,placement,size=(150.0,28.0),**extra):
        spec=spec_of([label_object(placement,**extra)])
        self.result=build(spec,measurements={'rABC-label':list(size)})
        self.transform=self.result['witness']['coordinateModel'];self.layout=self.result['witness']['layout']
        self.row={row['id']:row for row in self.layout['labels']}.get('rABC-label')
        self.svg0=self.result['svg']
        self.base=re.sub(r'<text\s[^>]*id="rABC-label"[^>]*>.*?</text>','',self.svg0,flags=re.S)
    def svg(self,box=None,text=TEXT,weight=True):
        box=box or self.row['box']
        return self.base.replace('</svg>',label_group('rABC-label',box,text,weight=weight)+'</svg>')
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in POINTS.items()},'marks':marks if marks is not None else marks_of(),
                               'segments':[{'id':sid,'refs':[a,b]} for sid,a,b in SEGMENTS],'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def leader(self):return re.search(r'<line\s[^>]*data-role="leader"[^>]*data-owner-label="rABC-label"[^>]*/>',self.svg0)

class SemanticTests(unittest.TestCase):
    def codes(self,**extra):
        with self.assertRaises(ValueError) as caught:validate(spec_of([region_object(**extra)]))
        return str(caught.exception).split(':')[0]
    def test_plain_placements_validate(self):
        for placement in ('LEADER','AUTO_LEADER'):validate(spec_of([label_object(placement)]))
        validate(spec_of([label_object('AUTO')]))
    def test_label_weight_needs_a_plain_text_label_and_a_known_placement(self):
        self.assertEqual(self.codes(labelText='6',labelKind='MATH',labelWeight='MATH'),'INVALID_LABEL_WEIGHT')
        self.assertEqual(self.codes(labelText='x',labelKind='TEXT',labelWeight='HEAVY'),'INVALID_LABEL_WEIGHT')
        self.assertEqual(self.codes(labelText='x',labelKind='TEXT',labelPlacement='INSIDE'),'INVALID_ANGLE_LABEL_PLACEMENT')
    def test_label_at_is_a_coordinate_pair(self):
        self.assertEqual(self.codes(labelText='x',labelKind='TEXT',labelAt=[1]),'REGION_LABEL_AT_INVALID')

class EngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.leader=Fixture('LEADER')
    def test_leader_label_stands_outside_the_region_on_a_leader_from_its_boundary(self):
        row=self.leader.row;self.assertIsNotNone(row);self.assertTrue(row['placement'].startswith('OWNER_LEADER_'),row['placement'])
        tag=self.leader.leader();self.assertIsNotNone(tag)
        start=(float(re.search(r'\sx1="([^"]+)"',tag.group(0)).group(1)),float(re.search(r'\sy1="([^"]+)"',tag.group(0)).group(1)))
        forward=lambda q:(self.leader.transform['originX']+q[0]*self.leader.transform['sx'],self.leader.transform['originY']-q[1]*self.leader.transform['sy'])
        poly=[forward(POINTS[name]) for name in POLYGON]
        edges=list(zip(poly,poly[1:]+poly[:1]))
        near=min(regions.point_segment_distance(start,a,b) for a,b in edges)
        self.assertLess(near,1.0,'the leader starts on the region boundary')
        box=row['box'];centre=(box['x']+box['width']/2,box['y']+box['height']/2)
        self.assertEqual(regions.area_state(centre,[poly]),-1,'the label stands outside the region')
    def test_observer_accepts_the_genuine_figure(self):
        report=self.leader.audit();self.assertEqual(report['errors'],[],report['errors']);self.assertTrue([r for r in report['observations'] if r.get('type')=='REGION_LABEL_LEADER'])
    def test_auto_leader_prefers_the_inside_when_it_fits(self):
        fixture=Fixture('AUTO_LEADER',size=(36.0,20.0),labelText='6')
        self.assertFalse(fixture.row['placement'].startswith('OWNER_LEADER_'),fixture.row['placement'])
        self.assertIsNone(fixture.leader())
    def test_auto_leader_falls_back_to_a_leader_when_no_room_inside(self):
        fixture=Fixture('AUTO_LEADER',size=(220.0,28.0))
        self.assertTrue(fixture.row['placement'].startswith('OWNER_LEADER_'),fixture.row['placement']);self.assertIsNotNone(fixture.leader())
    def test_label_at_stands_at_the_place(self):
        fixture=Fixture('AUTO',size=(20.0,16.0),labelText='6',labelAt=[-1.8,-0.4])
        forward=lambda q:(fixture.transform['originX']+q[0]*fixture.transform['sx'],fixture.transform['originY']-q[1]*fixture.transform['sy'])
        box=fixture.row['box'];centre=(box['x']+box['width']/2,box['y']+box['height']/2);target=forward((-1.8,-0.4))
        self.assertLess(math.dist(centre,target),24.5)

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture=Fixture('LEADER')
    def test_label_text_is_recomputed_from_the_plan(self):
        self.assertEqual(regions.region_label_text(marks_of()['regions'][0]),TEXT)
        self.assertEqual(regions.region_label_text({'label':'50pi-100','unit':'cm^2'}),'50π−100cm²')
        self.assertEqual(regions.region_label_text({'label':'9pi','unit':'m^2','labelName':'부채꼴 AOB'}),'부채꼴 AOB=9π m²')
        self.assertIsNone(regions.region_label_text({'label':'6'}))
    def test_tamper_text_weight_and_kind(self):
        self.assertIn('LABEL_TEXT_MISMATCH',self.fixture.codes(svg=self.fixture.svg(text='△ABC=3cm²')))
        self.assertIn('LABEL_WEIGHT_MISMATCH',self.fixture.codes(svg=self.fixture.svg(weight=False)))
    def test_tamper_label_moved_into_the_region(self):
        box=dict(self.fixture.row['box']);box.update(x=self.fixture.transform['originX']-box['width']/2-60,y=self.fixture.transform['originY']-box['height']/2)
        codes=self.fixture.codes(svg=self.fixture.svg(box=box))
        self.assertTrue({'REGION_LABEL_NOT_OUTSIDE','MARK_LEADER_NOT_ON_LABEL','MARK_LABEL_OVERLAPS'}&set(codes),codes)
    def test_tamper_leader_missing_and_unexpected(self):
        svg=self.fixture.svg();tag=self.fixture.leader().group(0)
        self.assertIn('REGION_LABEL_LEADER_MISSING',self.fixture.codes(svg=svg.replace(tag,'')))
        self.assertIn('REGION_LABEL_LEADER_UNEXPECTED',self.fixture.codes(marks=marks_of(labelPlacement='AUTO')))
    def test_tamper_leader_start_off_the_boundary(self):
        svg=self.fixture.svg();tag=self.fixture.leader().group(0)
        moved=re.sub(r'\sx1="([^"]+)"',lambda m:' x1="%.3f"'%(float(m.group(1))+30),tag,count=1)
        self.assertIn('MARK_LEADER_NOT_ON_OWNER',self.fixture.codes(svg=svg.replace(tag,moved)))

if __name__=='__main__':unittest.main()
