process.argv[2] = '554_current_v2_preparation_r38.json';
process.argv[3] = '552_machine_evidence_r38.json';
await import('./materialize-machine-evidence-r10.mjs');
