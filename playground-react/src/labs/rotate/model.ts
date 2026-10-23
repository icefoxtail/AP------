import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'rotate' as const,definition:PRACTICE.rotate,calculate:(variant:string,p:PracticeParams)=>calculation('rotate',variant,p)};
