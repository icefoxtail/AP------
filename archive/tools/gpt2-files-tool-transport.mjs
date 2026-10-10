/** ChatGPT Library Files connector transport for an authorized Node/Work host.
 * Inject `files__list`, `files__materialize`, `files__manage_library` as `files`.
 * This transport is NOT itself CAS: coordinate with gpt2-library-coordinated-adapter.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

function response(item) {
  if (item?.status !== 'succeeded') throw Error('LIBRARY_CONNECTOR_MUTATION_FAILED:' + (item?.error_code || item?.message || 'UNKNOWN'));
  return item;
}
export function createFilesToolTransport({ files, fsApi = fs, scratchDirectory = '/mnt/data' } = {}) {
  const ops = ['files__list', 'files__materialize', 'files__manage_library'];
  if (!files || ops.some(k => typeof files[k] !== 'function')) throw Error('FILES_CONNECTOR_TOOLS_REQUIRED');
  async function locate(p) {
    const parent = path.posix.dirname(p);
    let cursor = null;
    for (let n = 0; n < 25; n++) {
      const args = { surface:'library', library_path:parent, include_folders:false, limit:100 };
      if (cursor) args.cursor=cursor;
      const page=await files.files__list(args);
      if (page.warnings?.length) {
        // A fresh examination has no TECHNICAL/GPT2_V2 directory yet. The
        // connector reports this exact missing-parent warning, not an empty
        // listing. Treat only that specific case as absent; never translate
        // authorization failures or truncated listings into an empty folder.
        if (!cursor && (!page.items || page.items.length === 0) && !page.next_cursor &&
            page.warnings.every(w => w === 'Library path not found: ' + parent)) return null;
        throw Error('LIBRARY_LIST_INCOMPLETE:' + page.warnings.join(';'));
      }
      const found=page.items?.filter(x=>x.kind==='file'&&x.path===p)||[];
      if(found.length>1)throw Error('LIBRARY_NON_UNIQUE_CANONICAL_PATH');
      if(found.length===1)return found[0];
      if(!page.next_cursor)return null;
      cursor=page.next_cursor;
    }
    throw Error('LIBRARY_LIST_PAGINATION_EXCEEDED');
  }
  return {
    capabilities: { rawByteReadback: true, createOnlyNoOverwrite: true },
    async getRaw(remotePath) {
      const info=await locate(remotePath);
      if(!info)return null;
      if(!info.file_id)throw Error('LIBRARY_FILE_ID_MISSING');
      const r=await files.files__materialize({items:[{file_ref:{file_id:info.file_id},outputs:[{representation:'raw_file'}]}]});
      if(r.warnings?.length||r.artifacts?.length!==1||!r.artifacts[0]?.path)throw Error('LIBRARY_MATERIALIZE_FAILED');
      const bytes=await fsApi.readFile(r.artifacts[0].path);
      if(!Buffer.isBuffer(bytes))throw Error('LIBRARY_MATERIALIZED_BYTES_REQUIRED');
      return bytes;
    },
    async uploadCreateOnly(remotePath, bytes) {
      if(!Buffer.isBuffer(bytes))throw Error('LIBRARY_BYTES_REQUIRED');
      const base=await fsApi.mkdtemp(path.join(scratchDirectory,'gpt2-lib-'));
      const local=path.join(base,path.posix.basename(remotePath));
      try {
        await fsApi.writeFile(local,bytes,{flag:'wx'});
        const output=await files.files__manage_library({operations:[
          {operation:'create_folder',path:path.posix.dirname(remotePath)},
          {operation:'upload',container_path:local,destination_path:remotePath},
        ]});
        const result=response(output?.results?.[1]);
        return {path:result.path,fileId:result.file_id};
      } finally {
        await fsApi.rm(base,{recursive:true,force:true});
      }
    },
    async deleteById(fileId) {
      const output=await files.files__manage_library({operations:[{operation:'delete',target:{kind:'file',file_id:fileId}}]});
      response(output?.results?.[0]);
    },
  };
}