import fs from 'node:fs';

const sourcePath = 'archive/_generated/source-only/m2-20261004/21_왕운중_2학기_기말_중2_기출.js';
const source = fs.readFileSync(sourcePath, 'utf8');
const lines = source.split(/\r?\n/u);
const repair = new Map([
  [3, question => {
    question.answer = '③,⑤';
    question.solution = String.raw`$\triangle ABC\sim\triangle DEF$에서 대응점은 $A\leftrightarrow D$, $B\leftrightarrow E$, $C\leftrightarrow F$이고 닮음비는 $3:5$이다.
① $\angle F=\angle C=50^\circ$이므로 옳다.
② $BC=9$ cm이므로 $EF=9\times\dfrac53=15$ cm이고 옳다.
③ 그림에서 $\angle A$는 직각이 아니므로 옳지 않다.
④ $AC$와 $DF$는 대응변이므로 $AC:DF=3:5$이고 옳다.
⑤ 대응각 $\angle B$와 $\angle E$의 크기는 같으므로 그 비는 $1:1$이다. 따라서 옳지 않다.
따라서 정답은 ③, ⑤이다.`;
  }],
  [9, question => {
    question.solution = String.raw`$AD=6$ cm, $BC=9$ cm이고 $M$은 $BC$의 중점이므로 $BM=MC=\dfrac92$ cm이다.
$AD\parallel BM$에서 $\triangle ADP\sim\triangle MBP$이므로 $AP:PM=AD:BM=4:3$이다.
또 $AD\parallel MC$에서 $\triangle DAQ\sim\triangle MCQ$이므로 $DQ:QM=AD:MC=4:3$이다.
따라서 $\triangle ADM$에서 $P,Q$는 두 변을 같은 비 $4:3$으로 나눈다. 그러므로 $PQ\parallel AD$이고 $PQ:AD=PM:AM=3:7$이다.
$PQ=6\times\dfrac37=\dfrac{18}{7}$ cm이므로 정답은 ②이다.`;
  }],
  [13, question => {
    question.solution = String.raw`$E$는 $AD$의 중점이므로 $AE=ED$이다. 같은 밑변 $GE$에 대한 높이가 같아 $[GAE]=[GDE]=15$이다.
$DE\parallel BC$이므로 $\triangle DGE\sim\triangle BGC$이고 $DE:BC=1:2$이다. 따라서 $GE:GC=1:2$이다.
밑변 $GD$가 같은 $\triangle GDE$와 $\triangle GDC$의 넓이 비도 $1:2$이므로 $[GDC]=30$이다.
따라서 $[GDC]+[GAE]=30+15=45$이고 정답은 ④이다.`;
  }],
  [21, question => {
    question.solution = String.raw`(1) 동전 결과는 앞면 또는 뒷면이고 주사위 눈은 $4,5,6,7,8,9,10,11$이므로 전체 경우는 $2\times8=16$가지이다.
앞면이 나온 순서쌍은 (앞면,4), (앞면,5), (앞면,6), (앞면,7), (앞면,8), (앞면,9), (앞면,10), (앞면,11)이다.
뒷면이 나온 순서쌍은 (뒷면,4), (뒷면,5), (뒷면,6), (뒷면,7), (뒷면,8), (뒷면,9), (뒷면,10), (뒷면,11)이다.
(2) $4$부터 $11$까지의 소수는 $5,7,11$이므로 뒷면과 소수가 함께 나오는 경우는 (뒷면,5), (뒷면,7), (뒷면,11)의 $3$가지이다. 따라서 확률은 $\dfrac3{16}$이다.`;
  }],
]);

for (const [qid, apply] of repair) {
  const matches = [];
  for (let index = 0; index < lines.length; index += 1) {
    const text = lines[index].trim().replace(/,$/u, '');
    let question;
    try { question = JSON.parse(text); } catch { continue; }
    if (Number(question.id) === qid) matches.push({ index, question });
  }
  if (matches.length !== 1) throw new Error(`Expected one source row for q${qid}; found ${matches.length}`);
  const { index, question } = matches[0];
  apply(question);
  const prefix = lines[index].startsWith('  ') ? '  ' : '';
  lines[index] = `${prefix}${JSON.stringify(question)},`;
}

fs.writeFileSync(sourcePath, lines.join('\n'), 'utf8');
console.log(JSON.stringify({ repairedQids: [...repair.keys()] }));
