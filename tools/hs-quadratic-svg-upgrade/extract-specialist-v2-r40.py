import importlib.util
import sys
from pathlib import Path
TARGET = Path(__file__).with_name('extract-deterministic-v2-artifact-only-r11.py')
sys.argv = [str(TARGET), '581_specialist_candidate_visual_manifest_r40.json', '584_specialist_v2_artifact_only_r40.json']
spec = importlib.util.spec_from_file_location('extract_v2_r40', TARGET)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)
