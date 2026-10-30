"""E31 (2): the independent graph observer on a real composed figure with free equation texts on overlay lines (tests/e31-fixtures/free-text-overlay-lines.json:
y=-ax-1 drawn for a=-2 and the vertical line written x-1=0). The coordinate figure's lineLabels[].text is read back by tests/line-label-text.test.mjs."""
import copy
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_observer import audit

FIXTURES=Path(__file__).resolve().parent/'e31-fixtures'

class ComposedFigure(unittest.TestCase):
    def setUp(self):
        data=json.loads((FIXTURES/'free-text-overlay-lines.json').read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,plan=None,svg=None):return audit(plan or self.plan,svg or self.svg,self.transform)['errors']
    def edited(self,**change):
        plan=copy.deepcopy(self.plan)
        for line in plan['overlays']['lines']:
            if line['id'] in change:line.update(change[line['id']])
        return plan
    def test_the_figure_is_clean(self):
        self.assertEqual(self.errors(),[])
        # the final window is wider than the framed one (the unit point (0,1) lies above it), and the lines are cut by it
        self.assertLess(self.plan['viewport'][3],1.0)
    def test_the_text_is_read_back_glyph_by_glyph(self):
        self.assertIn('OVERLAY_LABEL_TEXT_MISMATCH:g',self.errors(self.edited(g={'label':'y=-bx-1'})))
        self.assertIn('OVERLAY_LABEL_TEXT_MISMATCH:v',self.errors(self.edited(v={'label':'x-1=1'})))
        self.assertIn('OVERLAY_LABEL_TEXT_MISMATCH:g',self.errors(self.edited(g={'label':'y=-ax-12'})))
    def test_a_text_that_is_not_the_drawn_line_is_named_by_the_observer_itself(self):
        self.assertIn('OVERLAY_LABEL_NOT_THE_LINE:g',self.errors(self.edited(g={'labelValues':{'a':'2'}})))
        self.assertIn('OVERLAY_LABEL_NOT_THE_LINE:v',self.errors(self.edited(v={'label':'x-2=0'})))
        self.assertIn('OVERLAY_LABEL_NOT_THE_LINE:v',self.errors(self.edited(v={'label':'y-1=0'})))
    def test_a_power_is_not_an_equation_of_a_line(self):
        self.assertIn('OVERLAY_LABEL_NOT_LINEAR:g',self.errors(self.edited(g={'label':'y=x^2','labelValues':None})))
    def test_a_symbolic_text_is_shown_as_written_and_not_compared(self):
        plan=self.edited(g={'labelValues':None})
        del plan['overlays']['lines'][0]['labelValues']
        self.assertEqual(self.errors(plan),[])
    def test_a_name_without_an_equals_sign_is_not_compared_either(self):
        # the same figure read against a plan whose line has another (matching-length) name: the glyphs differ, nothing else is claimed
        errors=self.errors(self.edited(v={'label':'l1112'}))
        self.assertEqual([e for e in errors if e.startswith('OVERLAY_LABEL_NOT')],[])

class FinalWindow(unittest.TestCase):
    """E31 (9): the figure is drawn in the plan's window widened (8 %) when the origin or the unit points (1,0), (0,1) are not strictly inside it; the overlay-line observer
    cuts the composed figure's lines by that final window (the bare model, drawn in the plan's own window, by the plan's)."""
    def test_a_window_holding_the_unit_points_is_kept(self):
        from graph_observer import _ov_final_window
        self.assertEqual(_ov_final_window([-2,3,-6,6]),[-2,3,-6,6])
    def test_a_window_that_stops_short_of_a_unit_point_is_widened_by_8_percent_of_the_span(self):
        from graph_observer import _ov_final_window
        got=_ov_final_window([-0.875,1.125,-2.5,0.5])         # (0,1) is above it
        span_x,span_y=2.0,3.5                                   # the union with (0,1): x -0.875..1.125 (the unit points are inside), y -2.5..1
        self.assertAlmostEqual(got[0],-0.875-.08*span_x);self.assertAlmostEqual(got[1],1.125+.08*span_x)
        self.assertAlmostEqual(got[2],-2.5-.08*span_y);self.assertAlmostEqual(got[3],1+.08*span_y)
        self.assertEqual(_ov_final_window([0,4,0,4]),[-.32,4.32,-.32,4.32])   # the origin on the edge counts as outside
    def test_the_composed_figure_is_cut_by_the_final_window_not_the_plan_window(self):
        from graph_observer import _ov_clip,_ov_final_window
        import xml.etree.ElementTree as ET
        data=json.loads((FIXTURES/'free-text-overlay-lines.json').read_text(encoding='utf-8'));plan,transform=data['plan'],data['transform']
        root=ET.fromstring(data['svg']);node=next(n for n in root.iter() if n.get('id')=='overlay-line-g')
        ends=[((float(node.get('x1'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y1')))/transform['sy']),
              ((float(node.get('x2'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y2')))/transform['sy'])]
        line={'kind':'LINE','slope':2.0,'intercept':-1.0}
        near=lambda a,b:abs(a[0]-b[0])<1e-3 and abs(a[1]-b[1])<1e-3
        final=_ov_clip(_ov_final_window(plan['viewport']),line);plain=_ov_clip(plan['viewport'],line)
        self.assertTrue(any(near(end,point) for end in ends for point in final) and all(any(near(end,point) for point in final) for end in ends))
        self.assertFalse(all(any(near(end,point) for point in plain) for end in ends))
    def test_the_bare_model_is_still_read_in_the_plan_window(self):
        from graph_spike import produce
        data=json.loads((FIXTURES/'free-text-overlay-lines.json').read_text(encoding='utf-8'));plan=data['plan']
        model=produce(plan);self.assertEqual(audit(plan,model['svg'],model['transform'])['errors'],[])

if __name__=='__main__':unittest.main()
