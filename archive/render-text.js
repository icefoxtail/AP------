(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.APRenderText = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // 시험지 본문·해설·보기·정답 문자열을 화면용 HTML로 바꾸는 순수 함수 모음.
  // engine.html(원본 시험지)과 mixed_engine.html(문제지 만들기·단원별 기출)이 이 파일 하나를 같이 쓴다.
  // 두 HTML에 같은 이름 함수를 따로 복사해 두면 한쪽만 고쳐져 같은 문항이 화면마다 다르게 나온다(tests/archive-render-text-shared.test.js가 막는다).
  // DOM·window·MathJax에 닿지 않는다. 표 엔진(ApTableEngine)만 globalThis에서 읽고, 시험에서는 setTableEngine으로 바꿀 수 있다.
  let tableEngineOverride = null;
  function tableEngine() { return tableEngineOverride || (typeof globalThis !== "undefined" ? globalThis.ApTableEngine : null) || null; }
  function setTableEngine(engine) { tableEngineOverride = engine || null; }

  const MATH_SEGMENT_RE = /(\$\$[\s\S]*?\$\$|\$(?!\$)[\s\S]*?(?<!\$)\$)/g;

  // 한글·자모로 시작하는 <이름표>만 글자로 바꾼다. 진짜 태그(영문 이름이나 /)와 속성 값 안의 한글은 건드리지 않는다.
  function escapeLooseAngleLabels(html) {
      return String(html).replace(/<(?=[가-힣ㄱ-ㅎ])([^<>]*)>/g, '&lt;$1&gt;');
  }

  // 수식($...$) 밖 글자 한 조각에서 $ 없이 쓴 TeX 명령(\frac, \circ 등)을 수식으로 감싼다.
  // 하위 첨자(_) 패턴이 바로 뒤의 __HTMLTAG_n__ 표지를 하위 첨자로 먹지 않게 `__`에서 멈춘다.
  function wrapBareLatex(seg) {
      const trimmed = seg.trim(); if (!trimmed) return seg;
      const hasKorean = /[가-힣]/.test(seg);
      // Source strings may encode line breaks as a literal backslash-n before
      // HTML blocks; exclude that token from TeX-macro detection.
      const hasLatex = /\\[a-zA-Z]/.test(seg.replace(/\\n(?![a-zA-Z])/g, ''));
      if (!hasKorean && /\\begin\{(cases|aligned|array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}/.test(seg)) return `$$${seg}$$`;
      if (!hasKorean && hasLatex && /^[0-9a-zA-Z\s\+\-\*\/\=\^\{\}\(\)\[\]_\.,\\!;:]+$/.test(trimmed)) return `$${trimmed}$`;
      if (hasKorean && hasLatex) return seg.replace(/(\\[a-zA-Z]+(?:\{[^}]*\})*(?:\{[^}]*\})*(?:_(?!_)\{?(?:(?!__)[^}\s])+\}?)?(?:\^\{?(?:(?!__)[^}\s])+\}?)?)/g, '$$$1$$');
      return seg;
  }

  // 표·보기 상자는 통째로 보호하되(표 트리를 지키려고), 그 안의 글자는 보호하지 않은 글처럼 다룬다:
  // 수식 안 <, >는 글자로(`$x<y$`의 <y가 태그로 읽히지 않게), 한글 <이름표>도 글자로, $ 없는 TeX 명령은 수식으로.
  function repairStructuralBlock(block) {
      return String(block).split(MATH_SEGMENT_RE).map((seg, idx) => {
          if (idx % 2 === 1) return seg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return escapeLooseAngleLabels(seg)
              .split(/(<\/?[a-zA-Z][^>]*>|<!--[\s\S]*?-->)/)
              .map((piece, pieceIdx) => (pieceIdx % 2 === 1 ? piece : wrapBareLatex(piece)))
              .join('');
      }).join('');
  }

  function wrapLatex(text) {
      if (text == null) return '';
      let s = String(text);
      // AP Table Engine: pipe tables and legacy HTML tables become one canonical table before any text rewriting.
      const tables = tableEngine();
      if (tables) s = tables.renderApTables(s);
      // Table and structured question blocks must survive text/LaTex rewriting as
      // complete HTML units. Protecting only individual tag boundaries loses the
      // table tree when the intervening content is split around math segments.
      const structuralBlocks = [];
      const saveStructuralBlock = match => {
          const token = `__WRAP_STRUCTURAL_BLOCK_${structuralBlocks.length}__`;
          // 표 셀 안의 <보기>·<조건> 같은 꺾쇠 이름표는 HTML 태그가 아니라 글자다. 표를 통째로 보호하면 브라우저가 모르는 태그로 읽어 글자가 사라지므로 미리 글자로 바꿔 둔다.
          structuralBlocks.push(repairStructuralBlock(match));
          return token;
      };
      s = s
          .replace(/<div[^>]*class=["'][^"']*question-table-wrap[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, saveStructuralBlock)
          .replace(/<table[\s\S]*?<\/table>/gi, saveStructuralBlock);
      // 인라인 <svg>…</svg>는 안의 글자에 $수식$이 있어도(예: <text>($x^3$)</text>) 수식 분할에 쪼개져 태그가 글자로 바뀌지 않게 통째로 보호한다.
      // 표 안의 svg는 위에서 표와 함께 이미 보호됐다.
      s = s.replace(/<svg[\s\S]*?<\/svg>/gi, match => {
          const token = `__WRAP_STRUCTURAL_BLOCK_${structuralBlocks.length}__`;
          structuralBlocks.push(match);
          return token;
      });
      s = s.replace(/\\\([\s\S]+?\\\)/g, m => '$' + m.slice(2, -2) + '$');
      // Stored display formulas can start and end with literal newline markers. Only recognize
      // the opening marker before a formula token, so commands such as \nabla stay intact.
      s = s.replace(/\\\[\\n(?=\\|\s|\d|[([{+-]|[a-zA-Z](?:\W|$))((?:(?!\\[\[\]])[\s\S])*?)\\n\\\]/g,
          (_, body) => '$$' + body.replace(/(?<!\\)\\n(?=\\)/g, ' ') + '$$');
      s = s.replace(/\\\[[\s\S]+?\\\]/g, m => '$$' + m.slice(2, -2) + '$$');
      const combRepl = T => (m, a1, a2, b1, b2) => `$_{${a1||a2}}${T}_{${b1||b2}}$`;
      const combPat = prefix => new RegExp(`(?<!\\$)(?:\\{\\}|\\[\\])_(?:\\{([^}]+)\\}|([a-zA-Z0-9+\\-]+))${prefix}_(?:\\{([^}]+)\\}|([a-zA-Z0-9+\\-]+))`, 'g');
      const htmlTags = [];
      // Split math before protecting HTML tags.  Otherwise an inequality such as
      // `$5a<b<7a$` is mistaken for a malformed `<b...>` tag and leaks raw
      // delimiters into the rendered solution.
      // Valid display/inline math can contain a source line break. Treat the
      // complete dollar-delimited segment as math and normalize only its line
      // breaks to spaces before the final HTML <br> pass.
      const mathSegmentRe = MATH_SEGMENT_RE;
      s = s.split(mathSegmentRe).map((seg, idx) => {
          if (idx % 2 === 1) return seg.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n|\r|\n/g, ' ');
          let t = seg;
          t = t.replace(/<svg[\s\S]*?<\/svg>|<img[^>]*>|<br\s*\/?>|\n*<\/?p(?![a-zA-Z])[^>]*>\n*|<\/?(div|span|b|i|strong|em|u|sup|sub|table|thead|tbody|tfoot|caption|tr|th|td|colgroup|col|ul|ol|li|dl|dt|dd|center|small|h[1-6]|fieldset|legend|figure|figcaption|picture|source|hr|pre|code|del|ins|mark|font|blockquote|label)(?![a-zA-Z0-9])[^>]*>/gi, m => {
              const token = `__HTMLTAG_${htmlTags.length}__`; htmlTags.push(m); return token;
          });
          t = t.replace(combPat('C'), combRepl('C')).replace(combPat('H'), combRepl('H')).replace(combPat('P'), combRepl('P'));
          return t.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }).join('');
      // HTML tags are represented by restore tokens at this point.  They are
      // ordinary non-math segments and must stay in the split stream until the
      // final restore; including the tokens in the delimiter silently discards
      // inline <img>/<br>/<div> markup before DOM construction.
      s = s.split(mathSegmentRe).map((seg, idx) => {
          if (idx % 2 === 1) return seg;
          return wrapBareLatex(seg);
      }).join('');
      s = s.split(mathSegmentRe).map((seg, idx) => {
          if (idx % 2 === 1) return seg;
          return seg.replace(/(\\\{(?:[^{}]|\{[^}]*\})*\\\})/g, '$$$1$$');
      }).join('');
      s = s.split(mathSegmentRe).map((seg, idx) => {
          if (idx % 2 === 0) return seg.replace(/\\{1,2}n(?![a-zA-Z])/g, '<br>');
          // A TeX row break followed by variable n (\\n) contains two backslashes, not a literal newline.
          return seg.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/(?<!\\)\\n(?![a-zA-Z])/g, '<br>');
      }).join('');
      s = s.replace(/\r\n|\r|\n/g, '<br>');
      return s
          .replace(/__HTMLTAG_(\d+)__/g, (_, i) => htmlTags[i] || '')
          .replace(/__WRAP_STRUCTURAL_BLOCK_(\d+)__/g, (_, i) => structuralBlocks[i] || '');
  }

  function normalizeSolutionLineBreaks(text) {
      // A student-supplement paragraph may legitimately begin with an ASCII variable
      // (for example, "A,B,C"). Protect only the known section marker so that its
      // escaped line break is not mistaken for a LaTeX command such as \\neq.
      return String(text || '')
          .replace(/(\[학생용 보강\])\\n/g, '$1\n')
          .replace(/\\n(?![a-zA-Z])/g, '\n');
  }

  function extractChoice(c) {
      if (c === null || c === undefined) return '';
      if (typeof c === 'object') return c.text || c.content || c.value || c.answer || Object.values(c)[0] || '';
      return String(c);
  }

  function stripChoicePrefix(text) {
      return String(text || '').replace(/^\s*(?:[①②③④⑤⑥⑦⑧⑨⑩]|(?:\(?\d+\)|\d+\.(?!\d)|\d+\))(?=\s))\s*/, '').trim();
  }

  function detectChoiceRenderMode(choices) {
      if (!choices || choices.length === 0) return 'compact';

      const texts = choices.map(c => stripChoicePrefix(extractChoice(c)).trim());
      // LaTeX 수식 제거 후 길이 측정 (LaTeX 소스 길이로 오인식 방지)
      const stripped = texts.map(t => t.replace(/\$\$[\s\S]*?\$\$/g, '~').replace(/\$[^$\n]*?\$/g, '~').trim());

      const avgLen = stripped.reduce((s, t) => s + t.length, 0) / Math.max(stripped.length, 1);
      const isVeryLong = stripped.some(t => t.length > 36);
      const hasLineBreak = texts.some(t => /\\n|\n|<br/i.test(t));
      const hasSentence = stripped.some(t => /[.?!。]|입니다|한다|된다|아니다|같다|옳다|옳지/.test(t) && t.length > 20);
      // boxed: 선택지 자체에 ㄱ/ㄴ/㉠/㉡ 마커가 2개 이상 포함된 경우만 (보기형 선택지)
      const hasMultiMarker = texts.some(t => (t.match(/[ㄱㄴㄷㄹㅁ]\.|㉠|㉡|㉢|㉣|㉤/g) || []).length >= 2);

      if (hasMultiMarker) return 'boxed';
      if (isVeryLong || hasLineBreak || hasSentence || avgLen > 28) return 'block';

      const isLong = stripped.some(t => t.length > 20);
      const hasBlockPrefix = texts.some(t => /^[가-힣ㄱ-ㅎa-zA-Z][\.\)]/.test(t));

      return (isLong || hasBlockPrefix) ? 'block' : 'compact';
  }

  // options.formatChoice: 보기 한 개를 화면용으로 고치는 선택 훅(문제지 만들기가 GeneratedMockSelection.formatChoiceForDisplay를 넘긴다). 없으면 그대로 쓴다.
  function renderChoicesHTML(q, options) {
      const formatChoice = typeof options?.formatChoice === 'function' ? options.formatChoice : null;
      if (q.choicesEmbeddedInImage === true || q.sourcePayload?.choicesEmbeddedInImage === true) return '';
      const circled = ['①', '②', '③', '④', '⑤'];
      const isSubjective = !Array.isArray(q.choices) || q.choices.length === 0 || q.choices[0] === '주관식' || q.choices.every(c => extractChoice(c).trim() === '');
      if (isSubjective) return '<div class="answer-box"></div>';
      const requestedColumns = Number.parseInt(q.choiceColumns, 10);
      const hasCustomGrid = requestedColumns >= 1 && requestedColumns <= 5;
      const mode = hasCustomGrid ? 'grid' : detectChoiceRenderMode(q.choices);
      const itemsHTML = q.choices.map((c, ci) => {
          const choiceText = extractChoice(c);
          const shown = q.preserveChoicePrefixes ? choiceText : stripChoicePrefix(choiceText);
          const text = wrapLatex(formatChoice ? formatChoice(shown) : shown);
          return `<div class="choice-item"><span class="choice-no">${circled[ci] || ''}</span><span class="choice-text">${text}</span></div>`;
      }).join('');
      const gridStyle = hasCustomGrid ? ` style="grid-template-columns:repeat(${requestedColumns}, minmax(0, 1fr))"` : '';
      return `<div class="choices choices-${mode}"${gridStyle}>${itemsHTML}</div>`;
  }

  function protectQuestionBoxes(html, save, compactBreaks) {
      // Track matching div tags so a heading div inside an existing box cannot end protection early.
      const tags = /((?:<br\s*\/?>\s*)*)(<\/?div\b(?:[^>"']|"[^"]*"|'[^']*')*>)/gi;
      let depth = 0;
      let blockStart = 0;
      let cursor = 0;
      let out = '';
      for (const match of html.matchAll(tags)) {
          const [, breaks, tag] = match;
          if (depth === 0) {
              if (tag.startsWith('</')) continue;
              const classes = tag.match(/\sclass\s*=\s*(["'])(.*?)\1/i)?.[2].split(/\s+/) || [];
              const bordered = /\sstyle\s*=\s*["'][^"']*\bborder\s*:/i.test(tag);
              if (!bordered && !classes.some(name => /^(?:box-content|box-region|question-table-wrap)$/.test(name) || /(?:^|-)box$/.test(name))) continue;
              blockStart = match.index + breaks.length;
              out += html.slice(cursor, match.index) + (compactBreaks && breaks ? '<br>' : breaks);
              depth = 1;
          } else if (tag.startsWith('</')) {
              depth--;
              if (depth === 0) {
                  cursor = match.index + match[0].length;
                  out += save(html.slice(blockStart, cursor));
              }
          } else {
              depth++;
          }
      }
      return out + html.slice(depth > 0 ? blockStart : cursor);
  }

  function protectRenderSegments(html, { compactBoxBreaks = false } = {}) {
      const tokens = [];
      const boxTokens = [];
      const save = (match) => {
          const token = `__PROTECTED_SEGMENT_${tokens.length}__`;
          tokens.push(match);
          return token;
      };

      // 블록 HTML을 먼저 보호한 뒤 인라인 수식을 보호한다.
      // 기존 순서(수식 → table/div)는 table 안의 수식 토큰이 table 토큰 안에 다시 들어가면서
      // __PROTECTED_SEGMENT_n__ 문자열이 한 번만 복원되고 화면에 그대로 남는 문제가 있었다.
      const protectedHtml = protectQuestionBoxes(String(html || ''), box => {
          const token = save(box);
          boxTokens.push(token);
          return token;
      }, compactBoxBreaks)
          .replace(/<table[\s\S]*?<\/table>/gi, save)
          .replace(/\$\$[\s\S]*?\$\$/g, save)
          .replace(/\$[^$\n]*?\$/g, save);

      return {
          html: protectedHtml,
          protect: save,
          splitAtBoxes() {
              return boxTokens.length ? protectedHtml.split(new RegExp('(' + boxTokens.join('|') + ')')) : [protectedHtml];
          },
          restore(value) {
              let restored = String(value || '');
              // 과거 저장본/예외 케이스에 중첩 토큰이 남아도 끝까지 복원한다.
              for (let pass = 0; pass < tokens.length + 2 && /__PROTECTED_SEGMENT_\d+__/.test(restored); pass++) {
                  restored = restored.replace(/__PROTECTED_SEGMENT_(\d+)__/g, (match, i) => {
                      const idx = Number(i);
                      if (tokens[idx] !== undefined) return tokens[idx];
                      console.warn('[JS Archive] protected segment restore failed:', match);
                      return '';
                  });
              }
              if (/__PROTECTED_SEGMENT_\d+__/.test(restored)) {
                  console.warn('[JS Archive] protected segment remained after restore:', restored);
              }
              return restored;
          }
      };
  }

  function normalizeQuestionContentBreaks(html, { subjective = false } = {}) {
      // 표시 수식은 그 자체가 한 줄을 차지한다. 수식에 붙인 br 한 개만 걷고 수식 내부는 보존한다.
      const parts = String(html || '').split(MATH_SEGMENT_RE);
      const cleaned = parts.map((part, index) => {
          if (index % 2) return part;
          if (parts[index - 1]?.startsWith('$$')) part = part.replace(/^\s*<br\s*\/?>/i, ' ');
          if (parts[index + 1]?.startsWith('$$')) part = part.replace(/<br\s*\/?>\s*$/i, ' ');
          return part;
      }).join('');
      if (!subjective) return cleaned;

      // 명시된 서술형에서만 (1)부터 이어지는 문항 번호를 줄로 나눈다. 수식과 본문 속 번호 참조는 보호한다.
      const state = protectRenderSegments(cleaned);
      let next = 1;
      return state.restore(state.html.replace(
          /(^|(?:<br\s*\/?>\s*)+|[.!?]\s+|\[(?:총\s*)?\d+(?:\.\d+)?\s*점\]\s*)(\(([1-9]\d*)\))(?=\s|__PROTECTED_SEGMENT_)/gi,
          (match, boundary, label, number) => {
              if (Number(number) !== next) return match;
              next++;
              if (!boundary) return label;
              return (/^<br/i.test(boundary) ? '' : boundary.trimEnd()) + '<br>' + label;
          }
      ));
  }

  function normalizeHangulStatementBreaks(html) {
      if (!html) return '';

      const tokens = [];
      const save = (kind, match) => {
          const token = '__HANGUL_STATEMENT_' + kind + '_' + tokens.length + '__';
          tokens.push(match);
          return token;
      };

      // Keep the existing note/box wrappers available for normalization, while
      // shielding structures whose text is not a question statement stream.
      let protectedHtml = String(html)
          .replace(
              /<div[^>]*class=["'][^"']*(?:\bchoices\b|\bsol-meta\b|\bsol-exp\b|\bsolution\b)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
              match => save('BLOCK', match)
          )
          .replace(
              /<table\b[\s\S]*?<\/table>|<svg\b[\s\S]*?<\/svg>|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,
              match => save('BLOCK', match)
          )
          .replace(
              /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$(?!\$)[\s\S]*?(?<!\$)\$/g,
              match => save('MATH', match)
          )
          .replace(/<(?!br\b)\/?[A-Za-z][^>]*>|<!--[\s\S]*?-->/gi, match => save('TAG', match));

      const rank = new Map([['ㄱ', 0], ['ㄴ', 1], ['ㄷ', 2], ['ㄹ', 3], ['ㅁ', 4]]);
      const markers = [...protectedHtml.matchAll(/([ㄱㄴㄷㄹㅁ])\./g)];
      const replacements = [];

      for (let index = 1; index < markers.length; index += 1) {
          const previous = markers[index - 1];
          const current = markers[index];
          if (rank.get(current[1]) <= rank.get(previous[1])) continue;

          const between = protectedHtml.slice(previous.index + previous[0].length, current.index);
          if (/__HANGUL_STATEMENT_BLOCK_\d+__/.test(between)) continue;

          const separatorMatch = between.match(
              /(?:\s|&(?:nbsp|ensp|emsp|thinsp);|<br\s*\/?>(?:\s*)?|__HANGUL_STATEMENT_TAG_\d+__)*$/i
          );
          const separator = separatorMatch ? separatorMatch[0] : '';
          const breakMatches = [...separator.matchAll(/<br\s*\/?>/gi)];
          const tagMatches = [...separator.matchAll(/__HANGUL_STATEMENT_TAG_\d+__/gi)];
          const lastTag = tagMatches[tagMatches.length - 1];
          const normalizedSeparator = breakMatches.length > 0
              ? separator.slice(0, breakMatches[0].index)
                  + '<br>'
                  + separator.slice(breakMatches[0].index + breakMatches[0][0].length)
                      .replace(/<br\s*\/?>/gi, '')
                      .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
                      .replace(/^\s+|\s+$/g, '')
              : lastTag
              ? separator.slice(0, lastTag.index + lastTag[0].length)
                  + separator.slice(lastTag.index + lastTag[0].length)
                      .replace(/<br\s*\/?>/gi, '')
                      .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
                      .replace(/\s+/g, '')
                  + '<br>'
              : separator
                  .replace(/<br\s*\/?>/gi, '')
                  .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
                  .replace(/\s+/g, '') + '<br>';

          replacements.push({
              start: current.index - separator.length,
              end: current.index,
              value: normalizedSeparator
          });
      }

      for (let index = replacements.length - 1; index >= 0; index -= 1) {
          const replacement = replacements[index];
          protectedHtml = protectedHtml.slice(0, replacement.start)
              + replacement.value
              + protectedHtml.slice(replacement.end);
      }

      return protectedHtml.replace(
          /__HANGUL_STATEMENT_(?:BLOCK|MATH|TAG)_(\d+)__/g,
          (match, index) => tokens[Number(index)] ?? ''
      );
  }

  function normalizeConditionMarkerBreaks(html) {
      if (!html) return '';

      const tokens = [];
      const conditionTokenRe = /__CONDITION_(?:BLOCK|MATH|TAG)_(\d+)__/g;
      const conditionTagTokenRe = /__CONDITION_TAG_\d+__/g;
      const conditionTagIndexRe = /^__CONDITION_TAG_(\d+)__$/;
      const save = (kind, match) => {
          const token = '__CONDITION_' + kind + '_' + tokens.length + '__';
          tokens.push(match);
          return token;
      };
      const tagTokenSource = token => {
          const match = String(token || '').match(conditionTagIndexRe);
          return match ? String(tokens[Number(match[1])] || '') : '';
      };
      const isOpeningTagToken = token => /^<[A-Za-z][^>]*>$/.test(tagTokenSource(token));
      const findMarkerWrapperStart = separator => {
          conditionTagTokenRe.lastIndex = 0;
          const tagMatches = [...String(separator || '').matchAll(conditionTagTokenRe)];
          let lastNonOpening = -1;
          for (let index = 0; index < tagMatches.length; index += 1) {
              if (!isOpeningTagToken(tagMatches[index][0])) lastNonOpening = index;
          }
          for (let index = lastNonOpening + 1; index < tagMatches.length; index += 1) {
              if (isOpeningTagToken(tagMatches[index][0])) return tagMatches[index];
          }
          return null;
      };
      let protectedHtml = String(html)
          .replace(
              /<div[^>]*class=["'][^"']*(?:\bchoices\b|\bsol-meta\b|\bsol-exp\b|\bsolution\b)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
              match => save('BLOCK', match)
          )
          .replace(
              /<table\b[\s\S]*?<\/table>|<svg\b[\s\S]*?<\/svg>|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<img\b[^>]*>/gi,
              match => save('BLOCK', match)
          )
          .replace(
              /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$(?!\$)[\s\S]*?(?<!\$)\$/g,
              match => save('MATH', match)
          )
          .replace(
              /<(?!br\b)\/?[A-Za-z][^>]*>|<!--[\s\S]*?-->/gi,
              match => save('TAG', match)
          );

      const markers = [];
      const addMarker = (match, index, label) => markers.push({ index, end: index + match.length, label });
      for (const match of protectedHtml.matchAll(/[（(][가나다라마][）)]/g)) {
          addMarker(match[0], match.index, match[0].replace(/[（()）]/g, ''));
      }
      for (const match of protectedHtml.matchAll(/(?:^|[\s>]|__CONDITION_TAG_\d+__)([가나다라마])\./g)) {
          addMarker(match[0].slice(-2), match.index + match[0].length - 2, match[1]);
      }
      markers.sort((left, right) => left.index - right.index);

      const rank = new Map([['가', 0], ['나', 1], ['다', 2], ['라', 3], ['마', 4]]);
      const replacements = [];
      for (let index = 1; index < markers.length; index += 1) {
          const previous = markers[index - 1];
          const current = markers[index];
          if (rank.get(current.label) <= rank.get(previous.label)) continue;

          const between = protectedHtml.slice(previous.end, current.index);
          const separatorMatch = between.match(
              /(?:\s|&(?:nbsp|ensp|emsp|thinsp);|<br\s*\/?>(?:\s*)?|__CONDITION_TAG_\d+__)*$/i
          );
          const separator = separatorMatch ? separatorMatch[0] : '';
          const breakMatches = [...separator.matchAll(/<br\s*\/?>/gi)];
          const markerOnlySeparator = between
              .replace(/<br\s*\/?>/gi, '')
              .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
              .replace(conditionTagTokenRe, '')
              .replace(/\s+/g, '');
          if (!breakMatches.length && /^[,，、;；:：~〜～∼\-–—…·와]*$/.test(markerOnlySeparator)) continue;
          const markerWrapperStart = findMarkerWrapperStart(separator);
          let normalizedSeparator;
          if (markerWrapperStart) {
              const beforeWrapper = separator.slice(0, markerWrapperStart.index)
                  .replace(/<br\s*\/?>/gi, '')
                  .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
                  .replace(/\s+$/g, '');
              const afterWrapper = separator.slice(markerWrapperStart.index)
                  .replace(/<br\s*\/?>/gi, '')
                  .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
                  .replace(/\s+/g, '');
              normalizedSeparator = beforeWrapper + '<br>' + afterWrapper;
          } else {
              normalizedSeparator = breakMatches.length > 0
                  ? separator.slice(0, breakMatches[0].index)
                      + '<br>'
                      + separator.slice(breakMatches[0].index + breakMatches[0][0].length)
                          .replace(/<br\s*\/?>/gi, '')
                          .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
                          .replace(/^\s+|\s+$/g, '')
                  : separator
                      .replace(/&(?:nbsp|ensp|emsp|thinsp);/gi, '')
                      .replace(/\s+/g, '')
                      + '<br>';
          }

          replacements.push({
              start: current.index - separator.length,
              end: current.index,
              value: normalizedSeparator
          });
      }

      for (let index = replacements.length - 1; index >= 0; index -= 1) {
          const replacement = replacements[index];
          protectedHtml = protectedHtml.slice(0, replacement.start)
              + replacement.value
              + protectedHtml.slice(replacement.end);
      }

      conditionTokenRe.lastIndex = 0;
      return protectedHtml.replace(
          conditionTokenRe,
          (match, index) => tokens[Number(index)] ?? ''
      );
  }

  function normalizeViewBlocks(html) {
      if (!html) return '';
      const normalizedHtml = normalizeConditionMarkerBreaks(normalizeHangulStatementBreaks(html));
      const state = protectRenderSegments(normalizedHtml, { compactBoxBreaks: true });
      const parts = state.splitAtBoxes();
      const normalized = parts.map((part, index) => {
          if (index % 2) return part;
          if (index > 0) part = part.replace(/^(?:<br\s*\/?>\s*){2,}/i, '<br>');
          const trailingBreaks = index + 1 < parts.length ? part.match(/(?:<br\s*\/?>\s*)+$/i) : null;
          if (!trailingBreaks) return addMissingViewBoxes(part, state.protect);
          return addMissingViewBoxes(part.slice(0, trailingBreaks.index), state.protect) + '<br>';
      });
      return state.restore(normalized.join(''));
  }

  function addMissingViewBoxes(html, protect) {
      const oneBreak = breaks => breaks ? '<br>' : '';

      // 보기/조건/자료 라벨은 문자열 시작 또는 명시적 줄바꿈 뒤에서만 블록으로 승격한다.
      // 발문 안의 "보기에서", "보기의", "보기 중" 같은 인라인 단어를 별도 박스로
      // 오인하면 문장이 강제로 줄바꿈되고 뒤 내용 전체가 박스에 들어갈 수 있다.
      let out = html.replace(
          /(^|(?:<br\s*\/?>\s*)+)((?:\[보기\]|&lt;보기&gt;|<보기>)(?=\s|<br\s*\/?>)|(?:보기|조건|자료)\s*:)\s*([\s\S]*?)(?=(?:<br\s*\/?>\s*){2,}|<br\s*\/?>\s*\([1-9]\d*\)|<\/(?:div|p)>|$)/gi,
          (match, boundary, label, body) => {
              const plain = body.replace(/<[^>]+>/g, '').trim();
              const markerCount = (plain.match(/[ㄱㄴㄷㄹㅁ]\.|㉠|㉡|㉢|㉣|㉤|①|②|③|④|⑤/g) || []).length;
              if (plain.length < 60 && markerCount < 2) return match;
              const name = escapeLooseAngleLabels(label);
              const text = body.trim().replace(/^(?:<br\s*\/?>\s*)+/i, '');
              return oneBreak(boundary) + protect(`<div class="question-note-box"><b>${name}</b><br>${text}</div>`);
          }
      );

      out = out.replace(
          /((?:<br\s*\/?>\s*)*)((?:[ㄱㄴㄷㄹㅁ]\.\s*[\s\S]*?){2,})(?=(?:<br\s*\/?>\s*){2,}|<\/(?:div|p)>|$)/g,
          (match, breaks, body) => {
              const plain = body.replace(/<[^>]+>/g, '').trim();
              const markerCount = (plain.match(/[ㄱㄴㄷㄹㅁ]\./g) || []).length;
              if (plain.length < 60 || markerCount < 2) return match;
              return oneBreak(breaks) + protect(`<div class="question-note-box">${body.trim()}</div>`);
          }
      );

      out = out.replace(
          /((?:<br\s*\/?>\s*)*)((?:㉠\s*[\s\S]*?㉡\s*[\s\S]*?(?:㉢|㉣|㉤)[\s\S]*?))(?=(?:<br\s*\/?>\s*){2,}|<\/(?:div|p)>|$)/g,
          (match, breaks, body) => {
              const plain = body.replace(/<[^>]+>/g, '').trim();
              const markerCount = (plain.match(/㉠|㉡|㉢|㉣|㉤/g) || []).length;
              if (plain.length < 60 || markerCount < 3) return match;
              return oneBreak(breaks) + `<div class="question-note-box">${body.trim()}</div>`;
          }
      );

      return out;
  }

  function formatGridAnswer(answer) {
      const raw = String(answer ?? '–').replace(/\s+\/\s+(?=\(\d+\))/g, '<br>');
      // Fraction highlighting is only for plain-text answer atoms.  Injecting
      // HTML spans inside an existing $...$ segment prevents MathJax from
      // recognizing the segment and leaks literal dollar signs into the answer
      // table (notably for fractional coordinates and slope/intercept answers).
      // $ 없이 쓴 TeX 명령(\dfrac, \begin 등)이 든 정답은 wrapLatex가 통째로 수식으로 감싸므로 span을 넣지 않는다(수식 안에 HTML이 들어가 깨진다).
      const bareTex = /\\[a-zA-Z]/.test(raw.replace(/\\n(?![a-zA-Z])/g, ''));
      const value = raw.split(/(\$[^$]*\$)/g).map(part => {
          if (bareTex || (part.startsWith('$') && part.endsWith('$'))) return part;
          return part.replace(/\b\d+\/\d+\b/g, match => `<span class="ans-atomic">${match}</span>`);
      }).join('');
      return wrapLatex(value);
  }

  // 원본 시험지 본문 일부는 "15. 다음 …"처럼 문항 번호로 시작한다. 엔진이 q-num으로 번호를 따로 붙이므로 그대로 그리면
  // 화면·인쇄에 "15. 15. 다음 …"이 되고, 문제지 만들기·진단평가로 순서가 바뀌면 "3. 15. 다음 …"처럼 엉뚱한 번호가 남는다.
  // 원본 파일은 고치지 않고(공유 데이터 고정값) 그리는 단계에서 렌더 사본의 앞 번호만 뗀다. 저장·지문 경로는 이 함수를 거치지 않는다.
  // 조건을 좁게 둔다: 맨 앞(선택적 <p> 뒤)의 "N." 또는 "N)" 다음에 공백이 있고 본문이 이어지며, N이 이 문항의 원래 번호(q.id의 숫자)와 정확히 같을 때만.
  // 번호가 다른 문항(서술형 번호가 1부터 다시 시작하는 시험지), 소수 "15.5", 수식 `$15.$` 안, 번호가 없는 문항은 그대로 둔다.
  const LEADING_QUESTION_NUMBER_RE = /^((?:\s|<br\s*\/?>)*(?:<p(?:\s[^>]*)?>\s*)?)(\d{1,3})(?:\.|．|\))\s+(?=\S)/i;
  function stripLeadingQuestionNumber(html, q) {
      if (typeof html !== "string" || !q) return html;
      // 원래 번호: 숫자 id("15") 또는 영문 한두 글자가 앞에 붙은 id("Q22", "q19"). 그 밖의 id는 번호로 보지 않는다.
      const idMatch = /^(?:[A-Za-z]{1,2})?(\d{1,3})$/.exec(String(q.id ?? "").trim());
      if (!idMatch) return html;
      const match = LEADING_QUESTION_NUMBER_RE.exec(html);
      if (!match || Number(match[2]) !== Number(idMatch[1])) return html;
      return match[1] + html.slice(match[0].length);
  }

  return {
    stripLeadingQuestionNumber,
    wrapLatex,
    normalizeSolutionLineBreaks,
    extractChoice,
    stripChoicePrefix,
    detectChoiceRenderMode,
    renderChoicesHTML,
    protectRenderSegments,
      normalizeQuestionContentBreaks,
    normalizeHangulStatementBreaks,
    normalizeConditionMarkerBreaks,
    normalizeViewBlocks,
    formatGridAnswer,
    setTableEngine
  };
});
