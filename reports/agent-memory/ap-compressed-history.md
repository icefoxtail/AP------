# AP Compressed History

Date: 2026-05-26

AP------ contains AP Math OS/APMS, docs, Worker/D1 backup, archive/exams, archive/textbook, student/planner/homework portals, OMR/QR/report flows, timetable/classroom, billing/operations, and public/brand materials.

On 2026-05-26, a report-only Hermes migration assessment created AP domain maps and concluded that AP root can safely adopt a document-only operating layer. A follow-up source recheck reviewed Hermes Agent structure and excluded runtime, dependency, MCP, daemon, cron, gateway, runner, git, deploy, remote D1, production smoke, and automation features.

archive/textbook already has a subordinate operating layer. AP root must coordinate with it, not overwrite it.
