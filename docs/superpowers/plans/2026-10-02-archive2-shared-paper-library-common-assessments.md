# Archive 2.0 Shared Paper Library + Common Assessments Plan

Status: **PLAN ONLY / FUTURE PRODUCT CONTRACT**  
Date: 2026-10-02

## Goal

Archive 2.0 needs a reusable paper line where one teacher can create a paper and the rest of the academy can immediately use it.

Target products:

- 내 시험지
- 공용 시험지
- 5분 테스트
- 단원평가
- 월말평가
- 학교 기출
- 시험 대비

The product must reuse the existing Archive output engines and assignment infrastructure rather than create a second renderer or second distribution system.

## Existing product context

Archive 2.0 already has:

- Working Draft
- server-backed immutable Saved Paper
- Assignment / Distribution
- Home product registry with future slots for 5분 테스트 / 단원평가 / 시험 대비
- existing exam / solution / answer engines
- class assignment and recent-assignment infrastructure

This plan adds the missing **teacher-created shared library layer** and formalizes Common Paper products.

## Authority model

```text
WORKING DRAFT
      ↓
SAVED PAPER
personal immutable completed paper
      ├────────────────────────────→ ASSIGNMENT
      │
      └→ PUBLISH
           ↓
      SHARED PAPER
      academy-wide immutable revision
           ├→ 시험 / 해설 / 정답 / 인쇄
           ├→ 바로 출제
           └→ 내 보관함에 복사 → personal edit

COMMON PAPER
canonical academy/system artifact
5분 테스트 / 단원평가 / 월말평가 / future common packs
           ├→ 시험 / 해설 / 정답 / 인쇄
           ├→ 바로 출제
           └→ 내 보관함에 복사
```

Hard separation:

- Saved Paper != Shared Paper != Common Paper != Assignment.
- Publishing never gives other teachers mutation access to the creator's Saved Paper.
- Shared Paper is identified by `sharedPaperId + revision + snapshotHash`.
- Common Paper is identified by `commonPaperId/packId + revision + snapshotHash`.
- Published revisions are immutable.
- Editing a published paper creates a new revision.
- Assignments pin the exact revision/snapshot used at distribution time.
- Unpublishing removes the paper from future discovery but does not rewrite old assignments or historical revisions.
- A teacher who wants to modify another teacher's shared paper must use **내 보관함에 복사** and receives a new personal Saved Paper.

## Shared Paper Library

Primary purpose:

> One teacher's finished work becomes an immediately reusable academy asset without making the original Saved Paper collaborative/mutable.

Shared Paper card/row actions:

- 시험
- 해설
- 정답
- 인쇄
- 바로 출제
- 내 보관함에 복사

Minimum display metadata:

- title
- grade / subject / scope
- creator
- shared product type
- revision
- published/updated time
- question count
- optional description / tags

Initial sharing scope should support **academy-wide teacher access**. Campus/group/organization visibility can be layered later without changing paper identity.

## Permission boundaries

Do not collapse permissions into one `can_manage` flag.

Separate at least:

- LIST
- SNAPSHOT_READ / OUTPUT
- ASSIGN
- COPY_TO_MY_LIBRARY
- PUBLISH_NEW_REVISION
- UNPUBLISH
- ADMIN

Default cross-teacher capabilities for an academy shared paper:

- LIST
- SNAPSHOT_READ / OUTPUT
- ASSIGN
- COPY_TO_MY_LIBRARY

Other teachers do not get origin mutation rights.

## Common Paper products

### 5분 테스트

- one small unit
- default 4 questions
- round 01 first
- 02/03 only where inventory is sufficient
- ordered question UID list fixed per revision
- output / assign directly from the Common Paper artifact
- do not repurpose the existing unit-past 50/80 rules

### 단원평가

- approximately 20-24 questions per unit
- representative types
- difficulty balance
- round 01 first
- later rounds only where inventory permits
- reuse existing assessment infrastructure where safe
- seal as a Common Paper revision

### 월말평가

Monthly/periodic assessment across the actual teaching range.

Identity includes:

- month/period
- grade / subject
- actual curriculum scope
- revision
- ordered question UIDs
- snapshotHash

Rules:

- may span multiple units/subunits
- do not implement by mechanically concatenating unit assessments
- rebalance representative types, difficulty, and monthly coverage
- support 시험 / 해설 / 정답 / 인쇄 / 바로 출제
- creating next month's paper must not mutate prior revisions

## Output Contract integration

The shared/common line must fit the Archive 2.0 Single Output Envelope rather than invent a separate transport.

Reserve `sourceKind` values:

- `shared-paper`
- `common-paper`

Shared Paper envelope identity:

- `sharedPaperId`
- `revision`
- `snapshotHash`

Common Paper envelope identity:

- `commonPaperId` or `packId`
- `revision`
- `snapshotHash`

Output and assignment must consume the pinned immutable artifact, not silently reconstruct from the latest catalog/current source.

Browser transport technology such as IndexedDB is not authority. The envelope is the contract; browser storage is only a transport. Server/headless PDF should construct/consume the same envelope schema from server authority.

## Home / Library information architecture

Archive 2.0 should eventually expose:

- 내 시험지
- 공용 시험지
- 5분 테스트
- 단원평가
- 월말평가
- 학교 기출
- 시험 대비

Reuse the existing Home product registry. Extend it rather than building a second product launcher.

## Reuse rule

Do not rebuild:

- exam / solution / answer renderers
- print/PDF engine
- Saved Paper immutable snapshot machinery
- recipient selection / assignment infrastructure
- recent assignment history
- source/canonical Archive catalog

Add adapters and paper authority only where required.

## Suggested implementation order

1. Finish Output / Snapshot Stability contract.
2. Freeze Shared/Common Paper identity and permission model.
3. Pilot Shared Paper publish from one Saved Paper.
4. Verify another teacher can direct-output, assign, and copy without mutating origin.
5. Add Shared Paper Library UI.
6. Pilot one 5분 테스트 01.
7. Pilot one 단원평가 01.
8. Pilot one 월말평가 01.
9. Reuse one shared/common output + assignment adapter across all product types.
10. Expand coverage only after revision/history/permission/output/assignment regression passes.

## Pilot acceptance

Shared Paper pilot must prove:

- creator Saved Paper remains unchanged
- new immutable shared revision exists
- other teacher sees the paper
- other teacher opens 시험 / 해설 / 정답 directly
- print/PDF works
- other teacher can assign it
- assignment pins the shared revision/snapshot
- other teacher can copy it to personal Saved Paper and edit only the copy
- creator can publish a new revision without changing old assignment output
- unpublish does not break historical assignment reopen

Common Paper pilot must additionally prove:

- canonical ownership is not a teacher Saved Paper
- ordered UIDs and revision are deterministic
- all teachers consume the same revision
- output/assignment use the same adapter as Shared Paper

## Non-goals for first implementation

- collaborative live editing of one paper
- silent mutation of published revisions
- duplicate renderer/print engine
- duplicate assignment system
- permission-by-teacher-name string matching
- rebuilding unit-past as 5분 테스트

## Final product principle

**Create once -> publish once -> every teacher can immediately view, print, assign, or copy, while every distributed paper remains historically immutable.**
