// Builds AUTHOR_GUIDE.md: the hand-written instructions (author-guide-body.md) followed by the plan contract text extracted from phase2.mjs
// (compilerContract plus every extendedContract fragment, literal or named constant, in source order), so the guide cannot drift from the code.
// usage: node production/build-author-guide.mjs [--check]     (--check exits 1 when AUTHOR_GUIDE.md is out of date)
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
export const bodyPath=path.join(here,'author-guide-body.md');
export const guidePath=path.join(here,'AUTHOR_GUIDE.md');
export const phase2Path=path.join(here,'phase2.mjs');

// Same extraction as the author-packet contract: the base template literal, the first extension, then each later literal extension.
export const contractText=(source=fs.readFileSync(phase2Path,'utf8'))=>{
  const base=source.match(/const compilerContract=`([\s\S]*?)`;/)?.[1];
  const first=source.match(/let extendedContract=compilerContract\+'([^']*)';/)?.[1];
  // A fragment is either a string literal or the name of a module-level template-literal constant (the per-family contracts).
  const named=name=>{const text=source.match(new RegExp('const '+name+'=`([^`]*)`;'))?.[1];if(text===undefined)throw Error('CONTRACT_CONSTANT_NOT_FOUND:'+name);return text;};
  const rest=[...source.matchAll(/extendedContract\+=(?:'([^']*)'|([A-Z][A-Z0-9_]*));/g)].map(match=>match[1]??named(match[2]));
  if(!base||first===undefined||!rest.length)throw Error('CONTRACT_FRAGMENTS_NOT_FOUND');
  return base+first+rest.join('');
};

export const buildGuide=()=>{
  const body=fs.readFileSync(bodyPath,'utf8').replace(/\r\n/g,'\n').trimEnd();
  return [
    '<!-- 자동 생성 파일입니다. 본문은 author-guide-body.md 를 고치고 `node production/build-author-guide.mjs` 를 실행하세요. 계약 전문은 phase2.mjs 에서 추출됩니다. -->',
    '',
    body,
    '',
    '## plan 계약 전문',
    '',
    '아래는 엔진이 받는 plan 형식의 정본이다(phase2.mjs의 계약 문구 그대로). 위 지침의 규칙은 이 계약을 쉽게 풀어 쓴 것이다.',
    '유리·무리(제곱근)·절댓값·구간별 일차·지수·로그·삼각함수 계열의 계약도 아래 전문에 순서대로 들어 있다.',
    '',
    '~~~~text',
    contractText(),
    '~~~~',
    ''
  ].join('\n');
};

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const next=buildGuide();
  if(process.argv.includes('--check')){
    const current=fs.existsSync(guidePath)?fs.readFileSync(guidePath,'utf8'):'';
    if(current!==next){console.error('AUTHOR_GUIDE.md is out of date: run node production/build-author-guide.mjs');process.exit(1);}
    console.log('AUTHOR_GUIDE.md is up to date');
  }else{
    fs.writeFileSync(guidePath,next);
    console.log('wrote',guidePath,next.length,'chars');
  }
}
