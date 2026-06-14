(function () {
    function clean(value) {
        return String(value == null ? '' : value).replace(/\s+/g, '').trim();
    }

    function normalizeEieGrade(value) {
        var raw = clean(value);
        if (!raw) return '';

        var aliases = {
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

        var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return '중' + middle[1];

        var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return '고' + high[1];

        return '';
    }

    function gradeBand(value) {
        var grade = normalizeEieGrade(value);
        if (/^중[1-3]$/.test(grade)) return 'middle';
        if (/^고[1-3]$/.test(grade)) return 'high';
        return '';
    }

    function gradeSortValue(value) {
        var grade = normalizeEieGrade(value);
        return ['중1', '중2', '중3', '고1', '고2', '고3'].indexOf(grade);
    }

    window.EieGradeUtils = {
        normalizeEieGrade: normalizeEieGrade,
        gradeBand: gradeBand,
        gradeSortValue: gradeSortValue
    };
})();
