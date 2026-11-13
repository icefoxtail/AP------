// Exact family/PostScript pairs from the same platform/encoding/language record group in the verified sfnt.
// Fontconfig's CSS family can differ from name ID 1 of a variable font; no prefix or generic alias is accepted.
export function extractFontNamePairs(bytes){
  const invalid=()=>{throw Error('FONT_NAME_TABLE_INVALID');};
  if(!Buffer.isBuffer(bytes)||bytes.length<12)invalid();
  const tables=bytes.readUInt16BE(4);if(12+16*tables>bytes.length)invalid();let table;
  for(let i=0;i<tables;i++){const at=12+16*i;if(bytes.toString('ascii',at,at+4)==='name'){const offset=bytes.readUInt32BE(at+8),length=bytes.readUInt32BE(at+12);if(offset+length>bytes.length)invalid();table=bytes.subarray(offset,offset+length);}}
  if(!table||table.length<6)invalid();
  const count=table.readUInt16BE(2),strings=table.readUInt16BE(4);if(6+12*count>table.length)invalid();
  const groups=new Map();
  for(let i=0;i<count;i++){
    const at=6+12*i,platform=table.readUInt16BE(at),encoding=table.readUInt16BE(at+2),language=table.readUInt16BE(at+4),nameId=table.readUInt16BE(at+6),length=table.readUInt16BE(at+8),offset=strings+table.readUInt16BE(at+10);
    if(![0,3].includes(platform)||![1,6].includes(nameId))continue;
    if(length%2||offset+length>table.length)invalid();
    const value=Buffer.from(table.subarray(offset,offset+length)).swap16().toString('utf16le');
    if(!value||/[\u0000-\u001f]/u.test(value))invalid();
    const key=[platform,encoding,language].join(':');const group=groups.get(key)??{platform,encoding,language};
    const field=nameId===1?'familyName':'postScriptName';if(group[field]!==undefined&&group[field]!==value)invalid();group[field]=value;groups.set(key,group);
  }
  const pairs=[...groups.values()].filter(g=>g.familyName&&g.postScriptName).sort((a,b)=>a.platform-b.platform||a.encoding-b.encoding||a.language-b.language);
  if(!pairs.length)invalid();return pairs;
}
export const matchesFontNamePair=(font,pairs)=>font?.glyphCount>0&&font.isCustomFont===false&&pairs.some(pair=>font.familyName===pair.familyName&&font.postScriptName===pair.postScriptName);
