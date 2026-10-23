import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'polygon' as const,definition:PRACTICE.polygon,calculate:(variant:string,p:PracticeParams)=>calculation('polygon',variant,p)};
