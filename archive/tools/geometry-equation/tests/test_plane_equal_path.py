"""One equal-length mark for a whole path (E32): equalLengths entries {"path":[segment ids]} (B-E-D against BC). The engine's placement at the path's middle (clear of the inner
joint E), the semantic checks and the independent observer with tamper cases. No Chrome here."""
import math
import re
import sys
import unittest
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from test_plane_dimensions import OBSERVER,build,spec_of   # noqa: E402
from visual_engine.semantic_model import validate   # noqa: E402

def figure(e=6.0):
    points={'B':(0.0,0.0),'E':(e,0.0),'D':(30.0,0.0),'C':(0.0,30.0)}
    segments=[('sBE','B','E'),('sED','E','D'),('sBC','B','C')]
    return points,segments
def objects_of(points,segments,paths=True,count=2,path_mark='AUTO'):
    rows=[{'id':sid,'kind':'SEGMENT','from':list(points[a]),'to':list(points[b])} for sid,a,b in segments]
    mark={'id':'e1','kind':'EQUAL_MARK','refs':['sBE','sBC'],'count':count}
    if paths:mark['paths']={'sBE':['sBE','sED']}
    if path_mark!='AUTO':mark['pathMark']=path_mark
    return rows+[mark]
def marks_of(count=2,path_mark='AUTO'):
    return {'equalLengths':[{'id':'e1','count':count,'segments':[{'path':['sBE','sED']},'sBC'],**({'pathMark':path_mark} if path_mark!='AUTO' else {})}]}

class Fixture:
    def __init__(self,e=6.0,count=2,path_mark='AUTO'):
        self.points,self.segments=figure(e);self.path_mark=path_mark
        self.result=build(spec_of(self.points,objects_of(self.points,self.segments,count=count,path_mark=path_mark),width=720,height=600))
        self.transform=self.result['witness']['coordinateModel'];self.svg=self.result['svg']
    def audit(self,svg=None,marks=None,points=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':{k:list(v) for k,v in (points or self.points).items()},'marks':marks if marks is not None else marks_of(path_mark=self.path_mark),
                               'segments':[{'id':sid,'refs':[a,b]} for sid,a,b in self.segments],'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def ticks(self,piece):
        out=[]
        for m in re.finditer(r'<line\s[^>]*data-mark="equal"[^>]*data-mark-segment="'+piece+r'"[^>]*/>',self.svg):
            tag=m.group(0);x1,y1,x2,y2=[float(re.search(r'\s'+k+r'="([^"]+)"',tag).group(1)) for k in ('x1','y1','x2','y2')]
            out.append(((x1+x2)/2,(y1+y2)/2,tag))
        return out

class SemanticTests(unittest.TestCase):
    def test_a_path_entry_compares_its_total_length(self):
        points,segments=figure();validate(spec_of(points,objects_of(points,segments)))
    def test_the_old_reading_still_fails_for_one_piece(self):
        points,segments=figure()
        with self.assertRaises(ValueError) as caught:validate(spec_of(points,objects_of(points,segments,paths=False)))
        self.assertEqual(str(caught.exception).split(':')[0],'EQUAL_MARK_LENGTH_MISMATCH')
    def test_a_broken_path_is_refused(self):
        points,segments=figure();spec=spec_of(points,objects_of(points,segments))
        for obj in spec['objects']:
            if obj['kind']=='EQUAL_MARK':obj['paths']={'sBE':['sBE','sBC']}
        with self.assertRaises(ValueError):validate(spec)

class EngineTests(unittest.TestCase):
    def test_the_mark_stands_at_the_middle_of_the_path_on_the_piece_it_falls_on(self):
        fixture=Fixture();m=fixture.transform
        self.assertEqual(len(fixture.ticks('sBE')),2);self.assertEqual(len(fixture.ticks('sBC')),2)
        x=sum(t[0] for t in fixture.ticks('sBE'))/2;self.assertAlmostEqual((x-m['originX'])/m['sx'],15.0,delta=0.2)     # the middle of B-E-D = 15, on the piece E-D
    def test_a_middle_near_the_inner_joint_brackets_the_whole_path(self):
        fixture=Fixture(e=14.6);m=fixture.transform
        for part in ('line','cap-from','cap-to'):self.assertIn('id="e1-sBE-bracket-'+part+'"',fixture.svg)
        self.assertEqual(len(fixture.ticks('sBE')),2)
        line=re.search(r'<line\s[^>]*id="e1-sBE-bracket-line"[^>]*/>',fixture.svg).group(0)
        x1,y1,x2,y2=[float(re.search(r'\s'+k+r'="([^"]+)"',line).group(1)) for k in ('x1','y1','x2','y2')]
        self.assertAlmostEqual(math.hypot(x2-x1,y2-y1),30.0*m['sx'],places=4)                   # as long as the whole path B-E-D
        self.assertAlmostEqual(abs(y1-m['originY']),12.0,places=4)                               # 12 px beside it
        mid=((x1+x2)/2,(y1+y2)/2);tick_x=sum(t[0] for t in fixture.ticks('sBE'))/2;tick_y=sum(t[1] for t in fixture.ticks('sBE'))/2
        self.assertAlmostEqual(math.hypot(tick_x-mid[0],tick_y-mid[1]),0.0,places=4)             # the ticks stand at the bracket's middle
    def test_path_mark_tick_stands_at_the_nearest_clear_place_and_bracket_is_forced(self):
        tick=Fixture(e=14.6,path_mark='TICK');m=tick.transform
        self.assertNotIn('bracket',tick.svg)
        x=sum(t[0] for t in tick.ticks('sBE'))/2;self.assertGreaterEqual(abs((x-m['originX'])/m['sx']-14.6)*m['sx'],8.0)
        self.assertEqual(tick.audit()['errors'],[],tick.audit()['errors'])
        forced=Fixture(e=6.0,path_mark='BRACKET');self.assertIn('bracket-line',forced.svg);self.assertEqual(forced.audit()['errors'],[],forced.audit()['errors'])
    def test_observer_reads_the_declared_path_mark(self):
        plain=Fixture(e=6.0)
        self.assertIn('EQUAL_MARK_PATH_NEEDS_BRACKET',plain.codes(marks=marks_of(path_mark='BRACKET')))
        bracketed=Fixture(e=14.6)
        self.assertIn('EQUAL_MARK_PATH_BRACKET_UNEXPECTED',bracketed.codes(marks=marks_of(path_mark='TICK')))
    def test_a_free_middle_needs_no_bracket(self):
        self.assertNotIn('bracket',Fixture(e=6.0).svg)
    def test_observer_accepts_the_genuine_figures(self):
        for e in (6.0,14.6):
            fixture=Fixture(e=e);report=fixture.audit();self.assertEqual(report['errors'],[],(e,report['errors']))

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.fixture=Fixture()
    def test_tamper_tick_on_the_joint(self):
        fixture=self.fixture;m=fixture.transform;svg=fixture.svg
        for x,y,tag in fixture.ticks('sBE'):
            joint=m['originX']+6.0*m['sx']
            moved=re.sub(r'\sx1="[^"]+"',' x1="%.4f"'%joint,tag,count=1);moved=re.sub(r'\sx2="[^"]+"',' x2="%.4f"'%joint,moved,count=1)
            svg=svg.replace(tag,moved)
        self.assertIn('EQUAL_MARK_PATH_ON_JOINT',fixture.codes(svg=svg))
    def test_tamper_lengths_differ(self):
        points={k:list(v) for k,v in self.fixture.points.items()};points['D']=[34.0,0.0]
        self.assertIn('EQUAL_MARK_LENGTH_MISMATCH',self.fixture.codes(points=points))
    def test_tamper_mark_missing_and_wrong_count(self):
        svg=self.fixture.svg;tag=self.fixture.ticks('sBE')[0][2]
        self.assertIn('EQUAL_MARK_MISSING',self.fixture.codes(svg=svg.replace(tag,'')))
        self.assertIn('EQUAL_MARK_MISSING',self.fixture.codes(marks=marks_of(count=3)))
    def test_tamper_bracket_cap_moved_and_crossed(self):
        fixture=Fixture(e=14.6);svg=fixture.svg
        cap=re.search(r'<line\s[^>]*id="e1-sBE-bracket-cap-from"[^>]*/>',svg).group(0)
        moved=re.sub(r'\sy2="([^"]+)"',lambda m:' y2="%.3f"'%(float(m.group(1))+2),cap,count=1)
        self.assertIn('EQUAL_MARK_BRACKET_MISMATCH',fixture.codes(svg=svg.replace(cap,moved)))
        crossing=svg.replace('</svg>','<line id="cut" data-role="line" x1="%.3f" y1="0" x2="%.3f" y2="600" stroke="#111"/></svg>'%(fixture.transform['originX']+10*fixture.transform['sx'],fixture.transform['originX']+10*fixture.transform['sx']))
        self.assertIn('EQUAL_MARK_BRACKET_CROSSES',fixture.codes(svg=crossing))
        self.assertEqual(fixture.audit()['errors'],[])
    def test_tamper_ticks_not_at_the_middle(self):
        fixture=Fixture();svg=fixture.svg
        for x,y,tag in fixture.ticks('sBE'):
            moved=re.sub(r'\sx1="([^"]+)"',lambda m:' x1="%.4f"'%(float(m.group(1))+4),tag,count=1);moved=re.sub(r'\sx2="([^"]+)"',lambda m:' x2="%.4f"'%(float(m.group(1))+4),moved,count=1)
            svg=svg.replace(tag,moved)
        self.assertIn('EQUAL_MARK_PATH_NOT_AT_MIDDLE',fixture.codes(svg=svg))
    def test_tamper_pieces_that_do_not_chain(self):
        marks={'equalLengths':[{'id':'e1','count':2,'segments':[{'path':['sBE','sBC']},'sED']}]}
        self.assertTrue(set(self.fixture.codes(marks=marks))&{'EQUAL_MARK_PATH_NOT_CONNECTED','EQUAL_MARK_MISSING','EQUAL_MARK_LENGTH_MISMATCH'})

if __name__=='__main__':unittest.main()
