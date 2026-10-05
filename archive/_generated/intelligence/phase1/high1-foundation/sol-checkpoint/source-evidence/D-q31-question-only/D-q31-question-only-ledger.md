# D q31 question-only source audit

- **Disposition:** `SOURCE_MATCH/HOLD`
- **Queue item:** `queueIndex31`
- **UID:** `qid_v1_2c107f88430fa3af5dcb5f20770e2abbe1f86f721dbddacfe0d90982a1caf970`
- **Source identity:** `original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js#24`
- **Source document:** `D:\기출\(1)1중간\(1)1중간\공통수학1\2026_효천고1_공통수학1_1중간.pdf`
- **Source SHA-256:** `BE4A3FEB97C11BB097824A866E22D2C65E5E643CCA87A418412033A7FAA28167`
- **Source location:** Page 7 of 8, section `서술형 2. [5점]`.

## Full-page-first evidence

Rendered and reviewed all eight pages of the exam PDF as full pages before zooming into the question. Full-page PNGs are `full-page-1.png` through `full-page-8.png` in this directory. Q24's high-resolution page render is `page-7-hires-7.png`; the subsequent question-only crop is `q24-question-crop.png`.

The exam page shows Q24 in the upper-left column. The stem has no accompanying figure or table, and it provides no multiple-choice options.

## Question-field comparison

Printed source stem (transcribed from the page):

> 다항식 \(f(x)=x^4+ax^3-7x^2+x+b\)는 \(x+1, x+2, g(x), h(x)\)를 인수로 갖는다. \(g(x)-h(x)=2\)가 성립할 때, \(\frac{g(a)\times h(b)}{f(0)}\)의 값을 구하는 과정을 서술하시오. (단, \(a,b\)는 상수이다.) [5점]

JS question object `questionBank[23]` / id `24` has the same stem: `다항식 $f(x)=x^4+ax^3-7x^2+x+b$는 $x+1, x+2, g(x), h(x)$를 인수로 갖는다. $g(x)-h(x)=2$가 성립할 때, $\dfrac{g(a) \times h(b)}{f(0)}$의 값을 구하는 과정을 서술하시오. (단, $a, b$는 상수이다.) [5점]`

| Field | Source page | JS before audit | Result |
|---|---|---|---|
| `content` | Same stem transcribed above | Same Korean wording and mathematical expression | Match |
| `choices` | Written-response item; no choices printed | `[]` | Match |
| `image` | No problem figure or table printed | Property absent (`undefined`) | Match |

## Source ambiguity

The printed question does not say that `g` and `h` are linear or monic. It gives only that each is a factor and that `g(x)-h(x)=2`. That difference condition alone does not fix their signs. For example, both pairs satisfy the same factor conditions for the same polynomial:

```text
f(x) = (x+1)(x+2)(x-1)(x-3) = x^4 - x^3 - 7x^2 + x + 6
(g,h) = (x-1, x-3)
(g,h) = (-x+3, -x+1)
```

In each pair, `g-h=2`; both factors divide the displayed `f`. The two assignments give different `g,h` normalizations, and the printed source supplies no rule selecting one. Therefore the source is ambiguous in the factor normalization/sign.

## Change record

- **Before:** JS `content` matches the printed stem; `choices` is empty; `image` is absent.
- **After:** No JS fields changed. The source itself has the same ambiguity, so no text or asset edit is justified from this source.
- **Disposition rationale:** `SOURCE_MATCH/HOLD` for separate correction protocol to resolve the original question's factor normalization/sign.

## Hashes

- Source exam PDF: `BE4A3FEB97C11BB097824A866E22D2C65E5E643CCA87A418412033A7FAA28167`
- Target JS: `DB242D2A18658E80729453EDDCA0C3643DC5235CD920A784AFCD70D993CC7501`
- `full-page-7.png`: `58058EEF7F3EDB57EBD5F8E6E4E12A60D17C0DDE7E381246EC7F09F8DDBFD5F1`
- `page-7-hires-7.png`: `700378A0BEA2756E1D1AC0A78E96622FD99752E5AEEE1F055C6CCE500955AFE1`
- `q24-question-crop.png`: `A952E1CB9A596912C758C64022BBF44139472000917BC31B28C4F07B3BF87CC8`
