import { PRACTICE, type PracticeParams } from '../practice/catalog';
import { calculation } from '../practice/model';
export const model={id:'rolling' as const,definition:PRACTICE.rolling,calculate:(variant:string,p:PracticeParams)=>calculation('rolling',variant,p)};
