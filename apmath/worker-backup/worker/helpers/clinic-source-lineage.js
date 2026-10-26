// Deprecated compatibility re-export.
//
// Source lineage has ONE implementation: ./clinic-provenance.js. The earlier
// duplicate helper was consolidated to keep a single authorization, privacy and
// verification contract. Nothing new should import this path; it exists only so
// a stray older import cannot hold a second, divergent lineage implementation.
export * from './clinic-provenance.js';
