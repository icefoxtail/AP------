"""G18c-3 / add-ons: the near-stroke label search is exact and fast (bounding-box pruning), a curve label with no room beside its stroke gets a finer search and then a leader that starts
on its own curve, and the observer accepts that leader (and only that leader). No Chrome."""
import math
import sys
import time
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_observer import multi_curve_label_audit
from visual_engine.label_layout import (Box,collision,near_box_polyline_distance,near_candidate_centers,near_leader_placement,near_wide_centers,
                                        _prep_polyline,_prepped_distance,_prepped_within,visible_owner_leader)

def curve(offset,count=240):
    return [(20+i*1.8,200-offset-12*math.sqrt(i/count*9)) for i in range(count+1)]

class Search(unittest.TestCase):
    def test_pruned_distances_equal_the_plain_ones(self):
        points=curve(0);prep=_prep_polyline(points)
        for x in range(0,460,37):
            for y in range(40,220,23):
                box=Box(x,y,60,22)
                self.assertEqual(_prepped_distance(box,prep),near_box_polyline_distance(box,points))
                for limit in (3.0,12.0,30.0):
                    self.assertEqual(_prepped_within(box,prep,limit),near_box_polyline_distance(box,points)<limit)

    def test_three_labels_are_found_quickly(self):
        own=curve(0);others=[curve(25),curve(60),curve(95)]
        begun=time.time()
        for _ in range(3):
            near_candidate_centers({'nearCurve':{'own':[own],'others':others,'end':False}},60,22,Box(12,12,488,388))
        self.assertLess(time.time()-begun,2.0)

    def test_a_hemmed_in_curve_finds_a_leader_on_its_own_vertex(self):
        own=curve(0);above=curve(26)[:120];below=[(x,y+26) for x,y in own][:120]   # the two neighbours stop short: the way out is past the end of the curve
        near={'own':[own],'others':[above,below],'end':False,'id':'g'}
        occupied=[{'id':'g-stroke','kind':'curve','geometry':own},{'id':'above','kind':'curve','geometry':above},{'id':'below','kind':'curve','geometry':below}]
        safe=Box(12,12,488,388)
        acceptable=lambda box,owner_check=True:safe.contains(box) and all(near_box_polyline_distance(box,o['geometry'])>=6 for o in occupied)
        found=near_leader_placement(near,60,22,occupied,acceptable,safe)
        self.assertIsNotNone(found)
        box,anchor,end,direction=found
        self.assertIn(tuple(anchor),[tuple(point) for point in own])
        self.assertIn(direction,('E','SE','S','SW','W','NW','N','NE'))
        self.assertGreater(math.dist(anchor,end),20)

    def test_wide_search_gives_centres_beside_the_stroke_only(self):
        own=curve(0);near={'own':[own],'others':[curve(70)],'end':False}
        for x,y in near_wide_centers(near,60,22,Box(12,12,488,388)):
            self.assertLessEqual(near_box_polyline_distance(Box(x-30,y-11,60,22),own),23.5)

class Observer(unittest.TestCase):
    PLAN={'family':'multi-curve','curves':[{'id':'f'},{'id':'g'}],'multiCurveFeatures':{'curves':[{'id':'f','kind':'LINE'},{'id':'g','kind':'LINE'}]}}
    def figure(self,leader):
        def label(ident,x,y):return f'<g id="{ident}" data-label-kind="EQUATION_LABEL" transform="translate({x} {y})"><svg width="60" height="20"></svg></g>'
        tail=f'<line id="g-owner-leader" data-role="leader" data-owner-label="curve-g-equation" data-owner="{leader}" x1="150" y1="200" x2="150" y2="290" stroke="#666"/>'
        return ('<svg xmlns="http://www.w3.org/2000/svg">'
                '<polyline data-role="curve" data-branch="CURVE_f" points="0,100 300,100"/><polyline data-role="curve" data-branch="CURVE_g" points="0,200 300,200"/>'
                +label('curve-f-equation',120,70)+label('curve-g-equation',120,290)+tail+'</svg>')
    def test_a_far_label_with_a_leader_on_its_own_curve_passes(self):
        # g's label stands 70 px from g with f closer by the box edge test; its leader starts on g and ends on the box
        self.assertEqual(multi_curve_label_audit(self.PLAN,self.figure('g'),{})['errors'],[])
    def test_a_leader_owned_by_another_curve_is_refused(self):
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-g-equation',multi_curve_label_audit(self.PLAN,self.figure('f'),{})['errors'])

    def test_a_leader_from_the_intersection_is_refused(self):
        ambiguous=self.figure('g').replace('points="0,100 300,100"','points="0,100 130,100 150,200"')
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-g-equation',multi_curve_label_audit(self.PLAN,ambiguous,{})['errors'])

    def test_a_leader_crossing_another_curve_vertex_is_refused(self):
        crossed=self.figure('g').replace('points="0,100 300,100"','points="0,100 130,100 150,245 200,250"')
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-g-equation',multi_curve_label_audit(self.PLAN,crossed,{})['errors'])

    def test_a_leader_overlapping_its_owner_is_refused(self):
        overlapping=self.figure('g').replace('points="0,200 300,200"','points="0,200 150,200 150,240 300,200"')
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-g-equation',multi_curve_label_audit(self.PLAN,overlapping,{})['errors'])

    def test_a_present_leader_is_checked_even_if_the_label_is_already_near(self):
        close=self.figure('f').replace('translate(120 290)','translate(120 215)').replace('y2="290"','y2="215"')
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-g-equation',multi_curve_label_audit(self.PLAN,close,{})['errors'])

    def test_a_branch_tag_shared_by_two_curves_uses_the_primitive_id(self):
        plan={'family':'multi-curve','curves':[{'id':'f'},{'id':'f_L'}],
              'multiCurveFeatures':{'curves':[{'id':'f','kind':'RATIONAL','branches':[{'side':'LEFT'}]},
                                               {'id':'f_L','kind':'LINE','branches':[{'side':'FUNCTION'}]}]}}
        svg=(self.figure('g').replace('data-branch="CURVE_f"','id="f-f-left-branch-0" data-branch="CURVE_f_L"')
             .replace('data-branch="CURVE_g"','id="f-f_L-branch-0" data-branch="CURVE_f_L"')
             .replace('curve-g-equation','curve-f_L-equation').replace('data-owner="g"','data-owner="f_L"'))
        self.assertEqual(multi_curve_label_audit(plan,svg,{})['errors'],[])

if __name__=='__main__':
    unittest.main()
