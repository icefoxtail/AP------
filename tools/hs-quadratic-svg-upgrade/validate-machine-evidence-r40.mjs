process.argv[2] = '590_machine_evidence_r40.json';
process.argv[3] = '591_machine_evidence_validation_r40.json';
await import('./validate-machine-evidence-r10.mjs');
