"""ellipse-figure-v1: the exact derivation and the independent SVG observer, without Chrome.

The composed figures are exercised end to end by tests/ellipse-figure.test.mjs; these cases pin the
exact foci/vertices/tangency and the observer's tamper detection on a hand-built SVG.
"""
import sys
import unittest
from pathlib import Path

PRODUCTION=Path(__file__).resolve().parents[1]/'production'
sys.path.insert(0,str(PRODUCTION))
import ellipse_figure as E
import ellipse_figure_observer as O

NS='http://www.w3.org/2000/svg'


def plan(ellipse=None,points=None,segments=None,polygons=None,lines=None):
    return {'capability':'ellipse-figure-v1','caption':'c',
            'sourceConditions':[{'id':'c1','condition':'c','mappedTo':['ellipse']}],
            'newVisualInformation':['n'],
            'ellipse':ellipse or {'center':['0','0'],'semiAxisSquared':{'major':'16','minor':'4'},'majorAxis':'X'},
            'points':points if points is not None else [{'id':'O','kind':'ORIGIN'}],
            'segments':segments or [],'polygons':polygons or [],'lines':lines or []}


def svg(extra='',ry=40,rx=80,cx=100,cy=80,label=True):
    out=['<svg xmlns="%s" width="200" height="160" viewBox="0 0 200 160">'%NS,
         '<line id="axis-x" data-role="axis" data-axis="x" x1="10" y1="80" x2="190" y2="80"/>',
         '<line id="axis-y" data-role="axis" data-axis="y" x1="100" y1="10" x2="100" y2="150"/>',
         '<polygon id="axis-x-head" data-role="axis-head" data-axis="x" points="190,80 181,76.4 181,83.6"/>',
         '<polygon id="axis-y-head" data-role="axis-head" data-axis="y" points="100,10 96.4,19 103.6,19"/>',
         '<ellipse id="ellipse" data-role="ellipse" cx="%s" cy="%s" rx="%s" ry="%s" fill="none"/>'%(cx,cy,rx,ry),
         '<circle id="point-O" data-role="point" data-point="O" cx="100" cy="80" r="3"/>']
    if label:
        out.append('<g id="label-O" data-label-role="point" data-point="O" data-tex="O" data-box="106,72,10,12"/>')
    out.append(extra)
    out.append('</svg>')
    return ''.join(out)


def simple_plan(**overrides):
    value=plan()
    value.update(overrides)
    return value


class ProduceTest(unittest.TestCase):
    def test_foci_and_semi_axes_are_exact(self):
        model=E.produce(plan())
        self.assertEqual(model['semiAxis']['major']['exact'],'4')
        self.assertEqual(model['semiAxis']['minor']['exact'],'2')
        self.assertEqual(model['focalDistance']['exact'],'2*sqrt(3)')
        self.assertEqual(model['focusSeparation']['exact'],'4*sqrt(3)')
        self.assertEqual([row['x']['exact'] for row in model['foci']],['2*sqrt(3)','-2*sqrt(3)'])

    def test_vertices_follow_the_major_axis(self):
        model=E.produce(plan(points=[{'id':'A','kind':'VERTEX','end':'MAJOR_POS'},
                                     {'id':"A'",'kind':'VERTEX','end':'MAJOR_NEG'},
                                     {'id':'B','kind':'VERTEX','end':'MINOR_POS'}]))
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['A']['x']['exact'],rows['A']['y']['exact']),('4','0'))
        self.assertEqual((rows["A'"]['x']['exact'],rows["A'"]['y']['exact']),('-4','0'))
        self.assertEqual((rows['B']['x']['exact'],rows['B']['y']['exact']),('0','2'))

    def test_vertical_major_axis_swaps_the_semi_axes(self):
        model=E.produce(plan(ellipse={'center':['0','0'],'semiAxisSquared':{'major':'9','minor':'3'},'majorAxis':'Y'},
                             points=[{'id':'F','kind':'FOCUS','side':1},
                                     {'id':'P','kind':'ON_ELLIPSE','x':'-1','branch':'POS'}]))
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['F']['x']['exact'],rows['F']['y']['exact']),('0','sqrt(6)'))
        self.assertEqual((rows['P']['x']['exact'],rows['P']['y']['exact']),('-1','sqrt(6)'))

    def test_opposite_point_is_the_central_mirror(self):
        model=E.produce(plan(points=[{'id':'P','kind':'ON_ELLIPSE','x':'sqrt(3)'},
                                     {'id':'Q','kind':'OPPOSITE','of':'P'}]))
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['Q']['x']['exact'],rows['Q']['y']['exact']),('-sqrt(3)','-sqrt(13)/2'))

    def test_a_tangent_line_is_proved_not_claimed(self):
        model=E.produce(plan(ellipse={'center':['0','0'],'semiAxisSquared':{'major':'9','minor':'3'},'majorAxis':'Y'},
                             points=[{'id':'P','kind':'ON_ELLIPSE','x':'-1','branch':'POS'}],
                             lines=[{'id':'l','slope':'sqrt(6)/2','intercept':'3*sqrt(6)/2','tangent':True}]))
        line=model['lines'][0]
        self.assertEqual(line['tangencyPointId'],'P')
        self.assertEqual(line['tangencyPoint']['x']['exact'],'-1')
        self.assertEqual(line['tangencyPoint']['y']['exact'],'sqrt(6)')
        with self.assertRaises(ValueError) as caught:
            E.produce(plan(ellipse={'center':['0','0'],'semiAxisSquared':{'major':'9','minor':'3'},'majorAxis':'Y'},
                           lines=[{'id':'l','slope':'1','intercept':'1','tangent':True}]))
        self.assertEqual(str(caught.exception),'ELLIPSE_LINE_NOT_TANGENT')


class RefusalTest(unittest.TestCase):
    def refused(self,value,code):
        with self.assertRaises(ValueError) as caught:
            E.produce(value)
        self.assertEqual(str(caught.exception),code)

    def test_shapes_outside_an_axis_aligned_ellipse(self):
        self.refused(plan(ellipse={'center':['0','0'],'semiAxisSquared':{'major':'4','minor':'4'},'majorAxis':'X'}),'ELLIPSE_AXES_INVALID')
        self.refused(plan(ellipse={'center':['0','0'],'semiAxisSquared':{'major':'4','minor':'9'},'majorAxis':'X'}),'ELLIPSE_AXES_INVALID')
        self.refused(plan(ellipse={'center':['0','0'],'semiAxisSquared':{'major':'16','minor':'4'},'majorAxis':'XY'}),'ELLIPSE_MAJOR_AXIS_UNSUPPORTED')
        self.refused(plan(ellipse={'center':['0','0'],'semiAxisSquared':{'major':'16','minor':'4'},'majorAxis':'X','rotation':'20'}),'ELLIPSE_PLAN_INVALID')
        self.refused({**plan(),'capability':'construction-spike-v1'},'ELLIPSE_PLAN_INVALID')

    def test_points_and_members(self):
        self.refused(plan(points=[{'id':'P','kind':'ON_ELLIPSE','x':'9'}]),'ELLIPSE_POINT_NOT_ON_ELLIPSE')
        self.refused(plan(points=[{'id':'Q','kind':'OPPOSITE','of':'P'}]),'ELLIPSE_POINT_UNKNOWN')
        self.refused(plan(points=[{'id':'p','kind':'ORIGIN'}]),'ELLIPSE_POINT_ID_INVALID')
        self.refused(plan(points=[{'id':'O','kind':'ORIGIN'},{'id':'O','kind':'ORIGIN'}]),'ELLIPSE_POINT_ID_DUPLICATE')
        self.refused(plan(segments=[{'id':'s','from':'O','to':'O'}]),'ELLIPSE_SEGMENT_INVALID')
        self.refused(plan(polygons=[{'id':'t','points':['O','B','C']}]),'ELLIPSE_POINT_UNKNOWN')
        self.refused(plan(lines=[{'id':'l','slope':'1','intercept':'1','label':'l'}]),'ELLIPSE_LINE_LABEL_UNSUPPORTED')


class ObserverTest(unittest.TestCase):
    def test_a_faithful_minimal_svg_passes(self):
        result=O.audit(simple_plan(),svg())
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertTrue(result['finalSvgSha256'].startswith('sha256:'))

    def test_tampered_svg_fails(self):
        self.assertNotEqual(O.audit(simple_plan(),svg(ry=32))['status'],'PASS')
        self.assertNotEqual(O.audit(simple_plan(),svg(rx=40))['status'],'PASS')
        self.assertNotEqual(O.audit(simple_plan(),svg(cx=120))['status'],'PASS')
        moved=svg().replace('data-point="O" cx="100"','data-point="O" cx="106"')
        self.assertNotEqual(O.audit(simple_plan(),moved)['status'],'PASS')
        self.assertNotEqual(O.audit(simple_plan(),svg(label=False))['status'],'PASS')
        self.assertNotEqual(O.audit(simple_plan(),svg(extra='<circle data-role="point" data-point="Z" cx="40" cy="40" r="3"/>'))['status'],'PASS')
        self.assertNotEqual(O.audit(simple_plan(),svg().replace('data-axis="x"','data-axis="xx"'))['status'],'PASS')
        wrong_y_head=svg().replace('data-axis="y" points="100,10 96.4,19 103.6,19"',
                                   'data-axis="y" points="100,150 96.4,141 103.6,141"')
        flipped=O.audit(simple_plan(),wrong_y_head)
        self.assertEqual(flipped['status'],'FAIL')
        self.assertIn('AXIS_HEAD_DIRECTION_INVALID:y',flipped['errors'])

    def test_the_observed_foci_come_from_the_plan_not_the_producer(self):
        value=plan(points=[{'id':'F','kind':'FOCUS','side':1}])
        model=E.produce(value)
        focus=model['points'][0]
        x=100+20*float(focus['x']['value'])
        out=svg(label=False).replace(
            '<circle id="point-O" data-role="point" data-point="O" cx="100" cy="80" r="3"/>',
            '<circle id="point-F" data-role="point" data-point="F" cx="%.3f" cy="80" r="3"/>'%x
        ).replace('</svg>','<g id="label-F" data-label-role="point" data-point="F" data-tex="F" data-box="%.3f,62,10,12"/></svg>'%(x+6))
        passed=O.audit(value,out)
        self.assertEqual(passed['status'],'PASS',passed['errors'])
        shifted=out.replace('data-point="F" cx="%.3f"'%x,'data-point="F" cx="%.3f"'%(x+5))
        self.assertNotEqual(O.audit(value,shifted)['status'],'PASS')


if __name__=='__main__':
    unittest.main()
