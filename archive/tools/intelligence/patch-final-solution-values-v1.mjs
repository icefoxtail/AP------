import fs from 'node:fs';
import path from 'node:path';

const repo = process.env.AP_REPO || process.cwd();
const values = {
  'archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_수학II.js': {
    21: {
      answer: '극솟값 −1/9, 극댓값 1/9',
      solution: '풀이: P=(t,t³), Q=(t,t)이고 R은 선분 PQ를 3:1로 외분하므로 외분점 공식에 따라 R의 y좌표는 f(t)=(3t³−t)/2이다. f′(t)=(9t²−1)/2이므로 임계점은 t=−1/3, 1/3이다. f(−1/3)=1/9, f(1/3)=−1/9이므로 극댓값은 1/9, 극솟값은 −1/9이다.'
    },
    22: {
      answer: '10',
      solution: '풀이: I=∫₀¹f(t)dt라 두면 주어진 식에서 f(t)=3t²+2I이다. 양변을 0부터 1까지 적분하면 I=∫₀¹(3t²+2I)dt=1+2I이므로 I=−1이다. 따라서 f(2)=3·2²+2I=12−2=10이다.'
    },
    23: {
      answer: '7개',
      solution: '풀이: 도함수 그래프의 영점은 x=−2, 2이고 꼭짓점은 (0,3)이므로 f′(x)=3−(3/4)x²이다. f(0)=0을 이용해 적분하면 f(x)=3x−x³/4이다. 따라서 f(−2)=−4, f(2)=4이고, 함수 f(x)=k가 서로 다른 세 실근을 가지려면 −4<k<4이어야 한다. 이 범위의 정수는 −3,−2,−1,0,1,2,3의 7개이다.'
    }
  },
  'archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_확률과통계_기출.js': {
    22: {
      answer: '8/15',
      solution: '풀이: 정답지의 분포표에서 X=0,1,2의 확률은 각각 23/90, 4/9, 2/45이다. 따라서 E(X)=0·(23/90)+1·(4/9)+2·(2/45)=4/9+4/45=20/45+4/45=24/45=8/15이다.'
    }
  },
  'archive/exams/original/middle/m1/2final/23_연향중_2학기_기말_중1_기출.js': {
    21: {
      answer: '130π−200',
      solution: '풀이: 한 변이 20cm인 정사각형에서 큰 호는 반지름 20cm인 사분원의 호이고, 안쪽 두 호는 각각 반지름 10cm인 사분원의 호이다. 색칠한 두 부분의 둘레를 합하면 큰 사분원 호의 길이 10π와 안쪽 사분원 호 네 개의 길이 20π를 더한 30πcm이다. 색칠한 두 부분의 넓이는 서로 같은 두 활꼴의 넓이이다. 한 활꼴의 넓이는 반지름 10cm인 두 사분원에서 생기는 부채꼴 넓이와 직각삼각형 넓이를 이용하여 50π−100cm²이고, 두 부분의 넓이는 100π−200cm²이다. 따라서 x+y=30π+(100π−200)=130π−200이다.'
    },
    22: {
      answer: '112cm²',
      solution: '풀이: 위와 아래의 밑면은 각각 한 변이 4cm, 6cm인 정사각형이므로 밑넓이의 합은 4²+6²=52cm²이다. 옆면은 합동인 사다리꼴 4개이고, 각 사다리꼴의 평행한 두 변은 4cm와 6cm, 높이는 3cm이다. 한 옆면의 넓이는 (4+6)×3÷2=15cm²이므로 옆넓이는 4×15=60cm²이다. 따라서 겉넓이는 52+60=112cm²이다.'
    }
  },
  'archive/exams/original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js': {
    21: {
      answer: '627πm²',
      solution: '풀이: 정육각형의 한 내각은 120°이므로 P에서 꽃밭 바깥으로 움직일 수 있는 부채꼴의 중심각은 360°−120°=240°이다. 끈의 길이가 30m이므로 이 부분의 넓이는 (240/360)π×30²=600πm²이다. 끈이 한 변 21m를 따라 양옆의 꼭짓점까지 감기면 남는 길이는 30−21=9m이고, 각 꼭짓점에서 외각 60°인 부채꼴이 하나씩 더 생긴다. 추가 넓이는 2×(60/360)π×9²=27πm²이다. 따라서 움직일 수 있는 영역의 넓이는 600π+27π=627πm²이다.'
    },
    22: {
      answer: '밑넓이 25cm², 옆넓이 10xcm², x=8',
      solution: '풀이: 밑면은 한 변 5cm인 정사각형이므로 밑넓이는 5²=25cm²이다. 옆면 네 개는 밑변 5cm, 높이 xcm인 합동인 삼각형이므로 한 옆면의 넓이는 5x÷2이고 옆넓이는 4×(5x÷2)=10xcm²이다. 겉넓이가 105cm²이므로 25+10x=105, 10x=80, x=8이다.'
    },
    23: {
      answer: '원뿔−원기둥, 24πcm³',
      solution: '풀이: 회전축 l을 기준으로 보면 전체 도형은 밑면의 반지름 4cm, 높이 6cm인 원뿔이 되고, 색칠하지 않은 부분은 반지름 2cm, 높이 2cm인 원기둥이 된다. 따라서 회전체의 부피는 원뿔의 부피에서 원기둥의 부피를 뺀 값이다. (1/3)π×4²×6−π×2²×2=32π−8π=24πcm³이다. 빈칸에는 차례로 원뿔, 원기둥을 쓴다.'
    }
  }
};

let changedFiles = 0;
let changedQuestions = 0;
for (const [rel, byId] of Object.entries(values)) {
  const file = path.join(repo, rel);
  const original = fs.readFileSync(file, 'utf8');
  const marker = original.indexOf('window.questionBank');
  let bank = original.slice(marker);
  for (const [id, value] of Object.entries(byId)) {
    const objectRe = new RegExp(`("id"\\s*:\\s*${id},[\\s\\S]*?)(?=\\n\\s*"id"\\s*:\\s*\\d+|\\n\\s*\\]\\s*;)`);
    const match = bank.match(objectRe);
    if (!match) throw new Error(`question ${id} not found in ${rel}`);
    const next = match[1].replace(/("answer"\s*:\s*)"(?:[^"\\]|\\.)*"/, `$1${JSON.stringify(value.answer)}`)
      .replace(/("solution"\s*:\s*)"(?:[^"\\]|\\.)*"(?=\s*,\s*\n\s*"subUnitKey")/, `$1${JSON.stringify(value.solution)}`);
    if (next === match[1]) continue;
    bank = bank.replace(match[1], next);
    changedQuestions++;
  }
  if (bank !== original.slice(marker)) {
    fs.writeFileSync(file, original.slice(0, marker) + bank, 'utf8');
    changedFiles++;
  }
}
console.log(JSON.stringify({ changedFiles, changedQuestions }));
