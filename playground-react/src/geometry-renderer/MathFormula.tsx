import katex from 'katex';

export default function MathFormula({tex}:{tex:string}){
  return <span className="geometry-math" role="math" dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:false,displayMode:false,output:'htmlAndMathml'})}}/>;
}
