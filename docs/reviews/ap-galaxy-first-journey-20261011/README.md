# AP Galaxy first journey — real canonical item workflow

- Base: 3da5863ad453f84568ec55538c8b9e2a7f292df7
- New head: 83a8f51c85124d8d28b19cd4e6c9b0f8bfd8f1dc
- Browser: Chromium headless with SwiftShader software WebGL, 1600×900 DPR1.
- Single sample: 2026 삼산중 1학기 중간, canonical JS source, 24 declared IDs. No exam/solution/answer iframe stub.
- Workflow: galaxy → exam star → 24-node orbit → q2 problem → answer → solution → full exam/print control → close/restore.
- Real content screenshot sequence: journey-1 through journey-7; journey-real-content.webm.
- Before/after WebGL clear-call frame proxy (3×2.5s): before 5.6, 5.2, 5.6; after 5.59, 5.19, 5.2. Same software renderer, not physical PC GPU throughput.
- Reduced motion: {"isWarp":false,"motionPressed":"true"}
- Rapid latest-wins/switching: [{"file":"26_삼산중_1학기_중간_중3_기출.js","count":24},{"latest":"26_삼산중_1학기_기말_중3_기출.js","count":24}]
- Movement cancellation: {"moving":false,"selectedGroup":false,"query":"삼산중"}
- Injected source failure and recovery: {"explicitStatus":true,"fabricatedNodes":0,"expectedBrowserErrors":[{"which":"after","type":"console","message":"Failed to load resource: net::ERR_FAILED"}],"recoveryCount":24}
- Browser page/console errors outside intentional failure injection: 0
- Known gaps: GPU performance on the actual PC, mobile 54-star browser test, browser history outside this tab, real physical printer were not verified.
