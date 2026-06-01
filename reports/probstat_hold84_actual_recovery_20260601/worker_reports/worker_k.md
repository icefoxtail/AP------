# Worker K hold84 actual recovery report

Date: 2026-06-01

## Scope

Touched only the four assigned candidate JS files plus this report.
No aggregate rebuild, live archive, archive/db.js, or git operation was performed.

## Files updated

1. `archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/20_매산여고_2학기_기말_고2_확률과통계/candidate/20_매산여고_2학기_기말_고2_확률과통계.candidate.js`
   - Restored OCR-based content in display order where full-page OCR gave stable question boundaries.
   - Restored objective choices for 1-18 from full-page images.
   - Corrected unresolved/corrupt answers:
     - 21: `a^2+1/4`
     - 22: `8`
     - 23: `3.04<=m<=6.96`
   - Remaining holds: none from this pass.

2. `archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/19_매산고_2학기_기말_고2_확률과통계/candidate/19_매산고_2학기_기말_고2_확률과통계.candidate.js`
   - Restored OCR-based content in display order where full-page OCR gave stable question boundaries.
   - Restored objective choices for 1-14 from full-page images.
   - Cleared corrupt unresolved answer text for 16 and 19 rather than leaving fake/garbled values.
   - Remaining holds:
     - 16: answer not confirmed from available answer text/image.
     - 19: compound 서술형 answer text remains unconfirmed because answer source is corrupted.

3. `archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/19_매산여고_2학기_기말_고2_확률과통계/candidate/19_매산여고_2학기_기말_고2_확률과통계.candidate.js`
   - Restored OCR-based content in display order where full-page OCR gave stable question boundaries.
   - Restored objective choices for 1-17 from full-page images.
   - Cleared corrupt unresolved answer text for 21 rather than leaving fake/garbled values.
   - Remaining holds:
     - 18: candidate type is multiple-choice, but source page marks objective section as 1-17 and display 18 begins the subjective section; choices left unresolved.
     - 21: 서술형 answer not confirmed from corrupted answer source.

4. `archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2mid/19_매산여고_2학기_중간_고2_확률과통계/candidate/19_매산여고_2학기_중간_고2_확률과통계.candidate.js`
   - Applied OCR-based content refresh where stable question segmentation was available.
   - Existing choices and answers were preserved; no remaining missing choices/answers found in this pass.
   - Remaining holds: none from this pass.

## Verification

- `node --check archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/20_매산여고_2학기_기말_고2_확률과통계/candidate/20_매산여고_2학기_기말_고2_확률과통계.candidate.js` passed.
- `node --check archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/19_매산고_2학기_기말_고2_확률과통계/candidate/19_매산고_2학기_기말_고2_확률과통계.candidate.js` passed.
- `node --check archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2final/19_매산여고_2학기_기말_고2_확률과통계/candidate/19_매산여고_2학기_기말_고2_확률과통계.candidate.js` passed.
- `node --check archive/_generated/past-exams/high_h2_probability_statistics_all_terms/2mid/19_매산여고_2학기_중간_고2_확률과통계/candidate/19_매산여고_2학기_중간_고2_확률과통계.candidate.js` passed.
