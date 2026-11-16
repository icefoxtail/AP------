# AP Enclosed Latin

This renamed font contains exactly U+24B6–U+24E9: 26 uppercase and 26 lowercase
enclosed Latin letters. It adds no other Unicode coverage. The existing
`mathjax-tex` math font and its default `serif` fallback remain in use. The
engine adds `AP Enclosed Latin` to individual enclosed-Latin runs in CHTML
unknown text, preserving the surrounding fallback markup for other characters.

The 5,100-byte WOFF2 is a subset of **Noto Sans CJK KR Regular**, face index 1 in
`NotoSansCJK-Regular.ttc` version 2.004. The original TTC SHA-256 is
`b76b0433203017ca80401b2ee0dd69350349871c4b19d504c34dbdd80541690a`.
`subset-manifest.json` records the input, output, licence and each glyph's
outline and horizontal metrics. All 52 outlines and advances were compared
with the original font after WOFF2 round-trip decoding. The derivative uses
the family name `AP Enclosed Latin` and PostScript name
`APEnclosedLatin-Regular`. The accompanying `LICENSE.txt` preserves the
font copyright notice and the SIL Open Font License 1.1.

## Reproduce

With FontTools 4.57.0 and Brotli installed:

```sh
python3 tools/subset-enclosed-latin-font.py \
  --source-font /usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc \
  --source-license /usr/share/doc/fonts-noto-cjk/copyright \
  --output-dir archive/vendor/ap-enclosed-latin
```

The generator refuses a different source font or distribution licence. It
keeps the original glyph outlines, advances, copyright and licence records,
removes unused layout features, renames the derivative and fixes timestamp
recalculation to make the output deterministic.

The engine waits for this exact face before MathJax completes its initial
page preparation. A failed, empty or delayed font load does not mark that
preparation successful. The wait is bounded at 5,000 ms. This avoids recording
a missing glyph's zero width in MathJax's unknown-character measurement cache.

The existing general MathJax loader still continues on its historical failure
paths. For the engine's enclosed-Latin startup hook and actual U+24B6–U+24E9
input only, both the shared render loop and the engine's direct fallback recheck
the startup promise before calling `typesetPromise`. The promise also ensures
the scoped CHTML hook is available before the first enclosed-glyph measurement.
Other input and other startup configurations retain their existing continuation
behavior.

## Verification boundary

`node --test tests/archive-mathjax-enclosed-latin-font.test.cjs` decodes the
shipped WOFF2 cmap and horizontal metrics, checks exact coverage and hashes,
executes the production startup hook with a fake clock, and checks the
vendored MathJax default fallback and mixed-run markup. It also connects the actual
general loader, shared loop and direct engine caller to test failure before
measurement. These are code and font-byte
checks. Actual Chrome rendering and independent screenshot review remain
separate requirements.

This font does not change question source, choices, answers, solutions,
metadata, identity or existing review decisions. It is not a replacement
for MathJax's `MJX-TEX-ZERO` font and does not assert that the latter contains
enclosed Latin glyphs.

MathJax documents `unknownFamily` and `startup.pageReady` here:

- https://docs.mathjax.org/en/latest/options/output/index.html
- https://docs.mathjax.org/en/latest/options/startup/startup.html
