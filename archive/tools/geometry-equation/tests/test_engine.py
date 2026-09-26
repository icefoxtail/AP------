import sys,unittest,importlib.util
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.engine import build,output_root,ROOT
from visual_engine.entrypoints import build_independent

def spec():
    return {'id':'circle','title':'중심과 반지름','visualType':'line_circle_geometry','viewport':{'xMin':-4,'xMax':4,'yMin':-4,'yMax':4},'sourceFacts':{'independentFactHash':'frozen'},'derivedFacts':{},'displayFacts':{},'objects':[{'id':'C','kind':'POINT','at':[-1,1],'priority':0},{'id':'circle','kind':'CIRCLE','center':[-1,1],'radius':2},{'id':'C-coordinate','kind':'COORDINATE_LABEL','target':'C','exact':['-1','1']},{'id':'equation','kind':'EQUATION_LABEL','text':'(x+1)^2+(y-1)^2=2^2','at':[2,3]}]}

class EngineTests(unittest.TestCase):
    def test_pure_deterministic_build(self):
        a=build(spec());b=build(spec());self.assertEqual(a,b)
        self.assertEqual(a['witness']['authority'],'BUILD_SIDE_ONLY')
        self.assertEqual(a['witness']['status'],'CANDIDATE_REQUIRES_QA')
    def test_fact_binding(self):
        fact={'independentFactHash':'frozen','visualSpec':spec()}
        self.assertEqual(build_independent({},fact)['witness']['classification'],'STANDARD')
        fact['independentFactHash']='wrong'
        with self.assertRaisesRegex(ValueError,'BINDING'):build_independent({},fact)
    def test_legacy_special_fail_closed(self):
        for fact in ({'independentFactHash':'frozen'},{'independentFactHash':'frozen','specialVisual':True}):
            with self.assertRaises(ValueError):build_independent({},fact)
    def test_output_guard(self):
        config={'engineVersion':'geometry-visual-v1','runId':'upgrade-v1','productionBaselinePolicy':'READ_ONLY','allowProductionWrite':False,'outputRoot':'archive/assets/images'}
        with self.assertRaisesRegex(ValueError,'PRODUCTION'):output_root(config)
        config['outputRoot']='archive/_generated/geometry-visual-engine/upgrade-v1'
        self.assertTrue(output_root(config).is_relative_to(ROOT/'archive/_generated'))
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

if __name__=='__main__':unittest.main()
