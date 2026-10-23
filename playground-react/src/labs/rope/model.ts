import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'rope' as const,definition:PRACTICE.rope,calculate:(variant:string,p:PracticeParams)=>calculation('rope',variant,p)};
