// Share JSON parsing only. Callers must still read and authenticate current bytes
// on every validation; this cache stores no approval or filesystem permission.
import crypto from 'node:crypto';
const freeze = value => {
  if(value && typeof value==='object' && !Object.isFrozen(value)) {
    for(const child of Object.values(value))freeze(child);
    Object.freeze(value);
  }
  return value;
};
export {freeze as freezeJsonValue};
export function createExactJsonByteParser(limit=128) {
  if(!Number.isSafeInteger(limit)||limit<1)throw Error('positive parser cache limit required');
  const cache=new Map();
  return raw => {
    if(!Buffer.isBuffer(raw))throw Error('fresh JSON bytes required');
    const key=crypto.createHash('sha256').update(raw).digest('hex'),old=cache.get(key);
    if(old && old.raw.equals(raw)) {
      cache.delete(key);cache.set(key,old);
      return old.value;
    }
    const value=freeze(JSON.parse(raw.toString('utf8')));
    cache.set(key,{raw:Buffer.from(raw),value});
    while(cache.size>limit)cache.delete(cache.keys().next().value);
    return value;
  };
}
