"""G13a: right-angle squares and equal-angle arcs on a graph (overlays.rightAngles / angles / equalAngles), the vertical asymptote label place (graphPlan.verticalAsymptoteLabelAt)
and the length label of a radical segment. Framing checks run without Chrome; the observer is checked on stored final figures (g13a-fixtures/*.json: plan = framed graphPlan,
svg = composed figure, transform = observer frame) with tamper cases that must fail. No Chrome here."""
import copy
import json
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

TESTS=Path(__file__).resolve().parent
sys.path.insert(0,str(TESTS.parent/'production'))
sys.path.insert(0,str(TESTS.parent))
from graph_framing import fit_overview,_overlay_features
from graph_observer import audit

FIXTURES=TESTS/'g13a-fixtures'
# y=(2/3)x^3+2x^2+x: the tangents at A(-2,2/3) and B(-1,1/3) have slopes 1 and -1 and meet at C(-5/3,1) at a right angle
CUBIC={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','1','2','2/3']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2.4,0.5],'viewport':[-2.8,0.6,-0.7,1.7],
       'axisTickValues':{'x':[],'y':[]},'requiredPoints':[{'id':'M','x':'-1-sqrt(2)/2','y':'1/3+sqrt(2)/3','marker':'NONE'},{'id':'N','x':'-1+sqrt(2)/2','y':'1/3-sqrt(2)/3','marker':'NONE'}],
       'overlays':{'lines':[{'id':'TA','slope':'1','intercept':'8/3'},{'id':'TB','slope':'-1','intercept':'-2/3'}],
                   'points':[{'id':'A','curveX':'-2'},{'id':'B','curveX':'-1'},{'id':'C','intersect':['TA','TB']}]}}
# y=4-x^2, P(1,3), Q(7-3*sqrt(5),0): PQ bisects the angle APB
PARABOLA={'family':'piecewise-polynomial','pieces':[{'coefficients':['4','0','-1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-1,5],'axisTickValues':{'x':[],'y':[]},
          'requiredPoints':[{'id':'V','x':'0','y':'4','marker':'NONE'}],'coordinateBand':{'hide':['V']},
          'overlays':{'points':[{'id':'A','axis':'x','value':'-2'},{'id':'B','axis':'x','value':'2'},{'id':'P','curveX':'1'},{'id':'Q','axis':'x','value':'7-3*sqrt(5)'}]}}

def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def with_overlays(base,**fields):
    plan=copy.deepcopy(base);plan['overlays'].update(fields);return plan
def marks(plan):return {row['id']:row for row in fit_overview(copy.deepcopy(plan))['graphPlan']['overlaysFeatures']['angleMarks']}
def fixture(name):
    data=json.loads((FIXTURES/(name+'.json')).read_text(encoding='utf-8'));return data['plan'],data['svg'],data['transform']
def edit(svg,change):
    root=ET.fromstring(svg);change(root);return ET.tostring(root,encoding='unicode')
def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)

class RightAngleFraming(unittest.TestCase):
    def test_a_right_angle_at_a_vertex_between_two_named_points(self):
        row=marks(with_overlays(CUBIC,rightAngles=[{'at':'C','from':['A','B']}]))['ra1']
        self.assertEqual((row['kind'],row['refs'],row['helpers'],row['value'],row['objectId']),('RIGHT',['A','C','B'],[],90.0,'overlay-rightangle-ra1'))
    def test_a_right_angle_between_two_perpendicular_lines(self):
        row=marks(with_overlays(CUBIC,rightAngles=[{'id':'k','lines':['TA','TB']}]))['k']
        self.assertEqual([helper['id'] for helper in row['helpers']],['overlay-angle-rk-a','overlay-angle-rk-v','overlay-angle-rk-b'])
        vertex=row['helpers'][1]['at'];self.assertAlmostEqual(vertex[0],-5/3,places=9);self.assertAlmostEqual(vertex[1],1.0,places=9)
        # side picks which of the four right angles: the one whose middle points down is the one inside the circle of the sample
        down=marks(with_overlays(CUBIC,rightAngles=[{'id':'k','lines':['TA','TB'],'side':'S'}]))['k']['helpers']
        self.assertLess(down[0]['at'][1],1.0);self.assertLess(down[2]['at'][1],1.0)
        up=row['helpers'];self.assertGreater(up[0]['at'][1],1.0);self.assertGreater(up[2]['at'][1],1.0)
    def test_a_required_point_that_has_exact_coordinates_is_a_hidden_helper(self):
        # N(-1+sqrt(2)/2, 1/3-sqrt(2)/3) is a requiredPoints entry (marker NONE): it is read by its exact coordinates and gets a hidden helper dot, never a drawn one
        plan=with_overlays(CUBIC,angles=[{'at':'B','from':'A','to':'N'}])
        row=marks(plan)['ang1'];self.assertEqual(row['refs'],['A','B','overlay-angle-ang1-b']);self.assertEqual([helper['id'] for helper in row['helpers']],['overlay-angle-ang1-b'])
        self.assertAlmostEqual(row['helpers'][0]['at'][0],-1+2**.5/2,places=9)
    def test_directions_that_are_not_perpendicular_are_refused(self):
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'at':'A','from':['B','C']}])),'GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR:ra1')
        lines=[{'id':'TA','slope':'1','intercept':'8/3'},{'id':'TB','slope':'-2','intercept':'-2/3'}]
        self.assertEqual(refused(with_overlays(CUBIC,lines=lines,points=[{'id':'A','curveX':'-2'}],rightAngles=[{'lines':['TA','TB']}])),'GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR:ra1')
    def test_a_vertical_and_a_horizontal_line_are_perpendicular(self):
        lines=[{'id':'V','x':'-1'},{'id':'H','slope':'0','intercept':'1/2'}]
        row=marks(with_overlays(CUBIC,lines=lines,points=[{'id':'A','curveX':'-2'}],rightAngles=[{'lines':['V','H']}]))['ra1']
        self.assertEqual(row['helpers'][1]['at'],[-1.0,0.5])
    def test_unknown_points_and_bad_fields_are_refused(self):
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'at':'Z','from':['A','B']}])),'GRAPH_ANGLE_POINT_UNKNOWN:ra1')
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'at':'C','from':['A']}])),'GRAPH_RIGHT_ANGLE_INVALID:ra1')
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'at':'C','from':['A','B'],'color':'BLUE'}])),'GRAPH_RIGHT_ANGLE_INVALID:ra1')
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'lines':['TA','nope']}])),'GRAPH_RIGHT_ANGLE_INVALID:ra1')
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'id':'a'},{'id':'a'}])),'GRAPH_RIGHT_ANGLE_INVALID:a')
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'id':'k','at':'C','from':['A','B']}]*2)),'OVERLAY_ID_DUPLICATE:rightangle:k')
        self.assertEqual(refused(with_overlays(CUBIC,rightAngles=[{'id':str(i),'at':'C','from':['A','B']} for i in range(4)])),'OVERLAY_TOO_MANY:rightAngles')
    def test_unequal_units_are_refused(self):
        framed=fit_overview(copy.deepcopy(with_overlays(CUBIC,rightAngles=[{'at':'C','from':['A','B']}])))['graphPlan']
        for ratio in (0.5,):
            squeezed={**framed,'axisRatio':ratio}
            with self.assertRaises(ValueError) as caught:_overlay_features(squeezed)
            self.assertEqual(str(caught.exception),'GRAPH_RIGHT_ANGLE_UNEQUAL_UNITS:ra1')
        flag={**framed};flag.pop('equalUnits')
        with self.assertRaises(ValueError) as caught:_overlay_features(flag)
        self.assertEqual(str(caught.exception),'GRAPH_RIGHT_ANGLE_UNEQUAL_UNITS:ra1')
    def test_a_plan_without_the_fields_has_no_marks(self):
        self.assertNotIn('angleMarks',fit_overview(copy.deepcopy(CUBIC))['graphPlan']['overlaysFeatures'])

class AngleFraming(unittest.TestCase):
    angles=[{'at':'P','from':'A','to':'Q'},{'at':'P','from':'Q','to':'B'}]
    def test_the_bisector_gives_two_equal_angles_in_one_colour(self):
        rows=marks(with_overlays(PARABOLA,angles=self.angles,equalAngles=[{'angles':[0,1],'color':'BLUE','arcs':2}]))
        self.assertEqual([rows[name]['color'] for name in ('ang1','ang2')],['BLUE','BLUE']);self.assertEqual([rows[name]['arcs'] for name in ('ang1','ang2')],[2,2])
        self.assertAlmostEqual(rows['ang1']['value'],rows['ang2']['value'],places=9);self.assertAlmostEqual(rows['ang1']['value'],31.7175,places=3)
    def test_angles_that_are_not_equal_are_refused(self):
        wrong=[{'at':'P','from':'A','to':'Q'},{'at':'P','from':'Q','to':'B'},{'at':'P','from':'A','to':'B'}]
        self.assertEqual(refused(with_overlays(PARABOLA,angles=wrong,equalAngles=[{'angles':[0,2],'color':'BLUE'}])),'GRAPH_EQUAL_ANGLES_MISMATCH:ang1&ang3')
        # one colour is one size, even without a group
        coloured=[{**wrong[0],'color':'WARM'},{**wrong[2],'color':'WARM'}]
        self.assertEqual(refused(with_overlays(PARABOLA,angles=coloured)),'GRAPH_EQUAL_ANGLES_MISMATCH:ang1&ang2:WARM')
    def test_a_bad_group_or_angle_is_refused(self):
        bad=lambda **fields:refused(with_overlays(PARABOLA,**fields))
        self.assertEqual(bad(angles=self.angles,equalAngles=[{'angles':[0,5],'color':'BLUE'}]),'GRAPH_EQUAL_ANGLES_INVALID:equalAngles.0')
        self.assertEqual(bad(angles=self.angles,equalAngles=[{'angles':[0],'color':'BLUE'}]),'GRAPH_EQUAL_ANGLES_INVALID:equalAngles.0')
        self.assertEqual(bad(angles=self.angles,equalAngles=[{'angles':[0,1]}]),'OVERLAY_COLOR_INVALID:equalAngles.0')
        self.assertEqual(bad(angles=self.angles,equalAngles=[{'angles':[0,1],'color':'RED'}]),'OVERLAY_COLOR_INVALID:equalAngles.0')
        self.assertEqual(bad(angles=self.angles,equalAngles=[{'angles':[0,1],'color':'BLUE','arcs':3}]),'GRAPH_EQUAL_ANGLES_INVALID:equalAngles.0')
        self.assertEqual(bad(angles=[{**self.angles[0],'color':'WARM'},self.angles[1]],equalAngles=[{'angles':[0,1],'color':'BLUE'}]),'OVERLAY_COLOR_INVALID:ang1')
        self.assertEqual(bad(angles=[{'at':'P','from':'A','to':'Z'}]),'GRAPH_ANGLE_POINT_UNKNOWN:ang1')
        self.assertEqual(bad(angles=[{'at':'P','from':'A','to':'A'}]),'GRAPH_ANGLE_DEGENERATE:ang1')
        self.assertEqual(bad(angles=[{'at':'P','from':'A','to':'Q','extra':1}]),'GRAPH_ANGLE_INVALID:ang1')
        self.assertEqual(bad(angles=[{'at':'A','from':'B','to':'Q'}]),'GRAPH_ANGLE_DEGENERATE:ang1')       # A, B and Q lie on one line: a straight angle
    def test_an_angle_needs_one_scale_on_both_axes(self):
        framed=fit_overview(copy.deepcopy(with_overlays(PARABOLA,angles=self.angles)))['graphPlan']
        with self.assertRaises(ValueError) as caught:_overlay_features({**framed,'axisRatio':0.5})
        self.assertEqual(str(caught.exception),'GRAPH_ANGLE_UNEQUAL_UNITS:ang1')

class VerticalAsymptoteFraming(unittest.TestCase):
    RATIONAL={'family':'rational','numerator':['-2','3'],'denominator':['2','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-9,3],'viewport':[-9,3,-6,10],'axisTickValues':{'x':[],'y':[]}}
    def test_the_places_are_checked(self):
        for place in ('TOP_LEFT','TOP_RIGHT','BOTTOM_LEFT','BOTTOM_RIGHT','NONE'):
            self.assertEqual(fit_overview({**copy.deepcopy(self.RATIONAL),'verticalAsymptoteLabelAt':place})['graphPlan']['verticalAsymptoteLabelAt'],place)
        for place in ('LEFT','top_left',None,3):
            self.assertEqual(refused({**self.RATIONAL,'verticalAsymptoteLabelAt':place}),'VERTICAL_ASYMPTOTE_LABEL_AT_INVALID',place)
        self.assertNotIn('verticalAsymptoteLabelAt',fit_overview(copy.deepcopy(self.RATIONAL))['graphPlan'])
    def test_the_constant_numerator_form_takes_it_too(self):
        plan={**copy.deepcopy(self.RATIONAL),'numerator':['3','0'],'denominator':['1','1'],'viewport':[-5,5,-5,5],'domain':[-5,5]}
        self.assertEqual(fit_overview({**plan,'verticalAsymptoteLabelAt':'BOTTOM_RIGHT'})['graphPlan']['verticalAsymptoteLabelAt'],'BOTTOM_RIGHT')

class Fixtures(unittest.TestCase):
    def errors(self,name,change=None,plan=None):
        fixed_plan,svg,transform=fixture(name)
        if change:svg=edit(svg,change)
        return audit(plan or fixed_plan,svg,transform)['errors']
    def test_every_stored_figure_is_clean(self):
        for name in ('right-angle-tangents','equal-angles-bisector','vertical-asymptote-label','vertical-asymptote-label-none'):
            self.assertEqual(self.errors(name),[],name)

class RightAngleObserver(Fixtures):
    name='right-angle-tangents'
    def test_a_square_off_its_vertex_is_named(self):
        def move(root):
            node(root,'overlay-rightangle-ra1').set('points',' '.join(str(float(v)+14) for v in node(root,'overlay-rightangle-ra1').get('points').replace(',',' ').split()))
        self.assertIn('GRAPH_RIGHT_ANGLE_MARK_NOT_AT_VERTEX:ra1',self.errors(self.name,move))
    def test_a_square_that_is_not_square_is_named(self):
        def squash(root):
            mark=node(root,'overlay-rightangle-ra1');values=[float(v) for v in mark.get('points').replace(',',' ').split()]
            values[2]+=5.0;mark.set('points','%g,%g %g,%g %g,%g'%tuple(values))
        self.assertTrue({'GRAPH_RIGHT_ANGLE_MARK_NOT_SQUARE:ra1','GRAPH_RIGHT_ANGLE_MARK_NOT_AT_VERTEX:ra1'} & set(self.errors(self.name,squash)))
    def test_a_missing_square_is_named(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='overlay-rightangle-ra1':parent.remove(child)
        self.assertIn('GRAPH_RIGHT_ANGLE_MARK_MISSING:ra1',self.errors(self.name,drop))
    def test_a_square_the_plan_does_not_declare_is_undeclared(self):
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);del plan['overlays']['rightAngles']
        self.assertIn('OVERLAY_UNDECLARED:overlay-rightangle-ra1',self.errors(self.name,plan=plan))
    def test_a_plan_whose_directions_are_not_perpendicular_is_refused_by_the_observer_too(self):
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['rightAngles']=[{'at':'A','from':['B','C']}]
        result=audit(plan,fixture(self.name)[1],fixture(self.name)[2]);self.assertEqual(result['status'],'UNSUPPORTED');self.assertIn('GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR',result['errors'])
    def test_the_order_of_the_two_legs_does_not_matter(self):
        plan,svg,transform=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['rightAngles']=[{'at':'C','from':['B','A']}]
        self.assertEqual(audit(plan,svg,transform)['errors'],[])
    def test_legs_along_other_rays_are_named(self):
        plan,svg,transform=fixture(self.name);plan=copy.deepcopy(plan)
        # the figure shows the square toward A and B; a plan that asks for the square toward A and the point M (the other tangent point of the cubic) is not what is drawn
        plan['overlays']['points'].append({'id':'D','x':'-5/3','y':'1/3'});plan['overlays']['rightAngles']=[{'at':'C','from':['A','D']}]
        errors=audit(plan,svg,transform)['errors']
        self.assertTrue(any(error.startswith('GRAPH_RIGHT_ANGLE_MARK_') for error in errors) or 'GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR' in errors,errors)

class EqualAnglesObserver(Fixtures):
    name='equal-angles-bisector'
    def arc(self,root,k=1,angle='ang1'):return node(root,'overlay-angle-%s-arc-%d'%(angle,k))
    def test_an_arc_in_another_colour_is_named(self):
        def paint(root):self.arc(root).set('stroke','#b85c00')
        self.assertIn('GRAPH_ANGLE_COLOR_MISMATCH:ang1',self.errors(self.name,paint))
    def test_a_sector_in_another_colour_is_named(self):
        def paint(root):node(root,'overlay-angle-ang2-sector').set('fill','#d9d9d9')
        self.assertIn('GRAPH_ANGLE_COLOR_MISMATCH:ang2',self.errors(self.name,paint))
    def test_an_arc_of_another_size_is_named(self):
        def stretch(root):
            arc=self.arc(root,1,'ang2');values=[float(v) for v in arc.get('points').replace(',',' ').split()]
            values[-2]+=18.0;values[-1]-=9.0;arc.set('points',' '.join('%g,%g'%(values[i],values[i+1]) for i in range(0,len(values),2)))
        errors=self.errors(self.name,stretch)
        self.assertTrue({'GRAPH_ANGLE_MARK_NOT_AT_VERTEX:ang2','GRAPH_ANGLE_MARK_VALUE_MISMATCH:ang2','GRAPH_ANGLE_MARK_LEGS_MISMATCH:ang2'} & set(errors),errors)
    def test_a_missing_arc_is_named(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='overlay-angle-ang1-arc-1':parent.remove(child)
        self.assertIn('GRAPH_ANGLE_MARK_MISSING:ang1',self.errors(self.name,drop))
    def test_angles_that_are_not_equal_are_refused_by_the_observer_too(self):
        plan,svg,transform=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['angles'][1]['to']='A';plan['overlays']['angles'][1]['from']='B'
        result=audit(plan,svg,transform);self.assertNotEqual(result['status'],'PASS')
        plan['overlays']['angles'][1]={'at':'P','from':'Q','to':'B','color':'WARM'};self.assertNotEqual(audit(plan,svg,transform)['status'],'PASS')
    def test_an_arc_the_plan_does_not_declare_is_undeclared(self):
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['equalAngles'][0]['arcs']=1
        self.assertEqual(self.errors(self.name,plan=plan),[])          # one arc declared and drawn
        plan['overlays']['equalAngles'][0]['arcs']=2
        self.assertIn('GRAPH_ANGLE_MARK_MISSING:ang1',self.errors(self.name,plan=plan))

class VerticalAsymptoteObserver(Fixtures):
    def test_a_label_on_the_wrong_side_or_end_is_named(self):
        plan,_,_=fixture('vertical-asymptote-label');plan=copy.deepcopy(plan);plan['verticalAsymptoteLabelAt']='TOP_RIGHT'
        errors=self.errors('vertical-asymptote-label',plan=plan)
        self.assertTrue({'VERTICAL_ASYMPTOTE_LABEL_WRONG_SIDE','VERTICAL_ASYMPTOTE_LABEL_WRONG_END','VERTICAL_ASYMPTOTE_LABEL_NO_ROOM'}<=set(errors),errors)
    def test_a_label_far_from_the_line_is_named(self):
        def far(root):
            node(root,'vertical-asymptote-label').set('transform','translate(-150,0)')
        errors=self.errors('vertical-asymptote-label',far)
        self.assertTrue({'VERTICAL_ASYMPTOTE_LABEL_NOT_AT_LINE','VERTICAL_ASYMPTOTE_LABEL_NO_ROOM'} <= set(errors),errors)
    def test_none_needs_some_label_that_reads_the_asymptote(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if (child.get('id') or '').startswith('overlay-callout-cx'):parent.remove(child)
        errors=self.errors('vertical-asymptote-label-none',drop)
        self.assertIn('VERTICAL_ASYMPTOTE_LABEL_MISSING',errors)

if __name__=='__main__':unittest.main()
