import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'boundary' as const,definition:PRACTICE.boundary,calculate:(variant:string,p:PracticeParams)=>calculation('boundary',variant,p)};
