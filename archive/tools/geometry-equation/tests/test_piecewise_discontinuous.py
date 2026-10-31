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
        p=copy.deepcopy(JUMP);p['pieces']=[{'coefficients':['0'],'domain':[index,index+1]} for index in range(9)];cases.append((p,'PIECEWISE_TOO_MANY_PIECES'))
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

# y=x+1 on [-3,1) (open at 1, limit 2) and y=x^2 on [1,3] (f(1)=1): the left limit 2 and the right limit 1 at x=1.
ARROWS=copy.deepcopy(JUMP);ARROWS['pieces'][1]['start']='OPEN';ARROWS['pieces'][0]['coefficients']=['1','1'];ARROWS['jumpValues']=[{'x':'1','y':'1'}];del ARROWS['referenceLines']
ARROWS['limitArrows']=[{'at':'1','side':'LEFT','toY':'2'},{'at':'1','side':'RIGHT','toY':'1'}]

class LimitArrows(unittest.TestCase):
    def build(self,plan=ARROWS):
        g=fit_overview(plan)['graphPlan'];model=produce(g);return g,model['svg'],model['transform']
    def test_features_lie_on_the_curve_short_of_the_point(self):
        g=fit_overview(ARROWS)['graphPlan'];rows=g['piecewiseDiscontinuousFeatures']['limitArrows']
        self.assertEqual([(row['id'],row['at'],row['toY'],row['side'],row['piece']) for row in rows],[('limit-arrow-1','1','2','LEFT',1),('limit-arrow-2','1','1','RIGHT',2)])
        self.assertEqual([(row['guideX'],row['guideY']) for row in rows],[(True,True)]*2)
        self.assertLess(rows[0]['to'][0],1.0);self.assertLess(rows[0]['from'][0],rows[0]['to'][0]);self.assertGreater(rows[1]['to'][0],1.0)
        self.assertAlmostEqual(rows[0]['from'][1],rows[0]['from'][0]+1,places=9);self.assertAlmostEqual(rows[1]['to'][1],rows[1]['to'][0]**2,places=9)
    def test_guides_vanish_on_an_axis(self):
        p=copy.deepcopy(ARROWS);p['pieces'][0]['coefficients']=['0','1'];p['pieces'][1]['coefficients']=['0','0','1']
        p['limitArrows']=[{'at':'1','side':'LEFT','toY':'1'}]
        row=fit_overview(p)['graphPlan']['piecewiseDiscontinuousFeatures']['limitArrows'][0];self.assertTrue(row['guideX'] and row['guideY'])
        p['pieces'][0]['coefficients']=['-1','1'];p['limitArrows']=[{'at':'1','side':'LEFT','toY':'0'}]
        row=fit_overview(p)['graphPlan']['piecewiseDiscontinuousFeatures']['limitArrows'][0];self.assertFalse(row['guideX']);self.assertTrue(row['guideY'])
    def test_model_passes_the_independent_observer(self):
        g,svg,transform=self.build();result=audit(g,svg,transform)
        self.assertEqual(result['status'],'PASS',result['errors'])
    def test_claims_fail_closed(self):
        cases=[]
        p=copy.deepcopy(ARROWS);p['limitArrows']=[{'at':'1','side':'LEFT','toY':'3'}];cases.append((p,'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_VALUE_MISMATCH:1'))
        p=copy.deepcopy(ARROWS);p['limitArrows']=[{'at':'5','side':'LEFT','toY':'3'}];cases.append((p,'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_AT_INVALID:1'))
        p=copy.deepcopy(ARROWS);p['limitArrows']=[{'at':'1','side':'UP','toY':'2'}];cases.append((p,'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID:1'))
        p=copy.deepcopy(ARROWS);p['limitArrows']=[{'at':'1','side':'LEFT','toY':'2','x':1}];cases.append((p,'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID:1'))
        p=copy.deepcopy(ARROWS);p['limitArrows']=[{'at':'1','side':'LEFT','toY':'2'}]*7;cases.append((p,'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID'))
        p=copy.deepcopy(ARROWS);p['xWindow']=[0,2];cases.append((p,'PIECEWISE_DISCONTINUOUS_X_WINDOW_TOO_SMALL'))
        p=copy.deepcopy(ARROWS);p['xWindow']=[3,1];cases.append((p,'PIECEWISE_DISCONTINUOUS_X_WINDOW_INVALID'))
        for plan,code in cases:
            got=refused(plan);self.assertTrue(got is not None and got.startswith(code),(code,got))
    def test_arrow_needs_room(self):
        p=copy.deepcopy(ARROWS);p['pieces'][0]['domain']=['0.9'.replace('0.9','9/10'),'1'];p['pieces'][0]['coefficients']=['1','1']
        p['pieces'].insert(0,{'coefficients':['0'],'domain':[-3,'9/10'],'end':'OPEN'});p['pieces'][1]['start']='CLOSED'
        self.assertEqual(refused(p),'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_NO_ROOM:1')
    def test_observer_reads_the_drawing(self):
        g,svg,transform=self.build()
        tampered={
         'tip pulled off the curve':re.sub(r'(<line id="limit-arrow-1" [^>]*y2=")([0-9.]+)',lambda m:m.group(1)+str(float(m.group(2))+9),svg),
         'arrow missing':re.sub(r'<line id="limit-arrow-2"[^>]*/>','',svg),
         'head missing':re.sub(r'<polygon id="limit-arrow-1-arrow-end"[^>]*/>','',svg),
         'guide missing':re.sub(r'<line id="limit-arrow-1-guide-x"[^>]*/>','',svg),
         'guide moved':re.sub(r'(<line id="limit-arrow-1-guide-y" [^>]*x2=")([0-9.]+)',lambda m:m.group(1)+str(float(m.group(2))+20),svg),
         'guide solid':re.sub(r'(<line id="limit-arrow-1-guide-x"[^>]*?) stroke-dasharray="6 4"',r'\1',svg),
        }
        for name,bad in tampered.items():
            self.assertNotEqual(bad,svg,name);self.assertEqual(audit(g,bad,transform)['status'],'FAIL',name)
        # The arrow reversed (tail nearer the point than the tip) is a wrong approach direction.
        line=re.search(r'<line id="limit-arrow-1" [^>]*x1="([0-9.]+)" y1="([0-9.]+)" x2="([0-9.]+)" y2="([0-9.]+)"',svg)
        x1,y1,x2,y2=line.groups();swapped=svg.replace(f'x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"',f'x1="{x2}" y1="{y2}" x2="{x1}" y2="{y1}"',1)
        self.assertEqual(audit(g,swapped,transform)['status'],'FAIL')
    def test_eight_pieces_and_no_new_field_means_no_arrow_elements(self):
        p={'family':'piecewise-discontinuous','pieces':[{'coefficients':[str(index%2)],'domain':[index,index+1],'end':'OPEN'} for index in range(8)],'requiredPoints':[],'axisTickValues':{'x':[],'y':[]}}
        self.assertIsNone(refused(p))
        g=fit_overview(JUMP)['graphPlan'];self.assertNotIn('limitArrows',g['piecewiseDiscontinuousFeatures']);self.assertNotIn('limit-arrow',produce(g)['svg'])

ARC_PLAN={'family':'piecewise-discontinuous','pieces':[
 {'kind':'ARC','center':['0','0'],'radiusSquared':'1','fromX':'0','toX':'1','branch':'UPPER','rightClosed':False},
 {'kind':'ARC','center':['1','0'],'radiusSquared':'1','fromX':'1','toX':'2','branch':'UPPER'}],
 'jumpValues':[{'x':'1','y':'1'}],'requiredPoints':[],'axisTickValues':{'x':[1,2],'y':[1]},'limitArrows':[{'at':'1','side':'LEFT','toY':'0'}]}

class ArcPieces(unittest.TestCase):
    def test_model_passes_and_markers_are_exact(self):
        g=fit_overview(ARC_PLAN)['graphPlan'];out=produce(g)
        self.assertEqual([(m['x'],m['y'],m['state']) for m in g['piecewiseDiscontinuousFeatures']['markers']],[('0','1','CLOSED'),('1','0','OPEN'),('1','1','CLOSED'),('2','0','CLOSED')])
        result=audit(g,out['svg'],out['transform']);self.assertEqual(result['status'],'PASS',result['errors'])
    def test_claims_fail_closed(self):
        p=copy.deepcopy(ARC_PLAN);p['pieces'][0]['toX']='2';self.assertTrue(refused(p).startswith('PIECEWISE_ARC_OUT_OF_DOMAIN'))
        p=copy.deepcopy(ARC_PLAN);p['pieces'][0]['branch']='MIDDLE';self.assertTrue(refused(p).startswith('PIECEWISE_ARC_INVALID'))
        p=copy.deepcopy(ARC_PLAN);p['pieces'][0]['radiusSquared']='0';self.assertTrue(refused(p).startswith('PIECEWISE_ARC_INVALID'))
        p=copy.deepcopy(ARC_PLAN);p['axisScale']=.5;self.assertIsNotNone(refused(p))
    def test_top_of_a_half_circle_must_be_marked(self):
        p=copy.deepcopy(ARC_PLAN);p['pieces']=[{'kind':'ARC','center':['0','0'],'radiusSquared':'1','fromX':'-1','toX':'1','branch':'UPPER'}];p['jumpValues']=[];p['limitArrows']=[]
        self.assertTrue(refused(p).startswith('PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS'))
        p['requiredPoints']=[{'id':'T','x':0,'y':1}];self.assertIsNone(refused(p))
    def test_observer_reads_the_arc(self):
        g=fit_overview(ARC_PLAN)['graphPlan'];model=produce(g);svg=model['svg'];transform=model['transform']
        first=re.search(r'(<polyline id="curve-piece-1"[^>]*points=")([^"]*)(")',svg);pts=first.group(2).split()
        mid=len(pts)//2;x,y=pts[mid].split(',');moved=svg[:first.start(2)]+' '.join(pts[:mid]+[x+','+str(float(y)+9)]+pts[mid+1:])+svg[first.end(2):]
        self.assertEqual(audit(g,moved,transform)['status'],'FAIL')
        frozen=copy.deepcopy(g);frozen['piecewiseDiscontinuousFeatures']['pieces'][0]['radiusSquared']='2'
        self.assertEqual(audit(frozen,svg,transform)['status'],'FAIL')

SHARED_PLAN={'family':'piecewise-discontinuous','functionName':'f','xWindow':[-1,3],'requiredPoints':[],'axisTickValues':{'x':[1,2],'y':[1]},
 'pieces':[{'coefficients':['1','-1'],'domain':[None,1],'end':'OPEN'},{'coefficients':['-1','1'],'domain':[1,2],'start':'OPEN','end':'OPEN'},{'coefficients':['-1','1'],'domain':[2,None],'start':'OPEN'}],
 'jumpValues':[{'x':'1','y':'1'},{'x':'2','y':'0'}],
 'sharedCurve':{'id':'g','style':'DASHED','pieces':copy.deepcopy(ARC_PLAN['pieces']),'jumpValues':[{'x':'1','y':'1'}]}}

class SharedAxes(unittest.TestCase):
    def build(self,plan=SHARED_PLAN):
        g=fit_overview(plan)['graphPlan'];model=produce(g);return g,model['svg'],model['transform']
    def test_one_frame_and_coincident_dots_listed(self):
        g,svg,transform=self.build()
        self.assertEqual(g['viewport'],g['sharedCurve']['viewport'])
        self.assertEqual([(row['first'],row['second']) for row in g['sharedFeatures']['coincidentMarkers']],[('endpoint-1','endpoint-2'),('endpoint-2','endpoint-3'),('endpoint-3','endpoint-4')])
        result=audit(g,svg,transform);self.assertEqual(result['status'],'PASS',result['errors'])
    def test_style_is_required_and_checked(self):
        p=copy.deepcopy(SHARED_PLAN);del p['sharedCurve']['style'];self.assertEqual(refused(p),'PAIR_SHARED_CURVES_INDISTINCT')
        g,svg,transform=self.build()
        same=re.sub(r'(<polyline id="curve-g-piece-\d"[^>]*?) stroke-dasharray="6 4"',r'\1',svg)
        self.assertNotEqual(same,svg);result=audit(g,same,transform)
        self.assertEqual(result['status'],'FAIL');self.assertIn('PAIR_SHARED_CURVES_INDISTINCT',result['errors'])
    def test_overlapping_dots_must_differ_in_size(self):
        g,svg,transform=self.build()
        big=re.sub(r'(<circle id="discontinuous-g-endpoint-2"[^>]*?) r="[0-9.]+"',r'\1 r="4"',svg)
        self.assertNotEqual(big,svg);result=audit(g,big,transform)
        self.assertEqual(result['status'],'FAIL');self.assertIn('PAIR_SHARED_MARKER_INDISTINCT',result['errors'])
    def test_second_curve_is_audited_on_its_own(self):
        g,svg,transform=self.build()
        moved=re.sub(r'(<circle id="discontinuous-g-endpoint-1"[^>]*?cx=")([0-9.]+)',lambda m:m.group(1)+str(float(m.group(2))+12),svg)
        self.assertNotEqual(moved,svg);self.assertEqual(audit(g,moved,transform)['status'],'FAIL')
        missing=re.sub(r'<polyline id="curve-g-piece-2"[^>]*/>','',svg);self.assertEqual(audit(g,missing,transform)['status'],'FAIL')
    def test_reference_lines_are_not_supported_with_shared(self):
        p=copy.deepcopy(SHARED_PLAN);p['referenceLines']=[{'id':'k','y':'1','intersectionX':['0']}];self.assertEqual(refused(p),'PAIR_SHARED_REFERENCE_LINES_UNSUPPORTED')

if __name__=='__main__':unittest.main()
