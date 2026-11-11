#!/bin/bash
# usage: pub-reset.sh <exam name regex>  — 실패한 게시 되돌리기
git checkout -q -- archive && git -c core.quotepath=off ls-files -o --exclude-standard archive/assets/images | grep -E "$1" | tr '\n' '\0' | xargs -0 -r rm -f
