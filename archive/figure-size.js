(function attachFigureSize(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APFigureSize = api;
})(typeof window !== 'undefined' ? window : globalThis, function createFigureSize(root) {
    'use strict';

    // 그림 크기 규칙 (2026-11-18 사용자 결정): 그림 크기는 "그림이 놓인 단 폭에 대한 비율 하나"로 정한다.
    // 크기 숫자와 CSS 규칙은 figure-size.css에 있고, 이 파일은 CSS가 알 수 없는 것(그림이 가로로 긴지, 묶음인지,
    // 그림 하나의 배율 덮어쓰기가 있는지)을 그림 요소에 data 속성으로 붙이기만 한다. 크기 값은 이 파일에 쓰지 않는다.
    //   data-ap-fig="wide"    자연 폭:높이 >= 2:1 (수직선·좌표 띠 등)
    //   data-ap-fig="bundle"  묶음 그림(줄이지 않고 단 폭 전체까지)
    //   data-ap-fig="scaled"  그림 하나 배율 덮어쓰기(data-scale="30~100", 인라인 style 변수 --ap-fig-scale)
    const SCALE_MIN = 30;
    const SCALE_MAX = 100;
    const WIDE_RATIO = 2;

    const SVG_INLINE = 'svg:not(mjx-container svg, .katex svg, svg svg)';
    const SCOPES = ['.q-content', '.q-image-wrap', '[data-semantic-content="1"]', '.choices', '.sol-image-wrap', '.sol-exp', '.sol-chunk'];
    const FIGURE_SELECTOR = SCOPES.map(scope => `${scope} img, ${scope} ${SVG_INLINE}`).join(', ');
    const SOLUTION_SCOPE = '.sol-image-wrap, .sol-exp, .sol-chunk';

    // 한 칸 보기(①~⑤, (1)~(5) 등 기호만 있는 칸)인지.
    const CHOICE_MARKER_ONLY = /^\s*(?:[①-⑳]|\(\s*\d+\s*\)|\d+\s*[.)])?\s*$/;

    function extractChoice(choice) {
        if (choice === null || choice === undefined) return '';
        if (typeof choice === 'object') return String(choice.text || choice.content || choice.value || choice.answer || Object.values(choice)[0] || '');
        return String(choice);
    }

    // 객관식 답 꼴(①~⑤ 하나 또는 여럿). 숫자·글자 답(주관식·단답형)은 해당하지 않는다.
    const OBJECTIVE_ANSWER = /^\s*[①-⑤](?:\s*[,，、]?\s*[①-⑤])*\s*$/;

    // 보기 칸(choices)이 아예 없거나 빈 배열인 객관식 문항: 답이 ①~⑤ 꼴이고 그림이 있으며, 발문 글자(태그·alt 제외)에 ①·② 보기가 함께 없으면 보기가 그림 안에 있다.
    // 이 판정은 크기 규칙(묶음 그림) 전용이다. 문항 결속(question-binding.js)은 자기 판정을 따로 가지며 이 함수를 쓰지 않는다.
    function emptyChoicesAreFigure(question) {
        const choices = question.choices;
        if (choices !== undefined && choices !== null && !(Array.isArray(choices) && choices.length === 0)) return false;
        if (!OBJECTIVE_ANSWER.test(String(question.answer === undefined || question.answer === null ? '' : question.answer))) return false;
        if (/주관|서술|단답/.test(String(question.questionType || question.type || ''))) return false;
        const content = String(question.content || question.question || '');
        if (!(Boolean(question.image) || /<img\b|<svg\b/i.test(content))) return false;
        const visibleText = content.replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ').replace(/<[^>]*>/g, ' ');
        return !(visibleText.includes('①') && visibleText.includes('②'));
    }

    // (c) 보기가 전부 비었거나 번호 기호뿐인데 문항에 그림이 있으면 보기 내용이 그림 안에 있다. (d) choicesEmbeddedInImage === true.
    // 보기 칸이 아예 없거나 빈 배열인 객관식(답 ①~⑤ 꼴)은 emptyChoicesAreFigure가 맡는다. 주관식·한 칸뿐인 문항은 그림 속 보기로 보지 않는다.
    function choicesAreFigure(question) {
        if (!question || typeof question !== 'object') return false;
        if (question.choicesEmbeddedInImage === true || question.sourcePayload?.choicesEmbeddedInImage === true) return true;
        if (emptyChoicesAreFigure(question)) return true;
        const choices = question.choices;
        if (!Array.isArray(choices) || choices.length < 2) return false;
        const texts = choices.map(extractChoice);
        if (texts.some(text => text.trim() === '주관식')) return false;
        if (!texts.every(text => CHOICE_MARKER_ONLY.test(text))) return false;
        const content = String(question.content || question.question || '');
        return Boolean(question.image) || /<img\b|<svg\b/i.test(content);
    }

    // 배율은 숫자 30~100(단 폭 대비 %)만 인정한다. 범위 밖이거나 숫자가 아니면 null(기본값을 쓴다).
    function parseScale(value) {
        if (value === null || value === undefined || value === '') return null;
        if (typeof value !== 'number' && typeof value !== 'string') return null;
        const text = String(value).trim();
        if (!/^\d+(?:\.\d+)?$/.test(text)) return null;
        const number = Number(text);
        return Number.isFinite(number) && number >= SCALE_MIN && number <= SCALE_MAX ? number : null;
    }

    function naturalRatio(element) {
        if (!element) return 0;
        if (String(element.tagName || '').toLowerCase() === 'img') {
            const width = Number(element.naturalWidth) || 0;
            const height = Number(element.naturalHeight) || 0;
            return width > 0 && height > 0 ? width / height : 0;
        }
        const viewBox = String(element.getAttribute?.('viewBox') || '').trim().split(/[\s,]+/).map(Number);
        if (viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) return viewBox[2] / viewBox[3];
        const width = parseFloat(element.getAttribute?.('width'));
        const height = parseFloat(element.getAttribute?.('height'));
        return width > 0 && height > 0 ? width / height : 0;
    }

    function kindOf(element) {
        if (element.closest('.choices')) return 'choice';
        if (element.closest(SOLUTION_SCOPE)) return 'solution';
        return 'problem';
    }

    function setMark(element, value, scale) {
        if (value) element.setAttribute('data-ap-fig', value);
        else element.removeAttribute('data-ap-fig');
        if (value === 'scaled') element.style.setProperty('--ap-fig-scale', String(scale / 100));
        else if (element.style?.getPropertyValue('--ap-fig-scale')) element.style.removeProperty('--ap-fig-scale');
    }

    // 렌더 때 그림이 모두 불러와진 뒤, 쪽 배치 측정 전에 한 번 부른다(같은 입력이면 같은 결과이므로 여러 번 불러도 안전하다).
    function classify(scope) {
        const summary = { total: 0, wide: 0, bundle: 0, scaled: 0 };
        if (!scope || typeof scope.querySelectorAll !== 'function') return summary;
        const elements = new Set(scope.querySelectorAll(FIGURE_SELECTOR));
        if (typeof scope.matches === 'function' && scope.matches(FIGURE_SELECTOR)) elements.add(scope);
        // 한 문항 본문에 그림이 2개 이상이면 묶음: 문항(.q-box) 단위로 센다.
        const countByBox = new Map();
        const problemCount = box => {
            if (!countByBox.has(box)) countByBox.set(box, Array.from(box.querySelectorAll(FIGURE_SELECTOR)).filter(figure => kindOf(figure) === 'problem').length);
            return countByBox.get(box);
        };
        elements.forEach(element => {
            const kind = kindOf(element);
            const box = element.closest('.q-box');
            const scale = parseScale(element.getAttribute('data-scale'));
            let value = '';
            if (scale !== null) value = 'scaled';
            else if (kind === 'choice') value = 'bundle';
            else if (kind === 'problem' && box && (box.dataset?.apFigBundle === '1' || problemCount(box) >= 2)) value = 'bundle';
            else if (naturalRatio(element) >= WIDE_RATIO) value = 'wide';
            setMark(element, value, scale);
            summary.total += 1;
            if (value) summary[value] += 1;
        });
        return summary;
    }

    // 새 규칙이 실제로 적용되는 화면인지(= figure-size.css의 변수가 있는 화면). 휴대폰 읽기 배치(<=640px 화면)에는 변수를 주지 않아
    // 옛 규칙이 그대로 쓰이고, 이 파일을 안 부르는 오답 엔진도 옛 규칙이다.
    function isActive(doc) {
        const document = doc || root?.document;
        try {
            return Boolean(document?.documentElement
                && typeof root.getComputedStyle === 'function'
                && root.getComputedStyle(document.documentElement).getPropertyValue('--ap-fig-sol').trim() !== '');
        } catch (error) {
            return false;
        }
    }

    return Object.freeze({ SCALE_MIN, SCALE_MAX, WIDE_RATIO, FIGURE_SELECTOR, choicesAreFigure, parseScale, naturalRatio, classify, isActive });
});
