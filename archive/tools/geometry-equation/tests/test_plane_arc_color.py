"""Palette colour of a highlighted circle arc (G13c, C1): planeMarks.arcs[].color. The engine strokes the arc in the palette line colour; the independent observer
(plane-marks-observer-worker.py) reads the colour back from the final SVG and checks that arcs of one colour have the same length. Tamper cases must fail. No Chrome here."""
import re
import sys
import unittest
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from test_plane_dimensions import OBSERVER,build,spec_of   # noqa: E402
from visual_engine.semantic_model import validate   # noqa: E402

R=30.0
POINTS={'O':(0.0,0.0),'A':(R,0.0),'B':(0.0,R),'C':(-R,0.0),'D':(0.0,-R)}
BLUE_LINE='#1f5fa8'
def arc_object(identifier,a,b,**extra):
    return {'id':identifier,'kind':'CIRCULAR_ARC','centerPoint':'O','startPoint':a,'endPoint':b,'sweep':'CCW','highlight':True,**extra}
def arc_row(identifier,a,b,**extra):
    return {'id':identifier,'circle':'k','center':'O','from':a,'to':b,'side':'CCW',**extra}
# arcAB and arcBC are quarter circles (equal), arcCD too; arcAC is a half circle (twice as long)
OBJECTS=[arc_object('arcAB','A','B',color='BLUE'),arc_object('arcBC','B','C',color='BLUE'),arc_object('arcCD','C','D')]
MARKS={'arcs':[arc_row('arcAB','A','B',color='BLUE'),arc_row('arcBC','B','C',color='BLUE'),arc_row('arcCD','C','D')]}

def spec(objects):
    result=spec_of(POINTS,[{'id':'k','kind':'CIRCLE','center':[0.0,0.0],'radius':R},*objects],width=520,height=520)
    result['viewport'].update(xMin=-R-12,xMax=R+12,yMin=-R-12,yMax=R+12,equalUnits=True)
    return result

class SemanticTests(unittest.TestCase):
    def test_palette_names_only(self):
        validate(spec(OBJECTS))
        with self.assertRaises(ValueError):validate(spec([arc_object('arcAB','A','B',color='TEAL')]))
        with self.assertRaises(ValueError):validate(spec([arc_object('arcAB','A','B',color='LIGHT')]))

class ArcColorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result=build(spec(OBJECTS));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':{k:list(v) for k,v in POINTS.items()},'marks':marks if marks is not None else MARKS,'segments':[],'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def node(self,identifier):return re.search(r'<polyline\s(?:[^>]*\s)?id="'+identifier+r'"[^>]*/>',self.svg).group(0)
    def test_coloured_arcs_wear_the_palette_line_and_the_plain_arc_does_not(self):
        for identifier in ('arcAB','arcBC'):self.assertIn('stroke="'+BLUE_LINE+'"',self.node(identifier))
        self.assertNotIn(BLUE_LINE,self.node('arcCD'))
    def test_observer_accepts_the_genuine_figure(self):
        self.assertEqual(self.audit()['errors'],[])
    def test_dashed_arc_style_is_observed(self):
        objects = [arc_object('arcAB', 'A', 'B', dash=True), arc_object('arcCD', 'C', 'D')]
        marks = {'arcs': [arc_row('arcAB', 'A', 'B', dashed=True), arc_row('arcCD', 'C', 'D')]}
        svg = build(spec(objects))['svg']
        self.assertIn('stroke-dasharray="6 4"', svg)
        self.assertEqual(self.audit(svg=svg, marks=marks)['errors'], [])
        tampered = svg.replace(' stroke-dasharray="6 4"', '', 1)
        self.assertIn('ARC_DASH_MISMATCH:arcAB', self.audit(svg=tampered, marks=marks)['errors'])

    def test_tampered_stroke_colour_is_caught(self):
        tag=self.node('arcAB');wrong=self.svg.replace(tag,tag.replace('stroke="'+BLUE_LINE+'"','stroke="#111"'))
        self.assertNotEqual(wrong,self.svg);self.assertIn('ARC_COLOR_MISMATCH',self.codes(svg=wrong))
    def test_colour_named_in_the_plan_but_not_drawn_is_caught(self):
        marks={'arcs':[arc_row('arcAB','A','B',color='BLUE'),arc_row('arcBC','B','C',color='BLUE'),arc_row('arcCD','C','D',color='BLUE')]}
        self.assertIn('ARC_COLOR_MISMATCH',self.codes(marks=marks))
    def test_one_colour_is_one_length(self):
        marks={'arcs':[arc_row('arcAB','A','B',color='BLUE'),arc_row('arcBC','B','C',color='BLUE')]}
        half=build(spec([arc_object('arcAB','A','B',color='BLUE'),arc_object('arcBC','B','D',color='BLUE')]))
        marks['arcs'][1]=arc_row('arcBC','B','D',color='BLUE')
        result=OBSERVER.audit({'svg':half['svg'],'points':{k:list(v) for k,v in POINTS.items()},'marks':marks,'segments':[],'transform':half['witness']['coordinateModel']})
        self.assertIn('ARC_COLOR_GROUP_MISMATCH',[error.split(':')[0] for error in result['errors']])
    def test_bad_colour_names_and_undrawn_coloured_arcs(self):
        self.assertIn('ARC_COLOR_INVALID',self.codes(marks={'arcs':[arc_row('arcAB','A','B',color='TEAL'),arc_row('arcBC','B','C'),arc_row('arcCD','C','D')]}))
        self.assertIn('ARC_COLOR_INVALID',self.codes(marks={'arcs':[arc_row('arcAB','A','B',color='BLUE',highlight=False),arc_row('arcBC','B','C'),arc_row('arcCD','C','D')]}))

if __name__=='__main__':unittest.main()
