import sys
from pathlib import Path
import math
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.geometry_model import *

class GeometryTests(unittest.TestCase):
    def test_vertical_canonical(self):
        l=line_from_two_points((2,-1),(2,9))
        self.assertEqual(l,Line(-100,0,200))
        self.assertEqual(line_intersection(l,Line(0,1,-3)),(2,3))

    def test_gold_old_numeric_parity(self):
        l,m=Line(1,3,2),Line(6,-2,-1)
        self.assertTrue(perpendicular_check(l,m))
        self.assertAlmostEqual(line_intersection(l,m)[0],-0.05)
        self.assertAlmostEqual(line_intersection(l,m)[1],-0.65)
        self.assertTrue(parallel_check(Line(2,-1,1),Line(2,-1,-4)))
        self.assertAlmostEqual(point_line_distance((0,1),Line(2,-1,-4)),math.sqrt(5))

    def test_foot_distance(self):
        for l in (Line(2,3,-4),Line(1,0,2),Line(0,1,-5)):
            p=(8,9); h=foot_of_perpendicular(p,l)
            self.assertTrue(point_on_line(h,l))
            self.assertAlmostEqual(math.dist(p,h),point_line_distance(p,l))
            self.assertTrue(perpendicular_check(l,line_from_two_points(p,h)))

    def test_division(self):
        self.assertEqual(midpoint((0,0),(6,3)),(3,1.5))
        self.assertEqual(internal_division((0,0),(6,3),2,1),(4,2))
        self.assertEqual(external_division((0,0),(6,3),2,1),(12,6))

    def test_circle_line(self):
        c=Circle((0,0),2)
        self.assertEqual(circle_line_intersections(c,Line(1,0,0)),[(0,-2),(0,2)])
        self.assertEqual(circle_line_intersections(c,Line(1,0,-2)),[(2,0)])
        self.assertEqual(circle_line_intersections(c,Line(1,0,-3)),[])
        self.assertTrue(tangent_check(c,Line(1,0,-2),(2,0)))
        self.assertFalse(tangent_check(c,Line(1,0,-2),(2,1)))

    def test_circle_circle(self):
        for d,count in ((4,1),(3,2),(5,0),(0,0)):
            if d==0:
                self.assertEqual(circle_circle_intersections(Circle((0,0),2),Circle((0,0),1)),[])
            else:
                hits=circle_circle_intersections(Circle((0,0),2),Circle((d,0),2))
                self.assertEqual(len(hits),count)
                for p in hits:
                    self.assertAlmostEqual(math.dist(p,(0,0)),2)
                    self.assertAlmostEqual(math.dist(p,(d,0)),2)

    def test_real_tangent_cluster(self):
        for a in ((3-math.sqrt(2)/3)/2,(3+math.sqrt(2)/3)/2):
            self.assertTrue(tangent_check(Circle((a,a),1/3),Line(1,1,-3),(1.5,1.5)))

    def test_fail_closed(self):
        calls=[lambda:Line(0,0,1),lambda:Line(True,1,0),lambda:Line(1,0,float('inf')),
               lambda:Circle((0,0),0),lambda:line_from_two_points((1,1),(1,1)),
               lambda:line_intersection(Line(1,1,0),Line(2,2,3)),
               lambda:external_division((0,0),(1,1),1,1),
               lambda:internal_division((0,0),(1,1),-1,2),
               lambda:circle_circle_intersections(Circle((0,0),2),Circle((0,0),2))]
        for call in calls:
            with self.subTest(call=call),self.assertRaises(ValueError): call()

    def test_large_small_norm_and_clip(self):
        self.assertEqual(Line(1e300,0,-2e300),Line(1e-300,0,-2e-300))
        self.assertEqual(clip_line(Line(1,0,-2),(-5,5,-4,4)),[(2,-4),(2,4)])

if __name__=='__main__': unittest.main()
