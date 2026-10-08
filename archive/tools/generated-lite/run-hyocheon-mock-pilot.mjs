// Read-only preview CLI. Does not publish, alter Archive2 DB or supply generated candidates.
import {readFileSync} from "node:fs";
import {generatePilotPaper} from "./school-marker-core.mjs";
const dataUrl=new URL("../../data/generated-lite/hyocheon-2026-1mid-school-marker-read-model.json",import.meta.url);
const model=JSON.parse(readFileSync(dataUrl,"utf8"));
const args=process.argv.slice(2);
function arg(key,fallback){const pos=args.indexOf("--"+key);return pos<0?fallback:args[pos+1]||fallback;}
const paper=generatePilotPaper({model,seed:arg("seed","hyocheon-001"),mode:arg("mode","SCHOOL_BALANCED"),fallback:arg("fallback","KEEP_ORIGINAL")});
process.stdout.write(JSON.stringify(paper,null,2)+"\n");
