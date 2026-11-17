#!/usr/bin/env bash
# Lists the exam images that differ between two commits, for .github/workflows/r2-archive-assets-copy.yml.
#
#   r2-changed-images.sh <base-sha> <head-sha> <out-file>
#
# <out-file> receives NUL-separated paths RELATIVE to archive/assets/images (the rclone source root), ready for
# `rclone copy --files-from0`. Only added/copied/modified/renamed-to files are listed (--diff-filter=ACMR, renames are
# reported as the new path). Deleted files are not listed because the workflow never removes anything from R2.
# NUL separation keeps Korean names, spaces and parentheses exact (no quoting, no newline splitting).
#
# Exit status is non-zero when the range cannot be read (bad sha, base not fetchable). The caller must then fall back
# to a full comparison; it must never assume "no change".
set -euo pipefail

base="${1:?base sha}"
head="${2:?head sha}"
out="${3:?output file}"
prefix="${IMAGE_PREFIX:-archive/assets/images}"

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
mv "$tmp" "$out"
