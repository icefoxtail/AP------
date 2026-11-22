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
    def test_leader_label_stands_outside_the_region_on_a_leader_from_a_dot_inside_it(self):
        row=self.leader.row;self.assertIsNotNone(row);self.assertTrue(row['placement'].startswith('OWNER_LEADER_'),row['placement'])
        tag=self.leader.leader();self.assertIsNotNone(tag)
        start=(float(re.search(r'\sx1="([^"]+)"',tag.group(0)).group(1)),float(re.search(r'\sy1="([^"]+)"',tag.group(0)).group(1)))
        forward=lambda q:(self.leader.transform['originX']+q[0]*self.leader.transform['sx'],self.leader.transform['originY']-q[1]*self.leader.transform['sy'])
        poly=[forward(POINTS[name]) for name in POLYGON]
        edges=list(zip(poly,poly[1:]+poly[:1]))
        near=min(regions.point_segment_distance(start,a,b) for a,b in edges)
        # the leader starts on a dot well INSIDE the region (a start on the boundary would read as the length of the side it touches)
        self.assertEqual(regions.area_state(start,[poly]),1,'the leader starts inside the region')
        self.assertGreaterEqual(near,8.0,'and well away from its boundary')
        dot=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*data-owner-label="rABC-label"[^>]*/>',self.leader.svg0)
        self.assertIsNotNone(dot,'a dot marks the start')
        self.assertAlmostEqual(float(re.search(r'\scx="([^"]+)"',dot.group(0)).group(1)),start[0],places=3)
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
    def test_tamper_leader_moved_off_its_dot(self):
        svg=self.fixture.svg();tag=self.fixture.leader().group(0)
        moved=re.sub(r'\sx1="([^"]+)"',lambda m:' x1="%.3f"'%(float(m.group(1))+30),tag,count=1)
        self.assertIn('REGION_LEADER_DOT_MISSING',self.fixture.codes(svg=svg.replace(tag,moved)))
    def test_tamper_leader_started_on_the_boundary_is_refused(self):
        # the old figure: the leader (and its dot) on the boundary of the region, where it reads as the length of the side it touches
        svg=self.fixture.svg();tag=self.fixture.leader().group(0);dot=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*/>',svg).group(0)
        forward=lambda q:(self.fixture.transform['originX']+q[0]*self.fixture.transform['sx'],self.fixture.transform['originY']-q[1]*self.fixture.transform['sy'])
        a,b=forward(POINTS['A']),forward(POINTS['B']);edge=((a[0]+b[0])/2,(a[1]+b[1])/2)
        moved=re.sub(r'\sy1="([^"]+)"',' y1="%.3f"'%edge[1],re.sub(r'\sx1="([^"]+)"',' x1="%.3f"'%edge[0],tag,count=1),count=1)
        moved_dot=re.sub(r'\scy="([^"]+)"',' cy="%.3f"'%edge[1],re.sub(r'\scx="([^"]+)"',' cx="%.3f"'%edge[0],dot,count=1),count=1)
        codes=self.fixture.codes(svg=svg.replace(tag,moved).replace(dot,moved_dot))
        self.assertIn('REGION_LEADER_START_NEAR_BOUNDARY',codes)
    def test_tamper_dot_removed(self):
        svg=self.fixture.svg();dot=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*/>',svg).group(0)
        self.assertIn('REGION_LEADER_DOT_MISSING',self.fixture.codes(svg=svg.replace(dot,'')))
    def test_tamper_value_right_above_the_middle_of_a_side(self):
        # the first answer for the trapezoid with a height and a diagonal: the dot 10 px inside the middle of the side AE, the value right above that side's middle, a short leader:
        # the student reads it as the length of the side. The observer refuses it on its own (not on any mark of the producer).
        fx=self.fixture;svg=fx.svg0;box=fx.row['box'];tag=fx.leader().group(0)
        forward=lambda q:(fx.transform['originX']+q[0]*fx.transform['sx'],fx.transform['originY']-q[1]*fx.transform['sy'])
        poly=[forward(POINTS[name]) for name in POLYGON]
        a,b=poly[0],poly[1];mid=((a[0]+b[0])/2,(a[1]+b[1])/2);d=math.dist(a,b);normal=((b[1]-a[1])/d,-(b[0]-a[0])/d)
        if regions.area_state((mid[0]+normal[0]*10,mid[1]+normal[1]*10),[poly])!=1:normal=(-normal[0],-normal[1])
        dot=(mid[0]+normal[0]*10,mid[1]+normal[1]*10);out=(-normal[0],-normal[1]);w,h=box['width'],box['height']
        reach=20+abs(out[0])*w/2+abs(out[1])*h/2;centre=(mid[0]+out[0]*reach,mid[1]+out[1]*reach)
        moved_box={'x':centre[0]-w/2,'y':centre[1]-h/2,'width':w,'height':h}
        end=(mid[0]+out[0]*20,mid[1]+out[1]*20)
        line=re.sub(r'\sx1="[^"]+"',' x1="%.3f"'%dot[0],tag);line=re.sub(r'\sy1="[^"]+"',' y1="%.3f"'%dot[1],line);line=re.sub(r'\sx2="[^"]+"',' x2="%.3f"'%end[0],line);line=re.sub(r'\sy2="[^"]+"',' y2="%.3f"'%end[1],line)
        circle=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*/>',svg).group(0)
        moved_circle=re.sub(r'\scy="[^"]+"',' cy="%.3f"'%dot[1],re.sub(r'\scx="[^"]+"',' cx="%.3f"'%dot[0],circle))
        moved=svg.replace(tag,line).replace(circle,moved_circle)
        moved=re.sub(r'<text\s[^>]*id="rABC-label"[^>]*>.*?</text>','',moved,flags=re.S).replace('</svg>',label_group('rABC-label',moved_box,TEXT)+'</svg>')
        self.assertIn('REGION_LEADER_READS_AS_SIDE',fx.codes(svg=moved))
        self.assertNotIn('REGION_LEADER_READS_AS_SIDE',fx.codes())
    def with_circle_and_dot(self,circle,dot):
        fx=self.fixture;svg=fx.svg();tag=fx.leader().group(0);old=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*/>',svg).group(0)
        line=re.sub(r'\sy1="[^"]+"',' y1="%.3f"'%dot[1],re.sub(r'\sx1="[^"]+"',' x1="%.3f"'%dot[0],tag))
        moved=re.sub(r'\scy="[^"]+"',' cy="%.3f"'%dot[1],re.sub(r'\scx="[^"]+"',' cx="%.3f"'%dot[0],old))
        ring='<circle data-role="circle" cx="%.3f" cy="%.3f" r="%.3f" fill="none" stroke="#111"/>'%circle
        return svg.replace(tag,line).replace(old,moved).replace('</svg>',ring+'</svg>')
    def test_tamper_dot_inside_a_circle_that_lies_wholly_inside_the_region(self):
        # the incircle of a triangle whose area is the value: a dot inside the circle reads as the circle's area (21 in L21)
        fx=self.fixture;forward=lambda q:(fx.transform['originX']+q[0]*fx.transform['sx'],fx.transform['originY']-q[1]*fx.transform['sy'])
        centre=forward((-1.0,0.2))
        self.assertIn('REGION_LEADER_START_IN_INNER_CIRCLE',fx.codes(svg=self.with_circle_and_dot((centre[0],centre[1],15.0),centre)))
        # a dot in the region but outside that circle is fine
        self.assertNotIn('REGION_LEADER_START_IN_INNER_CIRCLE',fx.codes(svg=self.with_circle_and_dot((centre[0],centre[1],15.0),(centre[0]+40.0,centre[1]))))
    def test_a_circle_across_the_boundary_is_not_an_inner_circle(self):
        fx=self.fixture;forward=lambda q:(fx.transform['originX']+q[0]*fx.transform['sx'],fx.transform['originY']-q[1]*fx.transform['sy'])
        poly=[forward(POINTS[name]) for name in POLYGON];a,b=poly[0],poly[1];mid=((a[0]+b[0])/2,(a[1]+b[1])/2);d=math.dist(a,b);normal=((b[1]-a[1])/d,-(b[0]-a[0])/d)
        if regions.area_state((mid[0]+normal[0]*10,mid[1]+normal[1]*10),[poly])!=1:normal=(-normal[0],-normal[1])
        dot=(mid[0]+normal[0]*12,mid[1]+normal[1]*12)
        self.assertNotIn('REGION_LEADER_START_IN_INNER_CIRCLE',fx.codes(svg=self.with_circle_and_dot((mid[0],mid[1],25.0),dot)))
    def test_a_leader_value_written_inside_its_region_is_not_missing_a_leader(self):
        # the engine writes a LEADER value inside its region when no place outside reads as the value; a label outside the region without a leader is still refused
        fx=self.fixture;svg=fx.svg0;tag=fx.leader().group(0);circle=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*/>',svg).group(0)
        forward=lambda q:(fx.transform['originX']+q[0]*fx.transform['sx'],fx.transform['originY']-q[1]*fx.transform['sy'])
        o=forward((-1.2,0.2));box=fx.row['box']
        inside={'x':o[0]-15,'y':o[1]-9,'width':30.0,'height':18.0}
        bare=re.sub(r'<text\s[^>]*id="rABC-label"[^>]*>.*?</text>','',svg.replace(tag,'').replace(circle,''),flags=re.S)
        self.assertNotIn('REGION_LABEL_LEADER_MISSING',fx.codes(svg=bare.replace('</svg>',label_group('rABC-label',inside,'6')+'</svg>')))
        self.assertIn('REGION_LABEL_LEADER_MISSING',fx.codes(svg=bare.replace('</svg>',label_group('rABC-label',box,TEXT)+'</svg>')))

if __name__=='__main__':unittest.main()
