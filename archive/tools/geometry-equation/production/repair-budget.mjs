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
    if(!this.ledger.includes(row)||!HASH_PATTERN.test(outputSha)||row.outputSha!==null)throw Error('INVALID_REPAIR_OUTPUT');
    const signature=r=>objectSha({stage:r.stage,inputSha:r.inputSha,reason:r.reason,outputSha:r.outputSha});
    const candidate=objectSha({stage:row.stage,inputSha:row.inputSha,reason:row.reason,outputSha});
    if(this.ledger.some(r=>r!==row&&r.outputSha!==null&&signature(r)===candidate))throw Error('REPAIR_STAGNATION');
    row.outputSha=outputSha;
  }
  record(stage,inputSha,reason,outputSha){
    if(!HASH_PATTERN.test(outputSha))throw Error('INVALID_REPAIR_OUTPUT');
    const prior=this.ledger.find(row=>row.stage===stage&&row.inputSha===inputSha&&row.reason===reason);
    if(prior){
      if(prior.outputSha===outputSha)return{row:prior,replayed:true,resumed:false};
      if(prior.outputSha===null){
        if(this.ledger.at(-1)!==prior)throw Error('INVALID_REPAIR_LEDGER');
        this.complete(prior,outputSha);return{row:prior,replayed:true,resumed:true};
      }
      throw Error('REPAIR_OUTPUT_MISMATCH');
    }
    const row=this.consume(stage,inputSha,reason);this.complete(row,outputSha);
    return{row,replayed:false,resumed:false};
  }
}
