"""Graph shaded regions (graphPlan.regions): exact boundary framing, the model-stage fill, the final engine path and the independent observer.
No Chrome here: the composed publication SVG is covered by tests/graph-regions.test.mjs; this file reads the runPhase2 model SVG and the
visual_engine build output directly."""
import copy
import re
from fractions import Fraction
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview,piecewise_polynomial_source,piecewise_reference_curves
from graph_spike import produce
from graph_observer import audit,graph_region_audit
from visual_engine.engine import build

PARABOLA={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'breakpoints':[],
    'sourceDomain':{'kind':'INTERVAL','range':['-2','2'],'states':['CLOSED','CLOSED']},'formula':'x^2',
    'requiredPoints':[{'id':'O','x':0,'y':0}],'axisTickValues':{'x':[],'y':[]},
    'regions':[{'id':'S1','upper':'f','lower':'axis','from':'1/5','to':'1','fill':'LIGHT','label':'S_1'}]}
ABS_QUAD={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','-4','1']},{'coefficients':['0','4','-1']},{'coefficients':['0','-4','1']}],
    'breakpoints':[{'x':'0','y':'0'},{'x':'4','y':'0'}],'sourceDomain':{'kind':'INTERVAL','range':['-1','5'],'states':['CLOSED','CLOSED']},'formula':'abs(x^2-4x)',
    'referenceLines':[{'id':'a','y':'2','intersectionX':['2-sqrt(6)','2-sqrt(2)','2+sqrt(2)','2+sqrt(6)']}],
    'requiredPoints':[{'id':'O','x':0,'y':0},{'id':'M','x':2,'y':4},{'id':'P','x':4,'y':0}],'axisTickValues':{'x':[],'y':[]},
    'regions':[{'id':'S1','upper':'f','lower':'a','from':'2-sqrt(2)','to':'2','fill':'MEDIUM','label':'S_1'}]}
CURVES={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},'formula':'x^2',
    'referenceCurves':[{'id':'g','coefficients':['2','0','-1'],'intersectionX':['-1','1']}],
    'requiredPoints':[{'id':'A','x':0,'y':0},{'id':'B','x':0,'y':2}],'exactCoordinates':{'A':['0','0'],'B':['0','2']},
    'axisTickValues':{'x':[],'y':[]},
    'regions':[{'id':'S1','upper':'g','lower':'f','from':'-1','to':'1','fill':'LIGHT','label':'S'}]}


def refused(plan):
    try:fit_overview(plan)
    except ValueError as error:return str(error)
    return None


def framed(plan):
    graph_plan=fit_overview(plan)['graphPlan'];out=produce(graph_plan)
    return graph_plan,out


def model_audit(plan):
    graph_plan,out=framed(plan);return graph_plan,out,audit(graph_plan,out['svg'],out['transform'])


def region_path(svg,identifier):
    return re.search(r'<path\s(?:[^>]*\s)?id="'+identifier+r'"[^>]*/>',svg).group(0)


def redraw(svg,identifier,change):
    tag=region_path(svg,identifier);d=re.search(r'\sd="([^"]*)"',tag)
    return svg.replace(tag,tag.replace(d.group(0),' d="'+change(d.group(1))+'"'))


def engine_spec(graph_plan):
    features=graph_plan['piecewisePolynomialFeatures'];v=graph_plan['viewport']
    objects=[{'id':'f-piece-'+str(index),'kind':'FUNCTION_GRAPH','expression':piece_expression(piece),'domain':piece['drawInterval'],
              'criticalX':[point['x'] for point in graph_plan.get('requiredPoints',[])],'branch':'PIECE_'+str(index)}
             for index,piece in enumerate(features['pieces'],1)]
    for region in features.get('regions',[]):
        objects.append({'id':'region-'+region['id'],'kind':'GRAPH_REGION','fill':region['fill'],'domain':region['domain'],
                        'upper':[{'expression':piece_expression({'coefficients':row['coefficients']}),'domain':[float(Fraction(row['interval'][0])),float(Fraction(row['interval'][1]))]} for row in region['upperRows']],
                        'lower':[{'expression':piece_expression({'coefficients':row['coefficients']}),'domain':[float(Fraction(row['interval'][0])),float(Fraction(row['interval'][1]))]} for row in region['lowerRows']],
                        **({'labelText':region['label']} if region.get('label') is not None else {})})
    return {'id':'graph-region-fixture','visualType':'function_graph',
            'viewport':{'xMin':v[0],'xMax':v[1],'yMin':v[2],'yMax':v[3],'width':512,'height':graph_plan['plotCanvas']['height']+144,'panel':0,'topInset':80,'equalUnits':True},
            'axes':True,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{'axisTickValues':{'x':[],'y':[]},'formulaPlacement':'HEADER_BAND'},'objects':objects}


def piece_expression(piece):
    terms=[]
    for index,value in enumerate(piece['coefficients']):
        if value=='0':continue
        if index==0:terms.append('('+value+')')
        elif index==1:terms.append('('+value+')*x')
        else:terms.append('('+value+')*x^'+str(index))
    return '+'.join(terms) or '0'




class Framing(unittest.TestCase):
    def test_boundary_rows_are_exact_and_clipped(self):
        graph_plan=fit_overview(PARABOLA)['graphPlan'];row=graph_plan['piecewisePolynomialFeatures']['regions'][0]
        self.assertEqual((row['id'],row['upper'],row['lower'],row['from'],row['to'],row['fill'],row['label']),('S1','f','axis','1/5','1','LIGHT','S_1'))
        self.assertEqual(row['upperRows'],[{'coefficients':['0','0','1'],'interval':['1/5','1']}])
        self.assertEqual(row['lowerRows'],[{'coefficients':['0','0','0'],'interval':['1/5','1']}])
    def test_a_region_between_two_curves_and_between_a_curve_and_a_line(self):
        line=fit_overview(ABS_QUAD)['graphPlan']['piecewisePolynomialFeatures']['regions'][0]
        self.assertEqual([row['coefficients'] for row in line['lowerRows']],[['2','0','0']])
        curves=fit_overview(CURVES)['graphPlan']['piecewisePolynomialFeatures']['regions'][0]
        self.assertEqual([row['coefficients'] for row in curves['upperRows']],[['2','0','-1']])
    def test_refusals(self):
        def with_region(**change):
            p=copy.deepcopy(PARABOLA);p['regions']=[{**p['regions'][0],**change}];return p
        cases=[
            (with_region(upper='h'),'GRAPH_REGION_BOUNDARY_UNKNOWN:S1:h'),
            (with_region(**{'from':'1','to':'1/5'}),'GRAPH_REGION_DOMAIN_INVALID:S1'),
            (with_region(fill='HATCH'),'GRAPH_REGION_FILL_UNSUPPORTED:S1'),
            (with_region(label='x'*41),'GRAPH_REGION_LABEL_INVALID:S1'),
            (with_region(id='1bad'),'GRAPH_REGION_ID_INVALID'),
            (with_region(**{'from':'-1','to':'1'}),'GRAPH_REGION_BOUNDARIES_CROSS:S1'),
        ]
        for plan,code in cases:
            with self.subTest(code=code):self.assertTrue((refused(plan) or '').startswith(code),refused(plan))
        p=copy.deepcopy(PARABOLA);p['regions'].append(copy.deepcopy(p['regions'][0]))
        self.assertTrue((refused(p) or '').startswith('GRAPH_REGION_ID_DUPLICATE:S1'))
        p=copy.deepcopy(PARABOLA);p['regions'][0]['vertical']=True
        self.assertTrue((refused(p) or '').startswith('GRAPH_REGION_FIELD_UNKNOWN:vertical'))
        p=copy.deepcopy(PARABOLA);p['regions']=[]
        self.assertTrue(refused(p) is None)
        self.assertTrue((refused({'family':'polynomial','regions':[]}) or '').startswith('GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL'))
        # A reference curve's own domain must cover the whole requested interval.
        p=copy.deepcopy(CURVES)
        p['referenceCurves']=[{'id':'g','pieces':[{'coefficients':['2','0','-1']}],'breakpoints':[],'sourceDomain':{'kind':'INTERVAL','range':['0','1'],'states':['CLOSED','CLOSED']},'intersectionX':['1']}]
        self.assertTrue((refused(p) or '').startswith('GRAPH_REGION_BOUNDARY_UNDEFINED:S1:g'))


class ModelStage(unittest.TestCase):
    def test_curve_axis_line_and_curve_curve_regions_pass_the_full_graph_audit(self):
        for plan in (PARABOLA,ABS_QUAD,CURVES):
            graph_plan,out,result=model_audit(plan)
            self.assertEqual(result['status'],'PASS',result['errors'])
            self.assertEqual([row['id'] for row in result['regions']],['S1'])
            self.assertEqual(result['regions'][0]['samples'],9)
    def test_fill_path_shape_and_order(self):
        graph_plan,out,result=model_audit(PARABOLA)
        self.assertEqual(result['status'],'PASS',result['errors'])
        tag=region_path(out['svg'],'region-S1')
        self.assertIn('fill-rule="evenodd"',tag);self.assertIn('stroke="none"',tag)
        self.assertIn('data-mark="graph-region"',tag)
        self.assertLess(out['svg'].index('id="region-S1"'),out['svg'].index('id="curve-piece-1"'))
    def test_tamper_moved_boundary_label_fill_and_order_fail(self):
        graph_plan,out,result=model_audit(PARABOLA)
        self.assertEqual(result['status'],'PASS',result['errors'])
        moved=redraw(out['svg'],'region-S1',lambda d:re.sub(r'L([-\d.]+),([-\d.]+)',lambda m:'L%s,%s'%(float(m.group(1)),float(m.group(2))-3),d))
        self.assertIn('GRAPH_REGION_BOUNDARY_MISMATCH:S1',audit(graph_plan,moved,out['transform'])['errors'])
        label=re.search(r'<text[^>]*id="region-S1-label"[^>]*>.*?</text>',out['svg'],re.S).group(0)
        no_label=out['svg'].replace(label,'')
        self.assertIn('GRAPH_REGION_LABEL_MISSING:S1',audit(graph_plan,no_label,out['transform'])['errors'])
        dragged=out['svg'].replace(label,re.sub(r'x="([-\d.]+)"','x="%s"' % (float(re.search(r'x="([-\d.]+)"',label).group(1))+40),label,count=1))
        self.assertIn('GRAPH_REGION_LABEL_OUTSIDE:S1',audit(graph_plan,dragged,out['transform'])['errors'])
        wrong_fill=out['svg'].replace(region_path(out['svg'],'region-S1'),region_path(out['svg'],'region-S1').replace('#e4e7ec','#c7ccd5'))
        self.assertIn('GRAPH_REGION_FILL_MISMATCH:S1',audit(graph_plan,wrong_fill,out['transform'])['errors'])
        missing=out['svg'].replace(region_path(out['svg'],'region-S1'),'')
        self.assertIn('GRAPH_REGION_MISSING:S1',audit(graph_plan,missing,out['transform'])['errors'])
        tag=region_path(out['svg'],'region-S1');raised=out['svg'].replace(tag,'').replace('</svg>',tag+'</svg>')
        self.assertIn('GRAPH_REGION_NOT_BENEATH_STROKES:S1',audit(graph_plan,raised,out['transform'])['errors'])
        shifted=redraw(out['svg'],'region-S1',lambda d:re.sub(r'M([-\d.]+),',lambda m:'M%s,'%(float(m.group(1))-6),d,count=1))
        self.assertIn('GRAPH_REGION_OUTSIDE_INTERVAL:S1',audit(graph_plan,shifted,out['transform'])['errors'])
    def test_undeclared_and_overlap(self):
        graph_plan,out,result=model_audit(PARABOLA)
        fewer=copy.deepcopy(graph_plan);fewer['regions']=[];fewer['piecewisePolynomialFeatures']['regions']=[]
        self.assertIn('GRAPH_REGION_UNDECLARED:region-S1',audit(fewer,out['svg'],out['transform'])['errors'])
        overlap=copy.deepcopy(PARABOLA);overlap['regions'].append({'id':'S2','upper':'f','lower':'axis','from':'1/4','to':'3/4','fill':'MEDIUM'})
        plan2,out2,result2=model_audit(overlap)
        self.assertIn('GRAPH_REGION_OVERLAP:S1:S2',result2['errors'])


class EnginePath(unittest.TestCase):
    def test_engine_fill_path_passes_the_region_observer(self):
        graph_plan=framed(PARABOLA)[0];spec=engine_spec(graph_plan)
        pieces,breaks,source,intervals=piecewise_polynomial_source(PARABOLA)
        refs=piecewise_reference_curves(PARABOLA,pieces,breaks,source,intervals)
        result=build(spec);errors,observations=graph_region_audit(graph_plan,result['svg'],{**result['witness']['coordinateModel'],'displayScale':1},pieces,intervals,refs,graph_plan['piecewisePolynomialFeatures'],ET.fromstring(result['svg']))
        self.assertEqual(errors,[])
        self.assertEqual([row['id'] for row in observations],['S1'])
        self.assertEqual(len([node for node in ET.fromstring(result['svg']).iter() if node.get('id')=='region-S1']),1)
    def test_engine_tamper_fails(self):
        graph_plan=framed(PARABOLA)[0];result=build(engine_spec(graph_plan))
        pieces,breaks,source,intervals=piecewise_polynomial_source(PARABOLA)
        refs=piecewise_reference_curves(PARABOLA,pieces,breaks,source,intervals)
        transform={**result['witness']['coordinateModel'],'displayScale':1}
        tag=region_path(result['svg'],'region-S1');raised=result['svg'].replace(tag,'').replace('</svg>',tag+'</svg>')
        errors,_=graph_region_audit(graph_plan,raised,transform,pieces,intervals,refs,graph_plan['piecewisePolynomialFeatures'],ET.fromstring(raised))
        self.assertIn('GRAPH_REGION_NOT_BENEATH_STROKES:S1',errors)
        moved=redraw(result['svg'],'region-S1',lambda d:re.sub(r'L([-\d.]+) ([-\d.]+)',lambda m:'L%s %s'%(float(m.group(1)),float(m.group(2))-4),d))
        errors,_=graph_region_audit(graph_plan,moved,transform,pieces,intervals,refs,graph_plan['piecewisePolynomialFeatures'],ET.fromstring(moved))
        self.assertIn('GRAPH_REGION_BOUNDARY_MISMATCH:S1',errors)


if __name__=='__main__':unittest.main()
