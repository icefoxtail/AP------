import importlib.util, sys
from pathlib import Path
TARGET=Path(__file__).with_name('validate-deterministic-candidate-visuals-r11.py'); sys.argv=[str(TARGET),'710_specialist_candidate_visual_manifest_r48.json','712_specialist_candidate_visual_static_check_r48.json']; spec=importlib.util.spec_from_file_location('validate_visuals_r48',TARGET); module=importlib.util.module_from_spec(spec); assert spec.loader is not None; spec.loader.exec_module(module)
