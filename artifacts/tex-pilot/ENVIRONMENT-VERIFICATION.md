# AP Math TikZ/TeX SVG 파일럿 환경 검증

검증일: 2026-09-10 (Asia/Seoul)

공식 배포처: [TeX Live/TUG CTAN net installer 안내](https://tug.org/texlive/acquire-netinstall.html), CTAN mirror `https://mirror.ctan.org/systems/texlive/tlnet`.

## 설치 및 경로

| 구성요소 | 버전/상태 | 실제 경로 |
|---|---|---|
| TeX Live | 2026 | `C:\Users\USER\AppData\Local\Programs\TeXLive\2026` |
| XeTeX / XeLaTeX | XeTeX 3.141592653-2.6-0.999998 (TeX Live 2026) | `C:\Users\USER\AppData\Local\Programs\TeXLive\2026\bin\windows\xetex.exe`, `xelatex.exe` |
| TikZ / PGF | tlmgr package `pgf`, installed, revision 79866 | TeX Live texmf-dist |
| PGFPlots | tlmgr package `pgfplots`, installed, revision 80105 | TeX Live texmf-dist |
| dvisvgm | 3.6; tlmgr package `dvisvgm`, installed, revision 77830 | `C:\Users\USER\AppData\Local\Programs\TeXLive\2026\bin\windows\dvisvgm.exe` |
| Node.js | v24.14.1 | `C:\Program Files\nodejs\node.exe` |
| npm | 11.12.1 | `C:\Program Files\nodejs\npm.ps1` |
| Python | 3.14.3 | `C:\Python314\python.exe` |
| Playwright | 1.60.0 (official npm package, user-scoped pilot directory) | `C:\Users\USER\AppData\Local\APMath\tex-pilot-setup\playwright\node_modules\playwright` |
| Chromium | existing cache, revision 1223 | `C:\Users\USER\AppData\Local\ms-playwright\chromium-1223\chrome-win64\chrome.exe` |

TeX Live 실행 경로는 사용자 PATH에 등록되어 있다: `C:\Users\USER\AppData\Local\Programs\TeXLive\2026\bin\windows`.

## 필수 명령 검증

모두 실제 명령 실행 결과 PASS:

```text
xelatex --version   -> XeTeX ... (TeX Live 2026)
dvisvgm --version   -> dvisvgm 3.6
node --version      -> v24.14.1
python --version    -> Python 3.14.3
npx playwright --version -> Version 1.60.0
```

## TikZ + PGFPlots → SVG → 브라우저

입력: `tikz-pgfplots-test.tex`

```text
xelatex -no-pdf -interaction=nonstopmode -halt-on-error tikz-pgfplots-test.tex -> exit 0
dvisvgm --no-fonts --exact --output=tikz-pgfplots-test-xdv.svg tikz-pgfplots-test.xdv -> exit 0
```

XeTeX에서 dvisvgm 호환 TikZ 경로를 사용하기 위해 테스트 파일에 `pgfsys-dvisvgm.def`를 지정했다. 생성 SVG는 `viewBox=-28.709585 -43.65355 225.779955 138.720966`, path 20개이다.

Playwright 1.60.0 + 기존 Chromium으로 `file:///.../tikz-pgfplots-test-xdv.svg`를 열어 확인했다:

```json
{"width":"225.779955pt","height":"138.720966pt","paths":20,"clientWidth":301.03125,"clientHeight":184.953125}
```

브라우저 스크린샷: `browser-render.png` (포물선과 축/눈금이 정상 표시됨).

SVGO는 현재 생성·렌더 검증에 필요하지 않아 설치하지 않았다.
