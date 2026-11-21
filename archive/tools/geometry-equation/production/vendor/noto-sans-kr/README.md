# Noto Sans KR — offline copy of the pinned engine font

Byte-identical copies of the two files `setup-spikes.mjs` downloads from
`dependency-lock.json` (`font.url`, `font.licenseUrl`; google/fonts commit
`9710da1eacb3be272583c3224dcb70f9da6eadbb`). They are here for environments whose
agent phase cannot reach `raw.githubusercontent.com` (DNS `EAI_AGAIN`).
Nothing in the engine changed: the font, the lock and the hash check stay the same.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| `NotoSansKR.ttf` | 10414588 | `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` (= `dependency-lock.json` `font.sha256`) |
| `OFL.txt` | 4388 | `1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9` |

License: SIL Open Font License 1.1 (`OFL.txt`), which allows redistribution
when the license travels with the font.

## Put it where the engine looks (repository root)

```sh
V=archive/tools/geometry-equation/production/vendor/noto-sans-kr
D=.tmp/apmath-visual-engine/dependencies
mkdir -p "$D"
cp "$V/NotoSansKR.ttf" "$V/OFL.txt" "$D/"
node -e "const c=require('crypto'),fs=require('fs'),l=require('./archive/tools/geometry-equation/production/dependency-lock.json');const h='sha256:'+c.createHash('sha256').update(fs.readFileSync('$D/NotoSansKR.ttf')).digest('hex');console.log(h===l.font.sha256?'FONT_SHA_OK '+h:'FONT_SHA_MISMATCH '+h);process.exit(h===l.font.sha256?0:1)"
```

The npm and Python parts still come from `setup-spikes.mjs`. If it stops only
at the font download, copy the font as above; `typography.mjs` checks the hash
again on every render (`FONT_HASH_LOCK_REQUIRED` on any mismatch).

The font does not provide a browser. The renderer still needs Chromium through
`GEOMETRY_BROWSER_EXECUTABLE` (or a `chrome` channel install).
