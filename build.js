const fs = require('fs');
const path = require('path');

const examsDir = path.join(__dirname, 'exams');
const outputFile = path.join(__dirname, 'db.js');

const db = { exams: [] };

try {
    const files = fs.readdirSync(examsDir);
    
    files.forEach(file => {
        if (file.endsWith('.js')) {
            // 파일명 형식: 25_순천고2_1학기_중간_대수.js
            const parts = file.replace('.js', '').split('_');
            
            if (parts.length >= 4) {
                const year = parts[0] ? "20" + parts[0] : "";
                const schoolRaw = parts[1] || "";
                const school = schoolRaw.replace(/[0-9]/g, '');
                const gradeNum = schoolRaw.replace(/[^0-9]/g, '');
                
                let grade = "";
                if (gradeNum) {
                    grade = (school.includes('중') ? '중' : '고') + gradeNum;
                } else if (parts[4] && parts[4].match(/^[중고][1-3]$/)) {
                    grade = parts[4];
                }

                let subject = "";
                if (parts[4] && !parts[4].match(/^[중고][1-3]$/)) {
                    subject = parts[4];
                }

                db.exams.push({
                    year: year,
                    school: school,
                    grade: grade,
                    semester: parts[2] ? parts[2].replace('학기', '') : "",
                    examType: parts[3] === '중간' ? 'mid' : (parts[3] === '기말' ? 'final' : ''),
                    subject: subject,
                    file: file,
                    type: 'exam'
                });
            }
        }
    });
    
    // 생성된 객체를 db.js 규격에 맞춰 저장
    const output = `window.mainDB = ${JSON.stringify(db, null, 4)};`;
    fs.writeFileSync(outputFile, output, 'utf-8');
    
    console.log(`[완료] 총 ${db.exams.length}개의 파일이 db.js에 일괄 등록되었습니다.`);
    
} catch (error) {
    console.error('디렉토리 읽기 또는 파일 쓰기 오류:', error);
}