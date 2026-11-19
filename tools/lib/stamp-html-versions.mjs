// Cache-version stamping for the shipped Pages site (build output only; source HTML is never edited).
//
// For every local <script src> and <link href> that points at a .js/.mjs/.css file inside the package, the `v`
// query parameter becomes the first STAMP_LENGTH hex digits of sha256(that file's shipped text), added when absent.
// A changed file therefore gets a new URL, an unchanged file keeps its URL (browser caches stay valid), and every
// HTML page that loads the same file carries the same value. External, data:, blob:, root-absolute, templated and
// already-stamped addresses are left exactly as written; a local target that is not in the package is an error.
// Text inside HTML comments and inside <script>…</script> bodies is never rewritten.
import { createHash } from 'node:crypto';
import path from 'node:path';

export const STAMP_LENGTH = 12;
const STAMPED = new RegExp(`^[0-9a-f]{${STAMP_LENGTH}}$`);
const STAMPABLE_TARGET = /\.(?:m?js|css)$/i;
// comments | <script …>body</script> | <link …>
const TOKEN = /<!--[\s\S]*?-->|<script\b([^>]*)>([\s\S]*?)(<\/script\s*>)|<link\b([^>]*)>/gi;
const ATTRIBUTE = /(^|\s)(src|href)(\s*=\s*)(?:"([^"]*)"|'([^']*)')/i;

export function textDigest(text) {
  return createHash('sha256').update(String(text).replace(/\r\n/g, '\n'), 'utf8').digest('hex');
}

const isLocalReference = (value) => value
  && !/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(value) // scheme (https:, data:, blob:, javascript:…), //host, /absolute, #fragment
  && !/[{}$<>]|<\?|\{\{/.test(value); // template placeholders are not addresses

function splitReference(value) {
  const hashAt = value.indexOf('#');
  const fragment = hashAt >= 0 ? value.slice(hashAt) : '';
  const rest = hashAt >= 0 ? value.slice(0, hashAt) : value;
  const queryAt = rest.indexOf('?');
  return { file: queryAt >= 0 ? rest.slice(0, queryAt) : rest, query: queryAt >= 0 ? rest.slice(queryAt + 1) : null, fragment };
}

// Returns the reference with `v` set to `stamp`, or null when it must stay as written (already a stamp).
function withStamp(parts, stamp) {
  const pairs = parts.query === null || parts.query === '' ? [] : parts.query.split('&');
  const at = pairs.findIndex((pair) => pair === 'v' || pair.startsWith('v='));
  if (at >= 0) {
    if (STAMPED.test(pairs[at].slice(2))) return null;
    pairs[at] = `v=${stamp}`;
  } else {
    pairs.push(`v=${stamp}`);
  }
  return `${parts.file}?${pairs.join('&')}${parts.fragment}`;
}

function restamp(attributes, htmlPath, hashOf, refs) {
  const match = ATTRIBUTE.exec(attributes);
  if (!match) return attributes;
  const [whole, lead, name, equals, doubleQuoted, singleQuoted] = match;
  const value = doubleQuoted ?? singleQuoted;
  if (!isLocalReference(value)) return attributes;
  const parts = splitReference(value);
  if (!STAMPABLE_TARGET.test(parts.file)) return attributes;
  let decoded = parts.file;
  try { decoded = decodeURIComponent(parts.file); } catch { /* keep the literal path */ }
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(htmlPath), decoded));
  if (target === '..' || target.startsWith('../')) throw new Error(`${htmlPath}: ${value} points outside the package`);
  const digest = hashOf(target, htmlPath, value); // throws when the file is not in the package
  const next = withStamp(parts, digest.slice(0, STAMP_LENGTH));
  if (next === null) return attributes;
  refs.push({ from: value, to: next, target });
  const quote = doubleQuoted !== undefined ? '"' : "'";
  return attributes.replace(whole, () => `${lead}${name}${equals}${quote}${next}${quote}`);
}

// text: the page's text; htmlPath: its package-relative path; hashOf(targetPath, htmlPath, reference) -> sha256 hex.
export function stampHtmlVersions({ htmlPath, text, hashOf }) {
  const refs = [];
  const stamped = text.replace(TOKEN, (token, scriptAttributes, scriptBody, scriptClose, linkAttributes) => {
    if (token.startsWith('<!--')) return token;
    if (scriptAttributes !== undefined) {
      const attributes = restamp(scriptAttributes, htmlPath, hashOf, refs);
      return attributes === scriptAttributes ? token : `<script${attributes}>${scriptBody}${scriptClose}`;
    }
    const attributes = restamp(linkAttributes, htmlPath, hashOf, refs);
    return attributes === linkAttributes ? token : `<link${attributes}>`;
  });
  return { text: stamped, refs };
}
