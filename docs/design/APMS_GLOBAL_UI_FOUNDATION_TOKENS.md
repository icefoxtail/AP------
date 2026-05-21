# APMS Global UI Foundation Tokens

## Academy OS to APMS

Academy OS token은 APMS의 기존 CSS 변수 위에 얇게 얹는다. 기존 `--primary`, `--surface`, `--border`, `--text`, `--secondary`를 바꾸지 않고 `--apms-ui-*` alias로 번역한다.

## 색상 token

- `--apms-ui-bg`: `var(--bg)`
- `--apms-ui-surface`: `var(--surface)`
- `--apms-ui-surface-soft`: `var(--surface-2)`
- `--apms-ui-border`: `var(--border)`
- `--apms-ui-text`: `var(--text)`
- `--apms-ui-muted`: `var(--secondary)`
- `--apms-ui-soft`: `rgba(118, 118, 128, 0.10)`
- `--apms-ui-accent`: `var(--primary)`

## Shape, spacing, typography

- Card radius: 14px to 16px, nested card 금지.
- Row radius: 10px to 12px.
- Chip/button radius: 999px or 10px, 용도별로 제한.
- Section gap: 8px, 12px, 16px 중심.
- Section/card title: 14px / 500.
- Row title: 14px / 500.
- Row meta: 12px to 13px / 400.
- Button: 13px / 500.
- Chip/status: 12px to 13px / 400 to 500.

## Shadow and states

Shadow는 `--apms-ui-shadow-card` 하나로 제한하고, row에는 shadow를 쓰지 않는다. Hover는 `--apms-ui-hover`로만 은은하게 표현한다. Active는 배경이나 border만 바꾸고 layout shift를 만들지 않는다.

## 금지 token

전역 `body`, `button`, `.card`, `*`, `td`, `tr`, `input`, `textarea`, `select`를 새 foundation에서 직접 수정하지 않는다. 새 font-weight 700/800/900을 추가하지 않으며 숫자 또는 상태값만 기존 굵기를 유지할 수 있다.

