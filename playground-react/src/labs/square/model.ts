import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'square' as const,definition:PRACTICE.square,calculate:(variant:string,p:PracticeParams)=>calculation('square',variant,p)};
