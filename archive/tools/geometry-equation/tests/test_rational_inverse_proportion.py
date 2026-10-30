"""Inverse proportion y=k/(d0+d1*x) on the rational family (nonzero constant numerator) and the optional overlay polygon label:
exact framing at one scale, the model, and the independent observer (including tampering)."""
import copy
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

SVG='{http://www.w3.org/2000/svg}'

def graph(numerator=('6','0'),denominator=('0','1'),**kwargs):
    return {'family':'rational','numerator':list(numerator),'denominator':list(denominator),'domain':[-10,10],'viewport':[-10,10,-10,10],
            'sourceDomain':{'kind':'ALL_REALS'},'axisTickValues':{'x':[],'y':[]},**kwargs}

def framed(plan):
    fitted=fit_overview(plan)['graphPlan'];return fitted,produce(fitted)

def audited(plan,svg=None,transform=None):
    fitted,model=framed(plan)
    return fitted,model,audit(fitted,model['svg'] if svg is None else svg,model['transform'] if transform is None else transform)

def refused(plan):
    try:fit_overview(plan)
    except ValueError as error:return str(error)
    return None

def screen(model,point):
    t=model['transform'];return (t['originX']+point[0]*t['sx'],t['originY']-point[1]*t['sy'])

def with_extra(model,attributes,tag='line'):
    root=ET.fromstring(model['svg']);ET.SubElement(root,SVG+tag,attributes);return ET.tostring(root,encoding='unicode')

class Framing(unittest.TestCase):
    def test_k_over_x_is_framed_at_one_scale_around_the_pole_with_both_axes_in_view(self):
        plan,model=framed(graph())
        self.assertEqual(plan['overviewPolicy'],'RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_v1')
        self.assertTrue(plan['equalUnits']);self.assertEqual(plan['axisRatio'],1.0)
        self.assertEqual(plan['plotCanvas']['width'],448)
        x0,x1,y0,y1=plan['viewport']
        self.assertLess(x0,0);self.assertGreater(x1,0);self.assertLess(y0,0);self.assertGreater(y1,0)
        self.assertEqual(plan['domain'],[x0,x1])
        self.assertAlmostEqual(model['transform']['sx'],model['transform']['sy'],9)
        features=plan['rationalFeatures']
        self.assertEqual(features['singularity'],{'kind':'VERTICAL_POLE','x':'0'})
        self.assertEqual(features['constant'],'6')
        self.assertIsNone(features['xIntercept'])
        self.assertEqual(features['poleDirection'],{'left':'DOWN','right':'UP'})
        # y=0 is the x-axis and x=0 is the y-axis: neither asymptote gets a dashed line.
        self.assertFalse(features['asymptotes']['horizontal']['drawn']);self.assertFalse(features['asymptotes']['vertical']['drawn'])
        self.assertFalse([node for node in ET.fromstring(model['svg']).iter() if node.get('data-role')=='asymptote'])

    def test_off_axis_pole_draws_only_the_vertical_dashed_asymptote(self):
        plan,model=framed(graph(denominator=('-2','1')))
        self.assertEqual(plan['rationalFeatures']['singularity']['x'],'2')
        self.assertTrue(plan['rationalFeatures']['asymptotes']['vertical']['drawn'])
        lines=[node for node in ET.fromstring(model['svg']).iter() if node.get('data-role')=='asymptote']
        self.assertEqual([node.get('data-axis') for node in lines],['vertical'])
        self.assertTrue(lines[0].get('stroke-dasharray'))

    def test_negative_and_fractional_constants_and_slopes(self):
        for numerator,denominator,left,right in ((('-80','0'),('0','1'),'UP','DOWN'),(('1','0'),('0','-2'),'UP','DOWN'),(('1/2','0'),('0','1'),'DOWN','UP')):
            plan,model,result=audited(graph(numerator=numerator,denominator=denominator))
            self.assertEqual(result['status'],'PASS',(numerator,denominator,result['errors']))
            self.assertEqual(plan['rationalFeatures']['poleDirection'],{'left':left,'right':right})

    def test_required_points_and_overlay_points_widen_the_frame_and_stay_in_view(self):
        plan,model,result=audited(graph(numerator=('-80','0'),domain=[-30,30],viewport=[-30,30,-30,30],requiredPoints=[{'id':'P','x':-4,'y':20},{'id':'Q','x':4,'y':-20}]))
        self.assertEqual(result['status'],'PASS',result['errors'])
        x0,x1,y0,y1=plan['viewport']
        for x,y in ((-4,20),(4,-20)):self.assertTrue(x0<x<x1 and y0<y<y1)
        plan2,_,result2=audited(graph(overlays={'points':[{'id':'P','curveX':'3'},{'id':'A','axis':'x','value':'3'}]}))
        self.assertEqual(result2['status'],'PASS',result2['errors'])
        self.assertEqual([point['id'] for point in plan2['overlaysFeatures']['points']],['P','A'])

    def test_grammar_and_every_refusal_has_its_own_code(self):
        self.assertEqual(refused(graph(numerator=('0','0'))),'UNSUPPORTED_RATIONAL_NUMERATOR_ZERO')
        self.assertEqual(refused(graph(denominator=('1','0'))),'UNSUPPORTED_RATIONAL_DENOMINATOR_DEGREE')
        self.assertEqual(refused(graph(numerator=('1','0','0'))),'UNSUPPORTED_RATIONAL_NUMERATOR_GRAMMAR')
        self.assertEqual(refused(graph(sourceDomain={'kind':'INTERVAL','range':[-2,2]})),'RATIONAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
        self.assertEqual(refused(graph(formulaLabel='$y$')),'RATIONAL_FORMULA_LABEL_INVALID')
        self.assertEqual(refused(graph(formulaLabel='y='+'b'*60)),'RATIONAL_FORMULA_LABEL_INVALID')
        self.assertEqual(refused(graph(numerator=('1','1'),denominator=('-1','1'),formulaLabel='y=b/x')),'RATIONAL_FORMULA_LABEL_REQUIRES_CONSTANT_NUMERATOR')
        self.assertEqual(refused(graph(requiredPoints=[{'id':'P','x':1,'y':5}])),'REQUIRED_GRAPH_POINT_NOT_ON_CURVE')
        self.assertEqual(refused(graph(requiredPoints=[{'id':'P','x':0,'y':0}])),'REQUIRED_GRAPH_POINT_OUTSIDE_RATIONAL_DOMAIN')
        # A pole far from the origin cannot share one scale with it and still show both branches.
        self.assertEqual(refused(graph(denominator=('-1000','1'),domain=[-10,1100],viewport=[-10,1100,-10,10])),'EQUAL_UNIT_CURVE_TOO_NARROW')

    def test_a_squeezed_axis_ratio_is_framed_and_observed(self):
        plan,model,result=audited(graph(numerator=('60','0'),domain=[-30,30],viewport=[-30,30,-30,130],requiredPoints=[{'id':'P','x':.5,'y':120}],axisSqueeze=True))
        self.assertEqual(plan['axisRatio'],.5);self.assertAlmostEqual(model['transform']['sy'],.5*model['transform']['sx'],9)
        self.assertEqual(result['status'],'PASS',result['errors'])

    def test_linear_over_linear_framing_is_unchanged(self):
        plan=fit_overview(graph(numerator=('1','1'),denominator=('-1','1'),domain=[-4,4],viewport=[-4,4,-4,4]))['graphPlan']
        self.assertEqual(plan['overviewPolicy'],'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1')
        self.assertEqual(plan['domain'],[-5.0,7.0])
        self.assertNotIn('equalUnits',plan);self.assertNotIn('plotCanvas',plan)

class Observer(unittest.TestCase):
    def test_model_passes_for_the_supported_shapes(self):
        for plan in (graph(),graph(denominator=('-2','1')),graph(numerator=('-80','0'),domain=[-30,30],viewport=[-30,30,-30,30],requiredPoints=[{'id':'P','x':-4,'y':20}])):
            _,_,result=audited(plan)
            self.assertEqual(result['status'],'PASS',result['errors'])
            self.assertEqual(result['overview']['status'],'PASS')

    def test_an_asymptote_drawn_over_an_axis_is_refused(self):
        plan,model,_=audited(graph(denominator=('-2','1')))
        t=model['transform'];x_axis=screen(model,(plan['viewport'][0],0));x_axis_end=screen(model,(plan['viewport'][1],0))
        svg=with_extra(model,{'id':'rational-asymptote-horizontal','data-role':'asymptote','data-axis':'horizontal','x1':str(x_axis[0]),'y1':str(x_axis[1]),'x2':str(x_axis_end[0]),'y2':str(x_axis_end[1]),'stroke':'black','stroke-dasharray':'5 4'})
        result=audit(plan,svg,t)
        self.assertIn('RATIONAL_ASYMPTOTE_DRAWN_ON_X_AXIS',result['overview']['errors'])
        self.assertIn('RATIONAL_ASYMPTOTE_INVENTORY_MISMATCH',result['overview']['errors'])
        # k/x: a dashed line over the y-axis is just as wrong.
        plan,model,_=audited(graph())
        top,bottom=screen(model,(0,plan['viewport'][3])),screen(model,(0,plan['viewport'][2]))
        svg=with_extra(model,{'id':'rational-asymptote-vertical','data-role':'asymptote','data-axis':'vertical','x1':str(top[0]),'y1':str(top[1]),'x2':str(bottom[0]),'y2':str(bottom[1]),'stroke':'black','stroke-dasharray':'5 4'})
        result=audit(plan,svg,model['transform'])
        self.assertIn('RATIONAL_ASYMPTOTE_DRAWN_ON_Y_AXIS',result['overview']['errors'])

    def test_missing_moved_or_solid_off_axis_asymptote_fails(self):
        plan,model,_=audited(graph(denominator=('-2','1')))
        root=ET.fromstring(model['svg']);line=next(node for node in root.iter() if node.get('data-role')=='asymptote')
        root.remove(line)
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('RATIONAL_VERTICAL_ASYMPTOTE_MISSING_OR_WRONG',result['overview']['errors']);self.assertIn('RATIONAL_ASYMPTOTE_INVENTORY_MISMATCH',result['overview']['errors'])
        root=ET.fromstring(model['svg']);line=next(node for node in root.iter() if node.get('data-role')=='asymptote')
        line.set('x1',str(float(line.get('x1'))+9));line.set('x2',str(float(line.get('x2'))+9))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('RATIONAL_ASYMPTOTE_GEOMETRY_MISMATCH',result['overview']['errors'])
        root=ET.fromstring(model['svg']);line=next(node for node in root.iter() if node.get('data-role')=='asymptote');del line.attrib['stroke-dasharray']
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('RATIONAL_ASYMPTOTE_MUST_BE_DASHED',result['overview']['errors'])

    def test_tampered_feature_inventory_scale_and_branch_are_refused(self):
        plan,model,_=audited(graph())
        lying=copy.deepcopy(plan);lying['rationalFeatures']['asymptotes']['vertical']['drawn']=True
        self.assertIn('RATIONAL_FEATURE_INVENTORY_MISMATCH',audit(lying,model['svg'],model['transform'])['overview']['errors'])
        lying=copy.deepcopy(plan);lying['rationalFeatures']['poleDirection']={'left':'UP','right':'DOWN'}
        self.assertIn('RATIONAL_FEATURE_INVENTORY_MISMATCH',audit(lying,model['svg'],model['transform'])['overview']['errors'])
        lying=copy.deepcopy(plan);lying['axisRatio']=.8
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit(lying,model['svg'],model['transform'])['errors'])
        lying=copy.deepcopy(plan);lying['equalUnits']=False
        self.assertIn('EQUAL_UNIT_DECLARATION_MISSING',audit(lying,model['svg'],model['transform'])['errors'])
        # The right branch drawn in the other quadrant pair (y=-6/x) is the wrong curve.
        root=ET.fromstring(model['svg']);t=model['transform']
        def points(node):
            values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?(?:e[+-]?\d+)?',node.get('points'))];return [(values[i],values[i+1]) for i in range(0,len(values),2)]
        right=next(node for node in root.iter() if node.get('data-role')=='curve' and points(node)[0][0]>t['originX'])
        right.set('points',' '.join(f'{x:.9f},{2*t["originY"]-y:.9f}' for x,y in points(right)))
        result=audit(plan,ET.tostring(root,encoding='unicode'),t)
        self.assertEqual(result['status'],'FAIL')
        self.assertIn('RATIONAL_BRANCH_IN_WRONG_QUADRANT',result['overview']['errors']);self.assertIn('RATIONAL_RIGHT_POLE_BRANCH_WRONG_SIDE',result['overview']['errors'])

    def test_a_curve_that_crosses_the_pole_is_refused(self):
        plan,model,_=audited(graph())
        root=ET.fromstring(model['svg']);t=model['transform']
        for node in list(root):
            if node.tag.endswith('polyline') and node.get('data-role')=='curve':root.remove(node)
        a,b=(t['originX']-.8*t['sx'],t['originY']+6/.8*t['sy']),(t['originX']+.8*t['sx'],t['originY']-6/.8*t['sy'])
        ET.SubElement(root,SVG+'polyline',{'id':'crossing','data-role':'curve','points':f'{a[0]},{a[1]} {b[0]},{b[1]}'})
        result=audit(plan,ET.tostring(root,encoding='unicode'),t)
        self.assertIn('DOMAIN_CROSSING',result['errors']);self.assertIn('RATIONAL_LEFT_BRANCH_TOO_NARROW',result['overview']['errors'])

    def test_required_point_dot_must_be_present_and_in_place(self):
        plan,model,_=audited(graph(requiredPoints=[{'id':'P','x':3,'y':2}]))
        root=ET.fromstring(model['svg']);dot=next(node for node in root.iter() if node.get('id')=='required-point-1');root.remove(dot)
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('RATIONAL_REQUIRED_POINT_DOT_MISSING:P',result['overview']['errors']);self.assertIn('RATIONAL_REQUIRED_POINT_INVENTORY_MISMATCH',result['overview']['errors'])
        root=ET.fromstring(model['svg']);dot=next(node for node in root.iter() if node.get('id')=='required-point-1');dot.set('cx',str(float(dot.get('cx'))+5))
        self.assertIn('RATIONAL_REQUIRED_POINT_DOT_MISSING:P',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['overview']['errors'])
        # A required point that is not on the curve is the plan's error, found again by the observer from the exact coefficients.
        lying=copy.deepcopy(plan);lying['requiredPoints']=[{'id':'P','x':3,'y':2.5}]
        self.assertIn('RATIONAL_REQUIRED_POINT_NOT_ON_CURVE:P',audit(lying,model['svg'],model['transform'])['overview']['errors'])

    def test_composed_coordinate_labels_belong_to_their_dots(self):
        plan,model,_=audited(graph(requiredPoints=[{'id':'P','x':3,'y':2}]))
        def composed(owner,present=True):
            root=ET.fromstring(model['svg']);root.set('data-composed','1')
            group=ET.SubElement(root,SVG+'g',{'id':'required-point-1-coordinates','data-label-kind':'COORDINATE_LABEL','data-owner':owner,'transform':'translate(10 10)'})
            if present:ET.SubElement(ET.SubElement(group,SVG+'svg',{'width':'30','height':'10'}),SVG+'path',{'d':'M0 0'})
            return ET.tostring(root,encoding='unicode')
        self.assertEqual(audit(plan,composed('required-point-1'),model['transform'])['overview']['status'],'PASS')
        self.assertIn('RATIONAL_REQUIRED_POINT_COORDINATES_OWNER_MISMATCH:P',audit(plan,composed('required-point-2'),model['transform'])['overview']['errors'])
        root=ET.fromstring(model['svg']);ET.SubElement(root,SVG+'g',{'id':'formula','data-label-kind':'EQUATION_LABEL','data-owner':'formula'})
        self.assertIn('RATIONAL_REQUIRED_POINT_COORDINATES_MISSING:P',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['overview']['errors'])

RECTANGLE=lambda **polygon:graph(overlays={'points':[{'id':'P','curveX':'3'},{'id':'A','axis':'x','value':'3'},{'id':'B','axis':'y','value':'2'},{'id':'O','x':'0','y':'0'}],
                                            'polygons':[{'id':'R','points':['O','A','P','B'],**polygon}]})

class PolygonLabel(unittest.TestCase):
    def test_an_unlabelled_polygon_keeps_its_old_features(self):
        features=fit_overview(RECTANGLE())['graphPlan']['overlaysFeatures']
        self.assertEqual(features['polygons'],[{'id':'R','points':['O','A','P','B'],'fill':'LIGHT'}])

    def test_label_defaults_to_math_and_text_is_allowed(self):
        self.assertEqual(fit_overview(RECTANGLE(label='b'))['graphPlan']['overlaysFeatures']['polygons'][0],{'id':'R','points':['O','A','P','B'],'fill':'LIGHT','label':'b','labelKind':'MATH'})
        self.assertEqual(fit_overview(RECTANGLE(label='(가) 직사각형',labelKind='TEXT'))['graphPlan']['overlaysFeatures']['polygons'][0]['labelKind'],'TEXT')

    def test_invalid_labels_fail_closed_with_their_codes(self):
        for polygon,code in ((dict(label='$b$'),'OVERLAY_POLYGON_LABEL_INVALID:R'),(dict(label='b'*41,labelKind='TEXT'),'OVERLAY_POLYGON_LABEL_INVALID:R'),
                             (dict(label=' '),'OVERLAY_POLYGON_LABEL_INVALID:R'),(dict(label=5),'OVERLAY_POLYGON_LABEL_INVALID:R'),
                             (dict(label='b',labelKind='HTML'),'OVERLAY_POLYGON_LABEL_KIND_INVALID:R'),(dict(labelKind='TEXT'),'OVERLAY_POLYGON_LABEL_KIND_WITHOUT_LABEL:R')):
            self.assertEqual(refused(RECTANGLE(**polygon)),code,polygon)

    def label_svg(self,plan,model,x,y,width=14,height=16,owner='overlay-polygon-R',ident='overlay-polygon-R-label'):
        root=ET.fromstring(model['svg'])
        group=ET.SubElement(root,SVG+'g',{'id':ident,'data-label-kind':'EQUATION_LABEL','data-owner':owner,'transform':f'translate({x} {y})'})
        ET.SubElement(ET.SubElement(group,SVG+'svg',{'width':str(width),'height':str(height)}),SVG+'path',{'d':'M0 0'})
        return ET.tostring(root,encoding='unicode')

    def test_the_label_must_stand_wholly_inside_its_polygon_and_be_owned_by_it(self):
        plan=fit_overview(RECTANGLE(label='b'))['graphPlan'];model=produce(plan)
        centre=screen(model,(1.5,1.0))
        inside=self.label_svg(plan,model,centre[0]-7,centre[1]-8)
        self.assertEqual(audit(plan,inside,model['transform'])['status'],'PASS',audit(plan,inside,model['transform'])['errors'])
        for name,svg,code in (('outside',self.label_svg(plan,model,screen(model,(4.5,3.0))[0],screen(model,(4.5,3.0))[1]),'OVERLAY_POLYGON_LABEL_OUTSIDE:R'),
                              ('straddling the edge',self.label_svg(plan,model,screen(model,(3,1))[0]-7,screen(model,(3,1))[1]-8),'OVERLAY_POLYGON_LABEL_OUTSIDE:R'),
                              ('wrong owner',self.label_svg(plan,model,centre[0]-7,centre[1]-8,owner='overlay-polygon-X'),'OVERLAY_POLYGON_LABEL_OWNER_MISMATCH:R')):
            self.assertIn(code,audit(plan,svg,model['transform'])['errors'],name)
        # A composed figure (it carries labels) without the declared polygon label is incomplete.
        root=ET.fromstring(model['svg']);ET.SubElement(root,SVG+'g',{'id':'formula','data-label-kind':'EQUATION_LABEL','data-owner':'formula'})
        self.assertIn('OVERLAY_POLYGON_LABEL_MISSING:R',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])

    def test_a_label_the_plan_did_not_declare_is_undeclared(self):
        plan=fit_overview(RECTANGLE())['graphPlan'];model=produce(plan);centre=screen(model,(1.5,1.0))
        result=audit(plan,self.label_svg(plan,model,centre[0]-7,centre[1]-8),model['transform'])
        self.assertIn('OVERLAY_UNDECLARED:overlay-polygon-R-label',result['errors'])

    def test_the_observer_reads_the_raw_label_itself(self):
        plan=fit_overview(RECTANGLE(label='b'))['graphPlan'];model=produce(plan)
        bad=copy.deepcopy(plan);bad['overlays']['polygons'][0]['label']='$b$'
        result=audit(bad,model['svg'],model['transform'])
        self.assertEqual(result['overlays']['status'],'UNSUPPORTED');self.assertIn('OVERLAY_POLYGON_LABEL_INVALID',result['overlays']['errors'])

if __name__=='__main__':unittest.main()
