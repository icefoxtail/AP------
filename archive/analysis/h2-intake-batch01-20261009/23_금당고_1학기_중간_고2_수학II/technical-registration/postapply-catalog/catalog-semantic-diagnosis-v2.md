# Post-apply Archive 2 catalog discrepancy

**Status:** ROOT authorization is required before applying the proposed two-file repair. No primary registry, helper, gate, source, or asset was modified.

The actual primary check, “node archive/tools/build-archive2-catalog.mjs --check,” exited 1 with “Archive 2.0 catalog projection is stale.” The raw stdout/stderr are preserved in “postapply-catalog/attempt-01.” I reseeded the owned candidate worktree from the exact applied nine-file snapshot and reproduced the same failure there. Running the existing canonical catalog generator in that isolated candidate produced the expected catalog and manifest; a subsequent candidate check exited 0.

The byte comparison is narrow. The applied catalog SHA is “d68a9c5df79cd10ebeb6f32a1cba69b0e4a186d170b7561b89c2ba06c1f9eb35”; the canonical expected catalog SHA is “7a4b6036ceb5a836bb12666e9ccac33c9fea8e7a87b7942132c6ea620bedc120”. Only the top-level indexVersion differs: applied “2ad048f409401633011774bd922f316602dce0c04fe368adc0fb4dbb718eff5a”, expected “923dbd4f05554f51004a6b88f80f5d03850aded4088167cdd8a9ffaf3dade696”. The packed records array, exams, source hashes, taxonomy, health, encoding, columns, and dictionary strings are byte-equal. Decoded changed-record count is zero; target 0, non-target 0.

The corresponding manifest SHA changes from “e9467a52e187f18e8e3ba0ab92383e280628dc09d8d4c7962a815a18b7bdf0f9” to “0b127107058cfd528c28ef79667b6ad47751484cd267abe17cf2e4b875ec8608”. Its only differing fields are generatedFromCatalogIndexVersion, projectionVersion, and the SHA row for data/archive2-catalog.json.

The source shows the hash-contract mismatch. register-target-exam.mjs line 150 hashes catalogRecords after core.decodeCatalog; archive2-core.js lines 815-827 reconstruct record objects in packed columns order. build-archive2-catalog.mjs lines 454-464 hashes source record objects before column packing. Both use JSON.stringify, so object-key insertion order can change the global index hash even when all decoded rows and packed values match.

The reviewable proposal copies the canonical expected catalog and manifest into .tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/registration-postapply-catalog/proposed-v1/. That proposal changes one catalog header field and the dependent manifest header/hash values; it contains no row, dictionary, or runtime changes. ROOT can authorize that exact pair after reviewing catalog-semantic-diagnosis-v2.json.

The original v4 package/candidate and the exact applied-before snapshot are preserved. The first missing step is ROOT_AUTHORIZATION_FOR_EXACT_TWO_FILE_CATALOG_AND_MANIFEST_REBIND; after authorization, ROOT can install the two proposed bytes and run the primary check plus required post-apply checks. No R1/R2/R3 review, quality validator, or render was rerun.
