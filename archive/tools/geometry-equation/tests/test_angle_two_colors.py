"""An angle in two relations (fillColor): the arc (stroke) colour is one role and the sector fill colour another. The engine draws both, the independent
observer (plane-marks-observer-worker.py) reads both back from the final SVG and checks the equal size inside each role. No Chrome here."""
import re
import sys
import unittest
from pathlib import Path

TESTS=Path(__file__).resolve().parent
GEOMETRY=TESTS.parent
sys.path.insert(0,str(GEOMETRY));sys.path.insert(0,str(GEOMETRY/'production'));sys.path.insert(0,str(TESTS))
from visual_engine.engine import build
from visual_engine.semantic_model import validate
import test_region_fill as rf
import test_plane_marks as pm
from test_color_marks_c1 import clone

OBSERVER=rf.OBSERVER
# parallelogram angles: aD = aB = 70 degrees, aC = aA = 110 degrees. aD and aB: BLUE arcs and WARM fill; aC and aA: GREEN fill with the default arcs
def two_role_parallelogram():
    points,objects=pm.parallelogram()
    objects=[o for o in objects if o['id'] not in {'aOut','p1','p2','e1'}]
    objects.append({'id':'aA','kind':'ANGLE_MARK','refs':['D','A','B'],'value':110.0,'arcs':2})
    objects.append({'id':'aB','kind':'ANGLE_MARK','refs':['A','B','C'],'value':70.0,'arcs':1})
    for o in objects:
        if o['id'] in {'aD','aB'}:o['color']='BLUE';o['fillColor']='WARM'
        if o['id'] in {'aC','aA'}:o['fillColor']='GREEN'
    return points,objects
MARKS={'angles':[{'id':'aD','refs':['A','D','C'],'value':70,'noLabel':True,'color':'BLUE','fillColor':'WARM'},{'id':'aC','refs':['D','C','B'],'value':110,'arcs':2,'noLabel':True,'fillColor':'GREEN'},
                 {'id':'aA','refs':['D','A','B'],'value':110,'arcs':2,'noLabel':True,'fillColor':'GREEN'},{'id':'aB','refs':['A','B','C'],'value':70,'noLabel':True,'color':'BLUE','fillColor':'WARM'}]}

class AngleTwoColourTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.points,objects=two_role_parallelogram();cls.result=build(pm.spec_of(cls.points,objects));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':{k:list(v) for k,v in self.points.items()},'marks':marks if marks is not None else MARKS,'segments':pm.SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def node(self,identifier):return re.search(r'<[a-z]+\s(?:[^>]*\s)?id="'+identifier+r'"[^>]*/>',self.svg).group(0)
    def swap(self,identifier,old,new):
        tag=self.node(identifier);self.assertIn(old,tag);return self.svg.replace(tag,tag.replace(old,new))

    def test_both_roles_are_drawn_and_read_back(self):
        self.assertEqual(self.audit()['errors'],[])
        self.assertIn('stroke="#1f5fa8"',self.node('aD-arc-1'));self.assertIn('fill="#f2a65a"',self.node('aD-sector'))          # BLUE arc over a WARM sector
        self.assertIn('stroke="#111"',self.node('aC-arc-1'));self.assertIn('fill="#6fcf97"',self.node('aC-sector'))             # default arc over a GREEN sector
        self.assertIn('fill-opacity="0.42"',self.node('aC-sector'))
    def test_arc_is_drawn_after_the_sector(self):
        self.assertLess(self.svg.index('id="aD-sector"'),self.svg.index('id="aD-arc-1"'))
    def test_plain_angles_are_untouched(self):
        points,objects=pm.parallelogram();plain=build(pm.spec_of(points,objects))['svg']
        self.assertIn('fill="#d9d9d9"',re.search(r'<polygon\s(?:[^>]*\s)?id="aD-sector"[^>]*/>',plain).group(0))
    def test_tamper_either_role(self):
        self.assertIn('ANGLE_COLOR_MISMATCH',self.codes(svg=self.swap('aD-arc-1','#1f5fa8','#b85c00')))           # the arc colour
        self.assertIn('ANGLE_COLOR_MISMATCH',self.codes(svg=self.swap('aD-sector','#f2a65a','#7fa6e8')))           # the fill colour
        self.assertIn('ANGLE_COLOR_MISMATCH',self.codes(svg=self.swap('aC-sector','#6fcf97','#d9d9d9')))           # a fill that lost its colour
        self.assertIn('ANGLE_EMPHASIS_UNDECLARED',self.codes(svg=self.swap('aC-arc-1','stroke="#111"','stroke="#1f5fa8"')))   # an arc nobody coloured
    def test_fill_colour_declared_in_the_plan_but_not_drawn(self):
        marks=clone(MARKS);marks['angles'][1]['fillColor']='ROSE'
        self.assertIn('ANGLE_COLOR_MISMATCH',self.codes(marks=marks))
    def test_equal_size_is_checked_inside_each_role(self):
        marks=clone(MARKS);marks['angles'][1]['fillColor']='WARM';self.assertIn('ANGLE_COLOR_GROUP_MISMATCH',self.codes(marks=marks))   # 110 degrees in the 70 degree fill
        marks=clone(MARKS);marks['angles'][1]['color']='BLUE';self.assertIn('ANGLE_COLOR_GROUP_MISMATCH',self.codes(marks=marks))       # 110 degrees in the 70 degree arc colour
        points,objects=two_role_parallelogram()
        for o in objects:
            if o['id']=='aC':o['fillColor']='WARM'                  # drawn: a 110 degree sector in the 70 degree group's fill
        svg=build(pm.spec_of(points,objects))['svg'];marks=clone(MARKS);marks['angles'][1]['fillColor']='WARM'
        self.assertIn('ANGLE_COLOR_GROUP_MISMATCH',[e.split(':')[0] for e in OBSERVER.audit({'svg':svg,'points':{k:list(v) for k,v in points.items()},'marks':marks,'segments':pm.SEGMENTS,'transform':self.transform})['errors']])
    def test_unknown_colour_names_are_refused(self):
        marks=clone(MARKS);marks['angles'][0]['fillColor']='TEAL';self.assertIn('ANGLE_COLOR_INVALID',self.codes(marks=marks))
        marks=clone(MARKS);marks['angles'][0]['fillColor']='LIGHT';self.assertIn('ANGLE_COLOR_INVALID',self.codes(marks=marks))
        points,objects=two_role_parallelogram()
        for o in objects:
            if o['id']=='aD':o['fillColor']='TEAL'
        with self.assertRaises(ValueError):validate(pm.spec_of(points,objects))
    def test_arc_must_contrast_with_its_fill(self):
        # the palette's own pairs all pass; a pale arc over a tint is what the check exists for (the swapped stroke also fails the colour check)
        pale=self.swap('aD-arc-1','stroke="#1f5fa8"','stroke="#f6e3c8"')
        self.assertIn('ANGLE_ARC_LOW_CONTRAST',self.codes(svg=pale))
