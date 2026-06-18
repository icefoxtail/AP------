(function () {
    function clean(value) {
        return String(value == null ? '' : value).replace(/\s+/g, '').trim();
    }

    function normalizeEieGrade(value) {
        var raw = clean(value);
        if (!raw) return '';

        var aliases = {
            '초1': '초1',
            '초등1': '초1',
            '초등1학년': '초1',
            '초등학교1': '초1',
            '초등학교1학년': '초1',
            '초2': '초2',
            '초등2': '초2',
            '초등2학년': '초2',
            '초등학교2': '초2',
            '초등학교2학년': '초2',
            '초3': '초3',
            '초등3': '초3',
            '초등3학년': '초3',
            '초등학교3': '초3',
            '초등학교3학년': '초3',
            '초4': '초4',
            '초등4': '초4',
            '초등4학년': '초4',
            '초등학교4': '초4',
            '초등학교4학년': '초4',
            '초5': '초5',
            '초등5': '초5',
            '초등5학년': '초5',
            '초등학교5': '초5',
            '초등학교5학년': '초5',
            '초6': '초6',
            '초등6': '초6',
            '초등6학년': '초6',
            '초등학교6': '초6',
            '초등학교6학년': '초6',
            '중1': '중1',
            '중학교1': '중1',
            '중학교1학년': '중1',
            '중등1': '중1',
            '중등1학년': '중1',
            '중2': '중2',
            '중학교2': '중2',
            '중학교2학년': '중2',
            '중등2': '중2',
            '중등2학년': '중2',
            '중3': '중3',
            '중학교3': '중3',
            '중학교3학년': '중3',
            '중등3': '중3',
            '중등3학년': '중3',
            '고1': '고1',
            '고등1': '고1',
            '고등1학년': '고1',
            '고등학교1': '고1',
            '고등학교1학년': '고1',
            '고2': '고2',
            '고등2': '고2',
            '고등2학년': '고2',
            '고등학교2': '고2',
            '고등학교2학년': '고2',
            '고3': '고3',
            '고등3': '고3',
            '고등3학년': '고3',
            '고등학교3': '고3',
            '고등학교3학년': '고3'
        };
        if (aliases[raw]) return aliases[raw];

        var elementary = raw.match(/^초(?:등|등학교)?([1-6])(?:학년)?$/);
        if (elementary) return '초' + elementary[1];

        var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return '중' + middle[1];

        var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return '고' + high[1];

        return '';
    }

    function gradeBand(value) {
        var grade = normalizeEieGrade(value);
        if (/^초[1-6]$/.test(grade)) return 'elementary';
        if (/^중[1-3]$/.test(grade)) return 'middle';
        if (/^고[1-3]$/.test(grade)) return 'high';
        return '';
    }

    function gradeSortValue(value) {
        var grade = normalizeEieGrade(value);
        return ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'].indexOf(grade);
    }

    window.EieGradeUtils = {
        normalizeEieGrade: normalizeEieGrade,
        gradeBand: gradeBand,
        gradeSortValue: gradeSortValue
    };
})();
