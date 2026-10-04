export function sectionTypeFromSetKey(setKey) {
  if (setKey.includes("중단원학습점검")) return "중단원학습점검";
  if (setKey.includes("대단원학습평가")) return "대단원학습평가";
  if (setKey.includes("익힘책")) return "익힘책";
  return "unknown";
}

