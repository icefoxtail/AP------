# Latest-main rule rebinding gate

Status: HOLD before dispatch  
Merged main: `14ff950d4a76104d10950494aa05c7dc894624cc`  
Branch merge commit: `9e0052a9c27558f22a1785320a9b414cc11db78b`  
Current rule-pack SHA: `sha256:b5207bfa4b318d30279e13a3b9aa86ee46b236bd064766032c6b5b2da18b35ee`  
Rules preflight: PASS (`docs/rules/MANIFEST.md` and active rules verified on current main)  
Work batch: `visang-workbook-geometry-20260929-rebound`  
Reserved launch: `visang-workbook-geometry-20260929-rebound:1` (RESERVED, no model invocation)  
Freeze SHA: `sha256:c7d40739019c7a045ab5567984f030de48d14cfb1d900a83eaa515d3cae5aa8b`

The provider plan and actual sealed U1/U2/U3 packet checks passed before the latest-main integration. The native serialized input sizes were 30,289 bytes (U1), 465,793 bytes (U2), and 782,358 bytes (U3); all are below 1 MiB. `provider-packet-preflight` returned PASS for all three phases.

After merging latest main, a fresh `machine-checks` invocation against the reserved frozen run stopped with `STALE_FILE:docs/rules/MANIFEST.md`. The original run input SHA still recomputes to `sha256:0e97da22cf5a653776f336b8ad2a5f3a42d5afc76bfc6b675182aeaa7daec9a5`, but its bound rule-file bytes predate main `14ff950d4`. Dispatch was not started. The reserved launch and freeze remain preserved for coordinator reconciliation.

The task now records three 2025 high-school geometry solution/visual calibration samples and two frozen negative visual fixtures in `golden_sample_calibration_refs.json`. The sample set is informational calibration only; it carries no answer or solution authority for the workbook questions.
