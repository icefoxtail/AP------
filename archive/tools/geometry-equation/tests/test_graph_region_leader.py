"""Graph-region labels on a leader: a label that stands outside its (thin) band must be tied to the band by a drawn leader (data-role=leader, data-owner-label).
The independent observer check (_graph_region_leader_labels) accepts a leader that starts on the band, runs away from it, ends on the label box and crosses no stroke,
and keeps GRAPH_REGION_LABEL_OUTSIDE for a label outside its band without one. Pure geometry, no Chrome."""
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_observer import _graph_region_leader_labels

TRANSFORM={'originX':0.0,'originY':100.0,'sx':10.0,'sy':10.0}
# model coordinates: a band 0..4 wide and 0..1 high (screen: x 0..40, y 90..100); a second band to its right
BAND_A=[(0,0),(4,0),(4,1),(0,1)]
BAND_B=[(6,0),(10,0),(10,1),(6,1)]
POLYGONS=[('A',BAND_A),('B',BAND_B)]

def svg(leader=None,strokes=''):
    body=''
    if leader is not None:body='<line id="region-A-label-owner-leader" data-role="leader" data-owner-label="region-A-label" data-owner="region-A" x1="%s" y1="%s" x2="%s" y2="%s"/>'%leader
    return ET.fromstring('<svg xmlns="http://www.w3.org/2000/svg">'+body+strokes+'</svg>')

# a label box (screen px) above band A; the leader leaves the band's top edge (y=90) straight up and ends on the bottom edge of the box
BOX=(10.0,60.0,20.0,10.0)

class GraphRegionLeader(unittest.TestCase):
    def check(self,root,box=BOX,polygons=POLYGONS):
        return _graph_region_leader_labels([('A',box)],polygons,TRANSFORM,root)

    def test_valid_leader_passes(self):
        self.assertEqual(self.check(svg((20,90,20,70))),[])

    def test_label_outside_without_leader_is_refused(self):
        self.assertEqual(self.check(svg()),['GRAPH_REGION_LABEL_OUTSIDE:A'])

    def test_leader_must_end_on_the_label_and_start_on_the_band(self):
        self.assertIn('GRAPH_REGION_LEADER_NOT_ON_LABEL:A',self.check(svg((20,90,20,80))))
        self.assertIn('GRAPH_REGION_LEADER_NOT_ON_REGION:A',self.check(svg((20,80,20,70))))

    def test_leader_into_the_band_is_refused(self):
        errors=self.check(svg((20,95,20,70)))   # starts inside the band
        self.assertTrue(any(error.startswith('GRAPH_REGION_LEADER') for error in errors),errors)

    def test_leader_may_not_cross_a_curve_or_enter_another_band(self):
        crossing='<polyline id="curve" points="0,80 40,80"/>'
        self.assertIn('GRAPH_REGION_LEADER_CROSSES:A:curve',self.check(svg((20,90,20,70),crossing)))
        other=[('A',BAND_A),('B',[(1,2),(3,2),(3,3),(1,3)])]   # a band between the leader's start and its label
        self.assertIn('GRAPH_REGION_LEADER_IN_REGION:A',self.check(svg((20,90,20,70)),polygons=other))

    def test_label_box_over_a_band_is_refused(self):
        errors=self.check(svg((20,90,20,92)),box=(10.0,90.0,20.0,10.0))
        self.assertIn('GRAPH_REGION_LABEL_NOT_OUTSIDE:A',errors)

if __name__=='__main__':unittest.main()
