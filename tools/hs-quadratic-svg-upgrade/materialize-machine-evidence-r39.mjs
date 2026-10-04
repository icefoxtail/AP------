process.argv[2] = '576_current_v2_preparation_r39.json';
process.argv[3] = '574_machine_evidence_r39.json';
await import('./materialize-machine-evidence-r10.mjs');
