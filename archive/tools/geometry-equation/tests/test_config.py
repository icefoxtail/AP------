import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.config import validate_config,resolve_output

def config():return {'engineVersion':'geometry-visual-v1','runId':'upgrade-v1','examUid':'config-tests','productionBaselinePolicy':'READ_ONLY','allowProductionWrite':False}
class ConfigTests(unittest.TestCase):
    def test_safe_defaults(self):
        self.assertEqual(validate_config(config())['maxRelayoutPasses'],3)
        self.assertEqual(resolve_output(config()).name,'config-tests')
    def test_traversal_and_other_run(self):
        for value in ('archive/assets','.tmp/archive/other-run/other-exam','../outside'):
            with self.assertRaises(ValueError):resolve_output({**config(),'outputRoot':value})
    def test_invalid_flags_and_cap(self):
        for patch in ({'allowProductionWrite':True},{'allowProductionWrite':0},{'maxRelayoutPasses':4},{'maxRelayoutPasses':True},{'runId':'../bad'},{'unexpected':1}):
            with self.assertRaises(ValueError):validate_config({**config(),**patch})
    def test_semantic_witness_changes_with_geometry(self):
        from test_engine import spec
        from visual_engine.engine import build
        a=spec();b=spec();b['objects'][1]['radius']=1
        self.assertNotEqual(build(a)['witness']['semanticWitnessSha256'],build(b)['witness']['semanticWitnessSha256'])

if __name__=='__main__':unittest.main()
