# UX debt ledger

| ID | Severity | Surface and baseline evidence | User impact | Minimal change | Final evidence | Status |
|---|---|---|---|---|---|---|
| H-1 | HIGH | Original, Unit Past, and mixed/Compose mobile paper preview; at 390px the 794px A4 page was scaled to 307.88px (`scale(0.38791)`), with an 8.15px MathJax container. | Questions, equations, and diagrams were too small to inspect on a phone. | Load a screen-only, one-column flow after `RENDER_READY`; keep the A4 page tree and print rules intact. | `evidence/screens/final-original-engine-mobile.png`; `final-workspace-detail-mobile.png`; `final-compose-selected-mobile.png`; 14 final A4 PDFs audited with no print CSS change. | CLOSED |
| M-1 | MEDIUM | Original and mixed-engine mode tabs were 26px high on a 390px viewport. | Teachers could miss exam, solution, or answer mode while reviewing. | Set each mobile mode tab to 44px and its toolbar to 52px; retain labels, state, and mode URL. | `evidence/screens/final-original-engine-mobile.png`; screen-only responsive test; 44px CSS target. | CLOSED |
| M-2 | MEDIUM | Compose desktop mode tabs measured 34px. | The mode controls were smaller than the desktop review target. | Set the existing buttons to 36px; keep labels, active state, and mode behavior. | `evidence/compose-final.json` desktop layout reports 36px for all three buttons. | CLOSED |
| M-3 | MEDIUM | Compose mobile sticky action buttons measured 42px; action bar ended at y=780px, with bottom tabs starting at y=781px. | The primary mobile actions were 2px below the touch target. | Raise the buttons to 44px while preserving bottom placement and the 1px tab gap. | `evidence/compose-final.json` reports 44px buttons, action bar y=715..780px, tabs y=781..844px, no overlap, and no horizontal overflow. | CLOSED |
| M-4 | MEDIUM | Compose desktop page-count selector measured 32px. | Changing the preview from 4 to 6 or 8 questions per page was a small target. | Set desktop page-count selects to 36px; retain 44px on compact screens and keep the 4/6/8 values. | `evidence/compose-final.json` reports a 36px desktop selector; targeted test checks Compose and mixed-engine selectors plus 44px mobile sizing. | CLOSED |

## Severity pass

- HIGH: 1 found, 1 fixed.
- MEDIUM: 4 found, 4 fixed.
- LOW: no remaining findings after PC/mobile and A4 visual review.
- Remaining UX HOLDs: none.
