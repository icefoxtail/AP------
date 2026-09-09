process.argv[2] = '552_machine_evidence_r38.json';
process.argv[3] = '553_machine_evidence_validation_r38.json';
await import('./validate-machine-evidence-r10.mjs');
