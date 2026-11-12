"""multi-curve-figure-v1, MULTI_CURVE_TOO_NARROW: a tall, narrow figure at one scale first gets a taller plot (up to 1000 px, canvas 1064) and is refused only when
the curves would still be under 48 px wide. The scale stays equal on both axes; figures that fit the usual 640 px plot are framed exactly as before.
Framing, the model figure and the independent observer run without Chrome."""
import copy
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_framing import fit_overview,EQUAL_UNIT_MIN_CURVE_PX,MULTI_CURVE_TALL_PLOT_HEIGHT
from graph_spike import produce
from graph_observer import audit

def parabolas(a,b,x1='1'):
    return {'family':'multi-curve','axisTickValues':{'x':['1'],'y':[]},'curves':[
        {'id':'a','kind':'Y_OF_X','coefficients':['0','0',str(a)],'domain':['0',x1],'color':'BLUE'},
        {'id':'b','kind':'Y_OF_X','coefficients':['0','0',str(b)],'domain':['0',x1],'color':'WARM'}]}

def framed(graph):
    return fit_overview(copy.deepcopy(graph))['graphPlan']

def refused(graph):
    try:fit_overview(copy.deepcopy(graph))
    except ValueError as error:return str(error)
    return None

class TallPlot(unittest.TestCase):
    def test_a_narrow_figure_gets_a_taller_plot_at_one_scale(self):
        plan=framed(parabolas(30,20))
        height=plan['plotCanvas']['height']
        self.assertTrue(640<height<=MULTI_CURVE_TALL_PLOT_HEIGHT,height)
        self.assertEqual((plan['plotCanvas']['width'],plan['equalUnits']),(448,True))
        # the curves are at least 48 px wide at the plot's x scale (448 px over the window), and the y scale is the x scale times axisRatio
        x0,x1,y0,y1=plan['viewport'];sx=448/(x1-x0);sy=height/(y1-y0)
        self.assertGreaterEqual(1*sx,EQUAL_UNIT_MIN_CURVE_PX)
        self.assertAlmostEqual(sy/sx,plan['axisRatio'],places=6)
        self.assertGreaterEqual(plan['axisRatio'],.5)

    def test_the_taller_plot_is_observed_and_rendered_by_the_model(self):
        plan=framed(parabolas(30,20));model=produce(plan)
        self.assertEqual(audit(plan,model['svg'],model['transform'])['status'],'PASS')

    def test_a_figure_that_fits_the_usual_plot_is_framed_as_before(self):
        for a,b in ((2,1),(4,3)):
            plan=framed(parabolas(a,b,'2'))
            self.assertLessEqual(plan['plotCanvas']['height'],640)
            self.assertEqual(plan['axisRatio'],1.0)
        # a figure that needs the squeeze (y at most halved) at 640 still takes it and keeps the 640 plot: the taller plot is only the last resort
        squeezed=framed(parabolas(16,12))
        self.assertEqual((squeezed['plotCanvas']['height'],squeezed['axisRatio']<1.0),(640,True))

    def test_a_figure_still_too_narrow_on_the_tallest_plot_is_refused(self):
        self.assertEqual(refused(parabolas(200,150)),'MULTI_CURVE_TOO_NARROW')

    def test_a_stack_panel_keeps_its_own_height_limit(self):
        graph=parabolas(30,20);graph['plotHeightLimit']=300
        self.assertEqual(refused(graph),'MULTI_CURVE_TOO_NARROW')
        graph['plotHeightLimit']=640
        self.assertEqual(refused(graph),'MULTI_CURVE_TOO_NARROW')

if __name__=='__main__':unittest.main()
