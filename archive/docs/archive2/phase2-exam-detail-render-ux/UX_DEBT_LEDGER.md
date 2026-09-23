# UX debt ledger

| ID | Severity | Surface and baseline evidence | User impact | Minimal change | Final evidence | Status |
|---|---|---|---|---|---|---|
| H-1 | HIGH | Original, Unit Past, and mixed/Compose mobile paper preview; at 390px the 794px A4 page was scaled to 307.88px (`scale(0.38791)`), with an 8.15px MathJax container. | Questions, equations, and diagrams were too small to inspect on a phone. | Load a screen-only, one-column flow after `RENDER_READY`; keep the A4 page tree and print rules intact. | `tests/archive2-preview-responsive.test.cjs`; A4 baseline/final summary and audit JSON. | CLOSED |
| P1-01 | HIGH | Archive2 mobile answer grid rendered its column-major DOM as `1, 13, 2, 14, …` after reflow to one column. | Students could read answer numbers in the wrong sequence. | Give each nonempty cell its original chunk index and apply it only to the Archive2 mobile screen grid. | `tests/archive2-preview-responsive.test.cjs`: 21-question DOM-position assertion for shared and fallback engine renderers. | CLOSED |
| P1-02 | HIGH | `archive2-preview-mobile.css` affected shared engines without an Archive2 caller marker. | Archive 1.0 engine pages changed along with Archive2. | Pass an explicit `archive2Context=archive2` marker from every Archive2 engine URL and gate all responsive CSS by the document context. | `tests/archive2-preview-responsive.test.cjs`: four Archive2 entry points tagged; marker-free Archive1 engine and mixed-engine pages remain two-column. | CLOSED |
| P2-01 | MEDIUM | Original q3 solution SVG has a 620×420 viewBox; at 390px its image was 214px wide in a 332px solution wrapper and capped at 145px high. | Small graph labels were difficult to read on mobile. | On Archive2 mobile screen only, let solution image wrappers and images use the available content width and remove the image height cap. | `tests/archive2-preview-responsive.test.cjs`: actual q3 SVG fills its mobile solution wrapper; marker-free Archive 1 retains prior caps. | CLOSED |
| M-1 | MEDIUM | Original and mixed-engine mode tabs were 26px high on a 390px viewport. | Teachers could miss exam, solution, or answer mode while reviewing. | Set each mobile mode tab to 44px and its toolbar to 52px; retain labels, state, and mode URL. | `tests/archive2-touch-targets.test.cjs`; `evidence/mobile-mode-tab-baseline.json`; 44px CSS target. | CLOSED |
| M-2 | MEDIUM | Compose desktop mode tabs measured 34px. | The mode controls were smaller than the desktop review target. | Set the existing buttons to 36px; keep labels, active state, and mode behavior. | `evidence/compose-final.json` desktop layout reports 36px for all three buttons. | CLOSED |
| M-3 | MEDIUM | Compose mobile sticky action buttons measured 42px; action bar ended at y=780px, with bottom tabs starting at y=781px. | The primary mobile actions were 2px below the touch target. | Raise the buttons to 44px while preserving bottom placement and the 1px tab gap. | `evidence/compose-final.json` reports 44px buttons, action bar y=715..780px, tabs y=781..844px, no overlap, and no horizontal overflow. | CLOSED |
| M-4 | MEDIUM | Compose desktop page-count selector measured 32px. | Changing the preview from 4 to 6 or 8 questions per page was a small target. | Set desktop page-count selects to 36px; retain 44px on compact screens and keep the 4/6/8 values. | `evidence/compose-final.json` reports a 36px desktop selector; targeted test checks Compose and mixed-engine selectors plus 44px mobile sizing. | CLOSED |

## Severity pass

- HIGH: 3 found, 3 fixed.
- MEDIUM: 4 found, 4 fixed.
- P2: 1 found, 1 fixed.
- LOW: none recorded in this ledger.
- Remaining UX HOLDs: none among the recorded findings.

## Evidence retention

- Removed 162 generated PNG render images (16,225,059 bytes) from this phase's evidence tree. No PDF renders were tracked there.
- Retained the final summary, this debt ledger, A4 baseline/final JSON summaries and audits, existing compact Compose/mobile-tab JSON evidence, and the targeted browser regression test.
