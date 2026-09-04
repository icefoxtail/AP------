---
name: apmath-visual-upgrade
description: Route APMath SVG, graph, geometry, and solutionImage generation, modification, and review through the current versioned rule-pack before any work starts.
---

# Apmath Visual Upgrade

Use this skill whenever a task creates, edits, regenerates, attaches, or reviews an SVG, graph, geometry figure, or `solutionImage` for the JS archive.

This skill is a router only. Do not copy, summarize, merge, or rewrite the rule prose here. The authoritative text remains in the repository files below.

## Mandatory preflight — do this before visual work

1. Resolve the repository root and read `docs/rules/00_RULES_INDEX.md`.
2. Read the following files in this order, recording the exact repository path, declared version, byte count, and SHA-256 from `docs/rules/MANIFEST.md`:

   1. `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md`
   2. `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`
   3. `docs/rules/04_VISUAL/도형추출.md` (must declare v3.0)
   4. `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` when the task concerns equations of figures, coordinates, lines, circles, conics, or related geometry explanations
   5. The applicable `UNIT_OVERLAY` under `docs/rules/`, if one exists for the target grade/course/unit. Exclude `docs/rules/90_ARCHIVE/` and do not treat unrelated overlays as applicable.

3. Apply the task-specific remainder of the read order from `docs/rules/00_RULES_INDEX.md`, including the relevant pipeline and review rules. The engine-level snapshot order is also exposed by `alive/engine/rule_pack.py::RULE_READ_ORDER`.
4. Before generating or changing an asset, record the effective rule paths and versions in the task evidence/report. A visual task is not started until the manifest entry and working-tree bytes/hash agree for every mandatory file.

## Fail-closed gate

If any mandatory file is missing, unreadable, absent from the manifest, version-mismatched, or hash-drifted, stop before changing SVG, graph, or `solutionImage` content. Report `RULE_ROUTING_BLOCKED`, the missing/drifted path, and the relevant manifest/hash evidence. Do not substitute an older rule, a plan file, a historical file, or memory of the rule.

If no applicable `UNIT_OVERLAY` exists, record that fact and continue with the common ruleset. If an applicable overlay exists but cannot be identified or read, stop; do not infer its curriculum, sampling, style, print, or review requirements.

## Scope boundary

This skill governs routing and preflight only. The rule files define the actual archive schema, protection boundaries, mathematical verification, sampling, coordinates, typography, print behavior, render gates, independent review, and seal requirements. Preserve production/source assets according to those authoritative documents and the user's explicit scope.
