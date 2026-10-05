process.argv[2] = '625_current_v2_preparation_r42.json';
process.argv[3] = '623_machine_evidence_r42.json';
await import('./materialize-machine-evidence-r10.mjs');
