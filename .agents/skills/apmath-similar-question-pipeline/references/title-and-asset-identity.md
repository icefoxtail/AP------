# Similar-exam title and asset identity

Use this reference for a whole-exam similar-question output that may later be
installed in `archive/exams/similar/`. It separates the machine identity used
by Archive and asset paths from the human title printed by the engine.

## Canonical identity

For a legacy-compatible or unclassified school-exam-derived similar set,
derive the identity from the source exam's canonical basename and append
`_유사`:

```text
25_제일고_2학기_중간_고2_확률과통계_유사
```

Keep the exact same identity in:

- the final JS filename, without `.js`;
- `window.examTitle`;
- the Archive `file` path basename;
- the asset directory name;
- the identity field in the package manifest and reports.

For a new universal A/B/C output, the variant class is part of the machine
identity. Use an uppercase class token even if a caller supplies lowercase:

```text
25_제일고_2학기_중간_고2_확률과통계_유사A
25_제일고_2학기_중간_고2_확률과통계_유사B
25_제일고_2학기_중간_고2_확률과통계_유사C
```

The class-aware identity must be identical in the final JS filename,
`window.examTitle`, Archive basename, asset directory, package manifest, and
reports. A/B/C counters are independent; an A output never consumes a B or C
number.

The human-facing title may be separate, for example:

```text
25년 제일고 고2 2학기 중간고사 확률과 통계 유사문제
```

If the renderer supports a display-title field, use it only for screen and
print headers. Never use the display title as an asset or file-system key.

## Collision policy

For the legacy untyped identity, the first output is `_유사`. If it is already
reserved by a different source fingerprint or variation profile, allocate the
lowest unused suffix in this order:

```text
..._유사.js
..._유사2.js
..._유사3.js
```

Do not create `_유사1` for new work. Existing `_유사1`, `_유사문제`,
`_강화유사문제`, and similar legacy names are preserved; inspect them as
possible collisions but do not silently rename them.

For a class-aware output, allocate within that class in this order:

```text
..._유사A.js
..._유사A2.js
..._유사A3.js
```

and equivalently for B and C. Do not create `_유사A1`, `_유사B1`, or
`_유사C1`. If `_유사A` exists, the next different accepted A set is
`_유사A2`; an existing `_유사B` does not affect that decision. The numeric
suffix is placed after the class token so the class remains immediately
readable.

Existing untyped `_유사` is legacy and is not silently reclassified as A. New
class-aware work must explicitly record `variantClass=A|B|C`; an old
`_유사`, `_유사문제`, or `_강화유사문제` artifact is preserved and reported as
legacy context, not overwritten.

Collision resolution must check the canonical JS path and its asset directory.
An exact rerun with the same source SHA, variant class, variation profile, and
accepted question-set hash reuses the existing identity. A different accepted
set gets the next free suffix within the same class. Never overwrite a
published or previously packaged identity without an explicit migration
request.

## Production-style install paths

For a high-school grade-2, second-semester midterm output, the intended
promotion paths are:

```text
archive/exams/similar/high/h2/2mid/<identity>.js
archive/assets/images/<identity>/q01.svg
archive/assets/images/<identity>/q02.svg
```

Use one question-number padding scheme within the exam. The production
similar archive convention is two digits (`q01` ... `q23`); solution diagrams
use the matching `qNN-solution.svg` name. The JS `image`, `visualAsset`, and
`solutionImage` fields must point to the same identity directory and exact
basename as the packaged asset.

The local Run remains review-only. Before publication, materialize an
install-ready package with these target-relative paths, verify every referenced
asset exists and hashes match, then request separate Archive publication. Do
not register the JS, update `db.js`, or update indexes merely because the local
Run passed.

## Identity gate

Before final packaging, fail closed unless:

1. source identity, source SHA, variation profile, and collision decision are
   recorded;
2. for A/B/C output, `variantClass` and the class-aware identity are recorded;
3. `window.examTitle`, JS basename, and asset directory use the same identity;
4. every visual reference resolves to one packaged asset with the same SHA;
5. no temporary `_generated/<runId>` path remains in the install-ready JS;
6. the human display title is not used as a path key; and
7. the package preserves the old Run as evidence when this is a post-run
   canonicalization rather than a new generation Run.
