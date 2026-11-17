"""Axis fold (piecewise-polynomial): an axis far from every drawn feature stands on the window edge instead of through the empty gap to the origin, and a
figure taller than 1:1.2 is made shorter by the y/x scale ratio 2/3, then 1/2. The framing decision, the independent observer (axis_fold_audit) with tampering,
and the no-change guarantee for a plan that is not folded. No Chrome here: the typeset figure is exercised by rendering."""
import copy
import re
import sys
import unittest
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview, AXIS_FOLD_CLEAR_PX, AXIS_FOLD_TALL
from graph_spike import produce
from graph_observer import audit, axis_fold_audit

# f(x)=x^4+8x^3+22x^2+24x+12 touches y=3 and y=4 only: far above the x axis, near the y axis
QUARTIC={'family':'piecewise-polynomial','pieces':[{'coefficients':['12','24','22','8','1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},
         'requiredPoints':[{'id':'E0','x':'-3','y':'3'},{'id':'E1','x':'-2','y':'4'},{'id':'E2','x':'-1','y':'3'}],'axisTickValues':{'x':[],'y':[]},
         'referenceLines':[{'id':'lower','y':'3','intersectionX':['-3','-1']},{'id':'upper','y':'4','intersectionX':['-2-sqrt(2)','-2','-2+sqrt(2)']}]}
# the same curve moved right and up: far from both axes
FAR_RIGHT={'family':'piecewise-polynomial','pieces':[{'coefficients':['12','24','22','8','1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},
           'requiredPoints':[{'id':'E0','x':'-3','y':'3'},{'id':'E1','x':'-2','y':'4'},{'id':'E2','x':'-1','y':'3'}],'axisTickValues':{'x':[],'y':[]}}
# x^2-4: the curve crosses the x axis (roots +-2) and the y axis
CUBIC_ROOTS={'family':'piecewise-polynomial','pieces':[{'coefficients':['-4','0','1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},
             'requiredPoints':[{'id':'V','x':'0','y':'-4'},{'id':'P','x':'-2','y':'0'},{'id':'Q','x':'2','y':'0'}],'axisTickValues':{'x':[],'y':[]}}

def plan_with(base,**change):
    plan=copy.deepcopy(base)
    for key,value in change.items():
        if value is None:plan.pop(key,None)
        else:plan[key]=value
    return plan
def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class FoldDecision(unittest.TestCase):
    def test_a_curve_far_above_the_x_axis_folds_it_onto_the_bottom_edge(self):
        plan=fitted(QUARTIC);fold=plan['axisFold']
        self.assertEqual(fold['schemaVersion'],'AXIS_FOLD_v1');self.assertEqual(fold['x']['edge'],'BOTTOM');self.assertNotIn('y',fold)
        xmin,xmax,ymin,ymax=plan['viewport']
        self.assertEqual(fold['x']['at'],ymin);self.assertGreater(ymin,0)                      # the window does not hold the origin line
        self.assertTrue(xmin<0<xmax)
        self.assertLessEqual(plan['plotCanvas']['height']/plan['plotCanvas']['width'],AXIS_FOLD_TALL)
    def test_the_lowest_feature_keeps_the_clear_distance_from_the_folded_axis(self):
        plan=fitted(QUARTIC);scale=plan['plotCanvas']['width']/(plan['viewport'][1]-plan['viewport'][0]);ratio=plan['axisRatio']
        self.assertGreaterEqual((3-plan['axisFold']['x']['at'])*scale*ratio,AXIS_FOLD_CLEAR_PX-1e-6)
    def test_a_y_axis_far_to_the_side_folds_onto_the_left_edge(self):
        shifted=copy.deepcopy(QUARTIC)
        # f(x-20): the same shape 20 to the right
        shifted['pieces']=[{'coefficients':['104332', '-23256', '1942', '-72', '1']}]
        shifted['requiredPoints']=[{'id':'E0','x':'17','y':'3'},{'id':'E1','x':'18','y':'4'},{'id':'E2','x':'19','y':'3'}]
        shifted['referenceLines']=[]
        got=fitted(shifted)
        self.assertEqual(got['axisFold']['y']['edge'],'LEFT');self.assertEqual(got['axisFold']['y']['at'],got['viewport'][0])
        self.assertEqual(got['axisFold']['x']['edge'],'BOTTOM')                                # far above as well: both axes fold
    def test_an_axis_the_features_reach_is_never_folded(self):
        self.assertNotIn('axisFold',fitted(CUBIC_ROOTS))
        p=fitted(CUBIC_ROOTS);self.assertTrue(p['viewport'][2]<0<p['viewport'][3] and p['viewport'][0]<0<p['viewport'][1])
    def test_a_figure_whose_axes_carry_meaning_keeps_the_origin(self):
        from graph_framing import axis_fold_allowed
        self.assertTrue(axis_fold_allowed(QUARTIC))
        for change in ({'axisScale':{'x':1,'y':2}},{'applicationAxes':True},{'regions':[{'id':'r'}]},{'axisFold':False},
                       {'referenceLines':[{'id':'m','slope':'1','intercept':'0'}]},{'overlays':{'guides':[{'id':'g'}]}},{'overlays':{'quadrants':[{'id':'q'}]}},
                       {'overlays':{'lines':[{'id':'d','slope':'1','intercept':'0'}]}}):
            self.assertFalse(axis_fold_allowed({**QUARTIC,**change}),change)
        self.assertTrue(axis_fold_allowed({**QUARTIC,'overlays':{'points':[{'id':'A','x':'0','y':'3'}],'lines':[{'id':'h','slope':'0','intercept':'3'},{'id':'v','x':'1'}]}}))
        self.assertNotIn('axisFold',fitted(plan_with(QUARTIC,axisScale={'x':1,'y':2})))
    def test_the_author_can_keep_the_origin_with_axis_fold_false(self):
        plan=fitted(plan_with(QUARTIC,axisFold=False))
        self.assertIs(plan['axisFold'],False);self.assertEqual(plan['axisRatio'],1.0)
        self.assertTrue(plan['viewport'][2]<0<plan['viewport'][3])                              # the old frame: origin inside, curve in the upper part
    def test_the_fold_itself_is_never_authored(self):
        for bad in (True,{'x':{'edge':'BOTTOM','at':1}},'fold',1):self.assertEqual(refused(plan_with(QUARTIC,axisFold=bad)),'PIECEWISE_POLY_AXIS_FOLD_INVALID')
    def test_a_tick_the_fold_would_cut_cancels_it(self):
        plan=fitted(plan_with(QUARTIC,axisTickValues={'x':[],'y':['1']}))                      # y=1 would lie in the folded part
        self.assertNotIn('axisFold',plan);self.assertTrue(plan['viewport'][2]<=1<=plan['viewport'][3])
        self.assertIn('axisFold',fitted(plan_with(QUARTIC,axisTickValues={'x':[],'y':['3']})))  # a tick the window keeps does not
    def test_the_folded_window_holds_no_origin_marking(self):
        # the origin point is no longer part of the frame: the folded window is tighter than the old one
        self.assertLess(fitted(QUARTIC)['plotCanvas']['height'],fitted(plan_with(QUARTIC,axisFold=False))['plotCanvas']['height'])

class TallFigure(unittest.TestCase):
    TALL={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'breakpoints':[],'sourceDomain':{'kind':'INTERVAL','range':['-1','1'],'states':['CLOSED','CLOSED']},
          'requiredPoints':[{'id':'V','x':'0','y':'0'}],'axisTickValues':{'x':[],'y':[]}}
    def test_a_tall_figure_is_made_shorter_before_it_is_drawn(self):
        tall={**self.TALL,'pieces':[{'coefficients':['0','0','3']}]}
        before=fitted(plan_with(tall,axisFold=False));after=fitted(tall)
        self.assertEqual(before['axisRatio'],1.0);self.assertGreater(before['plotCanvas']['height']/before['plotCanvas']['width'],AXIS_FOLD_TALL)
        self.assertIn(after['axisRatio'],(2/3,.5));self.assertLess(after['plotCanvas']['height'],before['plotCanvas']['height'])
    def test_a_figure_not_taller_than_one_to_one_point_two_keeps_one_scale(self):
        plan=fitted(self.TALL);self.assertEqual(plan['axisRatio'],1.0)
        self.assertEqual(plan,{key:value for key,value in fitted(plan_with(self.TALL,axisFold=False)).items() if key!='axisFold'})   # the old frame, field for field

# ---- the independent observer on a drawn figure ----
def drawn(plan,*,x_axis=None,y_axis=None,extra='',labels=''):
    """The model figure of a folded plan plus the axes the final figure draws (at the edge the plan names unless moved): an SVG the audit can read."""
    model=produce(plan);t=model['transform'];fold=plan['axisFold']
    xmin,xmax,ymin,ymax=plan['viewport']
    ox,oy,sx,sy=t['originX'],t['originY'],t['sx'],t['sy']
    y_of_x_axis=oy-(fold['x']['at'] if 'x' in fold else 0)*sy if x_axis is None else x_axis
    x_of_y_axis=ox+(fold['y']['at'] if 'y' in fold else 0)*sx if y_axis is None else y_axis
    axes=(f'<line id="x-axis" data-role="axis" data-axis="x" x1="{ox+xmin*sx}" y1="{y_of_x_axis}" x2="{ox+xmax*sx}" y2="{y_of_x_axis}"/>'
          f'<line id="y-axis" data-role="axis" data-axis="y" x1="{x_of_y_axis}" y1="{oy-ymin*sy}" x2="{x_of_y_axis}" y2="{oy-ymax*sy}"/>')
    return model['svg'].replace('</svg>',axes+extra+labels+'</svg>'),t

class ObserverFold(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.plan=fitted(QUARTIC);cls.svg,cls.t=drawn(cls.plan)
    def errors(self,plan=None,svg=None):
        return axis_fold_audit(plan or self.plan,svg or self.svg,self.t)
    def test_the_framed_figure_passes(self):
        self.assertEqual(self.errors(),{'status':'PASS','errors':[]})
    def test_a_plan_without_a_fold_is_not_touched(self):
        self.assertIsNone(axis_fold_audit(fitted(plan_with(QUARTIC,axisFold=False)),self.svg,self.t))
    def test_the_axis_must_stand_on_the_window_edge(self):
        svg,_=drawn(self.plan,x_axis=self.t['originY']-self.plan['axisFold']['x']['at']*self.t['sy']-30)
        self.assertIn('AXIS_FOLD_AXIS_MISPLACED:x',self.errors(svg=svg)['errors'])
        bad=copy.deepcopy(self.plan);bad['axisFold']['x']['at']+=.01
        self.assertIn('AXIS_FOLD_NOT_ON_WINDOW_EDGE:x',self.errors(bad)['errors'])
    def test_a_fold_that_is_not_needed_is_refused(self):
        bad=copy.deepcopy(self.plan);bad['viewport']=[bad['viewport'][0],bad['viewport'][1],-1.0,bad['viewport'][3]];bad['axisFold']['x']['at']=-1.0
        self.assertIn('AXIS_FOLD_NOT_NEEDED:x',self.errors(bad)['errors'])
    def test_an_element_touching_the_folded_axis_is_refused(self):
        y=self.t['originY']-self.plan['axisFold']['x']['at']*self.t['sy']
        dot=f'<circle id="stray" data-role="point" cx="{self.t["originX"]-30}" cy="{y-8}" r="3.2"/>'                     # 8 px above the axis: under 12
        svg,_=drawn(self.plan,extra=dot)
        self.assertIn('AXIS_FOLD_TOO_CLOSE:stray',self.errors(svg=svg)['errors'])
        far=f'<circle id="ok" data-role="point" cx="{self.t["originX"]-30}" cy="{y-30}" r="3.2"/>'
        self.assertEqual(self.errors(svg=drawn(self.plan,extra=far)[0])['errors'],[])
    def test_a_curve_running_into_the_folded_part_is_refused(self):
        y=self.t['originY']-self.plan['axisFold']['x']['at']*self.t['sy']
        line=f'<polyline id="runaway" data-role="curve" points="{self.t["originX"]-20},{y-40} {self.t["originX"]-20},{y+20}"/>'
        self.assertIn('AXIS_FOLD_ELEMENT_IN_FOLD:runaway',self.errors(svg=drawn(self.plan,extra=line)[0])['errors'])
    def test_a_label_box_must_keep_clear_and_stay_on_the_feature_side(self):
        y=self.t['originY']-self.plan['axisFold']['x']['at']*self.t['sy']
        def label(ident,top):
            return (f'<g id="{ident}" data-label-kind="COORDINATE_LABEL" transform="translate(100 {top})"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="16" viewBox="0 0 40 16"/></g>')
        close=drawn(self.plan,labels=label('near-name',y-20))[0]            # bottom 4 px above the axis
        beyond=drawn(self.plan,labels=label('below-name',y+6))[0]           # wholly below the axis
        clear=drawn(self.plan,labels=label('good-name',y-40))[0]            # bottom 24 px above
        self.assertIn('AXIS_FOLD_TOO_CLOSE:near-name',self.errors(svg=close)['errors'])
        self.assertIn('AXIS_FOLD_ELEMENT_IN_FOLD:below-name',self.errors(svg=beyond)['errors'])
        self.assertEqual(self.errors(svg=clear)['errors'],[])
        # the title and the tick numbers of the folded axis itself stand outside by design
        own=drawn(self.plan,labels=label('axis-x',y+4))[0];self.assertEqual(self.errors(svg=own)['errors'],[])
    def test_no_o_on_the_folded_side(self):
        y=self.t['originY']-self.plan['axisFold']['x']['at']*self.t['sy']
        o=f'<g id="origin-name" data-label-kind="POINT_NAME" transform="translate(40 {y-60})"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12"/></g>'
        self.assertIn('AXIS_FOLD_ORIGIN_LABEL:origin-name',self.errors(svg=drawn(self.plan,labels=o)[0])['errors'])
    def test_a_tick_number_must_be_a_real_value_inside_the_window(self):
        y=self.t['originY']-self.plan['axisFold']['x']['at']*self.t['sy'];x=self.t['originX']+(-2)*self.t['sx']
        good=f'<line id="tick-x-1" data-role="tick" data-axis="x" data-value="-2" x1="{x}" y1="{y}" x2="{x}" y2="{y+4}"/>'
        wrong=f'<line id="tick-x-2" data-role="tick" data-axis="x" data-value="-1" x1="{x}" y1="{y}" x2="{x}" y2="{y+4}"/>'            # drawn where -2 is
        inside_fold=f'<line id="tick-y-1" data-role="tick" data-axis="y" data-value="1" x1="{self.t["originX"]}" y1="{self.t["originY"]-self.t["sy"]}" x2="{self.t["originX"]-4}" y2="{self.t["originY"]-self.t["sy"]}"/>'  # y=1 is below the window
        self.assertEqual(self.errors(svg=drawn(self.plan,extra=good)[0])['errors'],[])
        self.assertIn('AXIS_FOLD_TICK_MISPLACED:tick-x-2',self.errors(svg=drawn(self.plan,extra=wrong)[0])['errors'])
        self.assertIn('AXIS_FOLD_TICK_MISPLACED:tick-y-1',self.errors(svg=drawn(self.plan,extra=inside_fold)[0])['errors'])
    def test_a_figure_that_must_not_fold_is_refused(self):
        for field,value,code in (('axisScale',{'x':1,'y':2},'AXIS_FOLD_FORBIDDEN:SCALE'),('applicationAxes',True,'AXIS_FOLD_FORBIDDEN:SCALE'),
                                 ('regions',[{'id':'r'}],'AXIS_FOLD_FORBIDDEN:REGIONS'),
                                 ('referenceLines',[{'id':'m','slope':'1','intercept':'0'}],'AXIS_FOLD_FORBIDDEN:SLANTED_LINE'),
                                 ('overlays',{'guides':[{'id':'g'}]},'AXIS_FOLD_FORBIDDEN:OVERLAYS'),
                                 ('overlays',{'lines':[{'id':'d','slope':'1','intercept':'0'}]},'AXIS_FOLD_FORBIDDEN:SLANTED_LINE')):
            bad={**self.plan,field:value};self.assertIn(code,self.errors(bad)['errors'],field)
        self.assertEqual(axis_fold_audit({**self.plan,'overlays':{'points':[{'id':'A','x':'-2','y':'4'}],'lines':[{'id':'h','slope':'0','intercept':'3'},{'id':'v','x':'-1'}]}},self.svg,self.t)['errors'],[])
    def test_a_malformed_fold_is_refused(self):
        for fold in ({'schemaVersion':'AXIS_FOLD_v1'},{'schemaVersion':'v0','x':{'edge':'BOTTOM','at':1}},{'schemaVersion':'AXIS_FOLD_v1','x':{'edge':'LEFT','at':1}},
                     {'schemaVersion':'AXIS_FOLD_v1','x':{'edge':'BOTTOM'}},'fold',{'schemaVersion':'AXIS_FOLD_v1','x':{'edge':'BOTTOM','at':self.plan['axisFold']['x']['at']},'z':1}):
            self.assertEqual(self.errors({**self.plan,'axisFold':fold})['status'],'FAIL',fold)
    def test_the_full_audit_includes_the_fold_check(self):
        bad=copy.deepcopy(self.plan);bad['axisFold']['x']['at']+=.5
        result=audit(bad,self.svg,self.t)
        self.assertTrue(any(error.startswith('AXIS_FOLD_') for error in result.get('errors',[])),result)

if __name__=='__main__':unittest.main()
