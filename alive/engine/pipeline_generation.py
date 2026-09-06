"""Shared candidate-only output boundary for legacy numeric generators."""
from __future__ import annotations

import sys
from pathlib import Path


def candidate_root(repository: Path, pipeline: str) -> Path:
    argv = sys.argv[1:]
    if '--candidate-root' in argv:
        index = argv.index('--candidate-root')
        if index + 1 >= len(argv):
            raise ValueError('--candidate-root requires a path')
        target = Path(argv[index + 1]).resolve()
    else:
        target = (repository / 'archive/_generated/visual-candidates' / pipeline).resolve()
    for protected in (repository / 'archive/exams', repository / 'archive/assets'):
        if target == protected.resolve() or target.is_relative_to(protected.resolve()) or protected.resolve().is_relative_to(target):
            raise ValueError('PRODUCTION_GENERATOR_OUTPUT_FORBIDDEN')
    return target


def write_candidate(root: Path, relative: str, text: str) -> Path:
    target = (root / relative).resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError('CANDIDATE_PATH_ESCAPE')
    repository = Path(__file__).resolve().parents[2]
    if any(target.is_relative_to((repository / directory).resolve()) for directory in ('archive/assets', 'archive/exams')):
        raise ValueError('PRODUCTION_GENERATOR_OUTPUT_FORBIDDEN')
    data = text.encode('utf-8')
    if target.exists():
        if target.read_bytes() == data:
            return target
        raise ValueError(f'APPEND_ONLY_CANDIDATE: choose a new --candidate-root: {target}')
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('xb') as output:
        output.write(data)
    return target


def render_typed_visual(fact: dict) -> tuple[str, dict]:
    """Shared typed generator for ALIVE and archive adapters; no legacy fallback."""
    import importlib.util
    file = Path(__file__).resolve().parents[2] / 'archive/tools/pipeline-core/generator.py'
    spec = importlib.util.spec_from_file_location('apmath_common_visual_generator', file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.generate(fact)
