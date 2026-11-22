"""Graph-region labels on a leader: a label that stands outside its band (the band is too thin or crowded to hold it) is tied to the band by a drawn leader
(data-role=leader, data-owner-label) that starts on a DOT INSIDE the band (data-role=leader-dot), never on the band's boundary (G bundle 2b, 2026-11-23: a leader from the
boundary read as a tick value or as the name of the curve it touched).
The independent observer check (_graph_region_leader_labels) reads the dot, the start, the exit and the crossings from the final SVG and the plan's bands; it shares nothing with
the engine's placement. Pure geometry, no Chrome."""
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_observer import _graph_region_leader_labels

TRANSFORM={'originX':0.0,'originY':100.0,'sx':10.0,'sy':10.0}
# model coordinates: a band 0..8 wide and 0..4 high (screen: x 0..80, y 60..100); a second band to its right
BAND_A=[(0,0),(8,0),(8,4),(0,4)]
BAND_B=[(10,0),(18,0),(18,4),(10,4)]
POLYGONS=[('A',BAND_A),('B',BAND_B)]

def svg(leader=None,dot=True,strokes=''):
    body=''
    if leader is not None:
        body='<line id="region-A-label-owner-leader" data-role="leader" data-owner-label="region-A-label" data-owner="region-A" x1="%s" y1="%s" x2="%s" y2="%s"/>'%leader
        if dot:body+='<circle id="region-A-label-owner-leader-dot" data-role="leader-dot" data-owner-label="region-A-label" data-owner="region-A" cx="%s" cy="%s" r="2.4"/>'%leader[:2]
    return ET.fromstring('<svg xmlns="http://www.w3.org/2000/svg">'+body+strokes+'</svg>')

# a label box (screen px) above band A; the leader starts on a dot inside the band, leaves through its top edge (y=60) once and ends on the bottom edge of the box
BOX=(30.0,20.0,20.0,10.0)
GOOD=(40,80,40,30)

class GraphRegionLeader(unittest.TestCase):
    def check(self,root,box=BOX,polygons=POLYGONS):
        return _graph_region_leader_labels([('A',box)],polygons,TRANSFORM,root)

    def test_valid_leader_from_a_dot_inside_passes(self):
        self.assertEqual(self.check(svg(GOOD)),[])

    def test_label_outside_without_leader_is_refused(self):
        self.assertEqual(self.check(svg()),['GRAPH_REGION_LABEL_OUTSIDE:A'])

    def test_leader_must_end_on_the_label(self):
        self.assertIn('GRAPH_REGION_LEADER_NOT_ON_LABEL:A',self.check(svg((40,80,40,40))))

    def test_leader_without_its_dot_is_refused(self):
        self.assertIn('GRAPH_REGION_LEADER_DOT_MISSING:A',self.check(svg(GOOD,dot=False)))

    def test_leader_from_the_boundary_is_refused(self):
        # the old way: the leader starts on the band's top edge (y=60) with no dot inside
        self.assertIn('GRAPH_REGION_LEADER_DOT_MISSING:A',self.check(svg((40,60,40,30),dot=False)))
        # even with a dot drawn there, a start on (or within the clearance of) the boundary is refused
        self.assertIn('GRAPH_REGION_LEADER_START_NEAR_BOUNDARY:A',self.check(svg((40,60,40,30))))
        self.assertIn('GRAPH_REGION_LEADER_START_NEAR_BOUNDARY:A',self.check(svg((40,65,40,30))))   # 5 px inside

    def test_leader_starting_outside_its_band_is_refused(self):
        self.assertIn('GRAPH_REGION_LEADER_NOT_FROM_INSIDE:A',self.check(svg((40,50,40,30))))

    def test_start_must_be_clear_of_every_stroke(self):
        near='<polyline id="curve" points="30,79 50,79"/>'
        self.assertIn('GRAPH_REGION_LEADER_START_NEAR_STROKE:A',self.check(svg(GOOD,strokes=near)))

    def test_leader_may_cross_the_bands_own_boundary_but_no_other_stroke(self):
        own='<polyline id="top-edge" points="0,60 80,60"/>'            # the band's own top edge: the leader leaves through it
        self.assertEqual(self.check(svg(GOOD,strokes=own)),[])
        crossing='<polyline id="curve" points="0,45 80,45"/>'          # a curve between the band and its label
        self.assertIn('GRAPH_REGION_LEADER_CROSSES:A:curve',self.check(svg(GOOD,strokes=crossing)))

    def test_leader_may_not_pass_through_another_band(self):
        other=[('A',BAND_A),('B',[(3,3),(5,3),(5,5),(3,5)])]            # a band between the leader's start and its label (screen y 50..70)
        self.assertIn('GRAPH_REGION_LEADER_IN_REGION:A',self.check(svg(GOOD),polygons=other))

    def test_label_box_over_a_band_is_refused(self):
        errors=self.check(svg((40,80,40,92)),box=(30.0,80.0,20.0,10.0))
        self.assertIn('GRAPH_REGION_LABEL_NOT_OUTSIDE:A',errors)

if __name__=='__main__':unittest.main()
