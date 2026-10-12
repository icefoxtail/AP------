import fs from 'node:fs';
import {physical,writeFresh} from '../../../../../tools/archive-codex-artifact-io.mjs';
const dir=process.argv[2],bundle=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const bundleRef=physical(process.argv[3]);
const value={schemaVersion:'JS_ARCHIVE_QID_SCOPED_R1_INDEPENDENT_FREEZE_V1',stage:'R1',scope:'QID_ONLY',reviewerIdentity:{role:'archive_r1',reviewerId:'codex-r1-direct-q15'},sourceRawSha256:bundle.sourceRawSha256,studentBundle:bundleRef,studentQidOrder:[15],rows:[{qid:15,independentAnswer:'④',reasoning:'이항정리에 의해 ㄱ은 참이다. ㄴ의 합은 n≥1에서 (1−1)^n=0이므로 2^n이 아니어서 거짓이다. n=8일 때 홀수 첨자 이항계수 합과 짝수 첨자 이항계수 합은 각각 2^(8−1)=128이다. 따라서 ㄷ은 log₂128=7로 참이고 ㄹ도 128=2^7로 참이다. 참인 것은 ㄱ, ㄷ, ㄹ이며 선택지 ④이다.'}],freezeBoundary:{answerSolutionAndAuthoringFilesNotReadBeforeFreeze:true,assetsRequired:[],browserRender:'NOT_RUN_R1_QID_ONLY'} };
console.log(JSON.stringify(writeFresh(`${dir}/independent-freeze.q15.json`,value),null,2));
