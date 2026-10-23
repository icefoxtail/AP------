import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'equalarea' as const,definition:PRACTICE.equalarea,calculate:(variant:string,p:PracticeParams)=>calculation('equalarea',variant,p)};
