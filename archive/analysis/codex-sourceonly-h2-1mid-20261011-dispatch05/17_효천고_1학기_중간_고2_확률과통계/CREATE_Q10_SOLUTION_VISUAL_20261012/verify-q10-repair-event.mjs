import fs from 'node:fs';
import crypto from 'node:crypto';
import {gitBlobSha} from '../../../../../archive/tools/archive-stage-validator.mjs';
const rel='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/CREATE_Q10_SOLUTION_VISUAL_20261012/CREATE.q10.visual-repair.event.rev2.json';
const b=fs.readFileSync(rel),e=JSON.parse(b);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const checks={eventSha256:hash(b),eventBlobSha:gitBlobSha(b)};
for(const k of ['sourceJs','problemPng','solutionSvg']){const ref=e.changedArtifacts[k];checks[k+'Current']=hash(fs.readFileSync(ref.path))===ref.sha256;checks[k+'Sha256']=ref.sha256;checks[k+'BlobSha']=ref.gitBlobSha;}
const rr=e.renderEvidence.standaloneChromiumSvg.screenshot;checks.staticRenderCurrent=hash(fs.readFileSync(rr.path))===rr.sha256;checks.archiveModeSol=e.renderEvidence.archiveModeSol.status;checks.otherQidsOpened=e.scope.otherTargetQidsOpened;checks.otherQidsModified=e.scope.otherTargetQidsModified;checks.nextRosterTarget=e.nextRosterTarget;
if(!checks.sourceJsCurrent||!checks.problemPngCurrent||!checks.solutionSvgCurrent||!checks.staticRenderCurrent)throw new Error('STALE_EVENT_BINDING');
console.log(JSON.stringify(checks,null,2));
