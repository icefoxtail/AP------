"""Install review overlay only. Zero steps added to registration or Pages producers."""
from pathlib import Path
from shutil import copy2
from subprocess import check_output
import sys

SOURCE = Path(__file__).resolve().parent
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
if not (ROOT / 'AGENTS.md').exists():
    raise SystemExit('Expected repository root with AGENTS.md')
branch = check_output(['git', 'branch', '--show-current'], cwd=ROOT, text=True).strip()
if not branch or branch == 'main':
    raise SystemExit('Create a separate review branch first')
for relative in [
    '.github/workflows/archive-progress-observer.yml',
    '.github/scripts/archive-progress-evidence.mjs',
    '.github/scripts/archive-progress-site-snapshot.py',
    'archive/tools/archive-progress-core.mjs',
    'archive/tools/archive-progress-collector.mjs',
    'archive/tools/archive-progress-github-proof.mjs',
    'archive/tools/archive-progress-content-proof.mjs',
    'archive/tools/archive-progress-observer.mjs',
    'archive/tools/archive-progress-retry.mjs',
    'archive/progress.html', 'archive/progress.js',
    'tests/archive-progress-cache-targets.test.mjs',
    'tests/archive-progress-observer.test.mjs',
    'tests/archive-progress-realpaths.test.mjs', 'tests/archive-progress-recovery.test.mjs',
    'tests/b15-actual-diagnostic.test.mjs', 'tests/browser-smoke.py',
]:
    target = ROOT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    copy2(SOURCE / relative, target)
# Precise cleanup if the earlier v1 overlay was already applied. All baseline
# producer validation, generation, deployment and diagnostic steps are unchanged.
reg = ROOT / '.github/workflows/archive-registration-sync.yml'
release = ROOT / '.github/workflows/archive-pages-release.yml'
old_registration = '''
      - name: Capture actual registration commit for observer (best effort)
        if: always()
        continue-on-error: true
        run: node .github/scripts/archive-progress-evidence.mjs "$RUNNER_TEMP/progress-evidence.json"

      - name: Upload registration observer evidence (best effort)
        if: always()
        continue-on-error: true
        uses: actions/upload-artifact@v4
        with:
          name: archive-progress-${{ github.run_id }}
          path: ${{ runner.temp }}/progress-evidence.json
          if-no-files-found: ignore
          retention-days: 30
'''
old_release = '''      - name: Capture verified build provenance for observer (best effort)
        if: always()
        continue-on-error: true
        run: node .github/scripts/archive-progress-evidence.mjs "$RUNNER_TEMP/progress-evidence.json"

      - name: Upload verified build observer evidence (best effort)
        if: always()
        continue-on-error: true
        uses: actions/upload-artifact@v4
        with:
          name: archive-progress-${{ github.run_id }}
          path: ${{ runner.temp }}/progress-evidence.json
          if-no-files-found: ignore
          retention-days: 30

'''
for file, old in [(reg, old_registration), (release, old_release)]:
    text = file.read_text()
    if old in text:
        file.write_text(text.replace(old, '', 1))
    elif 'Capture actual registration commit for observer' in text or 'Capture verified build provenance for observer' in text:
        raise SystemExit('Unexpected v1 producer instrumentation in ' + str(file))
print('Observer overlay installed; producer workflows unchanged (legacy observer hooks removed if present).')
