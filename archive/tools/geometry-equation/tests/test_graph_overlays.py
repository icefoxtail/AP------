"""graphPlan.overlays (G1): exact framing, the model, and the independent overlays observer (including tampering)."""
import copy
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

QUADRATIC={'family':'polynomial','coefficients':['-1','0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],
           'viewport':[-3,3,-2,9],'requiredPoints':[{'id':'A','x':1,'y':0}],
           'overlays':{'lines':[{'id':'L','slope':'1','intercept':'1'},{'id':'V','x':'2'}],
                       'points':[{'id':'P','curveX':'-2'},{'id':'Q','intersect':['L','V']},{'id':'O','axis':'x','value':'0'},{'id':'R','x':'1','y':'2'}],
                       'segments':[{'id':'S','from':'P','to':'Q'}],
                       'guides':[{'id':'G','from':'P','axis':'BOTH'}],
                       'polygons':[{'id':'T','points':['O','P','Q']}]}}

def fitted(plan):return fit_overview(plan)['graphPlan']
def observed(plan):
    model=produce(plan);return audit(plan,model['svg'],model['transform']),model
def refused(plan):
    try:fit_overview(plan)
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_overlay_features_are_computed_exactly(self):
        features=fitted(copy.deepcopy(QUADRATIC))['overlaysFeatures']
        self.assertEqual(features['schemaVersion'],'GRAPH_OVERLAYS_FEATURES_v1')
        points={point['id']:(point['x'],point['y']) for point in features['points']}
        self.assertEqual(points['P'],(-2.0,3.0))
        self.assertEqual(points['Q'],(2.0,3.0))
        self.assertEqual(points['O'],(0.0,0.0))
        self.assertEqual(points['R'],(1.0,2.0))
        self.assertEqual([(line['id'],line['kind']) for line in features['lines']],[('L','LINE'),('V','VERTICAL')])
        self.assertEqual(features['lines'][0]['text'],'y=x+1')
        self.assertEqual(features['lines'][1]['text'],'x=2')
        self.assertEqual(features['segments'][0]['from'],'P')
        self.assertEqual(features['polygons'][0]['points'],['O','P','Q'])
        self.assertEqual(features['polygons'][0]['fill'],'LIGHT')

    def test_every_single_curve_family_evaluates_an_on_curve_point(self):
        cases=[
          (QUADRATIC,'P',(-2.0,3.0)),
          ({'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']},{'coefficients':['2','-1']}],
            'breakpoints':[{'x':'1','y':'1'}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-2,9],
            'requiredPoints':[{'id':'V','x':0,'y':0},{'id':'C','x':1,'y':1}],'overlays':{'points':[{'id':'P','curveX':'2'}]}},'P',(2.0,0.0)),
          ({'family':'piecewise-affine','sourceDomain':{'kind':'CLOSED_INTERVAL','range':['-4','4']},'domain':[-4,4],'viewport':[-5,5,-5,5],
            'piecewise':{'breakX':'0','owner':'RIGHT','left':['1','1'],'right':['1','-1']},'overlays':{'points':[{'id':'P','curveX':'2'}]}},'P',(2.0,1.0)),
          ({'family':'rational','numerator':['1','1'],'denominator':['-1','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-4,4],'viewport':[-4,4,-4,4],
            'overlays':{'points':[{'id':'P','curveX':'-2'}]}},'P',(-2.0,1/3)),
          ({'family':'sqrt-affine','radicand':['4','1'],'sourceDomain':{'kind':'NATURAL_SQRT_AFFINE'},'domain':[0,9],'viewport':[-1,10,-1,6],
            'overlays':{'points':[{'id':'P','curveX':'5'}]}},'P',(5.0,3.0)),
          ({'family':'absolute-value','coefficients':['-2','2','1','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-5,7],'viewport':[-6,8,-2,15],
            'overlays':{'points':[{'id':'P','curveX':'0'}]}},'P',(0.0,3.0)),
          ({'family':'exponential-affine','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],'viewport':[-3,3,-2,12],
            'overlays':{'points':[{'id':'P','curveX':'0'}]}},'P',(0.0,1.0)),
          ({'family':'logarithmic-affine','coefficients':['1','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'},'domain':[0.1,4],'viewport':[-1,5,-5,5],
            'overlays':{'points':[{'id':'P','curveX':'1'}]}},'P',(1.0,0.0)),
          ({'family':'trigonometric','function':'SIN','coefficients':['1','1','0'],'phasePi':'0','sourceDomain':{'kind':'ALL_REALS'},
            'domain':[-4,4],'viewport':[-5,5,-5,5],'overlays':{'points':[{'id':'P','curveX':'0'}]}},'P',(0.0,0.0)),
        ]
        for plan,ident,want in cases:
            features=fitted(copy.deepcopy(plan))['overlaysFeatures']
            point=next(item for item in features['points'] if item['id']==ident)
            self.assertAlmostEqual(point['x'],want[0],9,plan['family'])
            self.assertAlmostEqual(point['y'],want[1],8,plan['family'])

    def test_overlay_claims_fail_closed(self):
        cases=[]
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['points'][0]['curveX']='9';cases.append((plan,'OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:P'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['points'][0]['curveX']='1/0';cases.append((plan,'OVERLAY_VALUE_INVALID:P'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['segments'][0]['to']='Z';cases.append((plan,'OVERLAY_POINT_UNKNOWN:S'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['points'].append({'id':'P','x':'1','y':'2'});cases.append((plan,'OVERLAY_ID_DUPLICATE:point:P'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['lines'].append({'id':'W','x':'1'});plan['overlays']['points'].append({'id':'Z','intersect':['V','W']});cases.append((plan,'OVERLAY_LINE_PARALLEL:Z'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['points'].append({'id':'Z','x':'50','y':'2'});cases.append((plan,'OVERLAY_POINT_OUTSIDE_VIEWPORT:Z'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['polygons'][0]['points']=['O','P'];cases.append((plan,'OVERLAY_POLYGON_INVALID:T'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['lines'][0]['slope']='1.5';cases.append((plan,'OVERLAY_VALUE_INVALID:L'))
        plan=copy.deepcopy(QUADRATIC);plan['overlays']['points'].append({'id':'A','curveX':'1'});cases.append((plan,'OVERLAY_POINT_ID_CONFLICT:A'))
        plan={'family':'exp-log-pair','identityLine':False,'curves':[{'id':'e','family':'exponential-affine','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'}},
               {'id':'l','family':'logarithmic-affine','coefficients':['1','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'}}],
              'overlays':{'points':[{'id':'P','curveX':'0'}]}}
        cases.append((plan,'OVERLAY_CURVE_REQUIRED:P'))
        for plan,code in cases:
            self.assertEqual(refused(plan),code)

class Observation(unittest.TestCase):
    def test_model_and_overlay_audit_pass(self):
        plan=fitted(copy.deepcopy(QUADRATIC))
        result,model=observed(plan)
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['overlays']['status'],'PASS')
        self.assertEqual(result['overlays']['points'],4)
        self.assertEqual(result['overlays']['polygons'],1)

    def test_tampering_fails(self):
        plan=fitted(copy.deepcopy(QUADRATIC));_,model=observed(plan);svg=model['svg'];transform=model['transform']
        def tamper(replacement):
            return audit(plan,replacement,transform)
        shifted=svg.replace('id="P" data-role="point" data-overlay="true" cx="','id="P" data-role="point" data-overlay="true" cx="7')
        self.assertIn('OVERLAY_POINT_MISMATCH:P',tamper(shifted)['errors'])
        moved=svg.replace('id="overlay-line-L"','id="overlay-line-L" data-tampered="1"').replace('x2="','x2="1',1)
        self.assertIn('OVERLAY_LINE_MISMATCH:L',tamper(moved)['errors'])
        missing_segment=svg.replace('id="overlay-segment-S"','id="overlay-segment-X"')
        self.assertIn('OVERLAY_SEGMENT_MISSING:S',tamper(missing_segment)['errors'])
        missing_polygon=svg.replace('id="overlay-polygon-T"','id="overlay-polygon-X"')
        self.assertIn('OVERLAY_POLYGON_MISSING:T',tamper(missing_polygon)['errors'])
        missing_fill=svg.replace('id="overlay-polygon-T-fill"','id="overlay-polygon-X-fill"')
        self.assertIn('OVERLAY_FILL_MISSING:T',tamper(missing_fill)['errors'])
        # A composed figure has label groups; every overlay line label must exist and be owned by its line.
        composed=svg.replace('</svg>','<g id="formula" data-label-kind="EQUATION_LABEL" data-owner="formula"></g></svg>')
        errors=tamper(composed)['errors']
        self.assertIn('OVERLAY_LABEL_MISSING:L',errors)
        self.assertIn('OVERLAY_LABEL_MISSING:V',errors)
        empty=svg.replace('</svg>','<g id="overlay-line-L-equation" data-label-kind="EQUATION_LABEL" data-owner="overlay-line-L"></g></svg>')
        self.assertIn('OVERLAY_LABEL_EMPTY:L',tamper(empty)['errors'])

if __name__=='__main__':unittest.main()
