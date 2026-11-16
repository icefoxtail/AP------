// Rebuild tool-owned evidence only, never operational metadata.
import fs from 'node:fs';
import path from 'node:path';
import {loadContext} from './common.mjs';
import {buildAliasEvidence} from './alias-evidence.mjs';
if(process.argv.slice(2).length)throw Error('NO_ARGUMENTS_SUPPORTED');
const context=loadContext();
fs.writeFileSync(path.join(context.root,'archive/tools/type-judgment/course-aliases.json'),JSON.stringify(buildAliasEvidence(context),null,2)+'\n');
