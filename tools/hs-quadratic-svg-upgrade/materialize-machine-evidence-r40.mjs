process.argv[2] = '592_current_v2_preparation_r40.json';
process.argv[3] = '590_machine_evidence_r40.json';
await import('./materialize-machine-evidence-r10.mjs');
