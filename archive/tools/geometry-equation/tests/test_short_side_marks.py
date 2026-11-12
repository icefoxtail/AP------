"""Angle arcs and equal-length ticks on a short side: the compact form instead of a refusal (and a refusal only when even that cannot be read).
No Chrome: engine primitives plus the independent observer on a hand-made spec (the same pattern as tests/test_plane_marks.py)."""
import math
import re
import sys
import unittest
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from test_plane_marks import OBSERVER,build,seg,spec_of   # noqa: E402

# spec_of's 520x420 viewport round this figure draws 63.33 px per unit.
SEGMENTS=[{'id':'sVP','refs':['V','P']},{'id':'sVQ','refs':['V','Q']},{'id':'sPQ','refs':['P','Q']}]

def figure(short,**extra):
    """V at the origin, P on the +x axis `short` units away (the short ray), Q far away: the angle at V is atan2(4,6)."""
    pts={'V':(0.0,0.0),'P':(short,0.0),'Q':(6.0,4.0)};value=round(math.degrees(math.atan2(4.0,6.0)),9)
    objects=[seg('sVP',pts,'V','P'),seg('sVQ',pts,'V','Q'),seg('sPQ',pts,'P','Q'),{'id':'aV','kind':'ANGLE_MARK','refs':['P','V','Q'],'value':value,'arcs':1,**extra}]
    marks={'angles':[{'id':'aV','refs':['P','V','Q'],'value':value,'noLabel':True}]}
    return pts,objects,marks
def audit(pts,result,marks,segments=SEGMENTS):
    return OBSERVER.audit({'svg':result['svg'],'points':{k:list(v) for k,v in pts.items()},'marks':marks,'segments':segments,'transform':result['witness']['coordinateModel']})
def element(svg,identifier):
    match=re.search(r'<(?:polyline|line|polygon)\s(?:[^>]*\s)?id="'+re.escape(identifier)+r'"[^>]*/>',svg);return match.group(0) if match else None
def pairs_of(tag):return [tuple(map(float,part.split(','))) for part in re.search(r'\spoints="([^"]*)"',tag).group(1).split()]

class ShortAngleRayTests(unittest.TestCase):
    def render(self,short,**extra):
        pts,objects,marks=figure(short,**extra);return pts,build(spec_of(pts,objects)),marks
    def arc_radius_px(self,svg):
        vertex=pairs_of(element(svg,'aV-sector'))[0];return math.dist(vertex,pairs_of(element(svg,'aV-arc-1'))[0])
    def test_a_normal_ray_is_unchanged_no_extension(self):
        pts,result,marks=self.render(0.5)    # 32 px ray: the usual arc
        self.assertIsNone(element(result['svg'],'aV-ext-from'));self.assertIsNone(element(result['svg'],'aV-ext-to'))
        self.assertGreaterEqual(self.arc_radius_px(result['svg']),16.0)
        self.assertEqual(audit(pts,result,marks)['errors'],[])
    def test_a_19px_ray_gets_a_small_arc_inside_the_ray(self):
        pts,result,marks=self.render(0.3)
        self.assertIsNone(element(result['svg'],'aV-ext-from'));self.assertIsNone(element(result['svg'],'aV-ext-to'))
        radius=self.arc_radius_px(result['svg']);self.assertGreaterEqual(radius,6.0);self.assertLessEqual(radius,19.0-3.0)
        report=audit(pts,result,marks);self.assertEqual(report['errors'],[]);self.assertEqual(report['status'],'PASS')
    def test_an_8_to_9px_ray_gets_a_small_arc_without_an_extension(self):
        pts,result,marks=self.render(0.135)
        self.assertIsNone(element(result['svg'],'aV-ext-from'))
        self.assertIsNone(element(result['svg'],'aV-ext-to'))
        self.assertGreaterEqual(self.arc_radius_px(result['svg']),3.0)
        self.assertLess(self.arc_radius_px(result['svg']),8.0)
        self.assertEqual(audit(pts,result,marks)['errors'],[])

    def test_a_10px_ray_gets_the_pulled_arc_with_its_ray_prolonged(self):
        pts,result,marks=self.render(0.16)
        ext=element(result['svg'],'aV-ext-from')
        self.assertIsNotNone(ext);self.assertIn('data-mark="angle"',ext);self.assertIn('stroke-dasharray',ext)
        self.assertIsNone(element(result['svg'],'aV-ext-to'))   # the long ray reaches the arc
        self.assertAlmostEqual(self.arc_radius_px(result['svg']),16.0,places=3)
        report=audit(pts,result,marks);self.assertEqual(report['errors'],[]);self.assertEqual(report['status'],'PASS')
    def test_the_observer_rejects_a_pulled_arc_whose_extension_is_missing_or_off_the_ray(self):
        pts,result,marks=self.render(0.16)
        ext=element(result['svg'],'aV-ext-from')
        missing=audit(pts,{**result,'svg':result['svg'].replace(ext,'')},marks)['errors']
        self.assertIn('ANGLE_EXTENSION_MISSING:aV:ext-from',missing)
        y2=float(re.search(r'\sy2="([^"]*)"',ext).group(1))
        bent=result['svg'].replace(ext,re.sub(r'\sy2="[^"]*"',' y2="%.6f"'%(y2-6.0),ext))
        self.assertTrue(any(error.startswith('ANGLE_EXTENSION_OFF_RAY:aV') for error in audit(pts,{**result,'svg':bent},marks)['errors']))
    def test_a_ray_shorter_than_two_point_dots_is_still_refused(self):
        pts,objects,_=figure(0.1)    # 6 px: the two points would sit on each other, no mark reads
        with self.assertRaises(ValueError) as caught:build(spec_of(pts,objects))
        self.assertEqual(str(caught.exception),'MARK_SEGMENT_TOO_SHORT:aV')
    def test_only_the_plain_single_ring_angle_has_a_compact_form(self):
        pts,objects,_=figure(0.16)
        for field in ({'ring':2},{'angleDimension':{'radiusFactor':1.15},'style':'ARC'}):
            copy=[dict(o,**field) if o['id']=='aV' else o for o in objects]
            with self.assertRaises(ValueError) as caught:build(spec_of(pts,copy))
            self.assertTrue(str(caught.exception).startswith('MARK_SEGMENT_TOO_SHORT'),str(caught.exception))

class ShortSegmentTickTests(unittest.TestCase):
    def build(self,length_units,count=1):
        pts={'A':(0.0,0.0),'B':(length_units,0.0),'C':(length_units,length_units),'D':(6.0,4.0)}
        objects=[seg('sAB',pts,'A','B'),seg('sBC',pts,'B','C'),seg('sCD',pts,'C','D'),{'id':'e1','kind':'EQUAL_MARK','refs':['sAB','sBC'],'count':count}]
        return pts,build(spec_of(pts,objects))
    def test_ticks_stand_on_a_20px_segment_and_still_on_the_normal_ones(self):
        segments=[{'id':'sAB','refs':['A','B']},{'id':'sBC','refs':['B','C']},{'id':'sCD','refs':['C','D']}]
        for units in (0.28,0.6):
            pts,result=self.build(units)
            self.assertIsNotNone(element(result['svg'],'e1-sAB-1'),units);self.assertIsNotNone(element(result['svg'],'e1-sBC-1'),units)
            report=audit(pts,result,{'equalLengths':[{'id':'e1','count':1,'segments':['sAB','sBC']}]},segments)
            self.assertEqual([e for e in report['errors'] if e.startswith('EQUAL_MARK')],[],units)
    def test_three_ticks_need_more_room_than_one(self):
        self.build(0.4,1)     # 29 px: one tick fits
        with self.assertRaises(ValueError) as caught:self.build(0.2,3)    # 14 px: three ticks do not
        self.assertEqual(str(caught.exception),'MARK_SEGMENT_TOO_SHORT:sAB')
    def test_a_segment_shorter_than_one_tick_slot_is_still_refused(self):
        with self.assertRaises(ValueError) as caught:self.build(0.12)    # 9 px
        self.assertEqual(str(caught.exception),'MARK_SEGMENT_TOO_SHORT:sAB')

if __name__=='__main__':unittest.main()
