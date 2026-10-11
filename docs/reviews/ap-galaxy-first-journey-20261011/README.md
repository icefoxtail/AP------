# AP Galaxy first journey — real canonical item workflow

- Base: 3da5863ad453f84568ec55538c8b9e2a7f292df7
- New head: 5e3098be204d467a33e5abba0b121559c8a1763d
- Browser: Chromium headless with SwiftShader software WebGL, 1600×900 DPR1.
- Single sample: 2026 삼산중 1학기 중간, canonical JS source, 24 declared IDs. No exam/solution/answer iframe stub.
- Workflow: galaxy → real exam → q2 single-column problem/answer/solution → full layout → standalone print pointer-ready → close/restore.
- Real content screenshot sequence: journey-1 through journey-7; journey-real-content.webm.
- Before/after WebGL clear-call frame proxy (3×2.5s): before 4.8, 4.79, 5.2; after 4.4, 5.2, 4.79. Same software renderer, not physical PC GPU throughput.
- Reduced motion: {"isWarp":false,"motionPressed":"true"}
- Rapid latest-wins/switching: [{"file":"26_삼산중_1학기_중간_중3_기출.js","count":24,"lastQuestion":{"file":"exams/original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js","number":"2."}},{"latest":"26_삼산중_1학기_기말_중3_기출.js","count":24}]
- Movement cancellation and flight finish: [{"moving":false,"selectedGroup":false,"query":"삼산중"},{"moving":false,"focused":true,"instant":"true"}]
- Reader, print and loading-race tests: [{"reading":true,"font":16,"grid":"block","transform":"none","width":456,"frameWidth":484,"overflow":false,"visualOverflow":false},{"url":"http://127.0.0.1:38007/archive/engine.html?data=exams%2Foriginal%2Fmiddle%2Fm3%2F1mid%2F26_%EC%82%BC%EC%82%B0%EC%A4%91_1%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EC%A4%913_%EA%B8%B0%EC%B6%9C.js&mode=exam&title=2026%EB%85%84+%C2%B7+1%ED%95%99%EA%B8%B0+%EC%A4%91%EA%B0%84%EA%B3%A0%EC%82%AC+%C2%B7+%EC%82%BC%EC%82%B0%EC%A4%91+%C2%B7+%EC%A4%913+%C2%B7+%EC%A4%913+%EC%88%98%ED%95%99&subject=%EC%A4%913+%EC%88%98%ED%95%99&q=24&qpp=4","visible":true,"enabled":true,"pointerTrial":true,"standaloneExam":{"renderedQuestionCount":24,"firstQuestion":"1.","lastQuestion":"24.","pageCount":7,"layout":"grid"},"printOutputVerified":false,"physicalPrinter":false},{"file":"exams/original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js","number":"2."},{"file":"exams/original/middle/m3/1final/26_삼산중_1학기_기말_중3_기출.js","number":"1."}]
- Injected source failure and recovery: {"explicitStatus":true,"fabricatedNodes":0,"expectedBrowserErrors":[{"which":"after","type":"console","message":"Failed to load resource: net::ERR_FAILED"}],"recoveryCount":24}
- Browser page/console errors outside intentional failure injection: 0
- Known gaps: GPU performance on the actual PC, mobile 54-star browser test, browser history outside this tab, real physical printer were not verified.
