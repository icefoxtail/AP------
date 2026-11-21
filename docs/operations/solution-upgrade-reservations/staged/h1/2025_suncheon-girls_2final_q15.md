# 고1 해설 업그레이드 MD 초안 — 2025 순천여고 2학기 기말 15번

> 상태: **DRAFT_STAGED / NOT_PRODUCTION / REVIEW_REQUIRED**. 사용자가 허용한 MD-우선 임시 작업물이다. 학생 노출 JS로 반영하거나 `main`에 병합하지 않는다. 독립 검수 및 실제 렌더 전에는 최종 PASS가 아니다.

| 항목 | 값 |
| --- | --- |
| 과목/우선순위 | 고1 공통수학2 · 2025년 2학기 기말 |
| source JS | `archive/exams/original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js` |
| 원본 JS blob | `70cb32b708e1a4209b98b4f83ffaf6fddeeeb220` |
| sourceIdentityKey | `sha256:5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947|15` |
| sourceQuestionNo/id | 15 / 15 |
| answer | ① |
| 상태 | UPGRADE_DRAFT — 수학식 독립 점검 후 편집 초안; 시각/Golden/렌더 보류 |
| JS 변경 | 없음 |

## 개선 사유

기존 `solution`은 `\\frac12|u(10-v)-v(10-u)|` 넓이식과 `D=(u-v)^2` 관계를 이유 없이 연속 사용한다. 학생에게는 **큰 삼각형에서 작은 두 삼각형의 넓이를 빼는 방법**과 두 교점의 등식 전개가 더 직접적이다.

코멘트는 왜 큰 삼각형을 쓰는지, 서로 다른 두 교점이라 왜 약분 가능한지 등에만 남기고 수식 변형은 등호를 이용해 단계별로 보인다.

## 향후 JS의 `solution`에 넣을 문안

직선 $y=-x+10$은 $x+y=10$이고, 두 좌표축과 $A(10,0)$, $B(0,10)$에서 만난다.

두 교점은 $xy=k>0$, $x+y=10>0$을 만족하므로 모두 제1사분면에 있다.
교점을 $P(p,10-p)$, $Q(q,10-q)$라 하자. ($p>q$)

큰 삼각형에서 양쪽의 작은 삼각형을 빼면 $\triangle OPQ$가 남는다.

$$
\begin{aligned}
[\triangle OAB]&=\frac12\cdot10\cdot10=50,\\
[\triangle OAP]&=\frac12\cdot10\cdot(10-p)=5(10-p),\\
[\triangle OBQ]&=\frac12\cdot10\cdot q=5q.
\end{aligned}
$$

따라서 넓이 $44$를 이용하면

$$
\begin{aligned}
44&=50-5(10-p)-5q\\
&=50-50+5p-5q\\
&=5(p-q),\\
p-q&=\frac{44}{5}.
\end{aligned}
$$

또 두 점은 $y=\dfrac{k}{x}$ 위에 있으므로 $xy=k$이다.

$$
\begin{aligned}
p(10-p)&=k,\\
q(10-q)&=k.
\end{aligned}
$$

따라서

$$
\begin{aligned}
p(10-p)&=q(10-q)\\
10p-p^2&=10q-q^2\\
10p-10q&=p^2-q^2\\
10(p-q)&=(p-q)(p+q).
\end{aligned}
$$

두 교점은 서로 다르므로 $p-q\ne0$이다. 양변을 $p-q$로 나누면

$$p+q=10.$$

앞에서 구한 $p-q=\dfrac{44}{5}$와 더하면

$$
\begin{aligned}
2p&=10+\frac{44}{5}\\
&=\frac{50}{5}+\frac{44}{5}\\
&=\frac{94}{5},\\
p&=\frac{47}{5}.
\end{aligned}
$$

$$
\begin{aligned}
q&=10-p\\
&=\frac{50}{5}-\frac{47}{5}\\
&=\frac35.
\end{aligned}
$$

마지막으로

$$
\begin{aligned}
k&=p(10-p)\\
&=\frac{47}{5}\left(10-\frac{47}{5}\right)\\
&=\frac{47}{5}\cdot\frac35\\
&=\frac{141}{25}.
\end{aligned}
$$

따라서 정답은 ①이다.

## 보호 및 후속 검수

- **허용 예정 필드:** 해당 q15의 `solution`만. `content`, `choices`, `answer`, 기존 문제·해설 SVG 및 메타는 보존한다.
- **수학 점검(초안 수준):** `p=47/5`, `q=3/5`는 `p+q=10`, `p-q=44/5`, `k=p(10-p)=141/25`, 넓이 `5(p-q)=44`를 만족한다.
- **NOT_RUN:** Golden/Negative 실물 calibration 완료 영수증, 원본 문제/기존 SVG 시각 대조, 학생 화면 `exam/sol/ans` 렌더, SHA-256 receipt 및 독립 리뷰.
- **다음 단계:** 원본 이미지와 수학·교육과정 독립 검토 → `solution` JS 문자열 escape/개행 검수 → 보호 필드 diff → 실제 렌더 → 승인 후 별도 JS 커밋/PR. 보류된 검사를 건너뛴 채 PASS 처리하지 않는다.
