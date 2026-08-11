function q(id,key,unit,type,content,choices,options={}){return{id,level:"중",category:unit,originalCategory:unit,standardCourse:"중1 수학",standardUnitKey:key,standardUnit:unit,standardUnitOrder:Number(key.slice(-2)),questionType:type,layoutTag:"grid",tags:[type,unit,...(options.tags||[])],wide:Boolean(options.wide),content,choices,answer:"",solution:"",...(options.visualAssetStatus?{visualAssetStatus:options.visualAssetStatus}:{})};}
const visual={visualAssetStatus:"not_processed"};
window.examTitle="23_향림중_2학기_중간_중1_기출";
window.archiveStatus = "metadata_and_prompt_transcription_only";
window.questionBank=[
q(1,"M1-07","입체도형의 성질","객관식","다음 직육면체에서 모서리와 모서리가 만나서 생기는 교점의 개수를 $a$, 면과 면이 만나서 생기는 교선의 개수를 $b$라고 할 때, $a+b$의 값은? [3점]",["$17$","$18$","$19$","$20$","$21$"],visual),
q(2,"M1-05","기본 도형","객관식","다음과 같이 원 위에 $5$개의 점 $A$, $B$, $C$, $D$, $E$가 있을 때, 이 중 두 점을 연결하여 만들 수 있는 직선의 개수는? [3점]",["$6$개","$7$개","$8$개","$9$개","$10$개"],visual),
q(3,"M1-05","기본 도형","객관식","다음은 두 직선이 한 점에서 만나고 있다. $\\angle a+\\angle b=120^\\circ$일 때, $\\angle x$의 크기는? [3점]",["$110^\\circ$","$115^\\circ$","$120^\\circ$","$125^\\circ$","$130^\\circ$"],visual),
q(4,"M1-04","좌표평면과 그래프","객관식","점 $A(5,4)$와 $x$축과의 거리를 $a$, 점 $B(2,7)$과 $y$축과의 거리를 $b$라 할 때, $a+b$의 값은? [3점]",["$6$","$7$","$8$","$9$","$10$"],visual),
q(5,"M1-05","기본 도형","객관식","다음 그림에서 점 $O$는 점 $F$에서 직선 $AD$에 내린 수선의 발이고, 세 직선은 한 점 $O$에서 만난다. $\\angle AOE=2\\angle EOD$일 때, $\\angle BOC$의 크기는? [4점]",["$25^\\circ$","$30^\\circ$","$35^\\circ$","$40^\\circ$","$45^\\circ$"],visual),
q(6,"M1-07","입체도형의 성질","객관식","다음 삼각기둥에 대한 설명 중 옳은 것은? [4점]",["면 $ABC$와 평행한 면은 $2$개이다.","모서리 $BE$와 수직인 면은 $3$개이다.","모서리 $BE$와 평행인 모서리는 $3$개이다.","모서리 $EF$와 수직으로 만나는 모서리는 $3$개이다.","모서리 $AB$와 꼬인 위치에 있는 모서리는 $2$개이다."],visual),
q(7,"M1-05","기본 도형","객관식","다음 작도에 대한 설명으로 옳지 않은 것은? [3점]",["선분을 연장할 때는 자를 사용한다.","원을 그릴 때는 컴퍼스를 사용한다.","선분의 길이를 잴 때 자를 사용한다.","눈금이 없는 자와 컴퍼스만을 사용한다.","주어진 선분의 길이를 옮길 때는 컴퍼스를 사용한다."],{}),
q(8,"M1-05","기본 도형","객관식","다음 그림에서 $l\\parallel m\\parallel n$일 때, $\\angle y$의 크기는? [4점]",["$145^\\circ$","$146^\\circ$","$147^\\circ$","$148^\\circ$","$149^\\circ$"],visual),
q(9,"M1-05","기본 도형","객관식","그림과 같이 직사각형 모양의 종이테이프를 선분 $FG$를 접는 선으로 하여 접었을 때, $\\angle x-\\angle y$의 값은? [4점]",["$28^\\circ$","$30^\\circ$","$32^\\circ$","$34^\\circ$","$36^\\circ$"],visual),
q(10,"M1-05","기본 도형","객관식","아래 그림은 $\\angle XOY$와 크기가 같은 각을 $PQ$를 한 변으로 하여 작도한 것이다. 다음 중 옳지 않은 것은? [4점]",["$\\overline{AB}=\\overline{CD}$","$\\overline{OA}=\\overline{OB}$","$\\overline{OA}=\\overline{PD}$","$\\overline{PC}=\\overline{CD}$","$\\angle AOB=\\angle CPD$"],visual),
q(11,"M1-05","기본 도형","객관식","$\\triangle ABC$에서 $\\overline{AB}$의 길이가 주어질 때, 다음 중 $\\triangle ABC$가 하나로 결정되지 않는 것은? [4점]",["$\\overline{AC}$, $\\angle A$","$\\overline{BC}$, $\\overline{CA}$","$\\angle B$, $\\angle C$","$\\angle A$, $\\angle B$","$\\overline{BC}$, $\\angle C$"],{}),
q(12,"M1-05","기본 도형","객관식","다음 그림과 같이 길이가 $20\\,\\mathrm{cm}$인 빨대를 접어서 삼각형을 만들려고 한다. 각 변의 길이가 모두 $4\\,\\mathrm{cm}$ 이상인 자연수가 되도록 할 때, 만들 수 있는 삼각형은 모두 몇 개인가? [4점]",["$6$","$7$","$8$","$9$","$10$"],visual),
q(13,"M1-05","기본 도형","객관식","다음 그림에서 $\\triangle ABC$와 $\\triangle ECD$는 정삼각형이다. 점 $C$는 $\\overline{BD}$ 위의 점이고 점 $F$는 $\\overline{AD}$와 $\\overline{BE}$의 교점일 때, 옳지 않은 것은? [4점]",["$\\angle x=120^\\circ$","$\\overline{AD}=\\overline{BE}$","$\\angle ACD=\\angle BCE$","$\\angle CAD=\\angle CBE$","$\\triangle ACD\\equiv\\triangle BEC$"],visual),
q(14,"M1-05","기본 도형","객관식","그림에서 $\\triangle ABC$와 $\\triangle DCE$는 정삼각형이고 $\\angle BCD=42^\\circ$일 때, $\\angle CAE$의 크기는? [4점]",["$14^\\circ$","$16^\\circ$","$18^\\circ$","$20^\\circ$","$22^\\circ$"],visual),
q(15,"M1-06","평면도형의 성질","객관식","다음을 모두 만족시키는 다각형에 대한 설명으로 옳지 않은 것은? [3점]<div class=\"note-box\">(가) 모든 변의 길이가 같다.<br>(나) 모든 내각의 크기가 같다.<br>(다) $12$개의 선분으로 둘러싸여 있다.</div>",["정십이각형이다.","한 외각의 크기는 $30^\\circ$이다.","내각의 크기의 합은 $1800^\\circ$이다.","다각형의 대각선의 총개수는 $60$이다.","한 꼭짓점에서 그을 수 있는 대각선의 개수는 $9$이다."],{}),
q(16,"M1-05","기본 도형","객관식","다음 그림에서 $\\angle x-\\angle y$의 값은? [3점]",["$66^\\circ$","$60^\\circ$","$36^\\circ$","$20^\\circ$","$18^\\circ$"],visual),
q(17,"M1-05","기본 도형","객관식","다음 그림에서 $\\angle x$의 크기는? [4점]",["$115^\\circ$","$120^\\circ$","$125^\\circ$","$130^\\circ$","$135^\\circ$"],visual),
q(18,"M1-06","평면도형의 성질","객관식","내각과 외각의 크기의 총합이 $1440^\\circ$인 정다각형의 한 외각의 크기는? [4점]",["$45^\\circ$","$40^\\circ$","$36^\\circ$","$30^\\circ$","$24^\\circ$"],{}),
q(19,"M1-06","평면도형의 성질","객관식","어떤 정다각형의 한 변 위의 꼭짓점이 아닌 한 점에서 각 꼭짓점에 선분을 그었을 때 생기는 삼각형의 개수가 $14$개라 한다. 이 정다각형의 한 내각의 크기는? [4점]",["$120^\\circ$","$144^\\circ$","$156^\\circ$","$164^\\circ$","$170^\\circ$"],{}),
q(20,"M1-06","평면도형의 성질","객관식","어느 다각형의 꼭짓점의 개수를 $A$, 그 다각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수를 $B$, 그 다각형의 한 꼭짓점에서 $B$개의 대각선을 그었을 때 만들어지는 삼각형의 개수를 $C$라 할 때, $A-B+C=8$을 만족하는 다각형은? [4점]",["육각형","칠각형","팔각형","구각형","십각형"],{}),
q(21,"M1-06","평면도형의 성질","객관식","다음 그림에서 $\\angle x$의 크기는? [3점]",["$60^\\circ$","$65^\\circ$","$70^\\circ$","$75^\\circ$","$80^\\circ$"],visual),
q(22,"M1-06","평면도형의 성질","객관식","다음은 한 변의 길이가 같은 정오각형과 정육각형을 한 변이 서로 겹치도록 그리고, 정오각형의 한 변과 정육각형의 한 변의 연장선을 그은 것이다. $\\angle a$, $\\angle b$, $\\angle c$, $\\angle d$, $\\angle e$, $\\angle f$에 대하여 다음 중 옳지 않은 것은? [4점]",["$\\angle a=108^\\circ$","$\\angle b=120^\\circ$","$\\angle c+\\angle d=208^\\circ$","$\\angle e=60^\\circ$","$\\angle e+\\angle f=156^\\circ$"],visual),
q(23,"M1-05","기본 도형","서술형","아래 그림과 같이 $l\\parallel m$일 때, $\\angle x$의 크기를 구하시오. [5점]",[],visual),
q(24,"M1-05","기본 도형","서술형","아래 그림과 같이 $\\overline{AB}\\parallel\\overline{ED}$, $\\overline{AC}\\parallel\\overline{FD}$이고, $\\overline{BF}=\\overline{CE}$이다.<br>(1) $\\triangle ABC$와 합동인 삼각형을 찾아 합동기호 $\\equiv$를 사용하여 두 삼각형이 합동임을 쓰시오. [1점]<br>(2) (1)에서 찾은 합동인 두 삼각형의 합동 조건을 쓰고, 그 이유 3가지를 서술하시오. [4점]",[],{...visual,wide:true}),
q(25,"M1-06","평면도형의 성질","서술형","한 내각의 크기가 $162^\\circ$인 정다각형의 대각선의 개수를 구하려고 한다.<br>(1) 위에서 설명된 정다각형의 이름을 쓰시오. [2점]<br>(2) 문제에서 설명된 정다각형의 대각선의 개수를 구하는 풀이과정과 답을 쓰시오. [3점]",[],{wide:true}),
q(26,"M1-06","평면도형의 성질","서술형","내각의 크기의 비가 $3:5:5:6:8$인 오각형에서 가장 작은 내각의 크기를 $a^\\circ$, 가장 작은 외각의 크기를 $b^\\circ$라고 할 때, $a+b$의 값을 구하려 한다.<br>(1) $a$를 구하는 풀이과정과 답을 쓰시오. [2점]<br>(2) $b$를 구하는 풀이과정과 답을 쓰시오. [2점]<br>(3) $a+b$의 값을 구하시오. [1점]",[],{wide:true})
];
