import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'sector' as const,definition:PRACTICE.sector,calculate:(variant:string,p:PracticeParams)=>calculation('sector',variant,p)};
