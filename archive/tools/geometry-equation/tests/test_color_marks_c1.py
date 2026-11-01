"""Colour groups of plane figures (C1-2, C1-3): angle colours + equalAngles, segment colours (segmentColors), and the colour of equalLengths / parallels groups.
The engine draws the colours; the independent observer (plane-marks-observer-worker.py) recomputes sizes, lengths and directions from the peer points and reads the
colours back from the final SVG. Tamper cases change a colour, a width or a size so that the observer must fail. No Chrome here."""
import importlib.util
import json
import re
import sys
import unittest
from pathlib import Path

TESTS=Path(__file__).resolve().parent
GEOMETRY=TESTS.parent
PRODUCTION=GEOMETRY/'production'
sys.path.insert(0,str(GEOMETRY))
sys.path.insert(0,str(PRODUCTION))
sys.path.insert(0,str(TESTS))
from visual_engine.engine import build
from visual_engine.semantic_model import validate
import test_region_fill as rf
import test_plane_marks as pm

OBSERVER=rf.OBSERVER
clone=lambda value:json.loads(json.dumps(value))

# ---- angles, segments, parallel and equal-length marks on the parallelogram of test_plane_marks
def coloured_parallelogram():
    points,objects=pm.parallelogram()
    objects=[o for o in objects if o['id'] not in {'aOut','p2'}]
    objects.append({'id':'aA','kind':'ANGLE_MARK','refs':['D','A','B'],'value':110.0,'arcs':2})
    objects.append({'id':'aB','kind':'ANGLE_MARK','refs':['A','B','C'],'value':70.0,'arcs':1})
    for o in objects:
        if o['id'] in {'aD','aB'}:o['color']='BLUE'
        if o['id'] in {'aC','aA'}:o['color']='WARM'
        if o['id'] in {'sBC','sDA'}:o['color']='ROSE'
        if o['id']=='p1':o['color']='VIOLET'
    for o in objects:
        if o['id']=='p1':o['color']='VIOLET'
    for o in objects:
        if o['id'] in {'sAB','sCD'}:o['color']='VIOLET'
    return points,objects
COLOURED_MARKS={'angles':[{'id':'aD','refs':['A','D','C'],'value':70,'noLabel':True},{'id':'aC','refs':['D','C','B'],'value':110,'arcs':2,'noLabel':True},
                          {'id':'aA','refs':['D','A','B'],'value':110,'arcs':2,'noLabel':True},{'id':'aB','refs':['A','B','C'],'value':70,'noLabel':True}],
                'equalAngles':[{'angles':['aD','aB'],'color':'BLUE'},{'angles':['aC','aA'],'color':'WARM'}],
                'parallels':[{'id':'p1','count':1,'segments':['sAB','sCD'],'color':'VIOLET'}],
                'equalLengths':[{'id':'e1','count':2,'segments':['sBC','sDA']}],
                'segmentColors':[{'segments':['sBC','sDA'],'color':'ROSE'}]}

class MarkColorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.points,objects=coloured_parallelogram();cls.result=build(pm.spec_of(cls.points,objects));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
    def audit(self,svg=None,marks=None,segments=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':{k:list(v) for k,v in self.points.items()},'marks':marks if marks is not None else COLOURED_MARKS,'segments':segments if segments is not None else pm.SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def node(self,identifier):return re.search(r'<[a-z]+\s(?:[^>]*\s)?id="'+identifier+r'"[^>]*/>',self.svg).group(0)
    def swap(self,identifier,old,new):
        tag=self.node(identifier);self.assertIn(old,tag);return self.svg.replace(tag,tag.replace(old,new))

    def test_genuine_figure_passes_and_draws_the_palette(self):
        self.assertEqual(self.audit()['errors'],[])
        arc=self.node('aD-arc-1');self.assertIn('stroke="#1f5fa8"',arc)
        sector=self.node('aD-sector');self.assertIn('fill="#7fa6e8"',sector);self.assertIn('fill-opacity="0.32"',sector)
        sector=self.node('aC-sector');self.assertIn('fill="#f2a65a"',sector);self.assertIn('fill-opacity="0.42"',sector)
        segment=self.node('sBC');self.assertIn('stroke="#b8325f"',segment);self.assertIn('stroke-width="%s"'%'2.4',segment)
        self.assertIn('stroke="#6b46b3"',self.node('sAB'))
        self.assertIn('stroke="#6b46b3"',self.node('p1-sAB-1'))
        self.assertIn('stroke="#111"',self.node('e1-sBC-1'))          # a group without a colour keeps the default mark
    def test_uncoloured_angle_keeps_the_old_gray_sector(self):
        points,objects=pm.parallelogram();plain=build(pm.spec_of(points,objects))['svg']
        tag=re.search(r'<polygon\s(?:[^>]*\s)?id="aD-sector"[^>]*/>',plain).group(0);self.assertIn('fill="#d9d9d9"',tag);self.assertNotIn('fill-opacity',tag)
    def test_tamper_arc_colour_and_sector_colour(self):
        self.assertIn('ANGLE_COLOR_MISMATCH',self.codes(svg=self.swap('aD-arc-1','#1f5fa8','#b85c00')))
        self.assertIn('ANGLE_COLOR_MISMATCH',self.codes(svg=self.swap('aC-sector','#f2a65a','#7fa6e8')))
        self.assertIn('ANGLE_COLOR_MISMATCH',self.codes(svg=self.swap('aA-sector','fill-opacity="0.42"','fill-opacity="0.8"')))
    def test_same_colour_for_angles_of_different_size_is_refused(self):
        marks=clone(COLOURED_MARKS);marks['equalAngles']=[{'angles':['aD','aC'],'color':'BLUE'},{'angles':['aB','aA'],'color':'WARM'}]
        self.assertIn('ANGLE_COLOR_GROUP_MISMATCH',self.codes(marks=marks))
        built=clone(COLOURED_MARKS);built['equalAngles']=[{'angles':['aD','aB','aC'],'color':'BLUE'}]
        points,objects=coloured_parallelogram()
        for o in objects:
            if o['id']=='aC':o['color']='BLUE'                       # drawn: a 110 degree angle in the 70 degree group's colour
        svg=build(pm.spec_of(points,objects))['svg']
        self.assertIn('ANGLE_COLOR_GROUP_MISMATCH',[e.split(':')[0] for e in OBSERVER.audit({'svg':svg,'points':{k:list(v) for k,v in points.items()},'marks':built,'segments':pm.SEGMENTS,'transform':self.transform})['errors']])
    def test_angle_colour_declared_in_the_plan_but_not_drawn(self):
        points,objects=coloured_parallelogram()
        for o in objects:
            if o['id']=='aD':del o['color']
        svg=build(pm.spec_of(points,objects))['svg']
        self.assertIn('ANGLE_COLOR_MISMATCH',[e.split(':')[0] for e in OBSERVER.audit({'svg':svg,'points':{k:list(v) for k,v in points.items()},'marks':COLOURED_MARKS,'segments':pm.SEGMENTS,'transform':self.transform})['errors']])
    def test_bad_equal_angles_rows(self):
        marks=clone(COLOURED_MARKS);marks['equalAngles'][0]['color']='TEAL';self.assertIn('ANGLE_COLOR_INVALID',self.codes(marks=marks))
        marks=clone(COLOURED_MARKS);marks['equalAngles'][0]['angles']=['aD','aZ'];self.assertIn('ANGLE_COLOR_INVALID',self.codes(marks=marks))
    def test_segment_colour_tamper(self):
        self.assertIn('SEGMENT_COLOR_MISMATCH',self.codes(svg=self.swap('sBC','#b8325f','#1f5fa8')))          # another palette colour
        self.assertIn('SEGMENT_COLOR_MISMATCH',self.codes(svg=self.swap('sDA','stroke-width="2.4"','stroke-width="1.6"')))   # not heavier than a plain segment
        self.assertIn('SEGMENT_COLOR_MISMATCH',self.codes(svg=self.swap('p1-sAB-1','#6b46b3','#111')))        # the arrow lost the group's colour
    def test_segment_coloured_but_not_declared(self):
        marks=clone(COLOURED_MARKS);del marks['segmentColors']
        self.assertIn('SEGMENT_COLOR_UNDECLARED',self.codes(marks=marks))
    def test_segment_colour_rows(self):
        def with_(rows):
            marks=clone(COLOURED_MARKS);marks['segmentColors']=rows;return self.codes(marks=marks)
        self.assertIn('SEGMENT_COLOR_UNKNOWN_SEGMENT',with_([{'segments':['sXX'],'color':'ROSE'}]))
        self.assertIn('SEGMENT_COLOR_DUPLICATE',with_([{'segments':['sBC'],'color':'ROSE'},{'segments':['sBC'],'color':'WARM'}]))
        self.assertIn('SEGMENT_COLOR_INVALID',with_([{'segments':['sBC'],'color':'TEAL'}]))
        self.assertIn('SEGMENT_COLOR_GROUP_MISMATCH',with_([{'segments':['sBC'],'color':'VIOLET'}]))             # VIOLET already belongs to the parallel group p1
    def test_parallel_group_colour_needs_really_parallel_segments(self):
        marks=clone(COLOURED_MARKS);marks['parallels'][0]['segments']=['sAB','sBC']
        self.assertIn('SEGMENT_COLOR_GROUP_MISMATCH',self.codes(marks=marks))
    def test_equal_length_group_colour_needs_really_equal_segments(self):
        marks=clone(COLOURED_MARKS);marks['equalLengths']=[{'id':'e1','count':2,'segments':['sBC','sAB'],'color':'GREEN'}];marks['segmentColors']=[]
        self.assertIn('SEGMENT_COLOR_GROUP_MISMATCH',self.codes(marks=marks))
    def test_group_colour_of_an_equal_length_row_colours_its_segments_and_ticks(self):
        points,objects=pm.parallelogram()
        for o in objects:
            if o['id'] in {'sBC','sDA'}:o['color']='GREEN'
            if o['id']=='e1':o['color']='GREEN'
        built=build(pm.spec_of(points,objects));marks=clone(pm.MARKS);marks['equalLengths'][0]['color']='GREEN';marks['angles']=pm.MARKS['angles']
        tag=re.search(r'<line\s(?:[^>]*\s)?id="e1-sBC-1"[^>]*/>',built['svg']).group(0);self.assertIn('stroke="#2e7d32"',tag)
        report=OBSERVER.audit({'svg':built['svg'],'points':{k:list(v) for k,v in points.items()},'marks':marks,'segments':pm.SEGMENTS,'transform':built['witness']['coordinateModel']})
        self.assertEqual(report['errors'],[])

    def test_semantic_model_refuses_bad_colours(self):
        points,objects=pm.parallelogram()
        bad=[{**o,'color':'TEAL'} if o['id']=='sAB' else o for o in objects]
        with self.assertRaises(ValueError) as caught:validate(pm.spec_of(points,bad))
        self.assertEqual(str(caught.exception).split(':')[0],'INVALID_COLOR')
        emphasised=[{**o,'color':'BLUE','emphasis':'BOLD'} if o['id']=='sAB' else o for o in objects]
        with self.assertRaises(ValueError) as caught:validate(pm.spec_of(points,emphasised))
        self.assertEqual(str(caught.exception).split(':')[0],'INVALID_COLOR')
        both=[{**o,'color':'BLUE','emphasisGroup':1} if o['id']=='aD' else o for o in objects]
        with self.assertRaises(ValueError) as caught:validate(pm.spec_of(points,both))
        self.assertEqual(str(caught.exception).split(':')[0],'INVALID_COLOR')

if __name__=='__main__':unittest.main()
