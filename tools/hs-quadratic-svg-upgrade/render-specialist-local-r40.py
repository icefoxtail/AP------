import importlib.util
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
TARGET = Path(__file__).with_name('render-approved-candidate-local-r9.py')
spec = importlib.util.spec_from_file_location('render_local_r40', TARGET)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)
module.MANIFEST = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908' / '581_specialist_candidate_visual_manifest_r40.json'
module.OUT_ROOT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908' / 'render-r40'
module.OUTPUT = ROOT / 'reports' / 'hs-quadratic-svg-upgrade-20260908' / '596_specialist_local_render_review_r40.json'
module.main()
