import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'arc' as const,definition:PRACTICE.arc,calculate:(variant:string,p:PracticeParams)=>calculation('arc',variant,p)};
