process.argv[2] = '607_machine_evidence_r41.json';
process.argv[3] = '608_machine_evidence_validation_r41.json';
await import('./validate-machine-evidence-r10.mjs');
