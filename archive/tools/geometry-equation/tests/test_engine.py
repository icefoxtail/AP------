import sys,unittest,importlib.util
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.engine import build,output_root,write_candidate,ROOT
import hashlib
import xml.etree.ElementTree as ET
from visual_engine.entrypoints import build_independent

def spec():
    return {'id':'circle','title':'중심과 반지름','visualType':'line_circle_geometry','viewport':{'xMin':-4,'xMax':4,'yMin':-4,'yMax':4},'sourceFacts':{'independentFactHash':'frozen'},'derivedFacts':{},'displayFacts':{},'objects':[{'id':'C','kind':'POINT','at':[-1,1],'priority':0},{'id':'circle','kind':'CIRCLE','center':[-1,1],'radius':2},{'id':'C-coordinate','kind':'COORDINATE_LABEL','target':'C','exact':['-1','1']},{'id':'equation','kind':'EQUATION_LABEL','text':'(x+1)^2+(y-1)^2=2^2','at':[2,3]}]}

class EngineTests(unittest.TestCase):
    def test_pure_deterministic_build(self):
        a=build(spec());b=build(spec());self.assertEqual(a,b)
        self.assertEqual(a['witness']['authority'],'BUILD_SIDE_ONLY')
        self.assertEqual(a['witness']['status'],'POLISH_REQUIRED')
        self.assertIn('tick-x--2-label',a['witness']['layout']['unresolved'])
    def test_final_svg_serializes_tick_owner_and_unit_tick_metadata(self):
        s=spec();s['id']='tick-binding';s['visualType']='function_graph';s['viewport']={'xMin':-2,'xMax':2,'yMin':-2,'yMax':2};s['objects']=[{'id':'g','kind':'FUNCTION_GRAPH','expression':'x^3','domain':[-2,2]}]
        root=ET.fromstring(build(s)['svg']);labels=[node for node in root.iter() if node.get('data-label-kind')=='TICK_LABEL']
        self.assertTrue(labels)
        self.assertEqual(next(node for node in root.iter() if node.get('id')=='x-axis').get('data-axis'),'x')
        self.assertEqual(next(node for node in root.iter() if node.get('id')=='y-axis').get('data-axis'),'y')
        for label_node in labels:
            tick_id=label_node.get('data-tick-owner')
            self.assertEqual(label_node.get('data-owner'),tick_id)
            tick=next(node for node in root.iter() if node.get('id')==tick_id)
            self.assertEqual(tick.get('data-role'),'tick')
            self.assertEqual(tick.get('data-required-label-id'),label_node.get('id'))
            self.assertEqual(label_node.get('data-tick-axis'),tick.get('data-axis'))
            self.assertAlmostEqual(float(label_node.get('data-tick-value')),float(tick.get('data-value')))
            self.assertEqual(label_node.get('data-visual-role'),'tick-label')
        self.assertAlmostEqual(float(next(node for node in labels if node.get('data-tick-owner')=='model-x-unit').get('data-tick-value')),1)
        self.assertAlmostEqual(float(next(node for node in labels if node.get('data-tick-owner')=='model-y-unit').get('data-tick-value')),1)
        self.assertTrue(any(node.get('id')=='model-x-unit' for node in root.iter()))
        self.assertTrue(any(node.get('id')=='model-y-unit' for node in root.iter()))
    def test_explicit_axis_tick_inventory_preserves_owner_binding(self):
        s=spec();s['id']='explicit-tick-binding';s['displayFacts']={'axisTickValues':{'x':['-1','1'],'y':['-2','1','2']}}
        result=build(s);root=ET.fromstring(result['svg']);ticks=[node for node in root.iter() if node.get('data-role')=='tick'];labels=[node for node in root.iter() if node.get('data-label-kind')=='TICK_LABEL']
        self.assertEqual({(node.get('data-axis'),float(node.get('data-value'))) for node in ticks},{('x',-1.0),('x',1.0),('y',-2.0),('y',1.0),('y',2.0)})
        self.assertEqual(len(ticks),len(labels))
        for label_node in labels:
            tick_id=label_node.get('data-tick-owner');tick=next(node for node in ticks if node.get('id')==tick_id)
            self.assertEqual(tick.get('data-required-label-id'),label_node.get('id'))
            self.assertEqual(label_node.get('data-owner'),tick_id)
    def test_fact_binding(self):
        fact={'independentFactHash':'frozen','visualSpec':spec()}
        self.assertEqual(build_independent({},fact)['witness']['classification'],'STANDARD')
        fact['independentFactHash']='wrong'
        with self.assertRaisesRegex(ValueError,'BINDING'):build_independent({},fact)
    def test_legacy_special_fail_closed(self):
        for fact in ({'independentFactHash':'frozen'},{'independentFactHash':'frozen','specialVisual':True}):
            with self.assertRaises(ValueError):build_independent({},fact)
    def test_output_guard(self):
        config={'engineVersion':'geometry-visual-v1','runId':'upgrade-v1','examUid':'engine-tests','productionBaselinePolicy':'READ_ONLY','allowProductionWrite':False,'outputRoot':'archive/assets/images'}
        with self.assertRaisesRegex(ValueError,'PRODUCTION'):output_root(config)
        config['outputRoot']='.tmp/archive/upgrade-v1/engine-tests'
        self.assertTrue(output_root(config).is_relative_to(ROOT/'.tmp/archive'))
        config['allowProductionWrite']=True
        with self.assertRaises(ValueError):output_root(config)
    def test_entrypoint_import_no_io(self):
        for name in ('generate-svg-from-independent-facts.py','generate-svg-assets.py'):
            file=Path(__file__).resolve().parents[1]/name
            module=importlib.util.module_from_spec(importlib.util.spec_from_file_location('adapter',file))
            module.__spec__.loader.exec_module(module)
            self.assertTrue(callable(module.build_svg))
    def test_bad_display_coordinate(self):
        s=spec();s['objects'][2]['exact']=['1/2','1']
        with self.assertRaisesRegex(ValueError,'DISPLAY_COORDINATE'):build(s)
    def test_file_witness_raw_sha_roundtrip(self):
        s=spec();s['id']='hash-roundtrip'
        config={'engineVersion':'geometry-visual-v1','runId':'upgrade-v1','examUid':'engine-tests','productionBaselinePolicy':'READ_ONLY','allowProductionWrite':False,'outputRoot':'.tmp/archive/upgrade-v1/engine-tests/tests/generated'}
        result=write_candidate(s,config)
        raw=(output_root(config)/'candidate/hash-roundtrip/visual.svg').read_bytes()
        self.assertNotIn(b'\r\n',raw)
        self.assertEqual(hashlib.sha256(raw).hexdigest(),result['witness']['normalizedSvgSha256'])

if __name__=='__main__':unittest.main()
