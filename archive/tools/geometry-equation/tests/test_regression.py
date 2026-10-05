import sys,unittest,math,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.semantic_model import validate
from visual_engine.math_expression import parse,serialize
from visual_engine.differential import value_derivative
from visual_engine.engine import build
from visual_engine.function_sampling import sample
from visual_engine.viewport import Viewport
from test_engine import spec

class RegressionTests(unittest.TestCase):
    def test_graph_tangent_and_wrong_intercept(self):
        s=spec();s['visualType']='function_graph';s['objects']=[{'id':'g','kind':'FUNCTION_GRAPH','expression':'x^3-4x','domain':[-3,3]},{'id':'l','kind':'LINE','coefficients':[1,1,2]},{'id':'t','kind':'TANGENT','refs':['l','g'],'at':[1,-3]}]
        self.assertEqual(validate(s)['relations'][0]['status'],'PASS')
        s['objects'][1]['coefficients']=[1,1,3]
        with self.assertRaisesRegex(ValueError,'UNVERIFIED'):validate(s)
    def test_differential_families(self):
        pairs=[('x^4',2,32),('sin(x)',0,1),('cos(x)',0,0),('tan(x)',0,1),('log(x)',1,1),('exp(x)',0,1),('sqrt(x)',4,.25),('1/x',2,-.25)]
        for text,x,d in pairs:
            self.assertAlmostEqual(value_derivative(parse(text),x)[1],d)
    def test_nondifferentiable_fail_closed(self):
        with self.assertRaises(ValueError):value_derivative(parse('abs(x)'),0)
    def test_exact_fraction_svg_reduction(self):
        s=spec();s['objects']=[{'id':'P','kind':'POINT','at':[.5,-1.5]},{'id':'coord','kind':'COORDINATE_LABEL','target':'P','exact':['2/4','-3/2']}]
        r=build(s);self.assertIn('(1/2,−3/2)',r['svg'])
    def test_visible_hangul_math_multiline(self):
        s=spec();s['objects'].append({'id':'condition','kind':'CONDITION_BOX','at':[3,-2],'lines':['중심 C',{'text':'r=2','math':True}]})
        r=build(s);self.assertIn('중심 C',r['svg']);self.assertIn('data-math="true"',r['svg'])
    def test_bad_graph_aspect(self):
        s=spec();s['visualType']='function_graph'
        with self.assertRaisesRegex(ValueError,'EQUAL_UNITS'):build(s)
    def test_graph_no_finite_boolean_leak(self):
        r=sample('x<=2',[-2,2],Viewport(-2,2,-2,2,equal=False))
        self.assertEqual(r['branches'],[]);self.assertEqual(r['status'],'POLISH_REQUIRED')
    def test_source_decimal_label_rejection(self):
        s=spec();s['objects'][2]['exact']=['-1.0001','1']
        with self.assertRaises(ValueError):build(s)
    def test_header_id_collision_rejected(self):
        s=spec();s['objects'][0]['id']='visual-title';s['objects']=s['objects'][:1]
        with self.assertRaisesRegex(ValueError,'DUPLICATE'):build(s)
    def test_nested_math_scope(self):
        self.assertEqual(serialize(parse('x^2^3')),r'x^{2^{3}}')
        self.assertEqual(serialize(parse('x^2^3'),'svg').count('baseline-shift="super"'),2)
        self.assertEqual(serialize(parse("f''(x)")),r'f^{\prime\prime}(x)')
        self.assertEqual(serialize(parse('abs(x)')),r'\left|x\right|')
        self.assertEqual(serialize(parse('π')),r'\pi')
    def test_schema_unknown_field_and_missing_field(self):
        for mutation in ('unknown','missing'):
            s=spec()
            if mutation=='unknown':s['objects'][0]['bogus']=1
            else:del s['objects'][0]['at']
            with self.assertRaises(ValueError):validate(s)
    def test_special_registry_keeps_all_gates(self):
        from visual_engine.entrypoints import build_independent
        from visual_engine.engine import write_candidate
        s=spec();s['id']='special-regression';cfg={'engineVersion':'geometry-visual-v1','runId':'upgrade-v1','productionBaselinePolicy':'READ_ONLY','allowProductionWrite':False,'outputRoot':'archive/_generated/geometry-visual-engine/upgrade-v1/tests/generated'}
        write_candidate(s,cfg)
        fact={'independentFactHash':'frozen','visualSpec':s,'specialVisual':{'adapter':'HANDCRAFTED_SVG','path':'archive/_generated/geometry-visual-engine/upgrade-v1/tests/generated/candidate/special-regression/visual.svg'}}
        result=build_independent({},fact)
        self.assertEqual(result['witness']['classification'],'SPECIAL');self.assertFalse(result['witness']['publicationAuthorized']);self.assertEqual(len(result['witness']['requiredGates']),4)

if __name__=='__main__':unittest.main()
