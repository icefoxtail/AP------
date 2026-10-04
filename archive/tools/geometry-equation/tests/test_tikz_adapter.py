import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.tikz_adapter import draft,text,compile_candidate

class TikzTests(unittest.TestCase):
    def test_safe_math_draft(self):
        p={'primitives':[{'kind':'line','from':[0,0],'to':[20,20],'layer':40}]}
        l={'labels':[{'text':'x^2-3x+4','sourceMath':'x^2-3x+4','baseline':[10,30]}]}
        result=draft(p,l);self.assertIn('x^{2}-3x+4',result);self.assertNotIn('x^{2-3x+4}',result)
        self.assertEqual(result,draft(p,l))
    def test_escape(self):
        self.assertEqual(text('한글%_#'),r'한글\%\_\#')
    def test_no_production_write(self):
        with self.assertRaisesRegex(ValueError,'PRODUCTION_WRITE'):compile_candidate('x',Path(__file__).resolve().parents[3]/'assets')
    def test_unknown_primitive(self):
        with self.assertRaises(ValueError):draft({'primitives':[{'kind':'unknown','layer':10}]},{'labels':[]})

if __name__=='__main__':unittest.main()
