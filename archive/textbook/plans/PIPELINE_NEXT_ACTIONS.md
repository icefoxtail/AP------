# PIPELINE_NEXT_ACTIONS

## P0

| Action | Source Report | Target Output | Forbidden |
| --- | --- | --- | --- |
| Protect generated JS before any data task | `.agent/BOOT.md` | declared allowed/forbidden files | blind JS edits |
| Clean dirty temporary files only after explicit approval | `git status` | cleanup plan | deleting user work |
| Normalize manual review queues | latest manual review reports | `reports/agent-memory/manual-review-queue.json` | solving uncertain items |
| Organize answer source evidence | answer reports and source maps | future answer-source queue | answer guessing |

## P1

| Action | Source Report | Target Output | Forbidden |
| --- | --- | --- | --- |
| Refresh book status board | current generated reports | updated `plans/BOOK_STATUS_BOARD.md` | guessed counts |
| Write workstream assignments | status board and queue files | `plans/PARALLEL_WORK_ASSIGNMENTS.md` | same JS lock collision |
| Classify remaining content/answer items | manual review reports | queue files | broad `direct_solve_uncertain` bucket |

## P2

| Action | Source Report | Target Output | Forbidden |
| --- | --- | --- | --- |
| Continue formula occurrence patch review | formula reports | patch candidate report | semantic rewrite |
| Split review packs | review pack reports | scoped review zips | editing operating JS |
| List pipeline stage improvement candidates | validation/failure reports | suggestion report | modifying pipeline code without approval |

