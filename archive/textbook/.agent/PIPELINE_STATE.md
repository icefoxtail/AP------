# PIPELINE_STATE

## 1. Pipeline Character

- The `archive/textbook` pipeline converts textbook and exam source materials into JS archive compatible output.
- The goal is not blind completion; the goal is source-backed output plus automatic separation of uncertain items.
- The output target is archive-compatible JS.
- Automatic `solution` generation is excluded by default.

## 2. Protected Areas

- `generated/js`
- `generated/reports`
- `generated/assets`
- `generated/review_pack`
- `archive/exams`
- `apmath`
- operational HTML files
- package files

## 3. Current Main Bottlenecks

- Full page/source image evidence gaps.
- Answer source mapping gaps.
- `question_crop_map` and `sourceDisplayNo` evidence gaps.
- `manual_review` results do not automatically become the next task queue.
- Parallel work can collide on the same JS file.
- Temporary OCR/crop files can pollute the working tree.

## 4. Next Priorities

- Normalize manual review, failed, and pending queues.
- Maintain a book status board.
- Apply workstream locks before parallel work.
- Organize answer-source evidence.
- Enter content/choices only from full page/source-backed evidence.
- Handle formula repair only by source-backed or exact-once patch rules.

## 5. Not Yet Done

- Hermes runtime adoption.
- Pipeline code integration.
- Automatic stage execution through this `.agent` layer.
- Bulk generated output modification.

