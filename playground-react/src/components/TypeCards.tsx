import type { LabId, LabType } from '../data/types';

function Thumbnail({ svg }: {svg:string}) {
  return <svg viewBox="0 0 140 110" aria-hidden="true" className="thumbnail-svg" dangerouslySetInnerHTML={{__html:svg}} />;
}

type Props = { types:LabType[]; selected:LabId; onPick:(id:LabId)=>void; compact?:boolean; };

export default function TypeCards({types,selected,onPick,compact=false}:Props) {
  return <div className={compact ? 'type-grid type-grid--compact' : 'type-grid'}>
    {types.map(type => <button type="button" key={type.id}
      className={`type-card ${selected === type.id ? 'is-selected' : ''} ${!type.implemented ? 'is-preview' : ''}`}
      onClick={() => onPick(type.id)} aria-pressed={selected===type.id}
      title={!type.implemented ? `${type.name}: 구조 카드 (실험실 미연결)` : type.name}>
      <div className="type-thumbnail"><Thumbnail svg={type.thumb}/></div>
      <div className="type-card-copy">
        <span className="type-number">{type.number}</span>
        <strong>{type.name}</strong>
        {!compact && <><span className="type-hint">{type.hint}</span><span className={`type-status ${type.implemented?'is-ready':''}`}>{type.implemented?'실험 가능':'연결 예정'}</span></>}
      </div>
    </button>)}
  </div>;
}
