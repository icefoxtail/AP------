import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'spinarea' as const,definition:PRACTICE.spinarea,calculate:(variant:string,p:PracticeParams)=>calculation('spinarea',variant,p)};
