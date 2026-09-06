from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from alive.engine.pipeline_closure import shared_closure


class SharedPipelineClosureTests(unittest.TestCase):
    def test_missing_manifest_is_blocked(self):
        with tempfile.TemporaryDirectory() as temp:
            self.assertEqual('BLOCKED', shared_closure(Path(temp), None)['status'])

    @unittest.skipUnless(shutil.which('node'), 'node required')
    def test_python_and_node_share_the_identical_live_closure(self):
        repository = Path(__file__).resolve().parents[3]
        module = (repository / 'archive/tools/pipeline-core/tests/fixture.mjs').as_uri()
        script = 'import fs from "node:fs"; import {fixture} from ' + json.dumps(module) + '; const f=fixture("alive",{visual:false});fs.writeFileSync(f.root+"/run.json",JSON.stringify(f.run));console.log(JSON.stringify({root:f.root}));'
        process = subprocess.run(['node', '--input-type=module', '-e', script], capture_output=True, text=True, encoding='utf-8', timeout=30)
        self.assertEqual(0, process.returncode, process.stderr)
        root = Path(json.loads(process.stdout)['root']).resolve()
        self.assertEqual(Path(tempfile.gettempdir()).resolve(), root.parent)
        self.assertTrue(root.name.startswith('apmath-core-test-'))
        try:
            result = shared_closure(root, root / 'run.json', root / 'candidate.js')
            self.assertEqual('PASS', result['status'], result)
            with (root / 'candidate.js').open('a', encoding='utf-8') as stream:
                stream.write('\n// changed after freeze')
            self.assertEqual('BLOCKED', shared_closure(root, root / 'run.json', root / 'candidate.js')['status'])
        finally:
            shutil.rmtree(root)


if __name__ == '__main__':
    unittest.main()
