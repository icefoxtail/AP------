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
def region_text(marks):return regions.region_label_text(marks['regions'][0])
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
    def tampered_beside_side(self,arc=False,text=TEXT):
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
        moved=re.sub(r'<text\s[^>]*id="rABC-label"[^>]*>.*?</text>','',moved,flags=re.S).replace('</svg>',label_group('rABC-label',moved_box,text)+'</svg>')
        if arc:
            # the same boundary drawn as an arc: one polyline of many pieces (a sector's arc), not a straight line
            for line_tag in re.findall(r'<line\s[^>]*data-role="line"[^>]*/>',moved):
                xs=[float(re.search(r'\s%s="([^"]+)"'%k,line_tag).group(1)) for k in ('x1','y1','x2','y2')]
                if (math.dist(xs[:2],a)<0.5 and math.dist(xs[2:],b)<0.5) or (math.dist(xs[:2],b)<0.5 and math.dist(xs[2:],a)<0.5):
                    points=' '.join('%.3f,%.3f'%(a[0]+(b[0]-a[0])*k/12,a[1]+(b[1]-a[1])*k/12) for k in range(13))
                    moved=moved.replace(line_tag,'<polyline data-role="circularArc" id="arcAB" points="'+points+'" fill="none" stroke="#111"/>')
        return moved
    @staticmethod
    def value_marks(**row):
        """The region row of the fixture with only the fields given (a bare value '6' unless the row says more)."""
        return {'regions':[{'id':'rABC','fill':'LIGHT','label':'6','labelPlacement':'LEADER','shapes':[{'polygon':POLYGON}],**row}]}
    def test_tamper_value_right_above_the_middle_of_a_side(self):
        # the first answer for the trapezoid with a height and a diagonal: the dot 10 px inside the middle of the side AE, the value right above that side's middle, a short leader:
        # the student reads it as the length of the side. The observer refuses it on its own (not on any mark of the producer). A BARE number: no name, no unit.
        self.assertIn('REGION_LEADER_READS_AS_SIDE',self.fixture.codes(svg=self.tampered_beside_side(text='6'),marks=self.value_marks()))
        self.assertNotIn('REGION_LEADER_READS_AS_SIDE',self.fixture.codes())
    def test_tamper_value_beside_an_arc_reads_as_its_length(self):
        # a sector's value right beside its arc reads as the arc's length: the whole arc is one boundary, however many pieces it is drawn in
        moved=self.tampered_beside_side(arc=True,text='6');self.assertIn('arcAB',moved)
        self.assertIn('REGION_LEADER_READS_AS_SIDE',self.fixture.codes(svg=moved,marks=self.value_marks()))
    def test_a_value_with_a_length_unit_is_still_a_length_beside_a_boundary(self):
        # '6cm' reads as a length: the exemption is for a name or an area / volume unit only
        marks=self.value_marks(unit='cm')
        self.assertIn('REGION_LEADER_READS_AS_SIDE',self.fixture.codes(svg=self.tampered_beside_side(text='6cm'),marks=marks))
    def test_a_value_that_names_its_region_or_its_area_unit_may_stand_beside_a_boundary(self):
        # 부채꼴 AOB=8cm² / 6cm²: the letters say it is the region's value. Both are drawn here exactly as the plan says.
        named=self.value_marks(labelName='\u25b3ABC',unit='cm^2');self.assertEqual(region_text(named),'\u25b3ABC=6cm\u00b2')
        self.assertNotIn('REGION_LEADER_READS_AS_SIDE',self.fixture.codes(svg=self.tampered_beside_side(text=region_text(named)),marks=named))
        only_unit=self.value_marks(unit='cm^2')
        self.assertNotIn('REGION_LEADER_READS_AS_SIDE',self.fixture.codes(svg=self.tampered_beside_side(text=region_text(only_unit)),marks=only_unit))
    def test_tamper_the_name_or_unit_erased_from_the_drawing_is_not_exempt(self):
        # the plan names the value but the drawn label is the bare number: no exemption, the reading rule applies (and the text check fails too)
        named=self.value_marks(labelName='\u25b3ABC',unit='cm^2')
        codes=self.fixture.codes(svg=self.tampered_beside_side(text='6'),marks=named)
        self.assertIn('REGION_LEADER_READS_AS_SIDE',codes);self.assertIn('LABEL_TEXT_MISMATCH',codes)
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
    def test_tamper_value_written_inside_a_circle_that_lies_wholly_inside_the_region(self):
        # a LEADER value the engine wrote inside its region (no leader) must not stand in the incircle: it would read as that circle's area. Deleting the rule must fail this test.
        fx=self.fixture;svg=fx.svg0;tag=fx.leader().group(0);dot=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*/>',svg).group(0)
        forward=lambda q:(fx.transform['originX']+q[0]*fx.transform['sx'],fx.transform['originY']-q[1]*fx.transform['sy'])
        o=forward((-1.2,0.2));inside={'x':o[0]-15,'y':o[1]-9,'width':30.0,'height':18.0}
        bare=re.sub(r'<text\s[^>]*id="rABC-label"[^>]*>.*?</text>','',svg.replace(tag,'').replace(dot,''),flags=re.S)
        ring=lambda cx,cy,r:'<circle data-role="circle" cx="%.3f" cy="%.3f" r="%.3f" fill="none" stroke="#111"/>'%(cx,cy,r)
        label=label_group('rABC-label',inside,'6')
        self.assertIn('REGION_VALUE_IN_INNER_CIRCLE',fx.codes(svg=bare.replace('</svg>',ring(o[0],o[1],25.0)+label+'</svg>')))
        self.assertNotIn('REGION_VALUE_IN_INNER_CIRCLE',fx.codes(svg=bare.replace('</svg>',ring(o[0]+90.0,o[1],25.0)+label+'</svg>')))
    def test_the_observer_measures_only_the_regions_stretch_of_a_drawn_circle(self):
        centre=(200.0,200.0);r=100.0
        ring=[(centre[0]+r*math.cos(k*math.pi/36),centre[1]-r*math.sin(k*math.pi/36)) for k in range(73)]
        sector=[[centre]+[(centre[0]+r*math.cos(math.radians(a)),centre[1]-r*math.sin(math.radians(a))) for a in range(20,161,2)]]
        run=regions.region_stretch(ring,(centre[0],centre[1]-r),sector)
        self.assertTrue(20<len(run)<40,len(run))
        self.assertTrue(all(min(regions.point_segment_distance(p,a,b) for a,b in zip(sector[0],sector[0][1:]+sector[0][:1]))<=2.5 for p in run))
        self.assertEqual(regions.region_stretch([(0.0,0.0),(10.0,0.0)],(5.0,0.0),sector),[(0.0,0.0),(10.0,0.0)])
    def test_a_leader_value_written_inside_its_region_is_not_missing_a_leader(self):
        # the engine writes a LEADER value inside its region when no place outside reads as the value; a label outside the region without a leader is still refused
        fx=self.fixture;svg=fx.svg0;tag=fx.leader().group(0);circle=re.search(r'<circle\s[^>]*data-role="leader-dot"[^>]*/>',svg).group(0)
        forward=lambda q:(fx.transform['originX']+q[0]*fx.transform['sx'],fx.transform['originY']-q[1]*fx.transform['sy'])
        o=forward((-1.2,0.2));box=fx.row['box']
        inside={'x':o[0]-15,'y':o[1]-9,'width':30.0,'height':18.0}
        bare=re.sub(r'<text\s[^>]*id="rABC-label"[^>]*>.*?</text>','',svg.replace(tag,'').replace(circle,''),flags=re.S)
        self.assertNotIn('REGION_LABEL_LEADER_MISSING',fx.codes(svg=bare.replace('</svg>',label_group('rABC-label',inside,'6')+'</svg>')))
        self.assertIn('REGION_LABEL_LEADER_MISSING',fx.codes(svg=bare.replace('</svg>',label_group('rABC-label',box,TEXT)+'</svg>')))


# a whole disk (the region's boundary is a circle all round: the loop of two arcs) with the circle drawn: no ends, so a value beside it reads as the circle's length wherever it stands
DISK_POINTS={'O':(0.0,0.0),'A':(2.0,0.0),'B':(0.0,2.0)}
DISK_LOOP={'start':'A','steps':[{'to':'B','arc':{'center':'O','sweep':'CCW'}},{'to':'A','arc':{'center':'O','sweep':'CCW'}}]}
DISK_PLAN_LOOP={'start':'A','steps':[{'to':'B','arc':{'center':'O','side':'MINOR'}},{'to':'A','arc':{'center':'O','side':'MAJOR'}}]}

class DiskFixture:
    def __init__(self,text,kind='MATH',weight=None,size=(36.0,18.0)):
        objects=[{'id':k,'kind':'POINT','at':list(v),'name':k} for k,v in DISK_POINTS.items()]+[{'id':'k','kind':'CIRCLE','center':[0.0,0.0],'radius':2.0}]
        objects.append({'id':'rD','kind':'FILL_REGION','fill':'LIGHT','loops':[DISK_LOOP],'labelText':text,'labelKind':kind,'labelPlacement':'LEADER',**({'labelWeight':weight} if weight else {})})
        spec={'id':'disk','visualType':'line_circle_geometry','viewport':{'xMin':-3.6,'xMax':3.6,'yMin':-3.3,'yMax':3.3,'width':560,'height':420,'panel':0,'equalUnits':True},
              'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},'objects':objects}
        self.result=build(spec,measurements={'rD-label':list(size)})
        self.transform=self.result['witness']['coordinateModel'];self.svg0=self.result['svg']
        self.row={row['id']:row for row in self.result['witness']['layout']['labels']}['rD-label']
        c=re.search(r'<circle\s[^>]*data-role="circle"[^>]*/>',self.svg0).group(0)
        self.circle=tuple(float(re.search(r'\s%s="([^"]+)"'%k,c).group(1)) for k in ('cx','cy','r'))
        self.text=text
    def ring_distances(self,box):
        cx,cy,r=self.circle
        return [abs(math.dist((box['x']+box['width']*i/4,box['y']+box['height']*j/2),(cx,cy))-r) for i in range(5) for j in range(3)]
    def inside(self,box):
        cx,cy,r=self.circle
        return all(math.dist((box['x']+box['width']*i,box['y']+box['height']*j),(cx,cy))<r for i in (0,1) for j in (0,1))
    def audit(self,svg,marks):
        return OBSERVER.audit({'svg':svg,'points':{k:list(v) for k,v in DISK_POINTS.items()},'marks':marks,'segments':[],'transform':self.transform})
    def marks(self,**row):
        return {'regions':[{'id':'rD','fill':'LIGHT','label':self.text,'labelPlacement':'LEADER','shapes':[{'loop':DISK_PLAN_LOOP}],**row}]}
    def codes(self,svg,marks):return [error.split(':')[0] for error in self.audit(svg,marks)['errors']]
    def leader_exit(self):
        tag=re.search(r'<line\s[^>]*data-role="leader"[^>]*data-owner-label="rD-label"[^>]*/>',self.svg0).group(0)
        a,b=[(float(re.search(r'\s%s="([^"]+)"'%x,tag).group(1)),float(re.search(r'\s%s="([^"]+)"'%y,tag).group(1))) for x,y in (('x1','y1'),('x2','y2'))]
        cx,cy,r=self.circle
        return next(((a[0]+(b[0]-a[0])*k/400,a[1]+(b[1]-a[1])*k/400) for k in range(400) if math.dist((a[0]+(b[0]-a[0])*k/400,a[1]+(b[1]-a[1])*k/400),(cx,cy))>=r))
    def with_label_at(self,box):
        base=re.sub(r'<text\s[^>]*id="rD-label"[^>]*>.*?</text>','',self.svg0,flags=re.S)
        return base.replace('</svg>',label_group('rD-label',box,self.text)+'</svg>')

class DiskTests(unittest.TestCase):
    """The circle that is the whole boundary of a disk region: the generator and the observer both see it, a named value is exempt only when its name or unit says it is not a length."""
    def test_generator_keeps_a_bare_value_away_from_a_circle_that_is_the_whole_boundary(self):
        fx=DiskFixture('16pi')
        self.assertTrue(fx.row['placement'].startswith('OWNER_LEADER_'),fx.row['placement'])
        self.assertGreater(min(fx.ring_distances(fx.row['box'])),48.0)
    def test_generator_lets_a_value_with_a_name_stand_beside_the_circle_but_not_AB_or_l(self):
        wide=(150.0,24.0)
        named=DiskFixture('\ubd80\ucc44\uaf34 AOB=8cm\u00b2','TEXT','MATH',wide)
        self.assertLessEqual(min(named.ring_distances(named.row['box'])),48.0,'a named value may stand beside the circle (the exemption is wired to the layout)')
        for text in ('AB=16\u03c0','l=6'):
            plain=DiskFixture(text,'TEXT','MATH',wide)
            self.assertGreater(min(plain.ring_distances(plain.row['box'])),48.0,text+' reads as a length: it keeps off the circle')
    def tamper_beside_the_circle(self,fx,degrees):
        cx,cy,r=fx.circle;exit_at=fx.leader_exit();theta=math.atan2(exit_at[1]-cy,exit_at[0]-cx)+math.radians(degrees)
        centre=(cx+(r+31.0)*math.cos(theta),cy+(r+31.0)*math.sin(theta))
        return fx.with_label_at({'x':centre[0]-18.0,'y':centre[1]-9.0,'width':36.0,'height':18.0})
    def test_observer_refuses_a_bare_value_beside_the_circle_on_either_side_of_the_seam(self):
        # the circle has no ends: just past the point where the leader leaves, on either side, the value is as much a length as anywhere else
        fx=DiskFixture('16pi')
        for degrees in (8.0,-8.0,90.0):
            self.assertIn('REGION_LEADER_READS_AS_SIDE',fx.codes(self.tamper_beside_the_circle(fx,degrees),fx.marks()),degrees)
        self.assertNotIn('REGION_LEADER_READS_AS_SIDE',fx.codes(fx.with_label_at(fx.row['box']),fx.marks()))   # the genuine figure is not refused
    def test_observer_exempts_a_name_that_is_not_a_length_and_refuses_AB_and_l(self):
        for name,text,exempt in (('\ubd80\ucc44\uaf34 AOB','\ubd80\ucc44\uaf34 AOB=16\u03c0',True),('S','S=16\u03c0',True),('AB','AB=16\u03c0',False),('l','l=16\u03c0',False)):
            fx=DiskFixture(text,'TEXT','MATH',(120.0,22.0));marks=fx.marks(labelName=name,label='16pi')
            drawn=regions.region_label_text(marks['regions'][0])
            moved=fx.with_label_at({'x':fx.circle[0]+fx.circle[2]+20.0,'y':fx.circle[1]-11.0,'width':120.0,'height':22.0}).replace('data-text="'+text+'"','data-text="'+drawn+'"')
            self.assertEqual(exempt,'REGION_LEADER_READS_AS_SIDE' not in fx.codes(moved,marks),name)

if __name__=='__main__':unittest.main()
