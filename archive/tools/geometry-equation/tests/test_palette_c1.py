"""Colour groups of plane figures (C1-1): the palette tie, region fills + equalAreas and graph region fills. The engine draws the colours; the independent observer
(plane_regions_observer.py, graph_observer.py) recomputes the areas from the peer points and reads the colours back from the final SVG. Tamper cases change the
colour, the opacity or the area so that the observer must fail. Angle and segment colours: tests/test_color_marks_c1.py. No Chrome here."""
import importlib.util
import json
import math
import re
import sys
import unittest
import warnings
from pathlib import Path

TESTS=Path(__file__).resolve().parent
GEOMETRY=TESTS.parent
PRODUCTION=GEOMETRY/'production'
sys.path.insert(0,str(GEOMETRY))
sys.path.insert(0,str(PRODUCTION))
sys.path.insert(0,str(TESTS))
from visual_engine.engine import build
from visual_engine.palette import PALETTE,PALETTE_NAMES,COLORED_SEGMENT_WIDTH
from visual_engine.semantic_model import validate
import plane_regions_observer as regions
import test_region_fill as rf
import test_graph_regions as gr

OBSERVER=rf.OBSERVER
clone=lambda value:json.loads(json.dumps(value))

def luminance(hex_color):
    channels=[int(hex_color[i:i+2],16)/255 for i in (1,3,5)]
    lin=[c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4 for c in channels]
    return 0.2126*lin[0]+0.7152*lin[1]+0.0722*lin[2]
def contrast(a,b):
    la,lb=sorted((luminance(a),luminance(b)),reverse=True);return (la+0.05)/(lb+0.05)
def over_white(hex_color,opacity):
    return '#'+''.join('%02x'%round(255*(1-opacity)+int(hex_color[i:i+2],16)*opacity) for i in (1,3,5))

class PaletteTests(unittest.TestCase):
    def test_the_five_names_and_the_solid_figure_values(self):
        self.assertEqual(list(PALETTE_NAMES),['BLUE','WARM','GREEN','ROSE','VIOLET'])
        solid=(PRODUCTION/'solid-figure-v1.mjs').read_text(encoding='utf-8')
        table=re.search(r"const HIGHLIGHT_FILLS=\{(.*?)\};",solid).group(1)
        rows={name:(color,float(opacity)) for name,color,opacity in re.findall(r"(\w+):\['(#[0-9a-f]{6})',([0-9.]+)\]",table)}
        self.assertEqual(rows['LIGHT'],(PALETTE['BLUE']['fill'],PALETTE['BLUE']['opacity']))     # BLUE is the solid figures' LIGHT blue
        for name in ('WARM','GREEN','ROSE','VIOLET'):self.assertEqual(rows[name],(PALETTE[name]['fill'],PALETTE[name]['opacity']),name)
    def test_every_copy_of_the_table_is_the_same(self):
        js=(PRODUCTION/'palette.mjs').read_text(encoding='utf-8')
        for name,row in PALETTE.items():
            self.assertIn("%s:{fill:'%s',opacity:%s,line:'%s'}"%(name,row['fill'],row['opacity'],row['line']),js,name)
        self.assertEqual(regions.PALETTE_FILLS,{name:(row['fill'],row['opacity']) for name,row in PALETTE.items()})
        worker=(PRODUCTION/'plane-marks-observer-worker.py').read_text(encoding='utf-8')
        self.assertEqual(eval(re.search(r"^PALETTE_LINES=(\{.*\})",worker,re.M).group(1)),{name:row['line'] for name,row in PALETTE.items()})
        self.assertIn('COLORED_SEGMENT_WIDTH=%s'%COLORED_SEGMENT_WIDTH,worker)
        graph=(PRODUCTION/'graph_observer.py').read_text(encoding='utf-8')
        self.assertEqual(eval(re.search(r"^GRAPH_REGION_OPACITY=(\{.*\})",graph,re.M).group(1)),{name:row['opacity'] for name,row in PALETTE.items()})
        self.assertEqual({name:color for name,color in eval(re.search(r"^GRAPH_REGION_FILLS=(\{.*\})",graph,re.M).group(1)).items() if name in PALETTE},{name:row['fill'] for name,row in PALETTE.items()})
    def test_gray_fills_are_untouched(self):
        self.assertEqual(regions.REGION_FILLS,{'LIGHT':'#e4e7ec','MEDIUM':'#c7ccd5'})
    def test_lines_are_dark_enough_on_white_and_text_reads_on_every_fill(self):
        for name,row in PALETTE.items():
            self.assertGreaterEqual(contrast(row['line'],'#ffffff'),3.0,name+' line on white')
            self.assertGreaterEqual(contrast('#111111',over_white(row['fill'],row['opacity'])),7.0,name+' black label on its fill')
    def test_grey_conversion_is_a_warning_only(self):
        tints={name:luminance(over_white(row['fill'],row['opacity'])) for name,row in PALETTE.items()}
        for first in tints:
            for second in tints:
                if first<second and abs(tints[first]-tints[second])<0.03:
                    warnings.warn('palette %s / %s print almost the same grey (%.3f vs %.3f); on a screen they stay clearly two colours'%(first,second,tints[first],tints[second]))
    def test_colours_differ_pairwise_on_screen(self):
        tints=[over_white(row['fill'],row['opacity']) for row in PALETTE.values()]
        self.assertEqual(len(set(tints)),5);self.assertEqual(len({row['line'] for row in PALETTE.values()}),5)

# ---- regions + equalAreas on the circle fixture of test_region_fill
def sector(identifier,fill,a,b):
    return {'id':identifier,'kind':'FILL_REGION','fill':fill,'loops':[{'start':'O','steps':[{'to':a},{'to':b,'arc':{'center':'O','sweep':'CCW'}},{'to':'O'}]}]}
def sector_row(identifier,fill,a,b):return {'id':identifier,'fill':fill,'shapes':[{'sector':{'center':'O','from':a,'to':b}}]}
SEGMENTS=[{'id':sid,'refs':refs} for sid,refs in [('sOA',['O','A']),('sOB',['O','B']),('sAB',['A','B']),('sOC',['O','C']),('sOD',['O','D'])]]

class RegionColorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.marks={'regions':[sector_row('rA','BLUE','A','B'),sector_row('rB','BLUE','C','D')],'equalAreas':[['rA','rB']]}
        cls.result=build(rf.spec_of([sector('rA','BLUE','A','B'),sector('rB','BLUE','C','D')]));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':{k:list(v) for k,v in rf.POINTS.items()},'marks':marks if marks is not None else self.marks,'segments':SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]
    def tag(self,svg,identifier):return re.search(r'<path\s(?:[^>]*\s)?id="'+identifier+r'"[^>]*/>',svg).group(0)

    def test_the_engine_draws_a_palette_tint_with_fill_opacity_and_the_grays_unchanged(self):
        tag=self.tag(self.svg,'rA');self.assertIn('fill="#7fa6e8"',tag);self.assertIn('fill-opacity="0.32"',tag)
        gray=build(rf.spec_of([rf.SECTOR_REGION]))['svg'];tag=self.tag(gray,'rg2');self.assertIn('fill="#c7ccd5"',tag);self.assertNotIn('fill-opacity',tag)
    def test_unknown_colour_is_refused(self):
        with self.assertRaises(ValueError) as caught:validate(rf.spec_of([sector('rA','TEAL','A','B')]))
        self.assertEqual(str(caught.exception).split(':')[0],'REGION_FILL_UNSUPPORTED')
    def test_genuine_equal_areas_pass_and_the_exact_area_is_reported(self):
        report=self.audit();self.assertEqual(report['errors'],[])
        row=next(r for r in report['observations'] if r.get('type')=='EQUAL_AREA')
        self.assertAlmostEqual(row['area'],25*math.pi/3,places=9)
        if row['exact'] is not None:self.assertEqual(row['exact'].replace(' ',''),'25*pi/3')
    def test_regions_of_different_area_cannot_be_one_group(self):
        marks=clone(self.marks);marks['regions'][1]=sector_row('rB','BLUE','C','O') if False else {'id':'rB','fill':'BLUE','shapes':[{'polygon':['O','C','D']}]}
        self.assertIn('REGION_EQUAL_AREA_MISMATCH',self.codes(marks=marks))
    def test_tamper_colour_of_one_region_of_the_group(self):
        other=self.svg.replace(self.tag(self.svg,'rB'),self.tag(self.svg,'rB').replace('#7fa6e8','#f2a65a'))
        codes=self.codes(svg=other);self.assertIn('REGION_FILL_MISMATCH',codes);self.assertIn('REGION_EQUAL_AREA_COLOR_MISMATCH',codes)
    def test_tamper_opacity_changed(self):
        other=self.svg.replace(self.tag(self.svg,'rA'),self.tag(self.svg,'rA').replace('fill-opacity="0.32"','fill-opacity="0.9"'))
        self.assertIn('REGION_FILL_MISMATCH',self.codes(svg=other))
    def test_plan_names_a_colour_the_drawing_does_not_have(self):
        marks=clone(self.marks);marks['regions'][0]['fill']='WARM';marks['regions'][1]['fill']='WARM'
        codes=self.codes(marks=marks);self.assertIn('REGION_FILL_MISMATCH',codes)
    def test_a_group_colour_used_by_a_region_outside_the_group_is_ambiguous(self):
        regions_=[sector('rA','BLUE','A','B'),sector('rB','BLUE','C','D'),sector('rC','BLUE','B','C')]
        built=build(rf.spec_of(regions_));marks={'regions':[*self.marks['regions'],sector_row('rC','BLUE','B','C')],'equalAreas':self.marks['equalAreas']}
        report=OBSERVER.audit({'svg':built['svg'],'points':{k:list(v) for k,v in rf.POINTS.items()},'marks':marks,'segments':SEGMENTS,'transform':built['witness']['coordinateModel']})
        self.assertIn('REGION_COLOR_GROUP_AMBIGUOUS',[e.split(':')[0] for e in report['errors']])
    def test_unknown_region_in_a_group(self):
        marks=clone(self.marks);marks['equalAreas']=[['rA','rZ']]
        self.assertIn('REGION_EQUAL_AREA_UNKNOWN_REGION',self.codes(marks=marks))
    def test_gray_regions_cannot_form_a_group(self):
        gray=build(rf.spec_of([sector('rA','LIGHT','A','B'),sector('rB','LIGHT','C','D')]))
        marks={'regions':[sector_row('rA','LIGHT','A','B'),sector_row('rB','LIGHT','C','D')],'equalAreas':[['rA','rB']]}
        report=OBSERVER.audit({'svg':gray['svg'],'points':{k:list(v) for k,v in rf.POINTS.items()},'marks':marks,'segments':SEGMENTS,'transform':gray['witness']['coordinateModel']})
        self.assertIn('REGION_EQUAL_AREA_COLOR_MISMATCH',[e.split(':')[0] for e in report['errors']])
    def test_exact_area_helper_handles_holes_and_whole_circles(self):
        peer={k:v for k,v in rf.POINTS.items()}
        row={'id':'r','shapes':[{'sector':{'center':'O','from':'A','to':'B'}}],'holes':[{'polygon':['O','A','B']}]}
        expected=25*math.pi/3-0.5*25*math.sin(math.radians(120))
        self.assertAlmostEqual(regions.region_area(row,lambda pid:peer[pid]),expected,places=9)
        circle={'id':'c','shapes':[{'loop':{'start':'A','steps':[{'to':'A','arc':{'center':'O','side':'FULL'}}]}}]}
        self.assertAlmostEqual(regions.region_area(circle,lambda pid:peer[pid]),25*math.pi,places=9)

class GraphRegionColorTests(unittest.TestCase):
    """graphPlan.regions[].fill takes the same names; the observer reads the colour and the opacity back from the model SVG."""
    def plan(self,fill):
        plan=clone(gr.PARABOLA);plan['regions'][0]['fill']=fill;return plan
    def test_palette_fill_is_drawn_translucent_and_read_back(self):
        graph_plan,out,report=gr.model_audit(self.plan('WARM'))
        self.assertEqual(report['errors'] if 'errors' in report else [],[])
        tag=gr.region_path(out['svg'],'region-S1');self.assertIn('fill="#f2a65a"',tag);self.assertIn('fill-opacity="0.42"',tag)
    def test_gray_graph_region_is_unchanged(self):
        _,out,_=gr.model_audit(self.plan('LIGHT'));tag=gr.region_path(out['svg'],'region-S1');self.assertIn('fill="#e4e7ec"',tag);self.assertNotIn('fill-opacity',tag)
    def test_tamper_colour_and_opacity(self):
        graph_plan,out=gr.framed(self.plan('WARM'))
        tag=gr.region_path(out['svg'],'region-S1')
        for svg in (out['svg'].replace(tag,tag.replace('#f2a65a','#6fcf97')),out['svg'].replace(tag,tag.replace(' fill-opacity="0.42"',''))):
            errors=gr.audit(graph_plan,svg,out['transform']);errors=errors['errors'] if isinstance(errors,dict) else errors
            self.assertTrue(any(str(e).startswith('GRAPH_REGION_FILL_MISMATCH') for e in errors),errors)
    def test_unknown_fill_is_still_refused(self):
        self.assertTrue((gr.refused(self.plan('TEAL')) or '').startswith('GRAPH_REGION_FILL_UNSUPPORTED:S1'))

if __name__=='__main__':unittest.main()
