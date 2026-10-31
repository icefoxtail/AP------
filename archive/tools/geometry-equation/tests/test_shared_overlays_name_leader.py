"""G7c: piecewise-discontinuous SHARED axes: overlays (points on g via `on`, vertical lines) and the g name tied to g by a leader."""
import copy
import math
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit,_pd_name_label_errors

ARCS=[{'kind':'ARC','center':['0','0'],'radiusSquared':'1','fromX':'0','toX':'1','branch':'UPPER','rightClosed':False},
      {'kind':'ARC','center':['1','0'],'radiusSquared':'1','fromX':'1','toX':'2','branch':'UPPER'}]
SHARED={'family':'piecewise-discontinuous','functionName':'f','xWindow':[-1,3],'requiredPoints':[],'axisTickValues':{'x':[1,2],'y':[1]},
 'pieces':[{'coefficients':['1','-1'],'domain':[None,1],'end':'OPEN'},{'coefficients':['-1','1'],'domain':[1,2],'start':'OPEN','end':'OPEN'},{'coefficients':['-1','1'],'domain':[2,None],'start':'OPEN'}],
 'jumpValues':[{'x':'1','y':'1'},{'x':'2','y':'0'}],
 'sharedCurve':{'id':'g','style':'DASHED','pieces':copy.deepcopy(ARCS),'jumpValues':[{'x':'1','y':'1'}]}}

def plan(overlays=None,name_label=None):
    p=copy.deepcopy(SHARED)
    if overlays is not None:p['overlays']=overlays
    if name_label is not None:p['sharedCurve']['nameLabel']=name_label
    return p
def refused(p):
    try:fit_overview(p)
    except ValueError as error:return str(error)
    return None
def build(p):
    g=fit_overview(p)['graphPlan'];model=produce(g);return g,model['svg'],model['transform']

class OverlaysOnShared(unittest.TestCase):
    def test_point_on_g_is_computed_from_g_and_audited(self):
        g,svg,transform=build(plan({'points':[{'id':'P','curveX':'1/2','on':'g'},{'id':'Q','curveX':'1/2'}],'guides':[{'id':'k','from':'P','axis':'x'}]}))
        rows={row['id']:row for row in g['overlaysFeatures']['points']}
        self.assertAlmostEqual(rows['P']['y'],math.sqrt(3)/2,places=9)   # g, not f
        self.assertAlmostEqual(rows['Q']['y'],.5,places=9)              # no `on`: f
        result=audit(g,svg,transform);self.assertEqual(result['status'],'PASS',result['errors'])
    def test_vertical_line_and_segment_are_allowed(self):
        g,svg,transform=build(plan({'lines':[{'id':'v','x':'1/2','style':'DASHED'}],'points':[{'id':'P','curveX':'1/2','on':'g'},{'id':'Q','curveX':'3/2','on':'g'}],'segments':[{'id':'s','from':'P','to':'Q','dashed':True}]}))
        result=audit(g,svg,transform);self.assertEqual(result['status'],'PASS',result['errors'])
    def test_unknown_curve_and_undefined_point_are_refused(self):
        self.assertEqual(refused(plan({'points':[{'id':'P','curveX':'1/2','on':'h'}]})),'OVERLAY_POINT_CURVE_UNKNOWN:P')
        self.assertEqual(refused(plan({'points':[{'id':'P','curveX':'5','on':'g'}]})),'OVERLAY_POINT_NOT_ON_CURVE:5')
        self.assertEqual(refused(plan({'points':[{'id':'P','x':'0','y':'0','on':'g'}]})),'OVERLAY_POINT_INVALID:P')
    def test_the_old_shared_refusals_stay(self):
        p=plan();p['referenceLines']=[{'id':'k','y':'1','intersectionX':['0']}];self.assertEqual(refused(p),'PAIR_SHARED_REFERENCE_LINES_UNSUPPORTED')
    def test_observer_catches_a_point_moved_off_g(self):
        g,svg,transform=build(plan({'points':[{'id':'P','curveX':'1/2','on':'g'}]}))
        moved=re.sub(r'(<circle id="P"[^>]*? cy=")([0-9.]+)',lambda m:m.group(1)+str(float(m.group(2))+9),svg)
        self.assertNotEqual(moved,svg);self.assertEqual(audit(g,moved,transform)['status'],'FAIL')
    def test_observer_catches_a_point_on_the_wrong_curve(self):
        g,svg,transform=build(plan({'points':[{'id':'P','curveX':'1/2','on':'g'}]}))
        forged=copy.deepcopy(g);forged['overlays']['points'][0].pop('on')   # claims f, the drawn point is on g
        self.assertEqual(audit(forged,svg,transform)['status'],'FAIL')

class NameLeader(unittest.TestCase):
    LABEL={'text':'g(x)','placement':'LEADER','anchorX':'3/2'}
    def test_field_checks(self):
        self.assertIsNone(refused(plan(None,self.LABEL)))
        self.assertEqual(refused(plan(None,{'placement':'LEADER','anchorX':'5'})),'CURVE_NAME_LEADER_ANCHOR_OFF_CURVE')
        self.assertEqual(refused(plan(None,{'placement':'BESIDE'})),'CURVE_NAME_LABEL_INVALID')
        self.assertEqual(refused(plan(None,{'placement':'LEADER','extra':1})),'CURVE_NAME_LABEL_INVALID')
    def svg_with_leader(self,start_x,start_y,end,box=None):
        g,svg,transform=build(plan(None,self.LABEL))
        ox,oy,sx,sy=[transform[key] for key in ('originX','originY','sx','sy')]
        px,py=ox+sx*start_x,oy-sy*start_y
        bx,by=(px+30,py-30) if box is None else box
        end=(bx,by+10) if end is None else end
        extra=('<line data-role="leader" data-owner-label="g-curve-name" x1="%f" y1="%f" x2="%f" y2="%f"/><g id="g-curve-name" transform="translate(%f %f)"><svg width="40" height="20"/></g>'%(px,py,end[0],end[1],bx,by))
        return g,svg.replace('</svg>','<g>'+extra+'</g></svg>').replace('<svg ','<svg data-label-kind="EQUATION_LABEL" ',1),transform
    def errors(self,*args,**kwargs):
        g,svg,transform=self.svg_with_leader(*args,**kwargs)
        return _pd_name_label_errors(g,g['sharedCurve'],svg,transform)
    def test_a_leader_from_g_to_the_label_passes(self):
        self.assertEqual(self.errors(1.5,math.sqrt(3)/2,None),[])
    def test_leader_start_on_f_instead_of_g_fails(self):
        self.assertIn('CURVE_NAME_LEADER_NOT_ON_OWNER',self.errors(1.5,.5,None))
    def test_leader_start_off_every_curve_fails(self):
        self.assertIn('CURVE_NAME_LEADER_NOT_ON_OWNER',self.errors(1.5,math.sqrt(3)/2+.2,None))
    def test_leader_at_a_crossing_of_f_and_g_is_ambiguous(self):
        self.assertIn('CURVE_NAME_LEADER_AMBIGUOUS_OWNER',self.errors(0.0,1.0,None))
    def test_leader_end_off_the_label_box_fails(self):
        g,svg,transform=self.svg_with_leader(1.5,math.sqrt(3)/2,None)
        ox,oy,sx,sy=[transform[key] for key in ('originX','originY','sx','sy')]
        self.assertIn('CURVE_NAME_LEADER_NOT_ON_LABEL',self.errors(1.5,math.sqrt(3)/2,(ox+sx*1.5+80,oy-sy*.866-90)))
    def test_missing_leader_fails(self):
        g,svg,transform=self.svg_with_leader(1.5,math.sqrt(3)/2,None)
        gone=re.sub(r'<line data-role="leader"[^>]*/>','',svg)
        self.assertEqual(_pd_name_label_errors(g,g['sharedCurve'],gone,transform),['CURVE_NAME_LEADER_MISSING'])
    def test_without_a_name_label_nothing_is_checked(self):
        g,svg,transform=build(plan())
        self.assertEqual(_pd_name_label_errors(g,g['sharedCurve'],svg,transform),[])

if __name__=='__main__':unittest.main()
