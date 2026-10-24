# Construction fact/display map V1

`verifyConstructionConditionBindings(plan)` retains legacy behavior for ordinary data plans when `factDisplayMap` is absent. A root Proxy is rejected with `util.types.isProxy` before own-property/map discovery, whether or not it has a map. In the opt-in path, the plan must include a nonempty `VISUAL_FACT_DISPLAY_MAP_v1` with explicit `sourceConditionId`, `factId`, `factRole`, `displayDisposition`, and conditional owner/preservation/reason fields. The gate structurally checks the supplied condition inventory against the plan's typed `mathPlan.nodes` and preserves the exact `PRESERVED_ARCHIVE_BANK` token behavior.

```js
factDisplayMap: {
  schemaVersion: 'VISUAL_FACT_DISPLAY_MAP_v1',
  rows: [{
    sourceConditionId: 'given-a', factId: 'A', factRole: 'GIVEN',
    displayDisposition: 'SVG_REQUIRED', expectedOwner: 'A',
    preservedLocationRef: null, reason: null
  }]
}
```

`SVG_REQUIRED` and `OMITTED_AUXILIARY` resolve only existing `POINT`, `LINE`, or `CIRCLE` node IDs. A preserved body row uses `factId === sourceConditionId`, the exact legacy target `PRESERVED_ARCHIVE_BANK`, and `preservedLocationRef: {kind:'PRESERVED_ARCHIVE_BANK', field:'content'|'choices'|'answer'|'solution'|'image'}`. An omitted auxiliary row uses `sourceConditionId: null`, `factRole: 'DERIVED_INTERMEDIATE'`, a nonempty reason, and null owner/location fields.

This V1 slice resolves only `POINT`, `LINE`, and `CIRCLE` construction nodes for `SVG_REQUIRED` and `OMITTED_AUXILIARY`. It does not bind scalar labels, point/segment annotations, display segments, or rendered primitives. It does not independently verify the original source, source-inventory completeness, Archive bytes or image parity, actual SVG contents, rendering, review, qualification, or publication. Success returns `undefined` and emits no hash or receipt.

The opt-in input is checked as inert JSON data before property reads; accessors, nested proxies, cycles, unsupported values, and non-NFC map identifiers are rejected. Ordinary no-map data plans keep legacy `mappedTo` strings and string arrays opaque and unchanged; the root-Proxy rejection above is the explicit exception.
