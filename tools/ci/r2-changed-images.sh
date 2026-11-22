#!/usr/bin/env bash
# Builds the explicit list of exam images to upload, for .github/workflows/r2-archive-assets-copy.yml.
# This script never lists the whole image folder for upload: there is no "everything" mode (user decision 2026-11-17,
# reason: Cloudflare R2 Class A request charges).
#
#   r2-changed-images.sh <base-sha> <head-sha> <out-file>        images changed between two commits
#   r2-changed-images.sh --folder <exam-folder-name> <out-file>  git-tracked images of ONE exam folder
#   r2-changed-images.sh --pick-base < runs.json                 newest run usable as a diff base (see below)
#
# <out-file> receives NUL-separated paths RELATIVE to archive/assets/images (the rclone source root), ready for
# `rclone copy --files-from0`. In diff mode only added/copied/modified/renamed-to files are listed
# (--diff-filter=ACMR, renames are reported as the new path); deleted files are not listed because the workflow never
# removes anything from R2. NUL separation keeps Korean names, spaces and parentheses exact.
#
# R2_MAX_IMAGES (default 500) caps how many files one run may list. A larger list is refused, not truncated.
#
# Exit status (<out-file> is written only on 0; after any other status the caller must not assume "no change"):
#   0 list written (may be empty in diff mode)   2 bad arguments / unreadable commit range
#   3 more than R2_MAX_IMAGES files               4 folder name rejected
#   5 folder has no git-tracked images
set -euo pipefail

prefix="${IMAGE_PREFIX:-archive/assets/images}"
max="${R2_MAX_IMAGES:-500}"
if ! [[ "$max" =~ ^[0-9]+$ ]]; then
  echo "r2-changed-images: R2_MAX_IMAGES must be a number" >&2
  exit 2
fi

tmp=""
trap '[ -z "$tmp" ] || rm -f "$tmp"' EXIT

# finish <out-file>: enforce the size limit on $tmp, then publish it as <out-file>.
finish() {
  local out="$1" count
  count="$(tr -cd '\0' < "$tmp" | wc -c | tr -d ' ')"
  if [ "$count" -gt "$max" ]; then
    echo "r2-changed-images: ${count} images exceed the limit of ${max}; refusing to upload" >&2
    exit 3
  fi
  mv "$tmp" "$out"
}

# --pick-base: reads the JSON of `gh api .../runs?branch=main&status=success` on stdin and prints the head_sha of the
# newest run that may serve as the diff base: a push run, or a manual run in mode catch_up. Manual runs in mode folder
# only upload one exam folder, so they never count (otherwise they would hide the images of a failed push).
# Prints nothing when no run qualifies. The run-name below must match `run-name:` in the workflow.
if [ "${1:-}" = "--pick-base" ]; then
  js='
const catchUpTitle = "R2 image copy (catch_up)";
let text = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => { text += chunk; });
process.stdin.on("end", () => {
  let runs = [];
  try { runs = JSON.parse(text).workflow_runs || []; } catch (error) { runs = []; }
  const ok = run => /^[0-9a-f]{40}$/.test(run.head_sha || "")
    && (run.event === "push" || (run.event === "workflow_dispatch" && (run.display_title === catchUpTitle || run.name === catchUpTitle)));
  const hit = runs.find(ok);
  if (hit) process.stdout.write(hit.head_sha + "\n");
});
'
  exec node -e "$js"
fi

if [ "${1:-}" = "--folder" ]; then
  folder="${2-}"
  out="${3:?output file}"
  case "$folder" in
    ""|*/*|*\\*|*..*|.*|*:*|*[[:cntrl:]]*)
      echo "r2-changed-images: folder must be one exam folder name under ${prefix}/ (no slash, '..', leading dot, colon)" >&2
      exit 4 ;;
  esac
  trimmed="${folder#"${folder%%[![:space:]]*}"}"
  trimmed="${trimmed%"${trimmed##*[![:space:]]}"}"
  if [ "$trimmed" != "$folder" ]; then
    echo "r2-changed-images: folder name has leading or trailing whitespace" >&2
    exit 4
  fi
  tmp="${out}.part"
  # Run inside the image root so paths come out relative to it; :(literal) turns off glob magic in the name.
  git -C "$prefix" -c core.quotepath=off ls-files -z -- ":(literal)${folder}/" > "$tmp"
  if [ ! -s "$tmp" ]; then
    echo "r2-changed-images: no git-tracked images under ${prefix}/${folder}/" >&2
    exit 5
  fi
  finish "$out"
  exit 0
fi

base="${1:?base sha}"
head="${2:?head sha}"
out="${3:?output file}"

sha_re='^[0-9a-f]{40}$'
if ! [[ "$base" =~ $sha_re && "$head" =~ $sha_re ]]; then
  echo "r2-changed-images: base and head must be full 40-hex commit ids" >&2
  exit 2
fi

# The checkout is shallow (depth 1); the base is usually not in it. Fetching a single commit is enough because
# `git diff <base> <head>` only compares the two trees.
if ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  git fetch --no-tags --depth=1 origin "$base" >&2
fi
git cat-file -e "${head}^{commit}"

tmp="${out}.part"
git -c core.quotepath=false diff -z --name-only --no-renames --diff-filter=ACMR \
  --relative="$prefix" "$base" "$head" > "$tmp"
finish "$out"
