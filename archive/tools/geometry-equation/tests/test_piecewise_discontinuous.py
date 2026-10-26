"""piecewise-discontinuous-spike-v1: exact framing claims (fail closed), the model and the independent observer."""
import copy
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

# y=x+2 on [-3,1) (open at 1, limit 3) and y=x^2 on [1,3] with the value f(1)=1 declared as an isolated point: a jump at x=1.
JUMP={'family':'piecewise-discontinuous','pieces':[{'coefficients':['2','1'],'domain':[-3,'1'],'end':'OPEN'},{'coefficients':['0','0','1'],'domain':['1',3],'start':'OPEN'}],
      'jumpValues':[{'x':'1','y':'1'}],
      'referenceLines':[{'id':'k','y':'1','intersectionX':['-1','1']},{'id':'m','y':'3','intersectionX':['sqrt(3)']}],
      'requiredPoints':[],'axisTickValues':{'x':[],'y':[]}}
# A staircase: values 1,2,1 on [0,1), [1,2), [2,3] (left-closed, right-open, last closed).
STEP={'family':'piecewise-discontinuous','step':{'values':['1','2','1'],'xFrom':0,'xTo':3},'requiredPoints':[],'axisTickValues':{'x':[],'y':[]}}
# A single piece with a declared isolated point away from it.
ISOLATED={'family':'piecewise-discontinuous','pieces':[{'coefficients':['0','1'],'domain':[0,2]}],'jumpValues':[{'x':'3','y':'0'}],'requiredPoints':[],'axisTickValues':{'x':[],'y':[]}}
# y=(x+1)^2-2 on [-3,1) with its in-piece vertex (-1,-2), y=x on [1,3].
EXTREMA={'family':'piecewise-discontinuous','pieces':[{'coefficients':['-1','2','1'],'domain':['-3','1'],'end':'OPEN'},{'coefficients':['0','1'],'domain':['1','3'],'start':'CLOSED'}],
         'referenceLines':[{'id':'k','y':'-1','intersectionX':['-2','0']}],'requiredPoints':[{'id':'V','x':-1,'y':-2}],'axisTickValues':{'x':[],'y':[]}}

def refused(plan):
    try:fit_overview(plan)
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_jump_inventory(self):
        g=fit_overview(JUMP)['graphPlan'];f=g['piecewiseDiscontinuousFeatures']
        self.assertEqual([(row['x'],row['y'],row['state']) for row in f['markers']],[('-3','-1','CLOSED'),('1','1','CLOSED'),('1','3','OPEN'),('3','9','CLOSED')])
        self.assertEqual([row['drawInterval'] for row in f['pieces']],[[-3.0,1.0],[1.0,3.0]])
        self.assertEqual([len(row['points']) for row in f['intersections']],[2,1])
        self.assertEqual([row['points'][1].get('marker') for row in f['intersections'] if len(row['points'])>1],[True])
        self.assertTrue(g['equalUnits']);self.assertEqual(g['axisRatio'],1.0);self.assertEqual(g['plotCanvas']['width'],448)
    def test_step_expands_into_half_open_pieces(self):
        g=fit_overview(STEP)['graphPlan'];f=g['piecewiseDiscontinuousFeatures']
        self.assertEqual([(row['coefficients'],row['interval'],row['start'],row['end']) for row in f['pieces']],
                         [(['1','0','0'],['0','1'],'CLOSED','OPEN'),(['2','0','0'],['1','2'],'CLOSED','OPEN'),(['1','0','0'],['2','3'],'CLOSED','CLOSED')])
        self.assertEqual([(row['x'],row['y'],row['state']) for row in f['markers']],[('0','1','CLOSED'),('1','1','OPEN'),('1','2','CLOSED'),('2','1','CLOSED'),('2','2','OPEN'),('3','1','CLOSED')])
    def test_extrema_must_be_marked(self):
        g=fit_overview(EXTREMA)['graphPlan']
        self.assertEqual(g['piecewiseDiscontinuousFeatures']['extrema'],[{'x':'-1','y':'-2','kind':'MIN'}])
        self.assertEqual([row['points'][0].get('keyPoint') for row in g['piecewiseDiscontinuousFeatures']['intersections']],[None])
    def test_claims_fail_closed(self):
        cases=[]
        p=copy.deepcopy(JUMP);p['pieces'][0]['end']='CLOSED';cases.append((p,'PIECEWISE_VALUE_CONFLICT:1'))
        p=copy.deepcopy(JUMP);p['pieces'][0]['end']='CLOSED';p['pieces'][1]['start']='CLOSED';del p['jumpValues'];cases.append((p,'PIECEWISE_DOMAIN_OVERLAP:1'))
        p=copy.deepcopy(JUMP);del p['jumpValues'];cases.append((p,'PIECEWISE_DISCONTINUITY_UNDECLARED:1'))
        p=copy.deepcopy(JUMP);p['pieces'][1]['domain']=['0','3'];cases.append((p,'PIECEWISE_DOMAIN_OVERLAP:0'))
        p=copy.deepcopy(JUMP);p['pieces'][0]['start']='HALF';cases.append((p,'PIECEWISE_ENDPOINT_STATE_INVALID:1'))
        p=copy.deepcopy(JUMP);p['pieces']=[{'coefficients':['0'],'domain':[index,index+1]} for index in range(7)];cases.append((p,'PIECEWISE_TOO_MANY_PIECES'))
        p=copy.deepcopy(JUMP);p['referenceLines'][0]['intersectionX']=['-1'];cases.append((p,'PIECEWISE_INTERSECTION_MISMATCH:k:engine finds 2'))
        p=copy.deepcopy(JUMP);p['referenceLines'][0]['intersectionX']=['-2','1'];cases.append((p,'PIECEWISE_INTERSECTION_MISMATCH:k:engine finds 2'))
        p=copy.deepcopy(STEP);p['step']['xFrom']=4;cases.append((p,'STEP_INTERVAL_INVALID'))
        p=copy.deepcopy(STEP);p['pieces']=[];cases.append((p,'PIECEWISE_DISCONTINUOUS_SOURCE_INVALID'))
        p=copy.deepcopy(JUMP);p['breakpoints']=[];cases.append((p,'PIECEWISE_DISCONTINUOUS_FIELD_UNKNOWN:breakpoints'))
        p=copy.deepcopy(EXTREMA);p['requiredPoints']=[];cases.append((p,'PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS:-1'))
        p=copy.deepcopy(STEP);p['referenceLines']=[{'id':'k','y':'1','intersectionX':[]}];cases.append((p,'PIECEWISE_REFERENCE_LINE_CONTAINS_A_PIECE'))
        for plan,code in cases:
            with self.subTest(code=code):
                result=refused(plan) or ''
                self.assertTrue(result.startswith(code),result)

class Observer(unittest.TestCase):
    def framed(self,plan):
        g=fit_overview(plan)['graphPlan'];return g,produce(g)
    def test_model_passes_for_four_items(self):
        for plan in (JUMP,STEP,ISOLATED,EXTREMA):
            g,out=self.framed(plan);result=audit(g,out['svg'],out['transform'])
            self.assertEqual(result['status'],'PASS',result['errors'])
    def test_observer_recomputes_the_source(self):
        g,out=self.framed(JUMP)
        # A source edit that contradicts the declared value is refused by the observer's own junction check.
        changed=copy.deepcopy(g);changed['pieces'][0]['end']='CLOSED'
        self.assertEqual(audit(changed,out['svg'],out['transform'])['status'],'UNSUPPORTED')
        # A frozen marker state that differs from the plan is caught.
        frozen=copy.deepcopy(g);frozen['piecewiseDiscontinuousFeatures']['markers'][2]['state']='CLOSED'
        self.assertEqual(audit(frozen,out['svg'],out['transform'])['status'],'FAIL')
    def test_tampered_svg_fails(self):
        g,out=self.framed(JUMP);svg=out['svg'];transform=out['transform']
        hollow=re.sub(r'(id="discontinuous-endpoint-3"[^>]*?)fill="#fff"',r'\1fill="#111"',svg)
        self.assertNotEqual(hollow,svg);self.assertEqual(audit(g,hollow,transform)['status'],'FAIL')
        missing=re.sub(r'<circle id="discontinuous-endpoint-3"[^>]*/>','',svg)
        self.assertNotEqual(missing,svg);self.assertEqual(audit(g,missing,transform)['status'],'FAIL')
        moved=re.sub(r'(id="discontinuous-endpoint-4"[^>]*?cx=")([0-9.]+)',lambda m:m.group(1)+str(float(m.group(2))+12),svg)
        self.assertNotEqual(moved,svg);self.assertEqual(audit(g,moved,transform)['status'],'FAIL')
        # A connecting segment bridging the jump: the first piece is stretched onto the second piece's end.
        first=re.search(r'(<polyline id="curve-piece-1"[^>]*points=")([^"]*)(")',svg)
        second=re.search(r'<polyline id="curve-piece-2"[^>]*points="([^"]*)"',svg)
        bridged=svg[:first.start(2)]+(first.group(2)+' '+second.group(1).split()[-1])+svg[first.end(2):]
        self.assertNotEqual(bridged,svg);self.assertEqual(audit(g,bridged,transform)['status'],'FAIL')
        missing_crossing=re.sub(r'<circle id="intersection-k-1"[^>]*/>','',svg)
        self.assertNotEqual(missing_crossing,svg);self.assertEqual(audit(g,missing_crossing,transform)['status'],'FAIL')

if __name__=='__main__':unittest.main()
