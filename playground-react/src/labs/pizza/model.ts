import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'pizza' as const,definition:PRACTICE.pizza,calculate:(variant:string,p:PracticeParams)=>calculation('pizza',variant,p)};
