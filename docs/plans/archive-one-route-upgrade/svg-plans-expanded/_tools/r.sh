#!/bin/bash
# usage: r.sh <plan.json> <examPathNoExt> <ord> <tag>
S=/c/Users/USER/AppData/Local/Temp/claude/c44ed85801f9d634/19ccf8ca-d95e-400a-b4de-c3efccda5d4a/scratchpad
D=$S/rt_$4; rm -rf $D; mkdir -p $D/pk/q$3-solution
cp "$1" $D/pk/q$3-solution/plan.json
echo "{\"items\":[{\"dir\":\"q$3-solution\",\"sourcePath\":\"archive/exams/$2.js\",\"ordinal\":$3}]}" > $D/pk.manifest.json
cd /c/Users/USER/Desktop/AP------/.claude/worktrees/factory-render
node .tmp/work/render.mjs --manifest $D/pk --out $D/out 2>&1 | tail -3
ls $D/out/*.svg 2>/dev/null
if ls $D/out/*.svg >/dev/null 2>&1; then
 SV=$(ls $D/out/*.svg | head -1)
 "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --screenshot="$(cygpath -m $D)/shot.png" --window-size=900,1000 --default-background-color=ffffffff "file:///$(cygpath -m $SV)" >/dev/null 2>&1
 ls $D/shot.png
fi
cat $D/out/q$3-solution-result.json 2>/dev/null | head -c 600
