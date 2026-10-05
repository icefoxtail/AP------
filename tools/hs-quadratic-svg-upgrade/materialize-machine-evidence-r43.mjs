process.argv[2] = '641_current_v2_preparation_r43.json';
process.argv[3] = '639_machine_evidence_r43.json';
await import('./materialize-machine-evidence-r10.mjs');
