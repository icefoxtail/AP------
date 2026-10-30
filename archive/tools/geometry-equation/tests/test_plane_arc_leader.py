"""Arc labels on a leader (E32): two arcs of one circle each write their own label on a leader that starts on that arc; the engine's outside/inside placement and the independent
observer with tamper cases. No Chrome here (the same hand-written label groups as test_plane_dimensions.py; tests/plane-arc-leader.test.mjs composes real figures)."""
import math
import re
import sys
import unittest
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from test_plane_dimensions import OBSERVER,build,label_group,spec_of   # noqa: E402
from visual_engine.semantic_model import validate   # noqa: E402

R=30.0
POINTS={'O':(0.0,0.0),'A':(R,0.0),'B':(0.0,R),'C':(-R,0.0)}
def arc_object(identifier,a,b,**extra):
    return {'id':identifier,'kind':'CIRCULAR_ARC','centerPoint':'O','startPoint':a,'endPoint':b,'sweep':'CCW','highlight':True,'labelText':'5','labelKind':'MATH','unit':'cm',**extra}
def objects_of(**extra):
    return [arc_object('arcAB','A','B',labelPlacement='LEADER',**extra),arc_object('arcBC','B','C',labelPlacement='LEADER',**extra)]
MARKS={'arcs':[{'id':'arcAB','circle':'k','center':'O','from':'A','to':'B','side':'MINOR','label':'5','unit':'cm','labelPlacement':'LEADER'},
               {'id':'arcBC','circle':'k','center':'O','from':'B','to':'C','side':'MINOR','label':'5','unit':'cm','labelPlacement':'LEADER'}]}

class Fixture:
    def __init__(self,objects):
        spec=spec_of(POINTS,[{'id':'k','kind':'CIRCLE','center':[0.0,0.0],'radius':R},*objects],width=520,height=520)
        spec['viewport'].update(xMin=-R-12,xMax=R+12,yMin=-R-12,yMax=R+12,equalUnits=True)
        self.result=build(spec,measurements={'arcAB-label':[46.0,24.0],'arcBC-label':[46.0,24.0]})
        self.transform=self.result['witness']['coordinateModel'];self.layout=self.result['witness']['layout']
        self.boxes={row['id']:row['box'] for row in self.layout['labels']};self.rows={row['id']:row for row in self.layout['labels']}
        svg=self.result['svg']
        for label_id in ('arcAB-label','arcBC-label'):svg=re.sub(r'<text\s[^>]*id="'+label_id+r'"[^>]*>.*?</text>','',svg,flags=re.S)
        self.base=svg
    def svg(self):
        groups=''.join(label_group(label_id,self.boxes[label_id],'5','cm') for label_id in ('arcAB-label','arcBC-label'))
        return self.base.replace('</svg>',groups+'</svg>')
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in POINTS.items()},'marks':marks if marks is not None else MARKS,'segments':[],'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def leader(self,label_id):return re.search(r'<line\s[^>]*data-role="leader"[^>]*data-owner-label="'+label_id+r'"[^>]*/>',self.result['svg']).group(0)

class SemanticTests(unittest.TestCase):
    def test_the_leader_placement_validates_on_an_arc_only(self):
        spec=spec_of(POINTS,[{'id':'k','kind':'CIRCLE','center':[0.0,0.0],'radius':R},*objects_of()]);validate(spec)
        bad=spec_of(POINTS,[{'id':'k','kind':'CIRCLE','center':[0.0,0.0],'radius':R},arc_object('arcAB','A','B',labelPlacement='INSIDE')])
        with self.assertRaises(ValueError):validate(bad)

class EngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.fixture=Fixture(objects_of())
    def test_both_labels_stand_on_leaders(self):
        self.assertEqual(self.fixture.layout['unresolved'],[])
        for label_id in ('arcAB-label','arcBC-label'):self.assertTrue(self.fixture.rows[label_id]['placement'].startswith('OWNER_LEADER_'),self.fixture.rows[label_id]['placement'])
    def test_every_leader_starts_on_its_own_arc(self):
        m=self.fixture.transform
        for label_id,low,high in (('arcAB-label',0.0,90.0),('arcBC-label',90.0,180.0)):
            node=self.fixture.leader(label_id);x=float(re.search(r'\sx1="([^"]+)"',node).group(1));y=float(re.search(r'\sy1="([^"]+)"',node).group(1))
            dx,dy=(x-m['originX'])/m['sx'],(m['originY']-y)/m['sy']
            self.assertAlmostEqual(math.hypot(dx,dy),R,delta=0.05)
            self.assertTrue(low<=math.degrees(math.atan2(dy,dx))<=high,label_id)
    def test_observer_accepts_the_genuine_figure(self):
        report=self.fixture.audit();self.assertEqual(report['errors'],[],report['errors'])

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.fixture=Fixture(objects_of())
    def test_tamper_leader_missing(self):
        svg=self.fixture.svg();node=self.fixture.leader('arcAB-label')
        self.assertIn('ARC_LABEL_LEADER_MISSING',self.fixture.codes(svg=svg.replace(node,'')))
    def test_tamper_leader_starts_on_the_other_arc(self):
        svg=self.fixture.svg();node=self.fixture.leader('arcAB-label');other=self.fixture.leader('arcBC-label')
        pick=lambda tag,name:re.search(r'\s'+name+r'="([^"]+)"',tag).group(1)
        moved=re.sub(r'\sx1="[^"]+"',' x1="'+pick(other,'x1')+'"',node,count=1);moved=re.sub(r'\sy1="[^"]+"',' y1="'+pick(other,'y1')+'"',moved,count=1)
        self.assertIn('MARK_LEADER_NOT_ON_OWNER',self.fixture.codes(svg=svg.replace(node,moved)))
    def test_tamper_leader_crossing_a_stroke(self):
        svg=self.fixture.svg().replace('</svg>','<line id="cut" data-role="line" x1="0" y1="0" x2="520" y2="520" stroke="#111"/></svg>')
        codes=self.fixture.codes(svg=svg);self.assertTrue('ARC_LABEL_LEADER_CROSSES' in codes or 'MARK_LABEL_OVERLAPS' in codes,codes)

if __name__=='__main__':unittest.main()
