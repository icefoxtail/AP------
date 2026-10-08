import fs from 'node:fs';
import path from 'node:path';
import {sha256} from './archive-codex-artifact-io.mjs';

export const UNIT_MASTER_PATH='docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md';
export function loadUnitOrders(root){
  const file=path.resolve(root,UNIT_MASTER_PATH),bytes=fs.readFileSync(file),orders=new Map();
  for(const line of bytes.toString('utf8').split(/\r?\n/)){
    const cells=line.split('|').slice(1,-1).map(s=>s.trim());
    if(cells.length!==3||!(/^(?:M[123]-\d{2}|H(?:15|22)-[A-Z0-9]+-\d{2})$/).test(cells[0])||!/^\d+$/.test(cells[2]))continue;
    const row={key:cells[0],label:cells[1],order:Number(cells[2])};
    if(orders.has(row.key)&&JSON.stringify(orders.get(row.key))!==JSON.stringify(row))throw Error('UNIT_MASTER_AMBIGUOUS:'+row.key);
    orders.set(row.key,row);
  }
  if(!orders.size)throw Error('UNIT_MASTER_ROWS_REQUIRED');
  return {orders,authority:{path:file,sha256:sha256(bytes)}};
}
export function inspectUnitOrders(questions,master){
  const findings=[];
  for(const q of questions){const expected=master.orders.get(q.standardUnitKey);
    if(!expected){findings.push({qid:Number(q.id),code:'STANDARD_UNIT_ORDER_AUTHORITY_UNKNOWN',standardUnitKey:q.standardUnitKey});continue;}
    if(q.standardUnitOrder!==expected.order)findings.push({qid:Number(q.id),code:'STANDARD_UNIT_ORDER_CANONICAL_MISMATCH',standardUnitKey:q.standardUnitKey,observed:q.standardUnitOrder,expected:expected.order});
  }
  return {authority:master.authority,findings,semanticReclassification:false,sourceMutation:false};
}
