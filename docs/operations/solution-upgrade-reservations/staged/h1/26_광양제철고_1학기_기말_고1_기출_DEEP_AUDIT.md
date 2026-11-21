# 2026 광양제철고 고1 1학기 기말 — 심층 감사 진행 중

- lane: lane30
- sourcePath: `archive/exams/original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js`
- sourceBlobSha: `52b90f5e0c02e00817787d9131466289fa39219c`
- course: 공통수학1 (q1~q4 확인)
- 총 19문항, 실제 개별 판정 4, KEEP 4 / UPGRADE 0 / HOLD 0 / UNREAD 15
- 상태: IN_PROGRESS; EXAM_AUDIT_COMPLETE=NO; EXAM_DRAFT_COMPLETE=NO
- nextQid: 5; Golden/Negative/렌더: NOT_RUN

## q1 — KEEP (텍스트 기준)

- 원문 문제: $x$에 대한 연립부등식 $\begin{cases}-2x-3<x+6\\5x+6\le3x+4\end{cases}$를 만족시키는 정수 $x$의 개수는? [4.3점]
- 정답: ②
- 기존 solution 원문:

> 첫째 부등식에서
> $-2x-3<x+6$
> $-3x<9$
> 양변을 $-3$으로 나누면 부등호 방향이 바뀌므로
> $x>-3$이다.
> 둘째 부등식에서
> $5x+6\le3x+4$
> $2x\le-2$
> $x\le-1$이다.
> 따라서 공통 범위는 $-3<x\le-1$이다.
> 이 범위의 정수는 $-2,-1$이므로 2개이다.
> 따라서 정답은 ②이다.

- 판정 이유: -3x<9에서 음수 -3으로 나눌 때 부등호를 뒤집어 x>-3, 두 번째 x≤-1과 교차해 정수 -2,-1을 얻는다.
- 이미지 검증: NOT_RUN

## q2 — KEEP (텍스트 기준)

- 원문 문제: A 공장에서 하루에 생산되는 옷의 수를 행렬로 나타내면 다음과 같다.<div class='question-table-wrap'><table class='question-table'><thead><tr><th>색상/종류</th><th>상의</th><th>하의</th></tr></thead><tbody><tr><th>파란색</th><td>$a$</td><td>$b$</td></tr><tr><th>흰색</th><td>$c$</td><td>$d$</td></tr></tbody></table></div><div style='text-align:center;margin:6px 0'>$\Rightarrow\begin{pmatrix}a&b\\c&d\end{pmatrix}$</div>P, Q의 두 생산 라인에서 하루에 생산되는 옷의 수는 각각 $\begin{pmatrix}1&2\\3&1\end{pmatrix}$, $\begin{pmatrix}2&3\\1&2\end{pmatrix}$이다. 지난주 공장 사정에 의하여 각 생산 라인의 작업일 수가 다르게 운영되어 파란색 상의가 11개, 흰색 상의가 13개 생산되었다. 지난주에 생산된 흰색 하의의 수는? [4.4점]
- 정답: ⑤
- 기존 solution 원문:

> P라인의 작업일을 $x$일, Q라인의 작업일을 $y$일이라 하자.
> 주어진 행렬에서 첫째 행은 파란색, 둘째 행은 흰색을 나타내고,
> 첫째 열은 상의, 둘째 열은 하의를 나타낸다.
> 
> 파란색 상의는 두 라인에서 각각 하루 $1$개, $2$개 생산하므로
> $x+2y=11$이다.
> 흰색 상의는 각각 하루 $3$개, $1$개 생산하므로
> $3x+y=13$이다.
> 
> 첫째 식을 $3$배 하여 둘째 식을 빼면
> $3x+6y=33$
> $3x+y=13$
> $5y=20$
> $y=4$이다.
> 따라서 $x+2\cdot4=11$이므로 $x=3$이다.
> 
> 흰색 하의는 P라인에서 하루 $1$개, Q라인에서 하루 $2$개 생산한다.
> 따라서 지난주 생산량은
> $x+2y=3+2\cdot4=11$개이다.
> 정답은 ⑤이다.

- 판정 이유: P,Q 작업일 x,y를 x+2y=11,3x+y=13으로 세워 x=3,y=4, 흰색 하의 x+2y=11을 얻는다.
- 이미지 검증: NOT_RUN

## q3 — KEEP (텍스트 기준)

- 원문 문제: 이차 정사각행렬 $A,B$에 대하여 $A-2B=\begin{pmatrix}1&-2\\6&5\end{pmatrix}$, $2A+B=\begin{pmatrix}2&-4\\-3&5\end{pmatrix}$가 성립할 때, 행렬 $AB$의 모든 성분의 합은? [4.5점]
- 정답: ①
- 기존 solution 원문:

> $M=\begin{pmatrix}1&-2\\6&5\end{pmatrix}$, $N=\begin{pmatrix}2&-4\\-3&5\end{pmatrix}$라 두면
> $A-2B=M$, $2A+B=N$이다.
> 첫째 식과 둘째 식의 2배를 더하면
> $5A=M+2N$이다.
> 따라서
> $A=\dfrac{M+2N}{5}$
> $=\dfrac{1}{5}\left\{\begin{pmatrix}1&-2\\6&5\end{pmatrix}+2\begin{pmatrix}2&-4\\-3&5\end{pmatrix}\right\}$
> $=\dfrac{1}{5}\begin{pmatrix}5&-10\\0&15\end{pmatrix}$
> $=\begin{pmatrix}1&-2\\0&3\end{pmatrix}$이다.
> 둘째 식에서 첫째 식의 2배를 빼면
> $5B=N-2M$이다.
> 따라서
> $B=\dfrac{N-2M}{5}$
> $=\dfrac{1}{5}\left\{\begin{pmatrix}2&-4\\-3&5\end{pmatrix}-2\begin{pmatrix}1&-2\\6&5\end{pmatrix}\right\}$
> $=\dfrac{1}{5}\begin{pmatrix}0&0\\-15&-5\end{pmatrix}$
> $=\begin{pmatrix}0&0\\-3&-1\end{pmatrix}$이다.
> 그러므로
> $AB=\begin{pmatrix}1&-2\\0&3\end{pmatrix}\begin{pmatrix}0&0\\-3&-1\end{pmatrix}$
> $=\begin{pmatrix}6&2\\-9&-3\end{pmatrix}$이다.
> 모든 성분의 합은 $6+2-9-3=-4$이다.
> 따라서 정답은 ①이다.

- 판정 이유: 5A=M+2N 및 5B=N−2M으로 행렬을 구하고 AB=(6,2;-9,-3), 성분 합 -4를 명시한다.
- 이미지 검증: NOT_RUN

## q4 — KEEP (텍스트 기준)

- 원문 문제: 숫자 $1,2,3,4,5,6,7$이 하나씩 적힌 7장의 카드 중 서로 다른 3장을 택해 일렬로 나열하여 세 자리 자연수를 만든다. 백의 자리, 십의 자리, 일의 자리 숫자 중 어느 두 개의 합이 나머지 한 개의 2배일 때 경우의 수는? [4.6점]
- 정답: ③
- 기존 solution 원문:

> $1$부터 $7$까지의 가운데 수가 양 끝 두 수의 평균이 되는 세 수의 집합은 양 끝 수의 차가 2일 때 5개, 4일 때 3개, 6일 때 1개로 모두 9개이다. 각 집합은 $3!=6$가지로 배열되므로 $9\cdot6=54$이다.
> 따라서 정답은 ③이다.

- 판정 이유: 등차수열 세 수의 공차 1,2,3에 해당하는 집합 수 5+3+1=9, 각 3! 배열을 곱해 54를 얻는다. 공차별 세기 근거는 보강 후보.
- 이미지 검증: NOT_RUN

## 미완료

q5~q19은 문제·기존 풀이를 개별 심층 판정하지 않았으므로 UNREAD로 남긴다. 다음 작업은 q5부터 원문과 정답을 직접 읽고 전 문항 감사 및 모든 개선 해설을 완료해야 한다.
