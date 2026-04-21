const fs = require('fs');
const path = require('path');

// 1. PDF 파일이 위치한 경로 (현재 폴더 기준)
const directoryPath = './'; 

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    // 2. PDF 파일만 필터링하여 데이터 구조화
    const catalog = files
        .filter(file => path.extname(file).toLowerCase() === '.pdf')
        .map((file, index) => {
            // 파일명에 '해설'이 포함되어 있으면 answer, 아니면 question으로 분류
            const type = file.includes('해설') ? 'answer' : 'question';
            return {
                id: index + 1,
                name: file,
                type: type
            };
        });

    // 3. catalog.js 파일로 저장
    const content = `const catalog = ${JSON.stringify(catalog, null, 2)};`;
    
    fs.writeFile('catalog.js', content, (err) => {
        if (err) throw err;
        console.log('총 ' + catalog.length + '개 파일이 catalog.js로 성공적으로 전사되었습니다.');
    });
});