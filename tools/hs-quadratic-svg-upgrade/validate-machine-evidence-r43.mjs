process.argv[2] = '639_machine_evidence_r43.json';
process.argv[3] = '640_machine_evidence_validation_r43.json';
await import('./validate-machine-evidence-r10.mjs');
