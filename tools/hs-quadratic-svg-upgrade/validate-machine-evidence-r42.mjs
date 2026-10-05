process.argv[2] = '623_machine_evidence_r42.json';
process.argv[3] = '624_machine_evidence_validation_r42.json';
await import('./validate-machine-evidence-r10.mjs');
