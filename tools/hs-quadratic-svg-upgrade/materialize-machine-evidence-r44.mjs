process.argv[2] = '657_current_v2_preparation_r44.json';
process.argv[3] = '655_machine_evidence_r44.json';
await import('./materialize-machine-evidence-r10.mjs');
