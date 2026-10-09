const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(process.argv[2],'utf8');
const context={window:{}};
vm.runInNewContext(src,context,{timeout:5000});
const keys=['number','id','questionType','content','question','choices','answer','solution','decisiveStep','score','level','category','originalCategory','standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','layoutTag','wide','image','imageSize','choiceColumns','preserveChoicePrefixes','__apExamSubjectiveSpacing','solutionImage','solutionImageAlt','visualDisposition','visualStatus'];
const rows=context.window.questionBank.map(q=>Object.fromEntries(keys.filter(k=>Object.prototype.hasOwnProperty.call(q,k)).map(k=>[k,q[k]])));
fs.writeFileSync(process.argv[3],JSON.stringify({examTitle:context.window.examTitle,questionCount:rows.length,rows},null,2));