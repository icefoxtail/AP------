// Exam batch (2026-11-23): several figures of ONE exam are rendered by one process so the Archive exam page is opened once for all of them instead of once per figure.
//
// What is batched is only the two steps that open the Archive page: the display measurement (measureArchiveTypographyPolicy) and the capture (captureArchiveCandidate).
// Everything else (python, compose, point names, bind) is exactly the single-figure code, run one task at a time:
//   - every figure of the group is one task running renderPlan();
//   - exactly one task runs at a time (a token). A task gives the token up only when it asks for a measurement or a capture;
//   - when every live task is waiting for such a request, the requests of the same exam are answered together by one page, and the tasks go on one after another in the order they asked.
// So a figure sees the same code in the same order as when it is rendered alone; only the page it waited for was shared.
// The batch is only a fast path: a request the batch cannot answer for a figure (any refusal, any error, a group of one) is answered by running the single-figure call itself,
// so a refused figure gets exactly the error code and detail it gets alone, and one figure's refusal never changes another figure's result.
import {AsyncLocalStorage} from 'node:async_hooks';

const als=new AsyncLocalStorage();
/** The session the calling task runs in, or null (a plain single-figure render). */
export const currentBatchSession=()=>als.getStore()??null;

class Session{
  constructor(live){
    this.live=live;
    this.pending=[];
    this.queue=[];
    this.held=false;
    this.flushing=false;
    this.stats={batches:0,batched:0,single:0,pageMs:{}};// pageMs: time spent in the shared page calls, per kind
  }
  acquire(){
    if(!this.held){this.held=true;return Promise.resolve();}
    return new Promise(resolve=>this.queue.push(resolve));
  }
  release(){
    const next=this.queue.shift();
    if(next)next();else this.held=false;
  }
  /**
   * One request, made by the task that holds the token.
   * req: {kind, group, dupKey, payload, batch(payloads) -> Promise<Array<{ok,value}>>, single() -> Promise<value>}
   * `batch` answers one group (same kind, same group) together; an entry {ok:false} (or a batch that throws) sends this request to `single()`, which runs in the calling task.
   */
  async submit(req){
    const answered=await new Promise(resolve=>{
      this.pending.push({...req,resolve});
      this.release();
      this.maybeFlush();
    });
    await this.acquire();
    if(answered.ok)return answered.value;
    this.stats.single++;
    return req.single();
  }
  taskDone(){
    this.live--;
    this.release();
    this.maybeFlush();
  }
  maybeFlush(){
    if(this.flushing||!this.pending.length||this.pending.length<this.live)return;
    this.flushing=true;
    this.flush().finally(()=>{this.flushing=false;});
  }
  async flush(){
    const requests=this.pending.splice(0);
    const groups=new Map();
    for(const request of requests){
      const key=request.kind+'|'+request.group;
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(request);
    }
    for(const members of groups.values()){
      // Two requests that name the same figure (same dupKey) cannot share a page: the second goes to the next wave.
      const waves=[];
      for(const request of members){
        let wave=waves.find(w=>!w.some(other=>other.dupKey!==undefined&&other.dupKey===request.dupKey));
        if(!wave){wave=[];waves.push(wave);}
        wave.push(request);
      }
      for(const wave of waves){
        let answers=null;
        if(wave.length>=2){
          const began=Date.now();
          try{answers=await wave[0].batch(wave.map(request=>request.payload));}
          catch{answers=null;}
          this.stats.pageMs[wave[0].kind]=(this.stats.pageMs[wave[0].kind]??0)+Date.now()-began;
          if(process.env.APMS_EXAM_BATCH_TRACE)console.error('exam batch round: '+wave[0].kind+' x'+wave.length+' '+(Date.now()-began)+'ms, answered '+(Array.isArray(answers)?answers.filter(answer=>answer?.ok).length:0));
          if(Array.isArray(answers)&&answers.length===wave.length)this.stats.batches++,this.stats.batched+=wave.length;
        }
        wave.forEach((request,index)=>{
          const answer=Array.isArray(answers)&&answers.length===wave.length?answers[index]:null;
          request.resolve(answer&&answer.ok===true?answer:{ok:false});
        });
      }
    }
  }
}

/**
 * Runs `tasks` (functions returning promises) as one batch session. Returns [{status:'fulfilled',value}|{status:'rejected',reason}] in task order.
 * A group of one task is run plainly, with no session.
 */
export async function runExamBatch(tasks){
  if(tasks.length<2)return Promise.allSettled(tasks.map(task=>Promise.resolve().then(task)));
  const session=new Session(tasks.length);
  const results=await Promise.allSettled(tasks.map(task=>als.run(session,async()=>{
    await session.acquire();
    try{return await task();}
    finally{session.taskDone();}
  })));
  results.stats=session.stats;
  return results;
}
