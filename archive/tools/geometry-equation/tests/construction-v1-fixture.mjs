export const int=value=>({kind:'integer',value:String(value)});
export const node=(id,op,inputs,outputType,args={},branch)=>({id,op,inputs,outputType,args,factRole:inputs.length?'DERIVED_INTERMEDIATE':'GIVEN',...(branch?{branch}:{})});
export const pointNode=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});

export const constructionV1Graph={schemaVersion:'construction-spike-v1',nodes:[
  pointNode('O',0,0),pointNode('A',0,2),pointNode('B',4,0),pointNode('C',0,3),pointNode('D',4,3),pointNode('V',0,0),pointNode('X',2,0),pointNode('Y',0,3),pointNode('P',5,0),
  node('axisX','LINE_THROUGH',['O','B'],'LINE'),node('axisY','LINE_THROUGH',['O','C'],'LINE'),
  node('parallel','PARALLEL_THROUGH',['C','axisX'],'LINE'),node('crossLine','LINE_INTERSECTION',['axisX','axisY'],'POINT'),
  node('mid','MIDPOINT',['O','P'],'POINT'),node('circleO','CIRCLE_THROUGH_POINT',['O','A'],'CIRCLE'),
  node('circle3','CIRCLE_THROUGH_3',['O','B','C'],'CIRCLE'),node('diameterCircle','CIRCLE_THROUGH_POINT',['mid','P'],'CIRCLE'),
  node('tangentAtA','TANGENT_AT_POINT',['circleO','A'],'LINE'),
  node('contacts','INTERSECTION',['circleO','diameterCircle'],'POINT_SET'),
  node('contact','SELECT_POINT',['contacts'],'POINT',{}, {kind:'SIDE_OF_ORIENTED_LINE',refs:['O','P'],sign:1}),
  node('contactOther','SELECT_POINT',['contacts'],'POINT',{}, {kind:'SIDE_OF_ORIENTED_LINE',refs:['O','P'],sign:-1}),
  node('externalTangent','LINE_THROUGH',['P','contact'],'LINE'),
  node('externalTangentOther','LINE_THROUGH',['P','contactOther'],'LINE'),
  node('radiusLine','LINE_THROUGH',['O','A'],'LINE'),
  node('internalBisector','ANGLE_BISECTOR',['X','V','Y'],'LINE',{mode:'INTERNAL'}),
  node('externalBisector','ANGLE_BISECTOR',['X','V','Y'],'LINE',{mode:'EXTERNAL'}),
  node('lengthAB','SEGMENT_LENGTH',['O','B'],'SCALAR'),node('lengthAC','SEGMENT_LENGTH',['O','C'],'SCALAR'),
  node('ratio','SCALAR_RATIO',['lengthAB','lengthAC'],'SCALAR')
],conditionAudits:[
  {id:'incidence-B-axisX',sourceConditionId:'incidence-B-axisX',kind:'INCIDENCE_POINT_ON_LINE',refs:['B','axisX']},
  {id:'distance-AB-4',sourceConditionId:'distance-AB-4',kind:'DISTANCE_EQUALS',refs:['O','B'],expected:int(4)},
  {id:'equal-external-tangent-lengths',sourceConditionId:'equal-external-tangent-lengths',kind:'EQUAL_DISTANCE',refs:['P','contact','P','contactOther']},
  {id:'midpoint-OP-half',sourceConditionId:'midpoint-OP-half',kind:'MIDPOINT_RATIO',refs:['O','mid','P'],expected:int(1)},
  {id:'perpendicular-coordinate-axes',sourceConditionId:'perpendicular-coordinate-axes',kind:'PERPENDICULAR',refs:['axisX','axisY']},
  {id:'parallel-through-C',sourceConditionId:'parallel-through-C',kind:'PARALLEL',refs:['axisX','parallel']},
  {id:'A-on-circleO',sourceConditionId:'A-on-circleO',kind:'CIRCLE_MEMBERSHIP',refs:['circleO','A']},
  {id:'tangent-at-A',sourceConditionId:'tangent-at-A',kind:'TANGENCY_AT_POINT',refs:['circleO','A','tangentAtA']},
  {id:'external-tangent-contact',sourceConditionId:'external-tangent-contact',kind:'TANGENCY_AT_POINT',refs:['circleO','contact','externalTangent']},
  {id:'contact-positive-side',sourceConditionId:'contact-positive-side',kind:'ORIENTED_SIDE',refs:['O','P','contact'],sign:1},
  {id:'contact-other-negative-side',sourceConditionId:'contact-other-negative-side',kind:'ORIENTED_SIDE',refs:['O','P','contactOther'],sign:-1}
]};
