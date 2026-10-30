"""Dimension lines, E32 additions: offset AUTO tiers (the observer's own copy of the rule), extension NONE, offsetPx, style INLINE (the length written on a segment inside the figure)
and crossArcs. The engine's primitives and the independent observer with tamper cases. No Chrome here (the same hand-written label groups as test_plane_dimensions.py);
tests/plane-dimensions-e32.test.mjs composes real figures."""
import math
import re
import sys
import unittest
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from test_plane_dimensions import (Fixture,LINE,LINE_SEGMENTS,OBSERVER,build,dim,seg,spec_of,tag,attribute,points_of,replace_attribute)   # noqa: E402

def peer(points):
    return lambda pid:tuple(points[pid])

class TierTests(unittest.TestCase):
    ROWS=[{'id':'e','from':'A','to':'E','side':'ABOVE','offset':'AUTO'},{'id':'f','from':'E','to':'C','side':'ABOVE','offset':'AUTO'},{'id':'g','from':'A','to':'C','side':'ABOVE','offset':'AUTO'}]
    POINTS={'A':(0.0,0.0),'E':(12.0,0.0),'C':(15.0,0.0)}
    def test_disjoint_spans_share_a_tier_and_the_total_stands_outside(self):
        tiers=OBSERVER.resolve_dimension_tiers(self.ROWS,peer(self.POINTS))
        self.assertEqual(tiers,{'e':1,'f':1,'g':2})
    def test_a_fixed_offset_keeps_its_tier_and_blocks_it(self):
        rows=[{**self.ROWS[0],'offset':1},self.ROWS[2]]
        self.assertEqual(OBSERVER.resolve_dimension_tiers(rows,peer(self.POINTS)),{'e':1,'g':2})
    def test_other_sides_and_other_lines_do_not_compete(self):
        points={**self.POINTS,'P':(0.0,5.0),'Q':(15.0,5.0)}
        rows=[self.ROWS[2],{'id':'h','from':'A','to':'C','side':'BELOW','offset':'AUTO'},{'id':'i','from':'P','to':'Q','side':'ABOVE','offset':'AUTO'}]
        self.assertEqual(OBSERVER.resolve_dimension_tiers(rows,peer(points)),{'g':1,'h':1,'i':1})
    def test_three_nested_spans_take_three_tiers(self):
        points={'A':(0.0,0.0),'B':(5.0,0.0),'C':(10.0,0.0),'D':(20.0,0.0)}
        rows=[{'id':'x','from':'A','to':'D','side':'BELOW','offset':'AUTO'},{'id':'y','from':'A','to':'C','side':'BELOW','offset':'AUTO'},{'id':'z','from':'A','to':'B','side':'BELOW','offset':'AUTO'}]
        self.assertEqual(OBSERVER.resolve_dimension_tiers(rows,peer(points)),{'z':1,'y':2,'x':3})

def inline_objects():
    return [seg('sAB',LINE,'A','B'),seg('sBC',LINE,'B','C'),dim('i1','A','B','ABOVE',style='INLINE',labelText='36')]
def inline_marks(**extra):
    return {'dimensions':[{'id':'i1','from':'A','to':'B','side':'ABOVE','style':'INLINE','label':'36','unit':'cm',**extra}]}

class InlineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture=Fixture(LINE,inline_objects(),{'i1-label':('36','cm')})
    def test_an_inline_dimension_draws_two_arrowheads_inside_the_points_and_no_line(self):
        svg=self.fixture.result['svg'];m=self.fixture.transform
        self.assertNotIn('id="i1-line"',svg);self.assertNotIn('id="i1-ext-from"',svg)
        head=points_of(tag(svg,'i1-arrow-from'));self.assertAlmostEqual(head[0][0],m['originX']+5.0,places=6);self.assertAlmostEqual(head[0][1],m['originY'],places=6)
        self.assertAlmostEqual(head[1][0],head[0][0]+10,places=6)
        tail=points_of(tag(svg,'i1-arrow-to'));self.assertAlmostEqual(tail[0][0],m['originX']+36*m['sx']-5.0,places=6)
    def test_the_label_stands_beside_the_segment(self):
        row={r['id']:r for r in self.fixture.layout['labels']}['i1-label'];box=row['box'];m=self.fixture.transform
        self.assertEqual(row['placement'],'DIMENSION_OUTSIDE');self.assertLess(box['y']+box['height'],m['originY']-5.9)         # ABOVE: the nearest edge at least 6 px over the segment
        self.assertLess(m['originY']-(box['y']+box['height']),30.0)
    def test_observer_accepts_the_genuine_figure(self):
        report=self.fixture.audit(marks=inline_marks(),segments=LINE_SEGMENTS);self.assertEqual(report['errors'],[],report['errors'])
    def test_tamper_arrow_moved_and_line_added(self):
        moved=self.fixture.svg().replace(tag(self.fixture.svg(),'i1-arrow-from'),re.sub(r'points="([-\d.]+),',lambda m:'points="%.3f,'%(float(m.group(1))+3),tag(self.fixture.svg(),'i1-arrow-from'),count=1))
        self.assertIn('DIMENSION_ARROW_MISMATCH',self.fixture.codes(svg=moved,marks=inline_marks(),segments=LINE_SEGMENTS))
        extra=self.fixture.svg().replace('</svg>','<line id="i1-line" data-role="indicator" data-mark="dimension" data-mark-id="i1" data-mark-part="line" x1="0" y1="0" x2="9" y2="0" stroke="#111"/></svg>')
        self.assertIn('DIMENSION_PART_UNEXPECTED',self.fixture.codes(svg=extra,marks=inline_marks(),segments=LINE_SEGMENTS))
    def test_inline_takes_no_offset_or_extension(self):
        for extra in ({'offsetPx':12},{'extension':'NONE'},{'offset':2}):
            row={**dim('i1','A','B','ABOVE',style='INLINE',labelText='36'),**extra}
            with self.assertRaises(ValueError) as caught:build(spec_of(LINE,[seg('sAB',LINE,'A','B'),row]))
            self.assertTrue(str(caught.exception).startswith(('DIMENSION_INLINE_FIELD_INVALID','DIMENSION_OFFSET_INVALID')),str(caught.exception))

class ExtensionAndOffsetTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        objects=[seg('sAB',LINE,'A','B'),seg('sBC',LINE,'B','C'),dim('n1','A','B','BELOW',style='ARROW',extension='NONE',offsetPx=12,labelText='36'),
                 dim('n2','B','C','BELOW',offsetPx=12,labelText='24'),dim('n3','A','C','BELOW',style='ARROW',offsetPx=12,offset=2,labelText='60')]
        cls.fixture=Fixture(LINE,objects,{'n1-label':('36','cm'),'n2-label':('24','cm'),'n3-label':('60','cm')})
    def marks(self):
        return {'dimensions':[{'id':'n1','from':'A','to':'B','side':'BELOW','style':'ARROW','extension':'NONE','offsetPx':12,'label':'36','unit':'cm'},
                              {'id':'n2','from':'B','to':'C','side':'BELOW','offsetPx':12,'label':'24','unit':'cm'},
                              {'id':'n3','from':'A','to':'C','side':'BELOW','style':'ARROW','offsetPx':12,'offset':2,'label':'60','unit':'cm'}]}
    def test_extension_none_draws_no_extension_lines_and_offset_px_moves_the_first_tier(self):
        svg=self.fixture.result['svg'];m=self.fixture.transform
        self.assertNotIn('id="n1-ext-from"',svg);self.assertIn('id="n1-line"',svg);self.assertIn('id="n2-ext-from"',svg)
        self.assertAlmostEqual(float(attribute(tag(svg,'n2-line'),'y1')),m['originY']+12,places=6)
        self.assertAlmostEqual(float(attribute(tag(svg,'n3-line'),'y1')),m['originY']+12+44,places=6)       # offsetPx is the first tier; each further tier is one 44 px step
        self.assertAlmostEqual(float(attribute(tag(svg,'n1-line'),'y1')),m['originY']+12,places=6)
    def test_observer_accepts_the_genuine_figure(self):
        report=self.fixture.audit(marks=self.marks(),segments=LINE_SEGMENTS);self.assertEqual(report['errors'],[],report['errors'])
    def test_tamper_extension_present_or_offset_wrong(self):
        extra=self.fixture.svg().replace('</svg>','<line id="n1-ext-from" data-role="indicator" data-mark="dimension" data-mark-id="n1" data-mark-part="ext-from" x1="0" y1="0" x2="0" y2="9" stroke="#111"/></svg>')
        self.assertIn('DIMENSION_PART_UNEXPECTED',self.fixture.codes(svg=extra,marks=self.marks(),segments=LINE_SEGMENTS))
        wrong=self.marks();wrong['dimensions'][1]['offsetPx']=20
        self.assertIn('DIMENSION_OFFSET_MISMATCH',self.fixture.codes(marks=wrong,segments=LINE_SEGMENTS))
        invalid=self.marks();invalid['dimensions'][1]['offsetPx']=300
        self.assertIn('DIMENSION_OFFSET_PX_INVALID',self.fixture.codes(marks=invalid,segments=LINE_SEGMENTS))
    def test_a_first_tier_too_near_for_its_extension_lines_is_refused(self):
        with self.assertRaises(ValueError) as caught:build(spec_of(LINE,[seg('sAB',LINE,'A','B'),dim('n','A','B','BELOW',offsetPx=8,labelText='36')]))
        self.assertEqual(str(caught.exception),'DIMENSION_OFFSET_TOO_NEAR:n')
        build(spec_of(LINE,[seg('sAB',LINE,'A','B'),dim('n','A','B','BELOW',offsetPx=8,extension='NONE',labelText='36')]))

class CrossArcsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        points={'A':(0.0,0.0),'B':(36.0,0.0),'O':(18.0,-30.0)}
        objects=[seg('sAB',points,'A','B'),{'id':'k','kind':'CIRCLE','center':[18.0,-30.0],'radius':25.0},dim('d','A','B','BELOW',labelText='36')]
        cls.points=points;cls.fixture=Fixture(points,objects,{'d-label':('36','cm')})
    def marks(self,**extra):return {'dimensions':[{'id':'d','from':'A','to':'B','side':'BELOW','label':'36','unit':'cm',**extra}]}
    def test_a_dimension_line_crossing_a_circle_is_refused_unless_crossarcs_allows_it(self):
        segments=[{'id':'sAB','refs':['A','B']}]
        self.assertIn('DIMENSION_CROSSES_STROKE',self.fixture.codes(marks=self.marks(),segments=segments))
        self.assertNotIn('DIMENSION_CROSSES_STROKE',self.fixture.codes(marks=self.marks(crossArcs=True),segments=segments))

if __name__=='__main__':unittest.main()
