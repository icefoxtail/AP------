# Figure-state handoff

The five original `figure-state.json` snapshots are preserved by immutable reference rather than duplicated into this branch. They contain the plan, model, composed output, capture metadata, and source/asset identity needed for a later independent review. This index does not change review status.

Source commit: https://github.com/icefoxtail/AP------/commit/d305548080a64c8ff7086fd86940336e870d1ae8

- q02: [original file](https://github.com/icefoxtail/AP------/blob/d305548080a64c8ff7086fd86940336e870d1ae8/svg-plan-staging/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A01_%EA%B8%B0%EC%B6%9C/rendered/q02/figure-state.json); exact path `svg-plan-staging/23_강남여고_2학기_기말_고1_기출/rendered/q02/figure-state.json`; blob SHA `4495f84d2f449ff153e2ba7023691dc76146de36`.
- q03: [original file](https://github.com/icefoxtail/AP------/blob/d305548080a64c8ff7086fd86940336e870d1ae8/svg-plan-staging/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A01_%EA%B8%B0%EC%B6%9C/rendered/q03/figure-state.json); exact path `svg-plan-staging/23_강남여고_2학기_기말_고1_기출/rendered/q03/figure-state.json`; blob SHA `da0ba00d252bcef155a0a0635b476a88621e9c86`.
- q12: [original file](https://github.com/icefoxtail/AP------/blob/d305548080a64c8ff7086fd86940336e870d1ae8/svg-plan-staging/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A01_%EA%B8%B0%EC%B6%9C/rendered/q12/figure-state.json); exact path `svg-plan-staging/23_강남여고_2학기_기말_고1_기출/rendered/q12/figure-state.json`; blob SHA `c275420e84b0a5139b93f8550c1b346986ffe765`.
- q21: [original file](https://github.com/icefoxtail/AP------/blob/d305548080a64c8ff7086fd86940336e870d1ae8/svg-plan-staging/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A01_%EA%B8%B0%EC%B6%9C/rendered/q21/figure-state.json); exact path `svg-plan-staging/23_강남여고_2학기_기말_고1_기출/rendered/q21/figure-state.json`; blob SHA `89bf78d1bdb7c7319f17fde62550f3a6f1682ba4`.
- q23: [original file](https://github.com/icefoxtail/AP------/blob/d305548080a64c8ff7086fd86940336e870d1ae8/svg-plan-staging/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A01_%EA%B8%B0%EC%B6%9C/rendered/q23/figure-state.json); exact path `svg-plan-staging/23_강남여고_2학기_기말_고1_기출/rendered/q23/figure-state.json`; blob SHA `8de5ca568d9e2f69cd77b09cda8088f5b0aada7f`.

## Review and source lineage

The copied `STATUS.json` files remain `OPEN`, with render status `RENDERED`, engine validation `ARCHIVE_BOUND`, and Claude's independent review still pending. This consolidation does not promote or re-state review status; CI, a new render, and independent Claude review were not run here.

The `ROOT_PLAN.md` baseline is common-branch exam-JS blob `a10eb7fe8c6669b3c90aeeb06758dccf43a51117`. At the immutable source commit above, the Gangnam exam JS blob is `8f75644fd393e170e4fefcc1c4be21625e17d137`; comparison found its only difference from the common-branch version in Q17's `solutionImage`, `solutionImageAlt`, `solutionImageCaption`, and `solutionImageSize` fields. The five copied candidates (Q2, Q3, Q12, Q21, Q23) are JSON-identical between the two exam-JS versions. This branch addition leaves both exam-JS files and `main` unchanged; Q17 is outside this copy.
