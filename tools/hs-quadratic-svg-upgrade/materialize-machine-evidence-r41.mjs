process.argv[2] = '609_current_v2_preparation_r41.json';
process.argv[3] = '607_machine_evidence_r41.json';
await import('./materialize-machine-evidence-r10.mjs');
