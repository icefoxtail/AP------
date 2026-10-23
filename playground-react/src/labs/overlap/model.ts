import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'overlap' as const,definition:PRACTICE.overlap,calculate:(variant:string,p:PracticeParams)=>calculation('overlap',variant,p)};
