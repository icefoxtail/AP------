"""Straight angles (E30): the engine draws the half turn on the named screen side, the semantic model checks the new fields, and the math grammar takes the degree sign.
No Chrome here; the typeset figure and the observer are exercised by tests/plane-straight-angles.test.mjs."""
import math
import sys
import unittest
from pathlib import Path

GEOMETRY=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(GEOMETRY))
from visual_engine.engine import build,prepare
from visual_engine.math_expression import parse,parse_list,serialize
from visual_engine.semantic_model import validate

LINE={'B':(-6.0,0.0),'O':(0.0,0.0),'E':(6.0,0.0),'A':(-3.0,4.0)}
def spec_of(objects,points=LINE):
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-10,'xMax':10,'yMin':-7.5,'yMax':7.5,'width':480,'height':360,'panel':0},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':k} for k,v in points.items()]+[
                {'id':'sOB','kind':'SEGMENT','from':list(points['O']),'to':list(points['B'])},{'id':'sOE','kind':'SEGMENT','from':list(points['O']),'to':list(points['E'])}]+objects}
def straight(side,**extra):return {'id':'aBOE','kind':'ANGLE_MARK','refs':['B','O','E'],'value':180,'straight':True,'straightSide':side,'arcs':1,'style':'ARC',**extra}
def arc_points(spec):
    prepared=prepare(spec)[0]
    return next(p for p in prepared['primitives'] if p['id']=='aBOE-arc-1')['points']

class StraightAngleEngineTests(unittest.TestCase):
    def test_the_semicircle_faces_the_named_side(self):
        spec=spec_of([straight('ABOVE')]);vertex=prepare(spec)[3].screen((0.0,0.0))
        for side,axis,sign in (('ABOVE',1,-1),('BELOW',1,1)):
            points=arc_points(spec_of([straight(side)]));middle=points[len(points)//2]
            self.assertGreater((middle[axis]-vertex[axis])*sign,10,side)
            radius=[math.dist(p,vertex) for p in points];self.assertLess(max(radius)-min(radius),1e-6)
            self.assertAlmostEqual(abs(sum(math.atan2(q[1]-vertex[1],q[0]-vertex[0])-math.atan2(p[1]-vertex[1],p[0]-vertex[0]) for p,q in zip(points,points[1:]))),math.pi,places=5)
    def test_a_vertical_line_takes_left_or_right(self):
        points={'B':(0.0,-6.0),'O':(0.0,0.0),'E':(0.0,6.0),'A':(3.0,0.0)}
        spec=spec_of([{'id':'aBOE','kind':'ANGLE_MARK','refs':['B','O','E'],'value':180,'straight':True,'straightSide':'RIGHT','arcs':1,'style':'ARC'}],points)
        vertex=prepare(spec)[3].screen((0.0,0.0));middle=arc_points(spec)[16];self.assertGreater(middle[0]-vertex[0],10)
    def test_a_side_along_the_line_is_refused(self):
        with self.assertRaises(ValueError) as caught:build(spec_of([straight('LEFT')]))
        self.assertEqual(str(caught.exception),'ANGLE_STRAIGHT_SIDE_AMBIGUOUS:aBOE')
    def test_the_sector_fill_is_a_half_disc(self):
        sector=next(p for p in prepare(spec_of([straight('ABOVE',style='SECTOR')]))[0]['primitives'] if p['id']=='aBOE-sector')
        self.assertGreater(len(sector['points']),16)
        vertex=sector['points'][0];total=sum(math.atan2(q[1]-vertex[1],q[0]-vertex[0])-math.atan2(p[1]-vertex[1],p[0]-vertex[0]) for p,q in zip(sector['points'][1:],sector['points'][2:]))
        self.assertAlmostEqual(abs(total),math.pi,places=5)

class StraightAngleSemanticTests(unittest.TestCase):
    def test_new_fields_are_checked(self):
        validate(spec_of([straight('ABOVE')]))
        for bad,code in ((straight('UP'),'INVALID_STRAIGHT_ANGLE'),({**straight('ABOVE'),'outer':True},'INVALID_STRAIGHT_ANGLE'),
                         ({'id':'aBOA','kind':'ANGLE_MARK','refs':['B','O','A'],'value':180,'straight':True,'straightSide':'ABOVE'},'UNVERIFIED_SEMANTIC_MARK:aBOA'),
                         ({'id':'aBOE','kind':'ANGLE_MARK','refs':['B','O','E'],'value':180,'straightSide':'ABOVE'},'INVALID_STRAIGHT_ANGLE'),
                         ({**straight('ABOVE'),'value':170},'UNVERIFIED_SEMANTIC_MARK:aBOE')):
            with self.assertRaises(ValueError,msg=code) as caught:validate(spec_of([bad]))
            self.assertEqual(str(caught.exception),code)
    def test_a_plain_180_without_straight_is_still_degenerate_for_the_old_rule(self):
        # the engine itself only knows a half turn when told: an angle of 180 degrees without straight is checked like any angle (value must match the points)
        validate(spec_of([{'id':'aBOE','kind':'ANGLE_MARK','refs':['B','O','E'],'value':180}]))

class MathGrammarTests(unittest.TestCase):
    def test_the_degree_sign_and_equations_of_degrees(self):
        self.assertEqual(serialize(parse_list('15°+75°=90°'),'tex'),r'15^{\circ}+75^{\circ}=90^{\circ}')
        self.assertEqual(serialize(parse_list('3x=90°'),'tex'),r'3x=90^{\circ}')

if __name__=='__main__':unittest.main()
