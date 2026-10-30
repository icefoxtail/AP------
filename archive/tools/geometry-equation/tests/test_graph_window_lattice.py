"""E13 (lattice points) and E22 (author display window, overlay point coordinates, segment lengths, equation labels that move):
exact framing, the independent observer on the model SVG, and the observer on real composed figures (fixtures) including tampering."""
import copy
import json
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit
from visual_engine.label_layout import Box,layout

FIXTURES=Path(__file__).resolve().parent/'e13e22-fixtures'

INVERSE={'family':'rational','numerator':['8','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[0.8,9],'viewport':[-0.5,9,-0.5,9],
         'axisTickValues':{'x':[1,2,3,4,5,6,7,8],'y':[1,2,3,4,5,6,7,8]},'displayWindow':[-1,9,-1,9],'formulaLabel':'y=8/x',
         'overlays':{'latticePoints':{'region':'BELOW_CURVE','xRange':[1,7],'yMin':1,'strict':True,'counts':True}}}

def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def observed(plan,svg=None,transform=None):
    model=produce(plan);return audit(plan,svg if svg is not None else model['svg'],transform or model['transform']),model

class DisplayWindowFraming(unittest.TestCase):
    def test_the_frame_is_the_window_at_one_scale(self):
        plan=fitted(INVERSE);v=plan['viewport'];height=plan['plotCanvas']['height']
        self.assertEqual(v[:2],[-1.0,9.0]);self.assertEqual(plan['plotCanvas']['width'],448)
        self.assertEqual(height,448.0)
        self.assertAlmostEqual((v[3]-v[2])*448/10,height,6);self.assertLessEqual(abs((v[2]+v[3])/2-4),1e-9)
        self.assertEqual(plan['axisRatio'],1.0);self.assertTrue(plan['equalUnits'])
        self.assertEqual(plan['rationalFeaturePolicy']['windowPolicy'],'AUTHOR_DISPLAY_WINDOW_EQUAL_UNITS_v1')

    def test_a_non_square_window_widens_y_by_less_than_a_pixel(self):
        plan=copy.deepcopy(INVERSE);plan['displayWindow']=[-2,9.3,-1.1,8.7];plan.pop('overlays')
        framed=fitted(plan);scale=448/(9.3+2)
        self.assertEqual(framed['viewport'][:2],[-2.0,9.3])
        self.assertLessEqual(framed['viewport'][2],-1.1+1e-9);self.assertGreaterEqual(framed['viewport'][3],8.7-1e-9)
        self.assertLess((-1.1-framed['viewport'][2])*scale,1.0);self.assertLess((framed['viewport'][3]-8.7)*scale,1.0)
        self.assertEqual(framed['plotCanvas']['height'],float(int(framed['plotCanvas']['height'])))

    def test_vertical_asymptote_is_drawn_only_inside_the_window(self):
        plan=copy.deepcopy(INVERSE);plan['numerator']=['4','0'];plan['denominator']=['-2','1'];plan['displayWindow']=[-3,6,-4,5];plan.pop('overlays');plan.pop('formulaLabel')
        features=fitted(plan)['rationalFeatures']['asymptotes']['vertical']
        self.assertEqual(features,{'x':'2','drawn':True})
        plan['displayWindow']=[-6,1,-4,5]
        features=fitted(plan)['rationalFeatures']['asymptotes']['vertical']
        self.assertEqual(features,{'x':'2','drawn':False,'reason':'OUTSIDE_WINDOW'})
        self.assertEqual(fitted(INVERSE)['rationalFeatures']['asymptotes']['vertical'],{'x':'0','drawn':False,'reason':'ON_Y_AXIS'})

    def test_window_claims_fail_closed(self):
        cases=[]
        def variant(**changes):
            plan=copy.deepcopy(INVERSE);plan.pop('overlays')
            for key,value in changes.items():plan[key]=value
            return plan
        cases.append((variant(displayWindow=[1,2,3]),'DISPLAY_WINDOW_INVALID'))
        cases.append((variant(displayWindow=[9,-1,-1,9]),'DISPLAY_WINDOW_INVALID'))
        cases.append((variant(displayWindow=[-1,9,-1,'9']),'DISPLAY_WINDOW_INVALID'))
        cases.append((variant(displayWindow=[1,9,-1,9]),'DISPLAY_WINDOW_MUST_CONTAIN_ORIGIN'))
        cases.append((variant(displayWindow=[-20,20,-1,2]),'DISPLAY_WINDOW_TOO_FLAT'))
        cases.append((variant(displayWindow=[-1,1,-9,9]),'DISPLAY_WINDOW_TOO_TALL'))
        cases.append((variant(axisSqueeze=True),'DISPLAY_WINDOW_FORBIDS_AXIS_SQUEEZE'))
        cases.append((variant(displayWindow=[-1,0.5,-1,60]),'DISPLAY_WINDOW_TOO_TALL'))
        cases.append((variant(requiredPoints=[{'id':'P','x':1,'y':8}],displayWindow=[-1,9,-1,7]),'REQUIRED_GRAPH_POINT_OUTSIDE_DISPLAY_WINDOW:P'))
        cases.append((variant(numerator=['1','1'],denominator=['0','1'],formulaLabel=None),'DISPLAY_WINDOW_REQUIRES_INVERSE_PROPORTION'))
        for plan,code in cases:
            if plan.get('formulaLabel',1) is None:plan.pop('formulaLabel')
            self.assertEqual(refused(plan),code,code)
        quadratic={'family':'polynomial','coefficients':['-1','0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-2,9],'displayWindow':[-3,3,-2,9]}
        self.assertEqual(refused(quadratic),'DISPLAY_WINDOW_UNSUPPORTED_FAMILY')
        # a window that shows no part of the curve: y=8/x stays outside the 2 x 2 window around the origin
        none=variant(displayWindow=[-1,1,-1,1]);none.pop('formulaLabel')
        self.assertEqual(refused(none),'DISPLAY_WINDOW_CURVE_NOT_VISIBLE')

class FormulaAt(unittest.TestCase):
    def variant(self,**changes):
        plan=copy.deepcopy(INVERSE);plan.pop('overlays')
        for key,value in changes.items():plan[key]=value
        return plan
    def test_formulaAt_claims_fail_closed(self):
        self.assertEqual(fitted(self.variant(formulaAt=[5,5]))['formulaAt'],[5,5])
        self.assertEqual(refused(self.variant(formulaAt=[5])),'FORMULA_AT_INVALID')
        self.assertEqual(refused(self.variant(formulaAt=[5,'5'])),'FORMULA_AT_INVALID')
        self.assertEqual(refused(self.variant(formulaAt=[20,5])),'FORMULA_AT_OUTSIDE_WINDOW')
        self.assertEqual(refused(self.variant(formulaAt=[9,5])),'FORMULA_AT_OUTSIDE_WINDOW')
        no_window=self.variant(formulaAt=[5,5]);no_window.pop('displayWindow')
        self.assertEqual(refused(no_window),'FORMULA_AT_REQUIRES_DISPLAY_WINDOW')
        linear=self.variant(formulaAt=[5,5],numerator=['1','1'],denominator=['-1','1']);linear.pop('displayWindow');linear.pop('formulaLabel')
        self.assertEqual(refused(linear),'FORMULA_AT_REQUIRES_DISPLAY_WINDOW')
        quadratic={'family':'polynomial','coefficients':['-1','0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-2,9],'formulaAt':[0,0]}
        self.assertEqual(refused(quadratic),'FORMULA_AT_UNSUPPORTED_FAMILY')
    def test_the_observer_checks_the_formula_label_near_its_spot(self):
        plan=fitted(self.variant(formulaAt=[5,5]));result,model=observed(plan);self.assertEqual(result['status'],'PASS',result['errors'])
        t=model['transform'];x=t['originX']+5*t['sx'];y=t['originY']-5*t['sy']
        def group(at):return '<g id="formula" data-label-kind="EQUATION_LABEL" data-owner="formula" transform="translate(%s %s)"><svg width="60" height="40"></svg></g>'%at
        near=model['svg'].replace('</svg>',group((x-30,y-20))+'</svg>')
        self.assertNotIn('FORMULA_LABEL_NOT_AT_ANCHOR',audit(plan,near,t)['errors'])
        far=model['svg'].replace('</svg>',group((x-30+250,y-20+200))+'</svg>')
        self.assertIn('FORMULA_LABEL_NOT_AT_ANCHOR',audit(plan,far,t)['errors'])
        # a plan whose window was dropped cannot carry a formulaAt
        stripped=copy.deepcopy(plan);stripped.pop('displayWindow')
        self.assertIn('FORMULA_AT_INVALID',audit(stripped,model['svg'],t)['errors'])

class DisplayWindowObservation(unittest.TestCase):
    def test_window_model_passes_and_tampering_fails(self):
        plan=fitted({**INVERSE,'overlays':{}});result,model=observed(plan)
        self.assertEqual(result['status'],'PASS',result['errors'])
        # the observer re-validates displayWindow itself: a frame that is not the declared window fails
        wrong=copy.deepcopy(plan);wrong['displayWindow']=[-1,8,-1,8]
        self.assertIn('DISPLAY_WINDOW_VIEWPORT_MISMATCH',audit(wrong,model['svg'],model['transform'])['errors'])
        # dropping displayWindow from the fitted plan turns the window figure back into an overview, which needs both branches and a centred pole
        stripped=copy.deepcopy(plan);stripped.pop('displayWindow')
        self.assertEqual(audit(stripped,model['svg'],model['transform'])['status'],'FAIL')
        # a missing branch: the left branch of y=42/x is not in the window [-9,3]x[-10,2]; drawing one there is unexpected
        bad=copy.deepcopy(plan);bad['displayWindow']=[-9,1,-10,2]
        self.assertIn('DISPLAY_WINDOW_VIEWPORT_MISMATCH',audit(bad,model['svg'],model['transform'])['errors'])

    def test_branches_follow_the_exact_curve(self):
        # y=42/x in [-9,3]x[-10,2]: only the third-quadrant branch is in the window
        plan=fitted({'family':'rational','numerator':['42','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-8,8],'viewport':[-8,8,-8,8],
                     'axisTickValues':{'x':[],'y':[]},'displayWindow':[-9,3,-10,2]})
        result,model=observed(plan);self.assertEqual(result['status'],'PASS',result['errors'])
        points=re.search(r'<polyline id="curve-0"[^>]* points="([^"]+)"',model['svg']).group(1)
        self.assertNotIn('curve-1',model['svg'])
        # a right branch added to the drawing is unexpected there
        extra=model['svg'].replace('</svg>','<polyline id="curve-1" data-role="curve" points="480,60 482,58" fill="none" stroke="black"/></svg>')
        self.assertTrue(any(code.startswith('RATIONAL_WINDOW_BRANCH_UNEXPECTED') or code in ('VISIBLE_COVERAGE_GAP','CURVE_INTERIOR_BOUND_FAIL','UNCLIPPED_CURVE') or code.startswith('RATIONAL_BRANCH_IN_WRONG_QUADRANT') for code in audit(plan,extra,model['transform'])['errors']),audit(plan,extra,model['transform'])['errors'])
        # the same curve in a window that shows both branches needs both
        both=fitted({'family':'rational','numerator':['42','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-8,8],'viewport':[-8,8,-8,8],
                     'axisTickValues':{'x':[],'y':[]},'displayWindow':[-9,9,-9,9]})
        result,model=observed(both);self.assertEqual(result['status'],'PASS',result['errors']);self.assertEqual(model['svg'].count('data-role="curve"'),2)
        self.assertEqual(points.count(',')>10,True)
        broken=re.sub(r'<polyline id="curve-1"[^>]*/>','',model['svg'])
        self.assertIn('RATIONAL_WINDOW_BRANCH_MISSING:right',audit(both,broken,model['transform'])['errors'])

class LatticeFraming(unittest.TestCase):
    def test_the_sixteen_points_of_the_example(self):
        row=fitted(INVERSE)['overlaysFeatures']['latticePoints']
        self.assertEqual(len(row['points']),16)
        self.assertEqual([(c['x'],c['count'],c['topY']) for c in row['columns']],[(1,7,7),(2,3,3),(3,2,2),(4,1,1),(5,1,1),(6,1,1),(7,1,1)])
        self.assertIn({'x':1,'y':7},row['points']);self.assertNotIn({'x':2,'y':4},row['points'])
        self.assertTrue(row['counts']);self.assertTrue(row['strict']);self.assertEqual(row['yMin'],1)

    def test_points_on_the_curve_are_included_when_not_strict(self):
        plan=copy.deepcopy(INVERSE);plan['overlays']['latticePoints']['strict']=False
        row=fitted(plan)['overlaysFeatures']['latticePoints']
        self.assertIn({'x':2,'y':4},row['points']);self.assertIn({'x':1,'y':8},row['points']);self.assertIn({'x':4,'y':2},row['points']);self.assertEqual(len(row['points']),16+3)

    def test_above_the_curve_up_to_a_bound(self):
        plan={'family':'rational','numerator':['2','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[0.5,6],'viewport':[-0.5,6,-0.5,6],
              'displayWindow':[-1,6,-1,6],'overlays':{'latticePoints':{'region':'ABOVE_CURVE','xRange':[1,3],'yMax':4}}}
        row=fitted(plan)['overlaysFeatures']['latticePoints']
        self.assertEqual({(p['x'],p['y']) for p in row['points']},{(1,3),(1,4),(2,2),(2,3),(2,4),(3,1),(3,2),(3,3),(3,4)})

    def test_the_automatic_frame_reaches_the_lattice(self):
        plan=copy.deepcopy(INVERSE);plan.pop('displayWindow')
        framed=fitted(plan);v=framed['viewport']
        self.assertLess(v[0],1);self.assertGreater(v[1],7);self.assertGreater(v[3],7)

    def test_lattice_claims_fail_closed(self):
        def variant(**changes):
            plan=copy.deepcopy(INVERSE);plan['overlays']['latticePoints'].update(changes);return plan
        cases=[(variant(region='INSIDE'),'OVERLAY_LATTICE_REGION_INVALID'),(variant(xRange=[1]),'OVERLAY_LATTICE_RANGE_INVALID'),(variant(xRange=[7,1]),'OVERLAY_LATTICE_RANGE_INVALID'),
               (variant(xRange=[1.5,3]),'OVERLAY_LATTICE_RANGE_INVALID'),(variant(xRange=[1,13]),'OVERLAY_LATTICE_TOO_MANY'),(variant(yMin='1'),'OVERLAY_LATTICE_BOUND_INVALID'),
               (variant(yMax=9),'OVERLAY_LATTICE_BOUND_INVALID'),(variant(strict='yes'),'OVERLAY_LATTICE_INVALID'),(variant(unknown=1),'OVERLAY_LATTICE_INVALID'),
               (variant(yMin=20),'OVERLAY_LATTICE_EMPTY'),(variant(curve='f'),'OVERLAY_CURVE_UNKNOWN:lattice')]
        wide=copy.deepcopy(INVERSE);wide['numerator']=['80','0'];wide['displayWindow']=[-1,9,-1,9];wide['overlays']['latticePoints']['xRange']=[1,3]
        cases.append((wide,'OVERLAY_LATTICE_TOO_MANY'))
        outside=copy.deepcopy(INVERSE);outside['displayWindow']=[-1,6,-1,9];cases.append((outside,'OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:lattice'))
        short=copy.deepcopy(INVERSE);short['displayWindow']=[-1,9,-1,5.5];cases.append((short,'OVERLAY_POINT_OUTSIDE_VIEWPORT:lattice'))
        coincide=copy.deepcopy(INVERSE);coincide['overlays']['points']=[{'id':'P','x':'1','y':'7'}];cases.append((coincide,'OVERLAY_LATTICE_POINT_COINCIDES:1,7'))
        for plan,code in cases:self.assertEqual(refused(plan),code,code)
        pole=copy.deepcopy(INVERSE);pole['overlays']['latticePoints']['xRange']=[0,3]
        self.assertEqual(refused(pole),'OVERLAY_LATTICE_COLUMN_UNDEFINED:0')

class LatticeObservation(unittest.TestCase):
    def setUp(self):
        self.plan=fitted(INVERSE);self.result,self.model=observed(self.plan)
    def test_model_passes(self):
        self.assertEqual(self.result['status'],'PASS',self.result['errors'])
    def run_with(self,svg):return audit(self.plan,svg,self.model['transform'])['errors']
    def test_a_missing_dot_fails(self):
        svg=re.sub(r'<circle id="overlay-lattice-x2y2"[^>]*/>','',self.model['svg'])
        self.assertIn('OVERLAY_LATTICE_POINT_MISSING:2,2',self.run_with(svg))
    def test_an_extra_dot_fails(self):
        extra=self.model['svg'].replace('</svg>','<circle id="overlay-lattice-x2y4" data-role="point" cx="100" cy="100" r="2.4" fill="#111" stroke="black"/></svg>')
        self.assertIn('OVERLAY_LATTICE_POINT_UNEXPECTED:overlay-lattice-x2y4',self.run_with(extra))
    def test_a_moved_dot_fails(self):
        svg=re.sub(r'(<circle id="overlay-lattice-x3y1"[^>]*? cx=")([^"]+)"',lambda m:m.group(1)+str(float(m.group(2))+9)+'"',self.model['svg'])
        errors=self.run_with(svg);self.assertIn('OVERLAY_LATTICE_POINT_MISSING:3,1',errors)
    def test_a_big_dot_fails(self):
        svg=self.model['svg'].replace('id="overlay-lattice-x1y1" data-role="point" data-overlay="true"','id="overlay-lattice-x1y1" data-role="point" data-overlay="true" data-big="1"').replace('r="2.4"','r="4.5"',1)
        self.assertIn('OVERLAY_LATTICE_DOT_SIZE:overlay-lattice-x1y1',self.run_with(svg))
    def test_dots_without_a_declared_lattice_fail(self):
        plan=copy.deepcopy(self.plan);plan['overlays']={}
        errors=audit(plan,self.model['svg'],self.model['transform'])['errors']
        self.assertTrue(any(code.startswith('OVERLAY_UNDECLARED:overlay-lattice-') for code in errors),errors)

class CoordinatesAndLengths(unittest.TestCase):
    def plan(self):
        return {'family':'rational','numerator':['42','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-8,8],'viewport':[-8,8,-8,8],'axisTickValues':{'x':[],'y':[]},
                'displayWindow':[-9,3,-10,2],'formulaLabel':'y=42/x',
                'overlays':{'points':[{'id':'A','x':'-6','y':'-3','coordinates':True,'labelDirection':'NW'},{'id':'B','curveX':'-6','coordinates':True},{'id':'C','x':'-2','y':'-7'},{'id':'D','x':'-2','y':'-3'},{'id':'O','x':'0','y':'0'}],
                            'segments':[{'id':'sAB','from':'A','to':'B','length':True,'labelDirection':'W'},{'id':'sBC','from':'B','to':'C'},{'id':'sOA','from':'O','to':'A','length':True}]}}
    def test_features(self):
        features=fitted(self.plan())['overlaysFeatures']
        points={p['id']:p for p in features['points']}
        self.assertEqual(points['A']['coordinates'],['-6','-3']);self.assertEqual(points['B']['coordinates'],['-6','-7']);self.assertNotIn('coordinates',points['C'])
        self.assertEqual(points['A']['labelDirection'],'NW');self.assertNotIn('labelDirection',points['B'])
        segments={s['id']:s for s in features['segments']}
        self.assertEqual(segments['sAB']['length'],{'text':'4','value':4.0})
        self.assertEqual(segments['sOA']['length']['text'],'3*sqrt(5)');self.assertAlmostEqual(segments['sOA']['length']['value'],3*5**.5,9)
        self.assertNotIn('length',segments['sBC'])
    def test_claims_fail_closed(self):
        def variant(edit):
            plan=self.plan();edit(plan['overlays']);return plan
        cases=[
          (variant(lambda o:o['points'][2].update(coordinates='yes')),'OVERLAY_COORDINATES_INVALID:C'),
          (variant(lambda o:o['points'].append({'id':'E','x':'sqrt(2)','y':'-1','coordinates':True})),'OVERLAY_COORDINATES_REQUIRE_RATIONALS:E'),   # E31: fractions are written now; an irrational coordinate is not
          (variant(lambda o:o['points'][2].update(labelDirection='N')),'OVERLAY_LABEL_DIRECTION_INVALID:C'),
          (variant(lambda o:o['points'][0].update(labelDirection='UP')),'OVERLAY_LABEL_DIRECTION_INVALID:A'),
          (variant(lambda o:o['segments'][1].update(labelDirection='N')),'OVERLAY_LABEL_DIRECTION_INVALID:sBC'),
          (variant(lambda o:o['segments'][1].update(length='yes')),'OVERLAY_SEGMENT_LENGTH_INVALID:sBC'),
          (variant(lambda o:o['points'].append({'id':'E','x':'-3/2','y':'-2'}) or o['segments'].append({'id':'sEO','from':'E','to':'O','length':True})),'OVERLAY_SEGMENT_LENGTH_UNSUPPORTED:sEO'),
        ]
        for plan,code in cases:self.assertEqual(refused(plan),code,code)
    def test_model_observation(self):
        plan=fitted(self.plan());result,model=observed(plan);self.assertEqual(result['status'],'PASS',result['errors'])

class TrigonometricRatePi(unittest.TestCase):
    """The general trigonometric grammar (ratePi, coefficients [A,C]) evaluates overlay points with curveX; it used to fail unpacking [A,k,C]."""
    PLAN={'family':'trigonometric','function':'COS','ratePi':'1/10','coefficients':['-27/2','33/2'],'phasePi':'0','sourceDomain':{'kind':'INTERVAL','range':['0','60'],'states':['CLOSED','CLOSED']},
          'domain':[0,60],'viewport':[-6,66,-4,34],'axisTickValues':{'x':['10','20','30','40','50','60'],'y':['20','30']},
          'overlays':{'points':[{'id':'M1','curveX':'10'},{'id':'M2','curveX':'30'},{'id':'M3','curveX':'5'}],'guides':[{'id':'g1','from':'M1','axis':'BOTH'}]}}
    def test_curveX_follows_the_rate_and_the_phase(self):
        points={p['id']:(p['x'],p['y']) for p in fitted(self.PLAN)['overlaysFeatures']['points']}
        self.assertEqual(points['M1'],(10.0,30.0));self.assertEqual(points['M2'],(30.0,30.0));self.assertAlmostEqual(points['M3'][1],16.5,9)
        # a phase in plain radians (here 0) instead of phasePi goes with the same ratePi form
        shifted=copy.deepcopy(self.PLAN);shifted.pop('phasePi');shifted['phase']='0';shifted['overlays']={'points':[{'id':'M1','curveX':'10'}]}
        self.assertEqual(fitted(shifted)['overlaysFeatures']['points'][0]['y'],30.0)
    def test_the_observer_recomputes_the_point(self):
        plan=fitted(self.PLAN);result,model=observed(plan);self.assertEqual(result['status'],'PASS',result['errors'])
        moved=re.sub(r'(<circle id="M2"[^>]*? cy=")([^"]+)"',lambda m:m.group(1)+str(float(m.group(2))+9)+'"',model['svg'])
        self.assertIn('OVERLAY_POINT_MISMATCH:M2',audit(plan,moved,model['transform'])['errors'])
    def test_a_bad_coefficient_list_is_refused_with_a_code(self):
        plan=copy.deepcopy(self.PLAN);plan['coefficients']=['-27/2']
        self.assertIsNotNone(refused(plan))

class UnnamedPoints(unittest.TestCase):
    PLAN={'family':'polynomial','coefficients':['-1','0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-2,9],
          'overlays':{'points':[{'id':'P','curveX':'2','unnamed':True},{'id':'Q','x':'1','y':'2'}]}}
    def test_the_feature_row_carries_the_flag_only_when_asked(self):
        rows={p['id']:p for p in fitted(self.PLAN)['overlaysFeatures']['points']}
        self.assertTrue(rows['P']['unnamed']);self.assertNotIn('unnamed',rows['Q'])
        off=copy.deepcopy(self.PLAN);off['overlays']['points'][0]['unnamed']=False
        self.assertNotIn('unnamed',{p['id']:p for p in fitted(off)['overlaysFeatures']['points']}['P'])
    def test_claims_fail_closed(self):
        bad=copy.deepcopy(self.PLAN);bad['overlays']['points'][0]['unnamed']='yes'
        self.assertEqual(refused(bad),'OVERLAY_POINT_UNNAMED_INVALID:P')
    def test_a_name_label_on_an_unnamed_point_fails(self):
        plan=fitted(self.PLAN);result,model=observed(plan);self.assertEqual(result['status'],'PASS',result['errors'])
        named=model['svg'].replace('</svg>','<g id="P-name" data-label-kind="POINT_NAME" data-owner="P" transform="translate(10 10)"><svg width="9" height="14"></svg></g></svg>')
        self.assertIn('OVERLAY_POINT_NAME_UNEXPECTED:P',audit(plan,named,model['transform'])['errors'])
        fine=model['svg'].replace('</svg>','<g id="Q-name" data-label-kind="POINT_NAME" data-owner="Q" transform="translate(10 10)"><svg width="9" height="14"></svg></g></svg>')
        self.assertNotIn('OVERLAY_POINT_NAME_UNEXPECTED:P',audit(plan,fine,model['transform'])['errors'])

import xml.etree.ElementTree as ET
ET.register_namespace('','http://www.w3.org/2000/svg')

class Fixture:
    """A real composed figure: the final SVG, its fitted graph plan and the observed frame (tests/e13e22-fixtures)."""
    def __init__(self,name):
        data=json.loads((FIXTURES/(name+'.json')).read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,svg=None):return audit(self.plan,svg if svg is not None else self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)
    @staticmethod
    def shift(root,ident,dx,dy):
        group=Fixture.node(root,ident);m=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',group.get('transform'))
        group.set('transform','translate(%s %s)'%(float(m.group(1))+dx,float(m.group(2))+dy))
    @staticmethod
    def remove(root,ident):
        for parent in root.iter():
            for child in list(parent):
                if child.get('id')==ident:parent.remove(child);return
        raise KeyError(ident)
    @staticmethod
    def change_glyph(root,ident,old,new):
        for path in Fixture.node(root,ident).iter():
            if path.get('data-c')==old:path.set('data-c',new);return
        raise KeyError(old)

class ComposedFigures(unittest.TestCase):
    """The observer on the three real figures (and the old fallback figure with a leader): each is clean, and each tampering is named."""
    def test_every_fixture_is_clean(self):
        for name in ('q14-lattice','q22-square','q20-window','q20-leader'):
            self.assertEqual(Fixture(name).errors(),[],name)

    def test_coordinate_and_length_labels_of_the_square(self):
        fx=Fixture('q22-square')
        self.assertIn('OVERLAY_COORDINATES_LABEL_TEXT_MISMATCH:A',[e.split(':got=')[0] for e in fx.errors(fx.edit(lambda r:fx.change_glyph(r,'A-coordinates','36','37')))])
        self.assertIn('OVERLAY_COORDINATES_LABEL_MISSING:B',fx.errors(fx.edit(lambda r:fx.remove(r,'B-coordinates'))))
        self.assertIn('OVERLAY_COORDINATES_LABEL_OWNER_MISMATCH:C',fx.errors(fx.edit(lambda r:fx.node(r,'C-coordinates').set('data-owner','D'))))
        self.assertIn('OVERLAY_COORDINATES_LABEL_AMBIGUOUS_OWNER:D',fx.errors(fx.edit(lambda r:fx.shift(r,'D-coordinates',-150,0))))
        self.assertIn('OVERLAY_SEGMENT_LENGTH_LABEL_MISSING:sAB',fx.errors(fx.edit(lambda r:fx.remove(r,'overlay-segment-sAB-length'))))
        self.assertIn('OVERLAY_SEGMENT_LENGTH_LABEL_OWNER_MISMATCH:sDA',fx.errors(fx.edit(lambda r:fx.node(r,'overlay-segment-sDA-length').set('data-owner','overlay-segment-sAB'))))
        self.assertIn('OVERLAY_SEGMENT_LENGTH_LABEL_NOT_NEAR_OWNER:overlay-segment-sAB-length',fx.errors(fx.edit(lambda r:fx.shift(r,'overlay-segment-sAB-length',160,60))))
        wrong=fx.errors(fx.edit(lambda r:fx.change_glyph(r,'overlay-segment-sAB-length','34','35')))
        self.assertTrue(any(e.startswith('OVERLAY_SEGMENT_LENGTH_LABEL_TEXT_MISMATCH:sAB') for e in wrong),wrong)
        self.assertIn('FORMULA_LABEL_NOT_AT_ANCHOR',fx.errors(fx.edit(lambda r:fx.shift(r,'formula',250,-150))))

    def test_lattice_counts_and_dots(self):
        fx=Fixture('q14-lattice')
        self.assertTrue(any(e.startswith('OVERLAY_LATTICE_COUNT_LABEL_TEXT_MISMATCH:1') for e in fx.errors(fx.edit(lambda r:fx.change_glyph(r,'overlay-lattice-count-x1','37','38')))))
        self.assertIn('OVERLAY_LATTICE_COUNT_LABEL_MISSING:3',fx.errors(fx.edit(lambda r:fx.remove(r,'overlay-lattice-count-x3'))))
        self.assertIn('OVERLAY_LATTICE_COUNT_LABEL_NOT_IN_COLUMN:3',fx.errors(fx.edit(lambda r:fx.shift(r,'overlay-lattice-count-x3',135,0))))
        self.assertIn('OVERLAY_LATTICE_POINT_MISSING:2,2',fx.errors(fx.edit(lambda r:fx.remove(r,'overlay-lattice-x2y2'))))
        self.assertIn('OVERLAY_LATTICE_DOT_SIZE:overlay-lattice-x1y1',fx.errors(fx.edit(lambda r:fx.node(r,'overlay-lattice-x1y1').set('r','5'))))
        moved=fx.errors(fx.edit(lambda r:fx.node(r,'overlay-lattice-x5y1').set('cx',str(float(fx.node(r,'overlay-lattice-x5y1').get('cx'))+20))))
        self.assertIn('OVERLAY_LATTICE_POINT_MISSING:5,1',moved)

    def test_line_equation_labels_belong_to_their_lines(self):
        fx=Fixture('q20-window')
        far=fx.errors(fx.edit(lambda r:fx.shift(r,'overlay-line-g-equation',330,-200)))
        self.assertTrue(any(e.startswith('OVERLAY_LINE_LABEL_') for e in far),far)
        owner=fx.errors(fx.edit(lambda r:fx.node(r,'overlay-line-d-equation').set('data-owner','overlay-line-g')))
        self.assertIn('OVERLAY_LABEL_OWNER_MISMATCH:d',owner)
        self.assertIn('OVERLAY_LABEL_MISSING:v',fx.errors(fx.edit(lambda r:fx.remove(r,'overlay-line-v-equation'))))

    def test_a_leader_must_start_on_its_line_and_end_on_its_label(self):
        fx=Fixture('q20-leader');leader='overlay-line-g-equation-owner-leader'
        self.assertIn(leader,fx.svg)
        start=fx.errors(fx.edit(lambda r:(fx.node(r,leader).set('x1',str(float(fx.node(r,leader).get('x1'))+40)),fx.node(r,leader).set('y1',str(float(fx.node(r,leader).get('y1'))-40)))))
        self.assertIn('OVERLAY_LINE_LEADER_NOT_ON_OWNER:overlay-line-g-equation',start)
        end=fx.errors(fx.edit(lambda r:fx.node(r,leader).set('x2',str(float(fx.node(r,leader).get('x2'))+40))))
        self.assertIn('OVERLAY_LINE_LEADER_NOT_ON_LABEL:overlay-line-g-equation',end)
        foreign=fx.errors(fx.edit(lambda r:fx.node(r,leader).set('data-owner','overlay-line-d')))
        self.assertIn('OVERLAY_LINE_LEADER_NOT_ON_OWNER:overlay-line-g-equation',foreign)
        # a leader that no line label declares is an undeclared overlay element
        self.assertTrue(any(e.startswith('OVERLAY_UNDECLARED:') for e in fx.errors(fx.edit(lambda r:fx.node(r,leader).set('data-owner-label','overlay-line-zz-equation')))))

class AxisTitles(unittest.TestCase):
    """graphPlan.axisTitles: a Korean title with its unit at the end of an axis, on every single-curve family, read back by the observer."""
    PLANS={
      'polynomial':{'family':'polynomial','coefficients':['-1','0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-2,9],'requiredPoints':[{'id':'A','x':1,'y':0}]},
      'rational':{'family':'rational','numerator':['6','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-10,10],'viewport':[-10,10,-10,10],'axisTickValues':{'x':[],'y':[]}},
      'piecewise-polynomial':{'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']},{'coefficients':['2','-1']}],'breakpoints':[{'x':'1','y':'1'}],'sourceDomain':{'kind':'ALL_REALS'},
                              'domain':[-3,3],'viewport':[-3,3,-2,9],'requiredPoints':[{'id':'V','x':0,'y':0},{'id':'C','x':1,'y':1}]},
      'trigonometric':{'family':'trigonometric','function':'COS','ratePi':'1/10','coefficients':['-27/2','33/2'],'phasePi':'0','sourceDomain':{'kind':'INTERVAL','range':['0','60'],'states':['CLOSED','CLOSED']},
                       'domain':[0,60],'viewport':[0,60,0,33],'axisTickValues':{'x':['10','20','30','40','50'],'y':[]}},
    }
    TITLES={'x':'시간(분)','y':'거리(km)'}
    def titled(self,family):
        plan=copy.deepcopy(self.PLANS[family]);plan['axisTitles']=copy.deepcopy(self.TITLES);return plan
    def test_every_family_keeps_the_titles_through_framing(self):
        for family in self.PLANS:
            self.assertEqual(fitted(self.titled(family))['axisTitles'],self.TITLES,family)
    def test_the_model_audit_passes_and_a_composed_figure_is_read_back(self):
        plan=fitted(self.titled('polynomial'));result,model=observed(plan);self.assertEqual(result['status'],'PASS',result['errors'])
        t=model['transform'];xmax,ymax=plan['viewport'][1],plan['viewport'][3]
        end_x=(t['originX']+xmax*t['sx'],t['originY']);end_y=(t['originX'],t['originY']-ymax*t['sy'])
        def group(axis,text,at,math=False):
            path='<path data-c="31" d="M0 0"/>' if math else '<path d="M0 0"/>'
            return '<g id="axis-%s" data-label-kind="GRAPH_ANNOTATION" data-owner="axis-%s"%s transform="translate(%s %s)"><svg width="40" height="14">%s</svg></g>'%(axis,axis,' data-text="%s"'%text if text else '',at[0],at[1],path)
        def with_labels(*groups):return model['svg'].replace('</svg>',''.join(groups)+'</svg>')
        good=with_labels(group('x','시간(분)',(end_x[0]+6,end_x[1]-20)),group('y','거리(km)',(end_y[0]+6,end_y[1]-18)))
        self.assertEqual(audit(plan,good,t)['errors'],[])
        wrong=with_labels(group('x','시간(초)',(end_x[0]+6,end_x[1]-20)),group('y','거리(km)',(end_y[0]+6,end_y[1]-18)))
        self.assertIn('AXIS_TITLE_TEXT_MISMATCH:x',audit(plan,wrong,t)['errors'])
        missing=with_labels(group('x','시간(분)',(end_x[0]+6,end_x[1]-20)))
        self.assertIn('AXIS_TITLE_MISSING:y',audit(plan,missing,t)['errors'])
        far=with_labels(group('x','시간(분)',(end_x[0]-300,end_x[1]-250)),group('y','거리(km)',(end_y[0]+6,end_y[1]-18)))
        self.assertIn('AXIS_TITLE_NOT_AT_AXIS_END:x',audit(plan,far,t)['errors'])
        math=with_labels(group('x',None,(end_x[0]+6,end_x[1]-20),math=True),group('y','거리(km)',(end_y[0]+6,end_y[1]-18)))
        self.assertIn('AXIS_TITLE_TEXT_MISMATCH:x',audit(plan,math,t)['errors'])
        swapped=with_labels(group('x','거리(km)',(end_x[0]+6,end_x[1]-20)),group('y','시간(분)',(end_y[0]+6,end_y[1]-18)))
        self.assertIn('AXIS_TITLE_TEXT_MISMATCH:x',audit(plan,swapped,t)['errors'])
    def test_a_malformed_title_is_unsupported_for_the_observer(self):
        plan=fitted(self.titled('polynomial'));plan['axisTitles']={'x':'$x$'};model=produce(plan)
        result=audit(plan,model['svg'],model['transform']);self.assertEqual(result['status'],'UNSUPPORTED');self.assertEqual(result['errors'],['AXIS_TITLE_INVALID:x'])
        plan['axisTitles']={'z':'가'};self.assertEqual(audit(plan,model['svg'],model['transform'])['errors'],['AXIS_TITLES_INVALID'])

class LayoutFallback(unittest.TestCase):
    """A label with lineFallback that found no room at its first anchor is tried at its other anchors on its own line; a label that fits is untouched."""
    def line(self,ident,a,b):return {'id':ident,'kind':'line','geometry':[a,b]}
    def label(self,**extra):
        return {'id':'overlay-line-g-equation','kind':'EQUATION_LABEL','target':'overlay-line-g','text':'y=ax','layoutText':'y=ax','priority':0,'at':[100.0,100.0],'font':13.25,'allowSuppress':False,**extra}
    def test_without_fallback_the_label_is_unresolved_when_blocked(self):
        obstacles=[self.line('overlay-line-g',[0,200],[200,0]),{'id':'block','kind':'rectangle','geometry':Box(40,40,120,120)}]
        result=layout([self.label()],obstacles,Box(0,0,300,300))
        self.assertEqual(result['unresolved'],['overlay-line-g-equation'])
    def test_with_fallback_the_label_moves_to_another_anchor_on_its_line(self):
        obstacles=[self.line('overlay-line-g',[0,300],[300,0]),{'id':'block','kind':'rectangle','geometry':Box(0,100,200,200)}]
        label=self.label(lineFallback=True,alternateAt=[[250.0,50.0],[30.0,270.0]],at=[100.0,200.0])
        result=layout([label],obstacles,Box(0,0,300,300))
        self.assertEqual(result['unresolved'],[]);placed=result['labels'][0]
        self.assertEqual(placed['at'],[250.0,50.0]);self.assertTrue(placed['placement'].startswith(('AUTO_','OWNER_LEADER_')))
    def test_a_label_that_fits_keeps_its_first_anchor(self):
        obstacles=[self.line('overlay-line-g',[0,300],[300,0])]
        plain=layout([self.label(at=[100.0,200.0])],obstacles,Box(0,0,300,300))
        with_alternates=layout([self.label(at=[100.0,200.0],lineFallback=True,alternateAt=[[250.0,50.0]])],obstacles,Box(0,0,300,300))
        self.assertEqual(plain['labels'][0]['box'],with_alternates['labels'][0]['box']);self.assertEqual(plain['labels'][0]['placement'],with_alternates['labels'][0]['placement'])
        self.assertEqual(with_alternates['labels'][0]['at'],[100.0,200.0])
    def test_a_fallback_label_still_needs_its_own_line_to_be_the_nearest(self):
        # two lines cross at the only free anchor: the alternate is refused unless a leader ties the label to its own line
        obstacles=[self.line('overlay-line-g',[0,300],[300,0]),self.line('overlay-line-h',[0,0],[300,300]),{'id':'block','kind':'rectangle','geometry':Box(0,100,200,200)}]
        label=self.label(lineFallback=True,alternateAt=[[150.0,150.0]],at=[100.0,200.0])
        result=layout([label],obstacles,Box(0,0,300,300))
        self.assertEqual(result['unresolved'],['overlay-line-g-equation'])

class CollinearOwners(unittest.TestCase):
    """A polygon edge drawn over the line a label names is that line, not a competitor: the label stands beside it (collinearOwners); the other edges still compete."""
    OWNER={'id':'overlay-line-v','kind':'line','geometry':[[100,0],[100,300]]}
    POLYGON={'id':'overlay-polygon-T','kind':'line','geometry':[[100,50],[100,250],[40,150],[100,50]]}
    def label(self,**extra):
        return {'id':'overlay-line-v-equation','kind':'EQUATION_LABEL','target':'overlay-line-v','text':'x=4','layoutText':'x=4','priority':0,'at':[100.0,150.0],'font':13.25,
                'allowSuppress':False,'lineOwned':True,'alternateAt':[],'gaps':[8,6,10,20,32,48],**extra}
    def test_helpers_split_the_polygon_and_find_the_incident_edge(self):
        from visual_engine.label_layout import competing_lines,owner_line_incident_ids,segment_on_line
        pieces=[piece['geometry'] for piece in competing_lines(self.OWNER,[self.OWNER,self.POLYGON])]
        self.assertEqual(pieces,[[[100,250],[40,150]],[[40,150],[100,50]]])
        self.assertTrue(segment_on_line(self.OWNER,[100,50],[100,250]));self.assertFalse(segment_on_line(self.OWNER,[100,250],[40,150]))
        self.assertEqual(sorted(owner_line_incident_ids(self.OWNER,(100,150),[self.OWNER,self.POLYGON])),['overlay-line-v','overlay-polygon-T'])
        self.assertEqual(sorted(owner_line_incident_ids(self.OWNER,(100,280),[self.OWNER,self.POLYGON])),['overlay-line-v'])
    def test_without_the_flag_the_overlapping_edge_blocks_a_near_label(self):
        result=layout([self.label()],[self.OWNER,self.POLYGON],Box(0,0,300,300))
        # The overlapping edge still blocks the label at its own anchor (100,150). Since E31 the wide search then samples the rest of the drawn line (it used to
        # leave the label unresolved), so the label may stand only where the edge does not cover the line: above y=50 or below y=250.
        self.assertEqual(result['unresolved'],[]);placed=result['labels'][0]
        self.assertNotEqual(placed['at'],[100.0,150.0]);self.assertTrue(placed['at'][1]<50 or placed['at'][1]>250,placed['at'])
    def test_with_the_flag_the_label_stands_beside_its_line(self):
        result=layout([self.label(collinearOwners=True)],[self.OWNER,self.POLYGON],Box(0,0,300,300))
        self.assertEqual(result['unresolved'],[]);self.assertTrue(result['labels'][0]['placement'].startswith(('AUTO_','COORDINATE_RELOCATION_')))
    def test_the_observer_does_not_count_a_collinear_segment_as_a_competitor(self):
        from graph_observer import _ov_collinear
        self.assertTrue(_ov_collinear(((100,0),(100,300)),((100,50),(100,250))));self.assertFalse(_ov_collinear(((100,0),(100,300)),((100,250),(40,150))))

if __name__=='__main__':unittest.main()
