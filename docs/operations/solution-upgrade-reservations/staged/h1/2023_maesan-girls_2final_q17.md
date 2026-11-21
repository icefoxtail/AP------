# 2023 매산여고 2학기 기말 고1 — 17번 학생용 해설 개선안

- sourcePath: \`archive/exams/original/high/h1/2final/23_매산여고_2학기_기말_고1_기출.js\`
- sourceBlobSha: \`1521ede6bd498765475906c81f1f53be8ac33435\`
- qid 17 / 정답 **② \(2736\)** / 학생용 수식·경우표 완성 및 독립 검산. 출고·Golden·Negative·렌더 **NOT_RUN**.
- 원본 문제 그림: \`archive/assets/images/23_매산여고_2학기_기말_고1_기출/q17.png\` (blob \`8d9da87b1432aea6c978cdaf84bef58eff0a965a\`, 직접 열람).
- 기존 풀이의 걸림돌: **22+12+15+8=57**의 숫자를 한 문단에 나열해, 각 첫째 줄 배치에서 왜 그것만 가능한지 추적하기 어렵다. 사람 이름을 일단 빼고 **자리의 남/여/빈칸 패턴**만 센 뒤 다시 이름을 배치한다.

## 학생용 완성 해설

### ① 사람 이름 대신 남·여·빈칸으로 먼저 세자

그림에는 **3개 분단 × 3개 줄 = 9자리**가 있다.

3분단 첫째 줄은 이미 공석이므로 남은 **8자리**에

\[
\mathrm B\ \text{(남학생)}\ 4\text{개},\qquad
\mathrm G\ \text{(여학생)}\ 2\text{개},\qquad
\mathrm E\ \text{(빈칸)}\ 2\text{개}
\]

를 놓는다.

한 줄의 이웃한 칸에 \(\mathrm B\mathrm G\) 또는 \(\mathrm G\mathrm B\)가 오면 안 된다. 남학생끼리, 여학생끼리 붙어도 괜찮다.

한 줄이 3자리일 때 필요한 기본 배치 수는 다음과 같다.

| 한 줄에 들어갈 수 | 허용 패턴 | 방법 수 |
|---|---|---:|
| B 3개 | BBB | \(1\) |
| B 2개, E 1개 | BBE, BEB, EBB | \(3\) |
| G 2개, E 1개 | GGE, GEG, EGG | \(3\) |
| B 1개, G 1개, E 1개 | BEG, GEB (E가 남녀 사이) | \(2\) |

### ② 첫째 줄에서 실제로 쓸 수 있는 두 자리를 기준으로 나누자

첫째 줄의 3분단은 \(\mathrm E\)로 고정이다. 따라서 나머지 **첫째 줄 두 칸의 모양**은 아래 다섯 종류이다.

**A. 첫째 줄 \(\mathrm{BB}\)**

남은 두 줄(둘째·셋째 줄)에는 \(2\mathrm B,2\mathrm G,2\mathrm E\)를 넣어야 한다.

- 한 줄이 \((2\mathrm B,1\mathrm E)\), 다른 줄이 \((2\mathrm G,1\mathrm E)\):
  \[
  2\times3\times3=18
  \]
  (어느 줄에 남학생을 놓을지 2가지, 각 줄에 빈칸 놓을 자리 3가지씩).
- 두 줄이 모두 \((1\mathrm B,1\mathrm G,1\mathrm E)\):
  \[
  2\times2=4
  \]
  (각 줄은 BEG, GEB 두 패턴).

\[
\boxed{N_A=18+4=22}
\]

**B. 첫째 줄 \(\mathrm{BE}\) 또는 \(\mathrm{EB}\)**

첫째 줄의 모양은 **2가지**. 남은 두 줄에는 \(3\mathrm B,2\mathrm G,1\mathrm E\).

남학생·여학생이 같은 줄에서 이웃하지 않으려면 한 줄은 BBB, 다른 줄은 GGE/GEG/EGG여야 한다.

\[
\begin{aligned}
N_B
&=2\times2\times1\times3\\
&=12.
\end{aligned}
\]

앞의 2는 첫째 줄 BE/EB, 다음 2는 어느 줄이 BBB인지, 마지막 3은 GGE의 빈칸 위치다.

**C. 첫째 줄 \(\mathrm{GG}\)**

남은 두 줄에는 \(4\mathrm B,0\mathrm G,2\mathrm E\)만 있다.

남녀가 같은 줄에서 만날 일이 없으므로 여학생/남학생의 이웃 금지조건이 **자동으로 만족**된다. 여섯 자리 중 빈칸 2자리만 고르면 된다.

\[
\begin{aligned}
N_C
&={}_6C_2\\
&=\frac{6\times5}{2\times1}\\
&=15.
\end{aligned}
\]

**D. 첫째 줄 \(\mathrm{GE}\) 또는 \(\mathrm{EG}\)**

첫째 줄 모양 **2가지**. 남은 두 줄에는 \(4\mathrm B,1\mathrm G,1\mathrm E\).

한 줄은 BBB, 다른 줄은 BEG 또는 GEB이어야 한다.

\[
\begin{aligned}
N_D
&=2\times2\times1\times2\\
&=8.
\end{aligned}
\]

앞의 2는 첫째 줄 GE/EG, 그다음 2는 BBB를 놓을 줄, 마지막 2는 BEG/GEB이다.

**E. 첫째 줄 \(\mathrm{EE}\)**

남은 두 줄에는 \(4\mathrm B,2\mathrm G\), 빈칸은 **하나도 없다**.

빈칸이 없으면 한 줄에 남녀가 함께 있는 순간 반드시 서로 이웃하는 곳이 생긴다. 따라서 한 줄은 BBB, 다른 줄은 GGG여야 하는데, 여학생은 두 명뿐이다.

\[
\boxed{N_E=0}
\]

### ③ 남·여·공석 패턴을 모두 더하자

\[
\begin{aligned}
N_{\text{패턴}}
&=N_A+N_B+N_C+N_D+N_E\\
&=22+12+15+8+0\\
&=57.
\end{aligned}
\]

### ④ 이제 서로 다른 실제 학생을 배치하자

패턴 하나마다 남학생 4명은 B가 적힌 서로 다른 4자리에,

\[
4!=4\times3\times2\times1=24\text{가지}
\]

여학생 2명은 G가 적힌 두 자리에,

\[
2!=2\times1=2\text{가지}
\]

로 배치할 수 있다.

\[
\begin{aligned}
N_{\text{전체}}
&=N_{\text{패턴}}\times4!\times2!\\
&=57\times24\times2\\
&=57\times48\\
&=\boxed{2736}.
\end{aligned}
\]

### 왜 이렇게 세나요? — 필요한 코멘트

- **학생 이름부터 배열하면** 남녀가 붙는지 매번 검사해야 합니다. 그래서 **성별·공석 패턴을 먼저** 셉니다.
- 첫째 줄에는 셋째 분단의 공석이 고정되어 있으니 나머지 두 자리에 BG/GB는 바로 금지됩니다.
- **BEG와 GEB는 가능**합니다. 남녀 사이에 빈칸 E가 하나 있어서 남녀가 서로 이웃하지 않기 때문입니다.
- 마지막의 \(4!\times2!\)는 같은 패턴에 실제 서로 다른 학생들의 자리를 정하는 횟수입니다.

### 독립 검산

허용 첫째 줄의 두 칸은 BB, BE/EB, GG, GE/EG, EE 이외에 없으며 BG/GB는 금지이다. 각 분기에서 남녀·공석 개수를 합하면 항상 B4,G2,E2가 된다. \(22+12+15+8+0=57\), \(57\cdot4!\cdot2!=2736\)로 원 정답과 일치. SVG/JS 수정 없음.