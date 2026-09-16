# Migration Dispositions

기존 key 각각을 아래 중 하나로 판정한다.

- KEEP
- RENAME
- MOVE
- SPLIT
- MERGE
- LEGACY_ALIAS
- INTERNAL_ONLY
- DELETE

## 규칙
- 2015 key라는 이유로 삭제 금지
- 동일한 한글명이더라도 교육과정이 다르면 별도 canonical node 가능
- source question의 수학 내용/해설을 읽지 않고 SPLIT 대상 문항을 일괄치환 금지
- migration map은 oldKey → canonicalPath + disposition + reason을 반드시 보관
