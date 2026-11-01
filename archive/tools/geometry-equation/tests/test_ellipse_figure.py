"""ellipse-figure-v1: the exact derivation and the independent SVG observer, without Chrome.

The composed figures are exercised end to end by tests/ellipse-figure.test.mjs; these cases pin the
exact foci/vertices/tangency and the observer's tamper detection on a hand-built SVG.
"""
import math
import sys
import unittest
from pathlib import Path

PRODUCTION=Path(__file__).resolve().parents[1]/'production'
sys.path.insert(0,str(PRODUCTION))
import ellipse_figure as E
import ellipse_figure_observer as O
import sympy as S

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


def pair_plan(points=None,segments=None,lines=None,ellipses=None):
    return {'capability':'ellipse-figure-v1','caption':'c',
            'sourceConditions':[{'id':'c1','condition':'c','mappedTo':['ellipses']}],
            'newVisualInformation':['n'],
            'ellipses':ellipses or [
                {'id':'C1','center':['0','-4'],'semiAxisSquared':{'major':'81','minor':'45'},'majorAxis':'Y'},
                {'id':'C2','center':['0','0'],'semiAxisSquared':{'major':'9','minor':'5'},'majorAxis':'Y'}],
            'points':points if points is not None else [
                {'id':'F','kind':'FOCUS','side':1,'ellipseId':'C1'},
                {'id':"F'",'kind':'FOCUS','side':-1,'ellipseId':'C1'},
                {'id':'P','kind':'ON_ELLIPSE','ellipseId':'C1','y':'-17/2','branch':'POS'},
                {'id':'Q','kind':'ON_ELLIPSE','ellipseId':'C2','y':'-3/2','branch':'POS'},
                {'id':'O','kind':'ORIGIN'}],
            'segments':segments if segments is not None else [
                {'id':'s1','from':"F'",'to':'F','label':'12'},
                {'id':'s2','from':'F','to':'P','label':'12'}],
            'polygons':[],'lines':lines or []}


def pair_svg(extra='',scale=20,ox=100,oy=200,drop_c2=False,tamper_c2=0):
    a1=str(3*5**0.5*scale);b1=str(9*scale)
    a2=str(5**0.5*scale);b2=str(3*scale)
    out=['<svg xmlns="%s" width="400" height="500" viewBox="0 0 400 500">'%NS,
         '<line id="axis-x" data-role="axis" data-axis="x" x1="10" y1="%d" x2="390" y2="%d"/>'%(oy,oy),
         '<line id="axis-y" data-role="axis" data-axis="y" x1="%d" y1="10" x2="%d" y2="490"/>'%(ox,ox),
         '<polygon id="axis-x-head" data-role="axis-head" data-axis="x" points="390,%d 381,%d 381,%d"/>'%(oy,oy-3.6,oy+3.6),
         '<polygon id="axis-y-head" data-role="axis-head" data-axis="y" points="%d,10 %d,19 %d,19"/>'%(ox,ox-3.6,ox+3.6),
         '<ellipse id="ellipse-C1" data-role="ellipse" data-ellipse="C1" cx="%d" cy="%d" rx="%s" ry="%s" fill="none"/>'%(ox,oy+4*scale,a1,b1)]
    if not drop_c2:
        out.append('<ellipse id="ellipse-C2" data-role="ellipse" data-ellipse="C2" cx="%d" cy="%d" rx="%s" ry="%s" fill="none"/>'%(ox,oy,a2,float(b2)+tamper_c2))
    out.append('<circle id="point-O" data-role="point" data-point="O" cx="%d" cy="%d" r="3"/>'%(ox,oy))
    out.append('<g id="label-O" data-label-role="point" data-point="O" data-tex="O" data-box="%d,%d,10,12"/>'%(ox+6,oy-18))
    out.append(extra)
    out.append('</svg>')
    return ''.join(out)


class PairProduceTest(unittest.TestCase):
    def test_pair_foci_and_points_are_exact(self):
        model=E.produce(pair_plan())
        self.assertEqual(model['mode'],'PAIR')
        self.assertEqual([row['id'] for row in model['ellipses']],['C1','C2'])
        first,second=model['ellipses']
        self.assertEqual(first['semiAxis']['major']['exact'],'9')
        self.assertEqual(first['semiAxis']['minor']['exact'],'3*sqrt(5)')
        self.assertEqual(first['foci'][0]['y']['exact'],'2')
        self.assertEqual(first['foci'][1]['y']['exact'],'-10')
        self.assertEqual(second['semiAxis']['major']['exact'],'3')
        self.assertEqual(second['semiAxis']['minor']['exact'],'sqrt(5)')
        self.assertEqual(second['foci'][0]['y']['exact'],'2')
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['P']['x']['exact'],rows['P']['y']['exact']),('3*sqrt(15)/2','-17/2'))
        self.assertEqual((rows['Q']['x']['exact'],rows['Q']['y']['exact']),('sqrt(15)/2','-3/2'))
        self.assertTrue(rows['P']['onEllipse'] and rows['Q']['onEllipse'])
        self.assertEqual(rows['P']['ellipseId'],'C1')
        self.assertEqual(rows['Q']['ellipseId'],'C2')

    def test_pair_refuses_other_counts_missing_ids_and_the_single_field(self):
        def refused(value,code):
            with self.assertRaises(ValueError) as caught:
                E.produce(value)
            self.assertEqual(str(caught.exception),code)
        base=pair_plan()
        refused({**base,'ellipses':[base['ellipses'][0]]},'ELLIPSE_PAIR_COUNT_INVALID')
        refused({**base,'ellipses':base['ellipses']+[base['ellipses'][0]]},'ELLIPSE_PAIR_COUNT_INVALID')
        refused({**base,'ellipses':[base['ellipses'][0],{**base['ellipses'][1],'id':'C1'}]},'ELLIPSE_ELLIPSE_ID_DUPLICATE')
        refused({**base,'ellipses':[base['ellipses'][0],{**base['ellipses'][1],'id':'C 2'}]},'ELLIPSE_ELLIPSE_ID_INVALID')
        refused({**base,'points':[{'id':'F','kind':'FOCUS','side':1}]},'ELLIPSE_POINT_ELLIPSE_ID_REQUIRED')
        refused({**base,'points':[{'id':'F','kind':'FOCUS','side':1,'ellipseId':'C9'}]},'ELLIPSE_POINT_ELLIPSE_ID_INVALID')
        refused({**base,'ellipse':base['ellipses'][0]},'ELLIPSE_PLAN_INVALID')
        refused({**base,'points':[{'id':'P','kind':'ON_ELLIPSE','ellipseId':'C2','y':'9/2'}]},'ELLIPSE_POINT_NOT_ON_ELLIPSE')


class PairObserverTest(unittest.TestCase):
    def test_a_faithful_pair_svg_passes(self):
        result=O.audit(pair_plan(points=[{'id':'O','kind':'ORIGIN'}],segments=[]),pair_svg())
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(len(result['checks']['ellipses']),2)

    def test_pair_tampering_fails(self):
        value=pair_plan(points=[{'id':'O','kind':'ORIGIN'}],segments=[])
        self.assertNotEqual(O.audit(value,pair_svg(drop_c2=True))['status'],'PASS')
        self.assertNotEqual(O.audit(value,pair_svg(tamper_c2=9))['status'],'PASS')
        self.assertNotEqual(O.audit(value,pair_svg(extra='<ellipse data-role="ellipse" data-ellipse="C3" cx="40" cy="40" rx="10" ry="20"/>'))['status'],'PASS')


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


# --- conic (parabola) plans: root field `conic`, derived by conic_figure.py and read back by conic_figure_observer.py ---
import conic_figure_observer as CO

SCALE=30.0
OX,OY=100.0,150.0


def conic_plan(points=None,segments=None,lines=None,**conic):
    return {'capability':'ellipse-figure-v1','caption':'c',
            'sourceConditions':[{'id':'c1','condition':'c','mappedTo':['conic']}],
            'newVisualInformation':['n'],
            'conic':{'kind':'PARABOLA','vertex':['0','0'],'p':'1','axis':'X',**conic},
            'points':points if points is not None else [
                {'id':'F','kind':'FOCUS'},{'id':'O','kind':'ORIGIN'},
                {'id':'A','kind':'ON_CONIC','x':'4','branch':'POS'},
                {'id':'M','kind':'FOOT','from':'A','onto':'l','rightAngle':True}],
            'segments':segments if segments is not None else [{'id':'s1','from':'A','to':'M'}],
            'polygons':[],
            'lines':lines if lines is not None else [{'id':'l','role':'DIRECTRIX','label':'l'}]}


def px(x):
    return OX+SCALE*x


def py(y):
    return OY-SCALE*y


def conic_svg(markers=None,line_label='l',directrix_x=-1.0,mark=True,curve_squash=1.0,extra=''):
    """A hand-built final SVG of y^2=4x at 30 px per unit: axes, curve, directrix, A, M, F, O and their names."""
    markers=markers or {'F':(1,0),'O':(0,0),'A':(4,4),'M':(-1,4)}
    t=-4.6;samples=[]
    while t<=4.6001:
        samples.append((px(t*t/4),py(t*curve_squash)));t+=0.2
    samples.append((px(0),py(0)));samples.sort(key=lambda pt:-pt[1])
    d=' '.join('%s%.2f %.2f'%('M' if index==0 else 'L',x,y) for index,(x,y) in enumerate(samples))
    out=['<svg xmlns="%s" width="300" height="300" viewBox="0 0 300 300">'%NS,
         '<line id="axis-x" data-role="axis" data-axis="x" x1="10" y1="150" x2="290" y2="150"/>',
         '<line id="axis-y" data-role="axis" data-axis="y" x1="100" y1="290" x2="100" y2="10"/>',
         '<polygon id="axis-x-head" data-role="axis-head" data-axis="x" points="290,150 281,146.4 281,153.6"/>',
         '<polygon id="axis-y-head" data-role="axis-head" data-axis="y" points="100,10 96.4,19 103.6,19"/>',
         '<path id="curve" data-role="curve" data-curve="PARABOLA" d="%s" fill="none"/>'%d,
         '<line id="line-l" data-role="line" data-line="l" x1="%.2f" y1="10" x2="%.2f" y2="290"/>'%(px(directrix_x),px(directrix_x))]
    if 'A' in markers and 'M' in markers:
        out.append('<line id="segment-s1" data-role="segment" data-from="A" data-to="M" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>'%(
            px(markers['A'][0]),py(markers['A'][1]),px(markers['M'][0]),py(markers['M'][1])))
    if mark:
        mx,my=px(-1),py(4)
        out.append('<polyline id="rightangle-M" data-role="right-angle" data-foot="M" points="%.2f,%.2f %.2f,%.2f %.2f,%.2f"/>'%(
            mx+6,my,mx+6,my+6,mx,my+6))
    for pid,(x,y) in markers.items():
        out.append('<circle id="point-%s" data-role="point" data-point="%s" cx="%.2f" cy="%.2f" r="3.2"/>'%(pid,pid,px(x),py(y)))
        out.append('<g id="point-label-%s" data-label-role="point" data-point="%s" data-tex="%s" data-box="%.2f,%.2f,10,12"/>'%(
            pid,pid,pid,px(x)+5,py(y)+3))
    out.append('<g id="line-l-label" data-label-role="line" data-line="l" data-tex="%s" data-box="%.2f,%.2f,6,12"/>'%(line_label,px(-1)+8,py(4)+30))
    out.append(extra)
    out.append('</svg>')
    return ''.join(out)


def refused_with(case,callable_,value,code):
    with case.assertRaises(ValueError) as caught:
        callable_(value)
    case.assertEqual(str(caught.exception),code)


class ConicProduceTest(unittest.TestCase):
    def test_focus_directrix_curve_points_and_feet_are_exact(self):
        # 26 제일고 q2: AF=5, BF=3 on a focal chord gives p=15/8; B is the first intersection of line AF with the parabola.
        value=conic_plan(p='15/8',points=[
            {'id':'F','kind':'FOCUS'},{'id':'A','kind':'ON_CONIC','x':'25/8','branch':'POS'},
            {'id':'B','kind':'LINE_CONIC','line':'k1','which':1},
            {'id':'M','kind':'FOOT','from':'A','onto':'l','rightAngle':True},{'id':'N','kind':'FOOT','from':'B','onto':'l'}],
            segments=[],lines=[{'id':'l','role':'DIRECTRIX'},{'id':'k1','through':['A','F'],'hidden':True}])
        model=E.produce(value)
        self.assertEqual(model['mode'],'CONIC')
        self.assertEqual(model['conic']['focus']['x']['exact'],'15/8')
        self.assertEqual(model['conic']['directrix']['orientation'],'VERTICAL')
        self.assertEqual(model['conic']['directrix']['value']['exact'],'-15/8')
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['A']['x']['exact'],rows['A']['y']['exact']),('25/8','5*sqrt(15)/4'))
        self.assertEqual((rows['B']['x']['exact'],rows['B']['y']['exact']),('9/8','-3*sqrt(15)/4'))
        self.assertEqual((rows['M']['x']['exact'],rows['M']['y']['exact']),('-15/8','5*sqrt(15)/4'))
        self.assertEqual((rows['N']['x']['exact'],rows['N']['y']['exact']),('-15/8','-3*sqrt(15)/4'))
        self.assertTrue(rows['A']['onCurve'] and rows['B']['onCurve'])
        self.assertFalse(rows['M']['onCurve'])
        self.assertEqual(rows['M']['foot'],{'from':'A','onto':'l','rightAngle':True})
        # the focus-directrix definition holds for A and B (AF=AM=5, BF=BN=3)
        for pid,length in (('A',5),('B',3)):
            self.assertAlmostEqual(rows[pid]['x']['value']-rows['M']['x']['value'],length,places=9)

    def test_an_upward_parabola_and_a_vertical_line_through_it(self):
        value=conic_plan(vertex=['1','-1'],p='1/2',axis='Y',points=[
            {'id':'F','kind':'FOCUS'},{'id':'V','kind':'VERTEX'},
            {'id':'P','kind':'LINE_CONIC','line':'m','which':1},{'id':'Q','kind':'ON_CONIC','y':'1/2','branch':'NEG'}],
            segments=[],lines=[{'id':'m','x':'3'},{'id':'d','role':'DIRECTRIX'}])
        model=E.produce(value)
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['F']['x']['exact'],rows['F']['y']['exact']),('1','-1/2'))
        self.assertEqual(model['conic']['directrix']['orientation'],'HORIZONTAL')
        self.assertEqual(rows['P']['x']['exact'],'3');self.assertEqual(rows['P']['y']['exact'],'1')
        self.assertEqual(rows['Q']['y']['exact'],'1/2')
        self.assertTrue(rows['Q']['onCurve'])
        self.assertLess(float(rows['Q']['x']['value']),1.0)

    def test_conic_refusals_carry_their_own_codes(self):
        check=lambda value,code:refused_with(self,E.produce,value,code)
        check(conic_plan(p='0'),'CONIC_PARAMETER_INVALID')
        check(conic_plan(p='x'),'CONIC_PARAMETER_INVALID')
        check(conic_plan(axis='Z'),'CONIC_PARAMETER_INVALID')
        check(conic_plan(kind='SPIRAL'),'CONIC_KIND_UNSUPPORTED')
        check({**conic_plan(),'ellipse':{'center':['0','0'],'semiAxisSquared':{'major':'4','minor':'1'},'majorAxis':'X'}},'CONIC_PLAN_CONFLICT')
        check(conic_plan(points=[{'id':'A','kind':'ON_CONIC','x':'-1','branch':'POS'}],segments=[]),'CONIC_POINT_NOT_ON_CURVE')
        check(conic_plan(points=[{'id':'A','kind':'ON_CONIC','y':'1'},{'id':'B','kind':'LINE_CONIC','line':'k','which':1}],segments=[],
                         lines=[{'id':'k','x':'-3'}]),'CONIC_LINE_NO_INTERSECTION')
        check(conic_plan(points=[{'id':'B','kind':'LINE_CONIC','line':'k','which':2}],segments=[],
                         lines=[{'id':'k','y':'1'}]),'CONIC_INTERSECTION_INDEX_INVALID')
        check(conic_plan(points=[{'id':'B','kind':'LINE_CONIC','line':'k','which':2}],segments=[],
                         lines=[{'id':'k','x':'0'}]),'CONIC_INTERSECTION_INDEX_INVALID')
        check(conic_plan(points=[{'id':'A','kind':'ON_CONIC','y':'2'},{'id':'M','kind':'FOOT','from':'A','onto':'nope'}],segments=[]),'CONIC_FOOT_INVALID')
        check(conic_plan(points=[{'id':'F','kind':'FOCUS'},{'id':'M','kind':'FOOT','from':'F','onto':'k'}],segments=[],
                         lines=[{'id':'k','y':'0'}]),'CONIC_FOOT_INVALID')
        check(conic_plan(points=[{'id':'O','kind':'ORIGIN'},{'id':'V','kind':'VERTEX'}],segments=[]),'CONIC_POINT_COINCIDENT')
        check(conic_plan(lines=[{'id':'l','role':'DIRECTRIX','label':'x'*41}]),'CONIC_LINE_LABEL_INVALID')
        check(conic_plan(lines=[{'id':'l','role':'DIRECTRIX','x':'3'}]),'ELLIPSE_LINE_INVALID')

    def test_ellipse_plans_keep_refusing_conic_only_fields(self):
        refused_with(self,E.produce,plan(lines=[{'id':'l','slope':'1','intercept':'1','role':'DIRECTRIX'}]),'CONIC_DIRECTRIX_REQUIRES_PARABOLA')
        refused_with(self,E.produce,plan(lines=[{'id':'l','slope':'1','intercept':'1','label':'l'}]),'ELLIPSE_LINE_LABEL_UNSUPPORTED')
        refused_with(self,E.produce,plan(points=[{'id':'A','kind':'ON_CONIC','x':'1'}]),'ELLIPSE_POINT_INVALID')


class ConicObserverTest(unittest.TestCase):
    def audit(self,svg_text,value=None):
        return CO.audit(value or conic_plan(),svg_text)

    def assertFails(self,result,prefix):
        self.assertEqual(result['status'],'FAIL')
        self.assertTrue(any(error.startswith(prefix) for error in result['errors']),'%s not in %s'%(prefix,result['errors']))

    def test_a_faithful_parabola_svg_passes_and_the_dispatch_finds_the_conic_observer(self):
        result=self.audit(conic_svg())
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertAlmostEqual(result['checks']['scale'],SCALE,delta=0.05)
        self.assertEqual(O.audit(conic_plan(),conic_svg())['status'],'PASS')

    def test_the_curve_must_lie_on_the_exact_equation(self):
        self.assertFails(self.audit(conic_svg(curve_squash=0.8)),'CONIC_CURVE_OFF_EQUATION')

    def test_the_directrix_and_other_lines_sit_on_their_equations(self):
        self.assertFails(self.audit(conic_svg(directrix_x=-1.3)),'CONIC_DIRECTRIX_MISMATCH:l')
        value=conic_plan(lines=[{'id':'l','role':'DIRECTRIX','label':'l'},{'id':'m','x':'3'}])
        good=conic_svg(extra='<line id="line-m" data-role="line" data-line="m" x1="%.2f" y1="10" x2="%.2f" y2="290"/>'%(px(3),px(3)))
        self.assertEqual(self.audit(good,value)['status'],'PASS')
        bad=conic_svg(extra='<line id="line-m" data-role="line" data-line="m" x1="%.2f" y1="10" x2="%.2f" y2="290"/>'%(px(3.4),px(3.4)))
        self.assertFails(self.audit(bad,value),'LINE_OFF_EQUATION:m')
        self.assertFails(self.audit(good),'LINE_UNDECLARED:m')

    def test_points_on_the_curve_and_the_focus_stay_where_the_plan_puts_them(self):
        self.assertFails(self.audit(conic_svg(markers={'F':(1.4,0),'O':(0,0),'A':(4,4),'M':(-1,4)})),'POINT_MOVED:F')
        result=self.audit(conic_svg(markers={'F':(1,0),'O':(0,0),'A':(4,3.5),'M':(-1,4)}))
        self.assertFails(result,'POINT_MOVED:A')
        self.assertTrue(any(error.startswith('CONIC_POINT_OFF_CURVE:A') for error in result['errors']),result['errors'])

    def test_a_line_conic_point_is_the_named_intersection(self):
        value=conic_plan(points=[{'id':'F','kind':'FOCUS'},{'id':'A','kind':'ON_CONIC','x':'4','branch':'POS'},
                                 {'id':'B','kind':'LINE_CONIC','line':'k1','which':1}],segments=[],
                         lines=[{'id':'l','role':'DIRECTRIX','label':'l'},{'id':'k1','through':['A','F'],'hidden':True}])
        ok=self.audit(conic_svg(markers={'F':(1,0),'A':(4,4),'B':(0.25,-1)},mark=False),value)
        self.assertEqual(ok['status'],'PASS',ok['errors'])
        # B drawn on A's own intersection: a right place on the curve, but the wrong one of the two
        swapped=self.audit(conic_svg(markers={'F':(1,0),'A':(4,4),'B':(4,4)},mark=False),value)
        self.assertFails(swapped,'CONIC_INTERSECTION_MISMATCH:B:order')
        off_line=self.audit(conic_svg(markers={'F':(1,0),'A':(4,4),'B':(1,-2)},mark=False),value)
        self.assertFails(off_line,'CONIC_INTERSECTION_MISMATCH:B:not-on-line')

    def test_the_foot_of_the_perpendicular_and_its_right_angle_mark(self):
        self.assertFails(self.audit(conic_svg(markers={'F':(1,0),'O':(0,0),'A':(4,4),'M':(-1,3)})),'CONIC_FOOT_MISMATCH:M:not-perpendicular')
        self.assertFails(self.audit(conic_svg(markers={'F':(1,0),'O':(0,0),'A':(4,4),'M':(-1.4,4)})),'CONIC_FOOT_MISMATCH:M:not-on-line')
        self.assertFails(self.audit(conic_svg(mark=False)),'CONIC_FOOT_MISMATCH:M:rightangle-missing')
        crooked=conic_svg().replace('%.2f,%.2f %.2f,%.2f'%(px(-1)+6,py(4),px(-1)+6,py(4)+6),'%.2f,%.2f %.2f,%.2f'%(px(-1)+6,py(4),px(-1)+9,py(4)+6))
        self.assertNotEqual(crooked,conic_svg())
        self.assertFails(self.audit(crooked),'CONIC_FOOT_MISMATCH:M:rightangle-shape')
        no_mark_plan=conic_plan(points=[{'id':'F','kind':'FOCUS'},{'id':'O','kind':'ORIGIN'},{'id':'A','kind':'ON_CONIC','x':'4','branch':'POS'},
                                        {'id':'M','kind':'FOOT','from':'A','onto':'l'}])
        self.assertFails(self.audit(conic_svg(),no_mark_plan),'CONIC_FOOT_MISMATCH:M:rightangle-undeclared')

    def test_the_line_name_is_the_plans_text_and_sits_by_its_own_line(self):
        self.assertFails(self.audit(conic_svg(line_label='m')),'CONIC_LINE_LABEL_MISMATCH:l:text')
        near='data-box="%.2f,%.2f,6,12"/>'%(px(-1)+8,py(4)+30)
        far=conic_svg().replace(near,'data-box="%.2f,%.2f,6,12"/>'%(px(4),py(-3)))
        self.assertNotEqual(far,conic_svg())
        self.assertFails(self.audit(far),'CONIC_LINE_LABEL_MISMATCH:l:not-adjacent')

    def test_the_definition_check_uses_the_plans_own_focus_and_directrix(self):
        par=CO.parabola_of(conic_plan()['conic'])
        points={'A':(S.Integer(4),S.Integer(4))}
        self.assertEqual(CO.definition_errors(par,points),[])
        self.assertEqual(CO.definition_errors(par,points,focus=(S.Integer(2),S.Integer(0))),['CONIC_DEFINITION_MISMATCH:A'])
        self.assertEqual(CO.definition_errors(par,points,directrix=(S.Integer(1),S.Integer(0),S.Integer(-2))),['CONIC_DEFINITION_MISMATCH:A'])

    def test_the_observer_refuses_the_same_plans_the_producer_does(self):
        for value,code in ((conic_plan(kind='SPIRAL'),'CONIC_KIND_UNSUPPORTED'),(conic_plan(p='0'),'CONIC_PARAMETER_INVALID'),
                           ({**conic_plan(),'ellipse':{}},'CONIC_PLAN_CONFLICT')):
            self.assertEqual(self.audit(conic_svg(),value)['errors'],['PLAN_REFUSED:%s'%code])


# --- hyperbola (G2b) ------------------------------------------------------------------------------------------------------------------------
HX,HY=150.0,150.0
HSCALE=20.0


def hyper_plan(points=None,lines=None,**conic):
    return {'capability':'ellipse-figure-v1','caption':'c',
            'sourceConditions':[{'id':'c1','condition':'c','mappedTo':['conic']}],'newVisualInformation':['n'],
            'conic':{'kind':'HYPERBOLA','center':['0','0'],'aSquared':'12','bSquared':'12','transverse':'X',**conic},
            'points':points if points is not None else [
                {'id':'O','kind':'ORIGIN','label':False},{'id':'P','kind':'ON_CONIC','x':'4','sign':'POS','label':False},
                {'id':'A','kind':'LINE_LINE','lines':['k1','s1'],'label':False},{'id':'B','kind':'LINE_LINE','lines':['k1','s2'],'label':False}],
            'segments':[],'polygons':[{'id':'t','points':['O','A','B']}] if points is None else [],
            'lines':lines if lines is not None else [
                {'id':'s1','role':'ASYMPTOTE','sign':1,'dashed':True},{'id':'s2','role':'ASYMPTOTE','sign':-1,'dashed':True},
                {'id':'k1','slope':'2','intercept':'-6'}]}


def hx(x):
    return HX+HSCALE*x


def hy(y):
    return HY-HSCALE*y


def hyper_svg(squash=1.0,drop_branch=None,asymptote_turn=0.0,markers=None,dash=True,neg_side_flip=False):
    """x^2-y^2=12 at 20 px per unit: axes, both branches, the asymptotes, the line y=2x-6, O, P, A(6,6), B(2,-2) and the triangle."""
    markers=markers or {'O':(0,0),'P':(4,2),'A':(6,6),'B':(2,-2)}
    a=math.sqrt(12.0)
    out=['<svg xmlns="%s" width="300" height="300" viewBox="0 0 300 300">'%NS,
         '<line id="axis-x" data-role="axis" data-axis="x" x1="10" y1="150" x2="290" y2="150"/>',
         '<line id="axis-y" data-role="axis" data-axis="y" x1="150" y1="290" x2="150" y2="10"/>',
         '<polygon id="axis-x-head" data-role="axis-head" data-axis="x" points="290,150 281,146.4 281,153.6"/>',
         '<polygon id="axis-y-head" data-role="axis-head" data-axis="y" points="150,10 146.4,19 153.6,19"/>']
    out.append('<polygon id="polygon-t" data-role="polygon" data-points="O,A,B" points="%.2f,%.2f %.2f,%.2f %.2f,%.2f" fill="%s"/>'%(
        hx(0),hy(0),hx(markers['A'][0]),hy(markers['A'][1]),hx(markers['B'][0]),hy(markers['B'][1]),O.LIGHT_FILL))
    for name,side in (('POS',1),('NEG',-1)):
        if drop_branch==name: continue
        ts=[-1.3+0.1*i for i in range(27)]
        flip=-1 if (neg_side_flip and name=='NEG') else 1
        d=' '.join('%s%.2f %.2f'%('M' if i==0 else 'L',hx(flip*side*a*math.cosh(t)),hy(squash*a*math.sinh(t))) for i,t in enumerate(ts))
        out.append('<path id="curve-%s" data-role="curve" data-curve="HYPERBOLA" data-branch="%s" d="%s" fill="none"/>'%(name.lower(),name,d))
    dashed=' stroke-dasharray="5 4"' if dash else ''
    turn=math.radians(asymptote_turn)
    for lid,slope,extra in (('s1',1.0,dashed),('s2',-1.0,dashed)):
        far=(7.0,7.0*slope+(7.0*math.tan(turn) if lid=='s1' else 0.0))
        out.append('<line id="line-%s" data-role="line" data-line="%s" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"%s/>'%(
            lid,lid,hx(-7.0),hy(-7.0*slope),hx(far[0]),hy(far[1]),extra))
    out.append('<line id="line-k1" data-role="line" data-line="k1" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>'%(hx(-0.5),hy(-7),hx(6.5),hy(7)))
    for pid,(x,y) in markers.items():
        out.append('<circle id="point-%s" data-role="point" data-point="%s" cx="%.2f" cy="%.2f" r="3.2"/>'%(pid,pid,hx(x),hy(y)))
    out.append('</svg>')
    return ''.join(out)


class HyperbolaProduceTest(unittest.TestCase):
    def test_foci_vertices_asymptotes_and_meeting_points_are_exact(self):
        value=hyper_plan(points=[
            {'id':'F','kind':'FOCUS','side':1},{'id':'G','kind':'FOCUS','side':-1},{'id':'V','kind':'VERTEX','side':1},
            {'id':'P','kind':'ON_CONIC','x':'4','sign':'POS'},{'id':'Q','kind':'ON_CONIC','y':'-2','branch':'NEG'},
            {'id':'A','kind':'LINE_LINE','lines':['k1','s1']},{'id':'B','kind':'LINE_LINE','lines':['k1','s2']},
            {'id':'C','kind':'LINE_CONIC','line':'k1','which':1,'label':False}])
        model=E.produce(value)
        rows={row['id']:row for row in model['points']}
        self.assertEqual(model['conic']['kind'],'HYPERBOLA')
        self.assertEqual((rows['F']['x']['exact'],rows['G']['x']['exact']),('2*sqrt(6)','-2*sqrt(6)'))
        self.assertEqual(rows['V']['x']['exact'],'2*sqrt(3)')
        self.assertEqual((rows['P']['x']['exact'],rows['P']['y']['exact']),('4','2'))
        self.assertEqual((rows['Q']['x']['exact'],rows['Q']['y']['exact']),('-4','-2'))
        self.assertEqual((rows['A']['x']['exact'],rows['A']['y']['exact']),('6','6'))
        self.assertEqual((rows['B']['x']['exact'],rows['B']['y']['exact']),('2','-2'))
        # y=2x-6 is tangent at (4,2): the single meeting point
        self.assertEqual((rows['C']['x']['exact'],rows['C']['y']['exact']),('4','2'))
        self.assertTrue(rows['P']['onCurve'] and not rows['A']['onCurve'])
        lines={row['id']:row for row in model['lines']}
        self.assertEqual(lines['s1']['slope']['exact'],'1');self.assertEqual(lines['s2']['slope']['exact'],'-1')

    def test_a_transverse_y_hyperbola_and_the_line_parallel_to_an_asymptote(self):
        value=hyper_plan(center=['1','0'],aSquared='4',bSquared='1',transverse='Y',points=[
            {'id':'V','kind':'VERTEX','side':-1},{'id':'P','kind':'ON_CONIC','x':'1','branch':'POS'},
            {'id':'Q','kind':'LINE_CONIC','line':'m','which':1,'label':False}],
            lines=[{'id':'s','role':'ASYMPTOTE','sign':-1},{'id':'m','slope':'-2','intercept':'0'}])
        model=E.produce(value)
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['V']['x']['exact'],rows['V']['y']['exact']),('1','-2'))
        self.assertEqual((rows['P']['x']['exact'],rows['P']['y']['exact']),('1','2'))
        lines={row['id']:row for row in model['lines']}
        self.assertEqual(lines['s']['slope']['exact'],'-2');self.assertEqual(lines['s']['intercept']['exact'],'2')
        # m (slope -2, through the origin) is parallel to the asymptote s: one meeting point only
        self.assertEqual(len(E.produce(value)['points']),3)
        refused_with(self,E.produce,{**value,'points':[{'id':'Q','kind':'LINE_CONIC','line':'m','which':2}]},'CONIC_INTERSECTION_INDEX_INVALID')

    def test_hyperbola_refusals_carry_their_own_codes(self):
        check=lambda value,code:refused_with(self,E.produce,value,code)
        check(hyper_plan(aSquared='0'),'CONIC_PARAMETER_INVALID')
        check(hyper_plan(bSquared='-3'),'CONIC_PARAMETER_INVALID')
        check(hyper_plan(transverse='Z'),'CONIC_PARAMETER_INVALID')
        check(hyper_plan(points=[{'id':'A','kind':'ON_CONIC','x':'1','sign':'POS'}],lines=[]),'CONIC_POINT_NOT_ON_CURVE')
        check(hyper_plan(points=[{'id':'A','kind':'ON_CONIC','x':'-4','branch':'POS','sign':'POS'}],lines=[]),'CONIC_POINT_NOT_ON_CURVE')
        check(hyper_plan(points=[{'id':'F','kind':'FOCUS'}],lines=[]),'ELLIPSE_POINT_INVALID')
        check(hyper_plan(lines=[{'id':'s1','role':'ASYMPTOTE','sign':2}]),'CONIC_PARAMETER_INVALID')
        check(hyper_plan(lines=[{'id':'d','role':'DIRECTRIX'}]),'CONIC_DIRECTRIX_REQUIRES_PARABOLA')
        check(conic_plan(lines=[{'id':'s','role':'ASYMPTOTE','sign':1}]),'CONIC_ASYMPTOTE_REQUIRES_HYPERBOLA')
        check(hyper_plan(points=[{'id':'A','kind':'LINE_LINE','lines':['s1','m']}],
                         lines=[{'id':'s1','role':'ASYMPTOTE','sign':1},{'id':'m','slope':'1','intercept':'1'}]),'CONIC_LINES_PARALLEL')
        check(hyper_plan(points=[{'id':'A','kind':'LINE_CONIC','line':'m','which':1}],
                         lines=[{'id':'m','x':'1'}]),'CONIC_LINE_NO_INTERSECTION')
        check(hyper_plan(points=[{'id':'A','kind':'LINE_LINE','lines':['s1','zz']}]),'ELLIPSE_LINE_INVALID')
        check(conic_plan(points=[{'id':'F','kind':'FOCUS','side':1}],segments=[]),'ELLIPSE_POINT_INVALID')


class HyperbolaObserverTest(unittest.TestCase):
    def audit(self,svg_text,value=None):
        return CO.audit(value or hyper_plan(),svg_text)

    def assertFails(self,result,prefix):
        self.assertEqual(result['status'],'FAIL')
        self.assertTrue(any(error.startswith(prefix) for error in result['errors']),'%s not in %s'%(prefix,result['errors']))

    def test_a_faithful_hyperbola_svg_passes(self):
        result=self.audit(hyper_svg())
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertAlmostEqual(result['checks']['scale'],HSCALE,delta=0.05)
        self.assertEqual(O.audit(hyper_plan(),hyper_svg())['status'],'PASS')

    def test_both_branches_lie_on_the_equation_and_on_their_own_side(self):
        self.assertFails(self.audit(hyper_svg(squash=0.85)),'CONIC_CURVE_OFF_EQUATION')
        self.assertFails(self.audit(hyper_svg(drop_branch='NEG')),'CONIC_HYPERBOLA_BRANCH_MISSING')
        self.assertFails(self.audit(hyper_svg(neg_side_flip=True)),'CONIC_HYPERBOLA_BRANCH_MISSING')

    def test_asymptotes_pass_through_the_centre_at_the_exact_slope_and_stay_dashed(self):
        self.assertFails(self.audit(hyper_svg(asymptote_turn=1.0)),'CONIC_ASYMPTOTE_MISMATCH:s1')
        self.assertFails(self.audit(hyper_svg(dash=False)),'LINE_DASH_MISMATCH')

    def test_line_line_points_sit_on_both_lines(self):
        moved={'O':(0,0),'P':(4,2),'A':(6,6),'B':(2.5,-2)}
        result=self.audit(hyper_svg(markers=moved))
        self.assertFails(result,'CONIC_LINE_LINE_MISMATCH:B')

    def test_the_definition_check_uses_the_plans_own_foci(self):
        par=CO.conic_of(hyper_plan()['conic'])
        points={'P':(S.Integer(4),S.Integer(2))}
        self.assertEqual(CO.definition_errors(par,points),[])
        par['foci']={1:(S.Integer(5),S.Integer(0)),-1:(S.Integer(-4),S.Integer(0))}
        self.assertEqual(CO.definition_errors(par,points),['CONIC_DEFINITION_MISMATCH:P'])

    def test_the_observer_refuses_the_same_plans_the_producer_does(self):
        for value,code in ((hyper_plan(aSquared='0'),'CONIC_PARAMETER_INVALID'),
                           (hyper_plan(lines=[{'id':'d','role':'DIRECTRIX'}]),'CONIC_DIRECTRIX_REQUIRES_PARABOLA'),
                           (conic_plan(lines=[{'id':'s','role':'ASYMPTOTE','sign':1}]),'CONIC_ASYMPTOTE_REQUIRES_HYPERBOLA'),
                           (hyper_plan(points=[{'id':'A','kind':'LINE_LINE','lines':['s1','m']}],
                                       lines=[{'id':'s1','role':'ASYMPTOTE','sign':1},{'id':'m','slope':'1','intercept':'1'}]),'CONIC_LINES_PARALLEL')):
            self.assertEqual(self.audit(hyper_svg(),value)['errors'],['PLAN_REFUSED:%s'%code])


# --- G2c: circle / ellipse kinds, two curves, tangents ---------------------------------------------------------------------------------
def g2c_plan(**fields):
    value={'capability':'ellipse-figure-v1','caption':'c','sourceConditions':[{'id':'c1','condition':'c','mappedTo':['conics']}],
           'newVisualInformation':['n']}
    value.update(fields)
    return value


MIX_CURVES=[{'id':'c1','kind':'ELLIPSE','center':['0','0'],'aSquared':'36','bSquared':'16','major':'X'},
            {'id':'c2','kind':'PARABOLA','vertex':['0','0'],'p':'1','axis':'X'}]


def mix_plan(**fields):
    value=g2c_plan(conics=MIX_CURVES,
                   points=[{'id':'O','kind':'ORIGIN','label':False},{'id':'P','kind':'CONIC_CONIC','curves':['c1','c2'],'which':1,'label':False}],
                   lines=[{'id':'t1','tangent':True,'at':'P','curve':'c1'},{'id':'t2','tangent':True,'at':'P','curve':'c2'}])
    value.update(fields)
    return value


def circle_plan(**fields):
    value=g2c_plan(conic={'kind':'CIRCLE','center':['0','0'],'rSquared':'25'},
                   points=[{'id':'Q','kind':'POINT','x':'7','y':'1','label':False},
                           {'id':'A','kind':'TANGENT_FROM','from':'Q','which':1,'label':False},
                           {'id':'B','kind':'TANGENT_FROM','from':'Q','which':2,'label':False}],
                   lines=[{'id':'u','through':['Q','A'],'tangent':True},{'id':'w','through':['Q','B'],'tangent':True}])
    value.update(fields)
    return value


G_SCALE=20.0


def g2c_svg(plan_value,squash=1.0,moves=None,line_shift=0.0):
    """A faithful SVG of a circle / ellipse / parabola(axis X, vertex 0,0) plan, drawn from the exact model."""
    import json as _json
    model=E.produce(plan_value)
    ox,oy=200.0,150.0
    px=lambda x:ox+float(x)*G_SCALE
    py=lambda y:oy-float(y)*G_SCALE
    out=['<svg xmlns="%s" width="400" height="300" viewBox="0 0 400 300">'%NS,
         '<line id="axis-x" data-role="axis" data-axis="x" x1="10" y1="150" x2="390" y2="150"/>',
         '<line id="axis-y" data-role="axis" data-axis="y" x1="200" y1="290" x2="200" y2="10"/>',
         '<polygon id="axis-x-head" data-role="axis-head" data-axis="x" points="390,150 381,146.4 381,153.6"/>',
         '<polygon id="axis-y-head" data-role="axis-head" data-axis="y" points="200,10 196.4,19 203.6,19"/>']
    rows=model.get('conics') or [dict(model['conic'],id=None)]
    for row in rows:
        tag='' if row['id'] is None else ' data-curve-id="%s"'%row['id']
        if row['kind']=='PARABOLA':
            samples=[(px(s*s/4),py(s)) for s in [i/10.0 for i in range(-55,56)]]
        else:
            if row['kind']=='CIRCLE': rx=ry=float(row['rSquared']['value'])**0.5
            else:
                a,b=float(row['aSquared']['value'])**0.5,float(row['bSquared']['value'])**0.5
                rx,ry=(a,b) if row['major']=='X' else (b,a)
            import math as _m
            samples=[(px(rx*_m.cos(i*_m.pi/180)*(squash if row['kind']=='CIRCLE' else 1)),py(ry*_m.sin(i*_m.pi/180))) for i in range(361)]
        d=' '.join('%s%.2f %.2f'%('L' if i else 'M',x,y) for i,(x,y) in enumerate(samples))
        out.append('<path id="curve%s" data-role="curve" data-curve="%s"%s d="%s" fill="none"/>'%(row['id'] or '',row['kind'],tag,d))
    for row in model['points']:
        x,y=px(row['x']['value']),py(row['y']['value'])
        if moves and row['id'] in moves: x,y=moves[row['id']]
        out.append('<circle id="point-%s" data-role="point" data-point="%s" cx="%.2f" cy="%.2f" r="3"/>'%(row['id'],row['id'],x,y))
    for row in model['lines']:
        a,b,c=[float(row['general'][key]['value']) for key in 'abc']
        if abs(b)>1e-12: ends=[(-8,(c-a*-8)/b),(8,(c-a*8)/b)]
        else: ends=[(c/a,-6),(c/a,6)]
        out.append('<line id="line-%s" data-role="line" data-line="%s" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>'%(
            row['id'],row['id'],px(ends[0][0]),py(ends[0][1])+line_shift,px(ends[1][0]),py(ends[1][1])+line_shift))
    out.append('</svg>')
    return ''.join(out)


class G2cProduceTest(unittest.TestCase):
    def test_two_curves_meet_and_the_tangents_at_the_meeting_are_exact(self):
        model=E.produce(mix_plan())
        rows={row['id']:row for row in model['points']}
        self.assertEqual((rows['P']['x']['exact'],rows['P']['y']['exact']),('3','-2*sqrt(3)'))
        self.assertEqual(rows['P']['onCurves'],['c1','c2'])
        self.assertEqual([row['kind'] for row in model['conics']],['ELLIPSE','PARABOLA'])
        slopes=[row['slope']['value'] for row in model['lines']]
        self.assertAlmostEqual(slopes[0]*slopes[1],-2/9,places=9)
        self.assertEqual(model['lines'][0]['tangencyPoint']['x']['exact'],'3')

    def test_a_circle_and_the_tangents_from_an_outside_point(self):
        model=E.produce(circle_plan())
        rows={row['id']:row for row in model['points']}
        self.assertEqual([(rows[i]['x']['exact'],rows[i]['y']['exact']) for i in 'AB'],[('3','4'),('4','-3')])
        self.assertTrue(all(row['tangent'] for row in model['lines']))

    def test_hyperbola_and_circle_meet_in_four_points_in_x_then_y_order(self):
        value=g2c_plan(conics=[{'id':'h','kind':'HYPERBOLA','center':['0','0'],'aSquared':'1','bSquared':'24','transverse':'X'},
                               {'id':'k','kind':'CIRCLE','center':['0','0'],'rSquared':'25'}],
                       points=[{'id':'P','kind':'CONIC_CONIC','curves':['h','k'],'which':4,'label':False},
                               {'id':'N','kind':'CONIC_CONIC','curves':['h','k'],'which':1,'label':False}])
        rows={row['id']:row for row in E.produce(value)['points']}
        self.assertEqual((rows['P']['x']['exact'],rows['P']['y']['exact']),('7/5','24/5'))
        self.assertEqual((rows['N']['x']['exact'],rows['N']['y']['exact']),('-7/5','-24/5'))

    def test_an_ellipse_has_foci_and_a_circle_a_centre(self):
        value=g2c_plan(conic={'kind':'ELLIPSE','center':['0','0'],'aSquared':'25','bSquared':'9','major':'X'},
                       points=[{'id':'F','kind':'FOCUS','side':1},{'id':'V','kind':'VERTEX','side':-1},{'id':'M','kind':'ON_CONIC','x':'0','branch':'POS'}])
        rows={row['id']:row for row in E.produce(value)['points']}
        self.assertEqual((rows['F']['x']['exact'],rows['V']['x']['exact'],rows['M']['y']['exact']),('4','-5','3'))
        value=g2c_plan(conic={'kind':'CIRCLE','center':['1','2'],'rSquared':'5'},points=[{'id':'C','kind':'CENTER'}])
        self.assertEqual(E.produce(value)['points'][0]['x']['exact'],'1')

    def test_refusals_carry_their_own_codes(self):
        check=lambda value,code:refused_with(self,E.produce,value,code)
        check(mix_plan(lines=[{'id':'t','slope':'0','intercept':'3','tangent':True,'curve':'c1'}]),'CONIC_TANGENT_CLAIM_FALSE')
        check(circle_plan(lines=[{'id':'t','slope':'0','intercept':'4','tangent':True}]),'CONIC_TANGENT_CLAIM_FALSE')
        check(circle_plan(points=[{'id':'Q','kind':'POINT','x':'1','y':'1'},{'id':'A','kind':'TANGENT_FROM','from':'Q','which':1}],lines=[]),'CONIC_TANGENT_FROM_INVALID')
        check(circle_plan(points=[{'id':'Q','kind':'POINT','x':'5','y':'0'},{'id':'A','kind':'TANGENT_FROM','from':'Q','which':1}],lines=[]),'CONIC_TANGENT_FROM_INVALID')
        check(circle_plan(points=[{'id':'Q','kind':'POINT','x':'7','y':'1'},{'id':'A','kind':'TANGENT_FROM','from':'Q','which':3}],lines=[]),'CONIC_INTERSECTION_INDEX_INVALID')
        check(mix_plan(points=[{'id':'P','kind':'CONIC_CONIC','curves':['c1','c2'],'which':3}],lines=[]),'CONIC_INTERSECTION_INDEX_INVALID')
        check(g2c_plan(conics=[MIX_CURVES[0],{'id':'c2','kind':'CIRCLE','center':['10','10'],'rSquared':'1'}],
                       points=[{'id':'P','kind':'CONIC_CONIC','curves':['c1','c2'],'which':1}]),'CONIC_INTERSECTION_INDEX_INVALID')
        check(g2c_plan(conics=MIX_CURVES+[{'id':'c3','kind':'CIRCLE','center':['0','0'],'rSquared':'1'}]),'CONIC_TOO_MANY_CURVES')
        check(mix_plan(conic=MIX_CURVES[0]),'CONIC_PLAN_CONFLICT')
        check(mix_plan(ellipse={'center':['0','0']}),'CONIC_PLAN_CONFLICT')
        check(mix_plan(points=[{'id':'F','kind':'FOCUS','side':1}],lines=[]),'CONIC_CURVE_REQUIRED')
        check(mix_plan(lines=[{'id':'t1','tangent':True,'at':'P'}]),'CONIC_CURVE_REQUIRED')
        check(g2c_plan(conic={'kind':'CIRCLE','center':['0','0'],'rSquared':'0'}),'CONIC_PARAMETER_INVALID')
        check(g2c_plan(conic={'kind':'ELLIPSE','center':['0','0'],'aSquared':'4','bSquared':'4','major':'X'}),'CONIC_PARAMETER_INVALID')
        check(g2c_plan(conic={'kind':'ELLIPSE','center':['0','0'],'aSquared':'0','bSquared':'4','major':'X'}),'CONIC_PARAMETER_INVALID')


class G2cObserverTest(unittest.TestCase):
    def assertFails(self,result,prefix):
        self.assertEqual(result['status'],'FAIL')
        self.assertTrue(any(error.startswith(prefix) for error in result['errors']),'%s not in %s'%(prefix,result['errors']))

    def test_faithful_svgs_pass_and_the_dispatch_reads_conics(self):
        for value in (mix_plan(),circle_plan()):
            result=CO.audit(value,g2c_svg(value))
            self.assertEqual(result['status'],'PASS',result['errors'])
            self.assertAlmostEqual(result['checks']['scale'],G_SCALE,delta=0.05)
        self.assertEqual(O.audit(mix_plan(),g2c_svg(mix_plan()))['status'],'PASS')

    def test_a_circle_must_be_round(self):
        value=circle_plan()
        self.assertFails(CO.audit(value,g2c_svg(value,squash=0.9)),'CONIC_CIRCLE_NOT_ROUND')

    def test_the_meeting_of_two_curves_lies_on_both(self):
        value=mix_plan()
        self.assertFails(CO.audit(value,g2c_svg(value,moves={'P':(260.0,190.0)})),'CONIC_CONIC_INTERSECTION_MISMATCH:P')

    def test_a_tangent_from_point_must_touch(self):
        value=circle_plan()
        # (5,0) is on the circle but is not a point of contact of the tangents from (7,1)
        self.assertFails(CO.audit(value,g2c_svg(value,moves={'A':(300.0,150.0)})),'CONIC_TANGENT_FROM_MISMATCH:A')

    def test_a_false_tangent_claim_and_an_undeclared_contact_are_caught(self):
        base=circle_plan(points=[{'id':'Q','kind':'POINT','x':'7','y':'1','label':False}],lines=[{'id':'u','slope':'0','intercept':'4','tangent':True}])
        self.assertFails(CO.audit(base,g2c_svg(circle_plan(points=[],lines=[]))),'TANGENT_CLAIM_FALSE:u')
        undeclared=circle_plan(points=[{'id':'Q','kind':'POINT','x':'7','y':'1','label':False}],lines=[{'id':'u','slope':'0','intercept':'5','tangent':True}])
        self.assertFails(CO.audit(undeclared,g2c_svg(undeclared)),'TANGENCY_POINT_NOT_DECLARED:u')

    def test_a_tangent_line_drawn_off_its_equation_fails(self):
        value=mix_plan()
        self.assertFails(CO.audit(value,g2c_svg(value,line_shift=5.0)),'LINE_OFF_EQUATION')

    def test_the_ellipse_definition_uses_the_plans_own_foci(self):
        par=CO.conic_of({'kind':'ELLIPSE','center':['0','0'],'aSquared':'25','bSquared':'9','major':'X'})
        points={'P':(S.Integer(0),S.Integer(3))}
        self.assertEqual(CO.definition_errors(par,points),[])
        par['foci']={1:(S.Integer(5),S.Integer(0)),-1:(S.Integer(-4),S.Integer(0))}
        self.assertEqual(CO.definition_errors(par,points),['CONIC_DEFINITION_MISMATCH:P'])

    def test_the_observer_refuses_the_same_plans_the_producer_does(self):
        for value,code in ((g2c_plan(conics=MIX_CURVES+[{'id':'c3','kind':'CIRCLE','center':['0','0'],'rSquared':'1'}]),'CONIC_TOO_MANY_CURVES'),
                           (mix_plan(conic=MIX_CURVES[0]),'CONIC_PLAN_CONFLICT'),
                           (mix_plan(points=[{'id':'F','kind':'FOCUS','side':1}],lines=[]),'CONIC_CURVE_REQUIRED'),
                           (circle_plan(points=[{'id':'Q','kind':'POINT','x':'1','y':'1'},{'id':'A','kind':'TANGENT_FROM','from':'Q','which':1}],lines=[]),'CONIC_TANGENT_FROM_INVALID'),
                           (mix_plan(points=[{'id':'P','kind':'CONIC_CONIC','curves':['c1','c2'],'which':3}],lines=[]),'CONIC_INTERSECTION_INDEX_INVALID'),
                           (g2c_plan(conic={'kind':'CIRCLE','center':['0','0'],'rSquared':'0'}),'CONIC_PARAMETER_INVALID')):
            self.assertEqual(CO.audit(value,'<svg xmlns="%s"/>'%NS)['errors'],['PLAN_REFUSED:%s'%code])


if __name__=='__main__':
    unittest.main()
