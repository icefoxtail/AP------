import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'tether' as const,definition:PRACTICE.tether,calculate:(variant:string,p:PracticeParams)=>calculation('tether',variant,p)};
