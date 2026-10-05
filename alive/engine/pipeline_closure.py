"""Use the shared Node verifier; never maintain a second semantic hash dialect."""
from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path
from typing import Any


def shared_closure(root: Path, manifest: Path | None, candidate: Path | None = None) -> dict[str, Any]:
    if manifest is None or not manifest.is_file():
        return {"status": "BLOCKED", "errors": ["COMMON_CLOSURE_MANIFEST_REQUIRED"], "productionAuthorized": False}
    node = shutil.which("node")
    if not node:
        return {"status": "BLOCKED", "errors": ["COMMON_CLOSURE_NODE_UNAVAILABLE"], "productionAuthorized": False}
    # Resolve implementation beside this module, not in an arbitrary input root.
    repository = Path(__file__).resolve().parents[2]
    integration = (repository / "archive/tools/pipeline-core/integration.mjs").as_uri()
    script = "import {closureFromFile} from " + json.dumps(integration) + "; const r=closureFromFile(process.argv[1], 'alive', process.argv[2], JSON.parse(process.argv[3])); console.log(JSON.stringify(r)); process.exitCode=r.status==='PASS'?0:1;"
    artifacts = [str(candidate.resolve())] if candidate else []
    try:
        process = subprocess.run([node, "--input-type=module", "-e", script, str(root.resolve()), str(manifest.resolve()), json.dumps(artifacts)], capture_output=True, text=True, encoding="utf-8", timeout=90)
        result = json.loads(process.stdout)
        if process.returncode and result.get("status") == "PASS":
            return {"status": "BLOCKED", "errors": ["COMMON_CLOSURE_PROCESS_FAILED"]}
        return result
    except (OSError, subprocess.SubprocessError, ValueError) as error:
        return {"status": "BLOCKED", "errors": [f"COMMON_CLOSURE_EXECUTION:{error}"], "productionAuthorized": False}
