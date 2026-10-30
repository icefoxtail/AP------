"""E31 (8): parallel marks (arrows) on displayed LINE objects, not only on segments. The engine puts the arrows on the part of each line that is inside the window, away from the places
other lines cross it; the semantic validator refuses a mix of lines and segments and lines that are not parallel; the plane-marks observer reads the arrows back.
No Chrome here: labels are exercised by tests/parallel-marks-on-lines.test.mjs and the real composed figure fixture."""
import importlib.util
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

def observer_module():
    spec=importlib.util.spec_from_file_location('plane_marks_observer',PRODUCTION/'plane-marks-observer-worker.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
OBSERVER=observer_module()

# x+y-5=0 and its parallel x+y+4=0 (one arrow), -3x+y+7=0 and its parallel -3x+y+4=0 (two arrows), crossed by each other inside the window
LINES={'l1':[1,1,-5],'m1':[1,1,4],'l2':[-3,1,7],'m2':[-3,1,4]}
def line(identifier):return {'id':identifier,'kind':'LINE','coefficients':LINES[identifier]}
def spec_of(objects,window=(-8,10,-10,10),axes=True):
    return {'id':'lines','visualType':'line_circle_geometry','viewport':{'xMin':window[0],'xMax':window[1],'yMin':window[2],'yMax':window[3],'width':540,'height':540,'panel':0},
            'axes':axes,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[line(i) for i in LINES]+objects}
PARALLELS=[{'id':'pa','kind':'PARALLEL_MARK','refs':['l1','m1'],'count':1},{'id':'pb','kind':'PARALLEL_MARK','refs':['l2','m2'],'count':2}]
MARKS={'parallels':[{'id':'pa','count':1,'lines':['l1','m1']},{'id':'pb','count':2,'lines':['l2','m2']}]}
def refused(objects,window=(-8,10,-10,10),axes=True):
    try:build(spec_of(objects,window,axes))
    except ValueError as error:return str(error)
    return None

class Engine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result=build(spec_of(PARALLELS));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
    def arrows(self,mark):return re.findall(r'<polyline\s(?:[^>]*\s)?id="'+mark+r'-[a-z0-9]+-\d"[^>]*/>',self.svg)
    def test_every_line_of_a_group_gets_its_count_of_arrows(self):
        self.assertEqual([len(self.arrows(m)) for m in ('pa','pb')],[2,4])
        for tag in self.arrows('pa')+self.arrows('pb'):self.assertIn('data-mark="parallel"',tag)
    def test_the_arrows_point_the_same_way_along_every_line_of_the_group(self):
        def direction(tag):
            points=[tuple(map(float,part.split(','))) for part in re.search(r'\spoints="([^"]*)"',tag).group(1).split()]
            return (points[1][0]-(points[0][0]+points[2][0])/2,points[1][1]-(points[0][1]+points[2][1])/2)
        first,second=[direction(tag) for tag in (self.arrows('pa')[0],self.arrows('pa')[2] if len(self.arrows('pa'))>2 else self.arrows('pa')[1])]
        self.assertGreater(first[0]*second[0]+first[1]*second[1],0)
    def test_the_arrows_keep_clear_of_the_crossing_of_the_two_groups(self):
        crossing=(3.0,2.0);sx=self.transform
        screen=(sx['originX']+crossing[0]*sx['sx'],sx['originY']-crossing[1]*sx['sy'])
        for mark in ('pa','pb'):
            for tag in self.arrows(mark):
                points=[tuple(map(float,part.split(','))) for part in re.search(r'\spoints="([^"]*)"',tag).group(1).split()]
                self.assertGreater(math.dist(points[1],screen),14)
    def test_the_observer_reads_the_arrows_back(self):
        points={}
        report=OBSERVER.audit({'svg':self.svg,'points':points,'marks':MARKS,'segments':[],'transform':self.transform})
        self.assertEqual(report['errors'],[]);self.assertEqual(report['status'],'PASS')
        self.assertEqual([row['segments'] for row in report['observations'] if row.get('type')=='PARALLEL'],[['l1','m1'],['l2','m2']])
    def test_a_line_outside_the_window_has_nowhere_to_stand(self):
        self.assertEqual(refused(PARALLELS,(30,40,30,40),False),'MARK_LINE_NOT_IN_VIEW:l1')

class Semantics(unittest.TestCase):
    def test_lines_that_are_not_parallel_are_refused(self):
        self.assertEqual(refused([{'id':'pa','kind':'PARALLEL_MARK','refs':['l1','l2'],'count':1}]),'PARALLEL_MARK_NOT_PARALLEL:pa')
    def test_a_mix_of_a_line_and_a_segment_is_refused(self):
        segment={'id':'s','kind':'SEGMENT','from':[0.0,4.0],'to':[3.0,1.0]}
        self.assertEqual(refused([segment,{'id':'pa','kind':'PARALLEL_MARK','refs':['l1','s'],'count':1}]),'UNVERIFIED_SEMANTIC_MARK:pa')
    def test_equal_marks_still_need_segments(self):
        self.assertEqual(refused([{'id':'e','kind':'EQUAL_MARK','refs':['l1','m1'],'count':1}]),'UNVERIFIED_SEMANTIC_MARK:e')
    def test_a_line_alone_cannot_be_a_parallel_group(self):
        self.assertEqual(refused([{'id':'pa','kind':'PARALLEL_MARK','refs':['l1'],'count':1}]),'UNVERIFIED_SEMANTIC_MARK:pa')

if __name__=='__main__':unittest.main()
