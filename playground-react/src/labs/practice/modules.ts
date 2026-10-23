import type { PracticeId, PracticeDefinition, PracticeParams } from './catalog';
import type { PracticeResult } from './model';
import { model as arc } from '../arc/model';
import { model as sector } from '../sector/model';
import { model as boundary } from '../boundary/model';
import { model as square } from '../square/model';
import { model as spinarea } from '../spinarea/model';
import { model as rotate } from '../rotate/model';
import { model as rope } from '../rope/model';
import { model as rolling } from '../rolling/model';
import { model as overlap } from '../overlap/model';
import { model as polygon } from '../polygon/model';
import { model as tether } from '../tether/model';
import { model as pizza } from '../pizza/model';
import { model as equalarea } from '../equalarea/model';

export type PracticeModule={id:PracticeId;definition:PracticeDefinition;calculate:(variant:string,p:PracticeParams)=>PracticeResult};
export const PRACTICE_MODULES:Record<PracticeId,PracticeModule>={arc,sector,boundary,square,spinarea,rotate,rope,rolling,overlap,polygon,tether,pizza,equalarea};
