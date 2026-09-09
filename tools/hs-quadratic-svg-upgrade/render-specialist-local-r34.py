import importlib.util
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
TARGET = Path(__file__).with_name('render-approved-candidate-local-r9.py')
spec = importlib.util.spec_from_file_location('render_local_r34', TARGET)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)
module.MANIFEST = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908' / '475_specialist_candidate_visual_manifest_r34.json'
module.OUT_ROOT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908' / 'render-r34'
module.OUTPUT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908' / '487_specialist_local_render_review_r34.json'
module.main()
