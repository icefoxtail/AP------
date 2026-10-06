import {objectSha,HASH_PATTERN} from '../../pipeline-core/canonical.mjs';
export class RepairBudget {
  constructor(ledger=[]){
    if(!Array.isArray(ledger)||ledger.length>3)throw Error('INVALID_REPAIR_LEDGER');
    if(ledger.some((row,index)=>!row||Object.keys(row).sort().join(',')!=='inputSha,iteration,outputSha,reason,stage'||row.iteration!==index+1||typeof row.stage!=='string'||!row.stage||!HASH_PATTERN.test(row.inputSha)||typeof row.reason!=='string'||!row.reason||(row.outputSha!==null&&!HASH_PATTERN.test(row.outputSha))))throw Error('INVALID_REPAIR_LEDGER');
    this.ledger=[...ledger];
  }
  consume(stage,inputSha,reason){
    if(this.ledger.length>=3)throw Error('REPAIR_BUDGET_EXHAUSTED');
    if(!HASH_PATTERN.test(inputSha)||!stage||!reason)throw Error('INVALID_REPAIR_ACTION');
    const row={iteration:this.ledger.length+1,stage,inputSha,reason,outputSha:null};this.ledger.push(row);return row;
  }
  complete(row,outputSha){
    if(!this.ledger.includes(row)||!HASH_PATTERN.test(outputSha))throw Error('INVALID_REPAIR_OUTPUT');
    row.outputSha=outputSha;
    const signature=r=>objectSha({stage:r.stage,inputSha:r.inputSha,reason:r.reason,outputSha:r.outputSha});
    if(this.ledger.slice(0,-1).some(r=>signature(r)===signature(row)))throw Error('REPAIR_STAGNATION');
  }
}
