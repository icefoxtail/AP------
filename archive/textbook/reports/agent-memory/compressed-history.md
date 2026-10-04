# Compressed History

The `archive/textbook` pipeline has evolved into a staged textbook/exam extraction workflow. It handles source PDFs, answer PDFs, page crops, question crops, visual assets, content/choices entry, answer filling, formula repair, validation, and review packs.

Recent work created a report-only Hermes-style draft layer from six JSON files under `reports/textbook_hermes_*_20260525.json`. The purpose was not to install Hermes Agent, but to borrow the operating ideas of boot documents, skill SOPs, memory, plans, workstream locks, trajectory compression, and self-improvement suggestions.

Important historical themes:

- Queue runner and stage contracts exist, but handoff state is scattered.
- Full page crop evidence is mandatory for reliable content entry.
- Answer mapping is fragile when display numbers restart by setKey/unit.
- Manual review, stale JS, failed stage, and answer missing reports need queue conversion.
- Formula repair work has used report/dry-run/applyability separation.
- Parallel work needs jsFile/report locks before multiple Codex windows edit anything.

This memory layer is a starting point. It does not execute stages and does not modify generated output.

