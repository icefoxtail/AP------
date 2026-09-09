import importlib.util
import sys
from pathlib import Path
TARGET = Path(__file__).with_name('validate-deterministic-candidate-visuals-r11.py')
sys.argv = [str(TARGET), '630_specialist_candidate_visual_manifest_r43.json', '632_specialist_candidate_visual_static_check_r43.json']
spec = importlib.util.spec_from_file_location('validate_visuals_r43', TARGET)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)
