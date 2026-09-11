# Pipeline defect repair log

## Repair 1 — non-objective blank choices

- Failure evidence: previous staging `20_매산고_2학기_중간_고1_기출/reports/failure-evidence-before-pipeline-fix/final_validation_summary.json`
- Root cause: extraction normalized empty choices for 단답형/서술형 as `vision_required`; final validator also treated every numeric display number as objective.
- Minimal fix commit: `ab9b39a53`
- Tests: Python past-exam tests 5/5, pipeline syntax/check PASS, Node past-exam tests executed.
- Fresh run: restarted from new START_SHA `ab9b39a53`.

## Repair 2 — decoded LaTeX serialization false positive

- Failure evidence: `../20_매산고_2학기_중간_고1_기출_fresh_ab9b39a53/reports/failure-evidence-before-serialization-fix/final_validation_summary.json`
- Root cause: validator inspected JSON-decoded runtime strings and rejected legitimate single-backslash LaTeX commands.
- Minimal fix commit: `7fdac72b2`
- Tests: Python past-exam tests 6/6, pipeline syntax/check PASS, pipeline-core test command executed.
- Fresh run: restarted from new START_SHA `7fdac72b2`.

## Repair 3 — staging source-asset binding and reserved pre-dispatch close

- Failure evidence: `alive/runtime/provider-bridge/past20-maesan-final-7fdac72b2/pre-dispatch-failure-receipt.json`
- Root cause: provider bridge only searched `archive/assets` for source problem assets, while fresh extraction correctly kept them under the staging `assetRoot`; the local packet-validation failure left a reserved slot with no safe terminal close.
- Minimal fix commit: `393877dda`
- Tests: pipeline-core test command and past-exam tests pass; added pre-dispatch reconcile regression test.
- Fresh run: restarted from new START_SHA `393877dda`.
