#!/bin/bash
# usage: a11y.sh <qdir>  — adds root role=img/title/desc to <qdir>/out/figure-solution.svg (composite/number-line outputs lack them)
Q=$1; source "$(dirname "$0")/env.sh"; cd "$R"; need_svgm1 || exit 1
T=$(date +%s%N); A=.tmp/svg-m1/runs/a11y-$T; mkdir -p $A; cp $Q/out/figure-solution.svg $A/in.svg
python - "$Q" "$A" <<'PY'
import json,hashlib,sys
q,a=sys.argv[1:3]; s=lambda p: hashlib.sha256(open(p,'rb').read()).hexdigest()
pj=json.load(open(q+'/publish.json',encoding='utf-8-sig')); it=json.load(open(q+'/item.json',encoding='utf-8-sig'))
json.dump([{'key':'a11y','assetPath':a+'/in.svg','outputSvg':a+'/out.svg','expectedSha256':s(a+'/in.svg'),'titleKo':'해설 그림: '+pj['alt'][:60],'descriptionKo':pj['alt'],'sourcePath':it.get('sourcePath',''),'sourceRun':q,'sourceReviewedPublishSha256':s(q+'/publish.json')}],open(a+'/m.json','w',encoding='utf-8'),ensure_ascii=False)
PY
node archive/tools/geometry-equation/ops/svg-m1/upgrade-svg-accessibility.mjs --manifest $A/m.json --audit-dir $A-audit | tail -1 && cp $A/out.svg $Q/out/figure-solution.svg
