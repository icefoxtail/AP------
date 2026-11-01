"""G12: graph callouts (a label pulled out on a leader from its dot), requiredPoints marker NONE, colour groups (overlay lines, segments, polygons, curves), fraction segment
lengths, a coordinate-pair display name and the discontinuous curve name place / axis variable. Framing checks run without Chrome; the observer is checked on stored final
figures (g12-fixtures/*.json: plan = framed graphPlan, svg = composed figure, transform = observer frame) with tamper cases that must fail. No Chrome here."""
import copy
import json
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

import sympy as S

TESTS=Path(__file__).resolve().parent
sys.path.insert(0,str(TESTS.parent/'production'))
sys.path.insert(0,str(TESTS.parent))
from graph_framing import fit_overview,_overlay_length_row
from graph_observer import audit,_ov_length_codes,GRAPH_COLOR_LINES,GRAPH_COLOR_LINE_WIDTH
from visual_engine.palette import PALETTE,COLORED_SEGMENT_WIDTH

FIXTURES=TESTS/'g12-fixtures'
CUBIC={'family':'piecewise-polynomial','pieces':[{'coefficients':['3','-2','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},'axisTickValues':{'x':[],'y':[]},
       'requiredPoints':[{'id':'M','x':'-sqrt(6)/3','y':'3+4*sqrt(6)/9'},{'id':'N','x':'sqrt(6)/3','y':'3-4*sqrt(6)/9'}],'coordinateBand':{'hide':['M','N']},
       'overlays':{'lines':[{'id':'t1','slope':'1','intercept':'1'}],'points':[{'id':'A','curveX':'1','unnamed':True,'coordinates':True}]}}
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def with_overlays(**fields):
    plan=copy.deepcopy(CUBIC);plan['overlays'].update(fields);return plan
def fixture(name):
    data=json.loads((FIXTURES/(name+'.json')).read_text(encoding='utf-8'));return data['plan'],data['svg'],data['transform']
def edit(svg,change):
    root=ET.fromstring(svg);change(root);return ET.tostring(root,encoding='unicode')
def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)

class Framing(unittest.TestCase):
    def test_a_callout_names_an_overlay_point_or_a_drawn_required_point(self):
        plan=with_overlays(callouts=[{'id':'c1','point':'A','text':'f(1)','direction':'W'},{'id':'c2','point':'M','text':'극대'}])
        plan['requiredPoints'][1]['marker']='NONE'
        rows={row['id']:row for row in fit_overview(plan)['graphPlan']['overlaysFeatures']['callouts']}
        self.assertEqual((rows['c1']['dot'],rows['c1']['labelKind'],rows['c1']['direction']),('A','MATH','W'))
        self.assertEqual((rows['c2']['dot'],rows['c2']['labelKind'],'direction' in rows['c2']),('required-point-1','TEXT',False))
        self.assertAlmostEqual(rows['c2']['at'][0],-6**.5/3,places=9)
    def test_a_bad_callout_is_refused_with_its_code(self):
        bad=lambda *entries:refused(with_overlays(callouts=list(entries)))
        self.assertEqual(bad({'id':'c','point':'Z','text':'a'}),'OVERLAY_CALLOUT_POINT_UNKNOWN:c')
        self.assertEqual(bad({'id':'c','point':'A','text':'a','direction':'UP'}),'OVERLAY_CALLOUT_DIRECTION_INVALID:c')
        self.assertEqual(bad({'id':'c','point':'A','text':'x'*13}),'OVERLAY_CALLOUT_TEXT_INVALID:c')
        self.assertEqual(bad({'id':'c','point':'A','text':'극대극대극대극대극대극'}),'OVERLAY_CALLOUT_TEXT_INVALID:c')
        self.assertEqual(bad({'id':'c','point':'A','text':'a','extra':1}),'OVERLAY_CALLOUT_INVALID:c')
        self.assertEqual(bad({'id':'c','point':'A','text':'a'},{'id':'c','point':'A','text':'b'}),'OVERLAY_ID_DUPLICATE:callout:c')
        hidden=with_overlays(callouts=[{'id':'c','point':'N','text':'극소'}]);hidden['requiredPoints'][1]['marker']='NONE'
        self.assertEqual(refused(hidden),'OVERLAY_CALLOUT_POINT_HIDDEN:c')
        self.assertEqual(refused(with_overlays(callouts=[{'id':str(i),'point':'A','text':'a'} for i in range(5)])),'OVERLAY_TOO_MANY:callouts')
    def test_marker_none_is_only_none_and_is_kept_by_the_framing(self):
        plan=copy.deepcopy(CUBIC);plan['requiredPoints'][0]['marker']='NONE'
        rows=fit_overview(plan)['graphPlan']['requiredPoints']
        self.assertEqual(rows[0].get('marker'),'NONE');self.assertNotIn('marker',rows[1])
        plan['requiredPoints'][0]['marker']='DOT'
        self.assertEqual(refused(plan),'REQUIRED_POINT_MARKER_INVALID:M')
    def test_colours_are_palette_names_and_a_segment_colour_needs_a_solid_segment(self):
        plan=with_overlays(lines=[{'id':'t1','slope':'1','intercept':'1','color':'WARM'}])
        self.assertEqual(fit_overview(plan)['graphPlan']['overlaysFeatures']['lines'][0]['color'],'WARM')
        self.assertEqual(refused(with_overlays(lines=[{'id':'t1','slope':'1','intercept':'1','color':'RED'}])),'OVERLAY_COLOR_INVALID:t1')
        points=[{'id':'A','curveX':'1','unnamed':True},{'id':'B','curveX':'-1','unnamed':True},{'id':'C','x':'0','y':'0','unnamed':True}]
        plan=with_overlays(points=points,segments=[{'id':'s','from':'A','to':'B','color':'BLUE'}],polygons=[{'id':'T','points':['A','B','C'],'fill':'VIOLET'}])
        features=fit_overview(plan)['graphPlan']['overlaysFeatures'];self.assertEqual((features['segments'][0]['color'],features['polygons'][0]['fill']),('BLUE','VIOLET'))
        plan['overlays']['segments'][0]['dashed']=True;self.assertEqual(refused(plan),'OVERLAY_COLOR_INVALID:s')
        plan['overlays']['segments'][0].update(dashed=False,color='ORANGE');self.assertEqual(refused(plan),'OVERLAY_COLOR_INVALID:s')
        plan['overlays']['segments'][0].pop('color');plan['overlays']['polygons'][0]['fill']='PINK';self.assertEqual(refused(plan),'OVERLAY_FILL_INVALID:T')
    def test_a_curve_colour_is_checked(self):
        plan=copy.deepcopy(CUBIC);plan['curveColor']='GREEN'
        self.assertEqual(fit_overview(plan)['graphPlan']['curveColor'],'GREEN')
        plan['curveColor']='TEAL';self.assertEqual(refused(plan),'OVERLAY_COLOR_INVALID:curveColor')
    def test_a_fraction_length_is_written_as_a_fraction(self):
        self.assertEqual(_overlay_length_row(S.Rational(3,2),'s'),{'text':'3/2','value':1.5})
        self.assertEqual(_overlay_length_row(S.Rational(9,8),'s')['text'],'9/8')
        self.assertEqual(_overlay_length_row(S.Integer(4),'s')['text'],'4')
        self.assertEqual(_overlay_length_row(2*S.sqrt(5),'s')['text'],'2*sqrt(5)')
        with self.assertRaises(ValueError) as caught:_overlay_length_row(S.pi,'s')
        self.assertEqual(str(caught.exception),'OVERLAY_SEGMENT_LENGTH_UNSUPPORTED:s')
        self.assertEqual(_ov_length_codes(S.Rational(3,2)),['33','32']);self.assertEqual(_ov_length_codes(S.Rational(9,8)),['39','38'])
        self.assertEqual(_ov_length_codes(2*S.sqrt(5)),['32','221A','35'])
    def test_a_discontinuous_name_place_and_axis_variable_are_checked(self):
        base={'family':'piecewise-discontinuous','functionName':'g','pieces':[{'coefficients':['2'],'domain':[None,-2],'end':'OPEN'},{'coefficients':['1'],'domain':[-2,None],'start':'OPEN'}],'jumpValues':[{'x':'-2','y':'1'}],'requiredPoints':[],'axisTickValues':{'x':[-2],'y':[1,2]}}
        good=fit_overview({**copy.deepcopy(base),'nameLabel':{'at':'END','side':'ABOVE'},'axisVariable':'m'})['graphPlan']
        self.assertEqual((good['nameLabel'],good['axisVariable']),({'at':'END','side':'ABOVE'},'m'))
        for field,value,code in (('nameLabel',{'at':'MIDDLE'},'CURVE_NAME_LABEL_INVALID'),('nameLabel',{'at':'END','side':'LEFT'},'CURVE_NAME_LABEL_INVALID'),('nameLabel',{'at':'END','x':1},'CURVE_NAME_LABEL_INVALID'),
                                  ('axisVariable','y','INVALID_AXIS_VARIABLE'),('axisVariable','g','INVALID_AXIS_VARIABLE'),('axisVariable','mm','INVALID_AXIS_VARIABLE'),('curveColor','TEAL','OVERLAY_COLOR_INVALID:curveColor')):
            self.assertEqual(refused({**copy.deepcopy(base),field:value}),code,field)
        self.assertEqual(refused({k:v for k,v in {**copy.deepcopy(base),'nameLabel':{'at':'END'}}.items() if k!='functionName'}),'CURVE_NAME_LABEL_INVALID')

class Palette(unittest.TestCase):
    def test_the_observer_table_is_the_engine_table(self):
        self.assertEqual(GRAPH_COLOR_LINES,{name:row['line'] for name,row in PALETTE.items()})
        self.assertEqual(GRAPH_COLOR_LINE_WIDTH,COLORED_SEGMENT_WIDTH)

class Fixtures(unittest.TestCase):
    def errors(self,name,plan=None,svg=None):
        fixed_plan,fixed_svg,transform=fixture(name);return audit(plan or fixed_plan,svg or fixed_svg,transform)['errors']
    def test_every_stored_figure_is_clean(self):
        for name in ('callouts-hidden-marker','colors','shared-callouts-name','axis-variable','fraction-lengths','asymptote-label'):
            self.assertEqual(self.errors(name),[],name)

class Callouts(unittest.TestCase):
    name='callouts-hidden-marker'
    def errors(self,plan=None,change=None):
        fixed_plan,svg,transform=fixture(self.name)
        if change:svg=edit(svg,change)
        return audit(plan or fixed_plan,svg,transform)['errors']
    def test_the_figure_has_its_leaders_and_no_extremum_dots(self):
        plan,svg,_=fixture(self.name)
        self.assertEqual(len(re.findall(r'data-owner-label="overlay-callout-',svg)),2);self.assertNotIn('id="required-point-',svg)
        self.assertEqual(sorted(row['id'] for row in plan['overlays']['callouts']),['ta','tb'])
    def test_a_missing_leader_is_named(self):
        def drop(root):
            for parent in root.iter():
                for child in list(parent):
                    if child.get('id')=='overlay-callout-ta-owner-leader':parent.remove(child)
        self.assertIn('OVERLAY_CALLOUT_LEADER_MISSING:ta',self.errors(change=drop))
    def test_a_leader_that_leaves_its_dot_or_misses_its_label_is_named(self):
        def start(root):
            leader=node(root,'overlay-callout-ta-owner-leader');leader.set('x1',str(float(leader.get('x1'))+20))
        self.assertIn('OVERLAY_CALLOUT_LEADER_NOT_ON_OWNER:ta',self.errors(change=start))
        def end(root):
            leader=node(root,'overlay-callout-tb-owner-leader');leader.set('y2',str(float(leader.get('y2'))-25))
        self.assertIn('OVERLAY_CALLOUT_LEADER_NOT_ON_LABEL:tb',self.errors(change=end))
    def test_a_leader_across_another_stroke_is_named(self):
        def cross(root):
            leader=node(root,'overlay-callout-ta-owner-leader');dot=node(root,'A')
            leader.set('x2',str(float(dot.get('cx'))-300));leader.set('y2',dot.get('cy'))     # straight left through the curve
        self.assertIn('OVERLAY_CALLOUT_LEADER_CROSSES_STROKE:ta',self.errors(change=cross))
    def test_a_label_text_that_is_not_the_plans_is_named(self):
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['callouts'][0]['text']='극대'
        self.assertIn('OVERLAY_CALLOUT_TEXT_MISMATCH:ta',self.errors(plan=plan))
    def test_a_label_of_another_owner_is_named(self):
        def swap(root):node(root,'overlay-callout-ta').set('data-owner','B')
        self.assertIn('OVERLAY_CALLOUT_OWNER_MISMATCH:ta',self.errors(change=swap))
    def test_a_callout_the_plan_does_not_declare_is_undeclared(self):
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['callouts']=plan['overlays']['callouts'][:1]
        self.assertTrue(any(error.startswith('OVERLAY_UNDECLARED:overlay-callout-tb') for error in self.errors(plan=plan)),self.errors(plan=plan))
    def test_a_hidden_key_point_that_is_drawn_is_named(self):
        def draw(root):
            dot=node(root,'A');extra=ET.SubElement(root,'circle');extra.set('id','required-point-1');extra.set('cx',dot.get('cx'));extra.set('cy',dot.get('cy'));extra.set('r','3.2');extra.set('data-role','point')
        self.assertIn('PIECEWISE_POLY_KEY_POINT_MARKER_SHOWN:M',self.errors(change=draw))
    def test_a_key_point_that_the_plan_draws_must_be_drawn(self):
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['requiredPoints'][0].pop('marker')
        self.assertIn('PIECEWISE_POLY_KEY_POINT_DOT_MISSING:M',self.errors(plan=plan))

class Colours(unittest.TestCase):
    name='colors'
    def errors(self,plan=None,change=None):
        fixed_plan,svg,transform=fixture(self.name)
        if change:svg=edit(svg,change)
        return audit(plan or fixed_plan,svg,transform)['errors']
    def test_the_figure_wears_the_declared_colours(self):
        plan,svg,_=fixture(self.name);root=ET.fromstring(svg)
        self.assertEqual(node(root,'overlay-line-M1').get('stroke'),PALETTE['BLUE']['line']);self.assertEqual(node(root,'overlay-polygon-T2-fill').get('fill'),PALETTE['WARM']['fill'])
        self.assertEqual(node(root,'f-piece-1-branch-0').get('stroke'),PALETTE['GREEN']['line']);self.assertEqual(node(root,'overlay-line-L').get('stroke'),'#111')
    def test_a_line_in_another_colour_is_named(self):
        self.assertIn('OVERLAY_COLOR_MISMATCH:M1',self.errors(change=lambda root:node(root,'overlay-line-M1').set('stroke',PALETTE['WARM']['line'])))
    def test_a_coloured_line_with_the_plain_width_is_named(self):
        self.assertIn('OVERLAY_COLOR_MISMATCH:M2',self.errors(change=lambda root:node(root,'overlay-line-M2').set('stroke-width','1.6')))
    def test_a_colour_the_plan_did_not_declare_is_named(self):
        self.assertIn('OVERLAY_COLOR_MISMATCH:L',self.errors(change=lambda root:node(root,'overlay-line-L').set('stroke',PALETTE['ROSE']['line'])))
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['lines'][1].pop('color')
        self.assertIn('OVERLAY_COLOR_MISMATCH:M1',self.errors(plan=plan))
    def test_a_polygon_tint_opacity_and_outline_are_read_back(self):
        self.assertIn('OVERLAY_COLOR_MISMATCH:T1',self.errors(change=lambda root:node(root,'overlay-polygon-T1-fill').set('fill',PALETTE['WARM']['fill'])))
        self.assertIn('OVERLAY_COLOR_MISMATCH:T1',self.errors(change=lambda root:node(root,'overlay-polygon-T1-fill').set('fill-opacity','0.9')))
        self.assertIn('OVERLAY_COLOR_MISMATCH:T2',self.errors(change=lambda root:node(root,'overlay-polygon-T2').set('stroke','#111')))
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['overlays']['polygons'][0]['fill']='LIGHT'
        self.assertIn('OVERLAY_COLOR_MISMATCH:T1',self.errors(plan=plan))
    def test_a_curve_in_another_colour_is_named(self):
        self.assertIn('OVERLAY_COLOR_MISMATCH:PIECE_1',self.errors(change=lambda root:node(root,'f-piece-1-branch-0').set('stroke','#111')))
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan.pop('curveColor')
        self.assertIn('OVERLAY_COLOR_MISMATCH:PIECE_1',self.errors(plan=plan))
        plan['curveColor']='TEAL';result=audit(plan,fixture(self.name)[1],fixture(self.name)[2])
        self.assertIn('OVERLAY_COLOR_INVALID:curveColor',result['errors'])

class SharedAndNames(unittest.TestCase):
    def errors(self,name,plan=None,change=None):
        fixed_plan,svg,transform=fixture(name)
        if change:svg=edit(svg,change)
        return audit(plan or fixed_plan,svg,transform)['errors']
    def test_the_curve_name_stands_where_the_plan_says(self):
        plan,_,_=fixture('shared-callouts-name');self.assertEqual(plan['nameLabel'],{'at':'END','side':'BELOW'})
        for other in ('START','MID'):
            moved=copy.deepcopy(plan);moved['nameLabel']['at']=other
            self.assertIn('CURVE_NAME_LABEL_NOT_AT_PLACE:main-curve-name',self.errors('shared-callouts-name',plan=moved),other)
        moved=copy.deepcopy(plan);moved['nameLabel']['side']='ABOVE'
        self.assertIn('CURVE_NAME_LABEL_NOT_AT_PLACE:main-curve-name',self.errors('shared-callouts-name',plan=moved))
    def test_a_callout_on_an_axis_dot_has_its_leader(self):
        plan,svg,_=fixture('shared-callouts-name')
        self.assertEqual(sorted(row['id'] for row in plan['overlays']['callouts']),['cf','cl']);self.assertIn('overlay-callout-cf-owner-leader',svg)
        def move(root):
            label=node(root,'overlay-callout-cl');label.set('transform','translate(5,5)')
        self.assertTrue(self.errors('shared-callouts-name',change=move))
    def test_the_axis_letter_and_the_name_follow_the_variable(self):
        plan,svg,_=fixture('axis-variable');self.assertEqual(plan['axisVariable'],'m')
        other=copy.deepcopy(plan);other['axisVariable']='t'
        errors=self.errors('axis-variable',plan=other)
        self.assertIn('AXIS_VARIABLE_LABEL_MISMATCH',errors);self.assertIn('AXIS_VARIABLE_NAME_MISMATCH:g',errors)
    def test_a_fraction_length_is_read_back_digit_by_digit(self):
        plan,svg,_=fixture('fraction-lengths')
        self.assertEqual([row['text'] for row in (s['length'] for s in plan['overlaysFeatures']['segments'])],['3/2','9/8'])
        def tamper(root):
            for child in node(root,'overlay-segment-CA-length').iter():
                if child.get('data-c')=='39':child.set('data-c','35')              # 9/8 now reads 5/8
        self.assertTrue(any(error.startswith('OVERLAY_SEGMENT_LENGTH_LABEL_TEXT_MISMATCH:CA') for error in self.errors('fraction-lengths',change=tamper)),self.errors('fraction-lengths',change=tamper))

RATIONAL={'family':'rational','numerator':['0','6'],'denominator':['-2','3'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-6,10],'viewport':[-6,10,-4,8],'axisTickValues':{'x':[],'y':[]}}
class AsymptoteLabel(unittest.TestCase):
    name='asymptote-label'
    def errors(self,plan=None,change=None):
        fixed_plan,svg,transform=fixture(self.name)
        if change:svg=edit(svg,change)
        return audit(plan or fixed_plan,svg,transform)['errors']
    def test_the_field_is_checked(self):
        self.assertEqual(fit_overview({**copy.deepcopy(RATIONAL),'asymptoteLabelAt':'END'})['graphPlan']['asymptoteLabelAt'],'END')
        self.assertEqual(refused({**copy.deepcopy(RATIONAL),'asymptoteLabelAt':'MIDDLE'}),'ASYMPTOTE_LABEL_AT_INVALID')
        self.assertEqual(refused({**copy.deepcopy(RATIONAL),'numerator':['6','0'],'asymptoteLabelAt':'END'}),'ASYMPTOTE_LABEL_AT_UNSUPPORTED')
    def test_the_label_stands_under_the_dashed_line_at_its_right_end(self):
        plan,svg,transform=fixture(self.name);root=ET.fromstring(svg)
        label=node(root,'horizontal-asymptote-label');line=node(root,'rational-asymptote-horizontal')
        match=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',label.get('transform'))
        self.assertGreater(float(match.group(2)),float(line.get('y1')))                 # below the line (screen y grows downwards): the curve is above it at the right end
        self.assertGreater(float(match.group(1)),transform['originX']+transform['sx']*3)   # the right half
    def test_a_label_moved_to_the_other_end_is_named(self):
        plan,_,_=fixture(self.name);plan=copy.deepcopy(plan);plan['asymptoteLabelAt']='START'
        self.assertIn('ASYMPTOTE_LABEL_NOT_AT_END',self.errors(plan=plan))
    def test_a_label_on_the_curve_side_is_named(self):
        def lift(root):
            label=node(root,'horizontal-asymptote-label');match=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',label.get('transform'))
            label.set('transform','translate(%s,%s)'%(match.group(1),float(match.group(2))-45))
        self.assertIn('ASYMPTOTE_LABEL_ON_CURVE_SIDE',self.errors(change=lift))

if __name__=='__main__':unittest.main()
