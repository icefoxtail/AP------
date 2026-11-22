'use strict';
// 절대 시간 문턱(ms)을 CI에서도 깨지지 않게 하는 도우미.
// 이유: 공용 러너는 부하에 따라 같은 코드가 2~3배 흔들려(예: 500ms 문턱이 640~1300ms) 병합마다 빨강이 났다.
// 로컬(CI 아님)에서는 원래 문턱을 그대로 쓰고, CI에서는 10배로 넓혀 수 초 단위의 실제 회귀(복잡도 폭증·동기 대기)만 잡는다.
const slack = process.env.CI || process.env.GITHUB_ACTIONS ? 10 : 1;
module.exports = function timeBudget(ms) { return ms * slack; };
