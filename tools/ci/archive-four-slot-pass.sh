#!/usr/bin/env bash
# Independent 4slot lane: no source/annotation/approval mutation; commit only verified derived output.
set -euo pipefail
work="${RUNNER_TEMP:-/tmp}/archive-four-slot"
mkdir -p "$work"
cat > "$work/commit.paths" <<'PATHS'
archive/data/item-4slot-index.json
.archive-meta-register/auto/4slot/last-verification.json
.archive-meta-register/auto/4slot/receipts/*.json
PATHS
if [[ "$(node -p "JSON.parse(require('fs').readFileSync('.archive-meta-register/auto/config.json','utf8')).fourSlotEnabled !== false")" != true ]]; then
  echo '4slot registration disabled; authored data and existing outputs preserved.'
  exit 0
fi
node tools/4slot/build-4slot-runtime.cjs --write --report "$work/report.json" > "$work/build.log"
# Re-derive from source inputs, not just from cached generated rows.
node tools/4slot/build-4slot-runtime.cjs --check --report "$work/verify.json" > "$work/verify.log"
node tools/4slot/build-4slot-runtime.cjs --report "$work/replay.json" > "$work/replay.log"
node - "$work" <<'JS'
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const work=process.argv[2],read=f=>JSON.parse(fs.readFileSync(path.join(work,f),'utf8'));
const report=read('report.json'),check=read('verify.json'),replay=read('replay.json');
if(check.changed||replay.changed||report.indexSha256!==check.indexSha256||check.indexSha256!==replay.indexSha256)throw Error('FOUR_SLOT_REPLAY_OR_VERIFICATION_DRIFT');
const body=fs.readFileSync('archive/data/item-4slot-index.json');
if(crypto.createHash('sha256').update(body).digest('hex')!==check.indexSha256)throw Error('FOUR_SLOT_BYTES_CHANGED');
const directory='.archive-meta-register/auto/4slot';fs.mkdirSync(directory+'/receipts',{recursive:true});
const proof={schemaVersion:'archive-4slot-registration-verification-v1',status:check.status,indexSha256:check.indexSha256,inputDigest:check.inputDigest,counts:check.counts,consumerVerified:check.verified,replayChanged:false,sourceMutation:0,authored4SlotMutation:0,semanticApprovalMutation:0,independentReviewClaim:false};
fs.writeFileSync(directory+'/last-verification.json',JSON.stringify(proof,null,2)+'\n');
const receipt=directory+'/receipts/'+check.indexSha256+'.json';
if(fs.existsSync(receipt)){
  const prior=JSON.parse(fs.readFileSync(receipt,'utf8'));
  for(const [key,value]of Object.entries(proof))if(JSON.stringify(prior[key])!==JSON.stringify(value))throw Error('FOUR_SLOT_RECEIPT_CONFLICT:'+key);
}else{
  const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  fs.writeFileSync(receipt,JSON.stringify({...proof,sourceCommit},null,2)+'\n');
}
console.log(JSON.stringify(proof,null,2));
JS
git diff --check
git diff --exit-code -- archive/exams archive/data/item-4slot archive/data/question_metadata.json archive/data/meta-foundation/runtime
python - "$work/commit.paths" <<'PY'
import fnmatch,subprocess,sys
patterns=[x.strip() for x in open(sys.argv[1]) if x.strip() and not x.startswith('#')]
changed=set(subprocess.check_output(['git','diff','--name-only','-z']).decode().split('\0'))
changed.update(subprocess.check_output(['git','ls-files','--others','--exclude-standard','-z']).decode().split('\0'))
bad=[p for p in changed if p and not any(fnmatch.fnmatchcase(p,x) for x in patterns)]
if bad: raise SystemExit('UNEXPECTED_4SLOT_GENERATED_PATHS: '+str(bad))
PY
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
 { echo '### Existing 4slot → registered index'; echo '```json'; cat "$work/verify.json"; echo '```'; } >> "$GITHUB_STEP_SUMMARY"
fi
