/* Pairs each similar-problem set with its original past exam (user request 2026-11-10: show the
   similar problems beside the exam they belong to).
   The catalog has no field that links the two, so the pairing is computed once per catalog load from
   the exam fields. A wrong pair (a teacher handing out another exam's similar problems) is worse than
   no pair, so anything ambiguous stays unlinked and is listed on the 자료 점검 screen. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Similar = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const compact = (value) => String(value ?? "").replace(/\s+/g, "").normalize("NFC");
  const yearOf = (value) => {
    const text = compact(value);
    if (!/^\d{2}$|^\d{4}$/.test(text)) return "";
    return text.length === 2 ? `20${text}` : text;
  };
  // The five fields that name one school exam. A missing value stays "" (never guessed).
  const identityOf = (exam) => ({
    school: compact(exam?.school),
    grade: compact(exam?.grade),
    year: yearOf(exam?.year),
    semester: compact(exam?.semester),
    examType: compact(exam?.examType),
  });
  const IDENTITY_FIELDS = ["school", "grade", "year", "semester", "examType"];
  const sameIdentity = (a, b) => IDENTITY_FIELDS.every((field) => a[field] && a[field] === b[field]);
  // A field that is filled on both sides and differs rules a pair out; an empty field does not.
  const conflicts = (a, b) => IDENTITY_FIELDS.some((field) => a[field] && b[field] && a[field] !== b[field]);

  // Subjects that are certainly different courses. Free-text subject labels ("수학", "기출c", "중1 수학")
  // are not compared; only two of these that differ rule a same-day pair out ("기하" set vs "대수" exam).
  const KNOWN_SUBJECTS = new Set(["대수", "기하", "미적분", "확률과통계", "공통수학1", "공통수학2"]);
  const knownSubject = (value) => {
    const text = compact(value).replace(/^(미적분)d$/, "$1");
    return KNOWN_SUBJECTS.has(text) ? text : "";
  };
  const fileOf = (exam) => String(exam?.file || "");
  const baseName = (file) => file.split("/").pop().replace(/\.js$/i, "");
  const titleOf = (exam) => compact(exam?.identityTitle || baseName(fileOf(exam)));
  // Similar-problem sets live in the similar/ folder; its 단원평가 files are unit tests, not similar problems.
  const isSimilarSet = (exam) => fileOf(exam).startsWith("similar/") && exam.contentType !== "단원평가";
  const isOriginalExam = (exam) => exam?.contentType === "기출" && !fileOf(exam).startsWith("similar/");
  const SIMILAR_TAIL = "_유사";

  const compareSets = (a, b) =>
    fileOf(a).localeCompare(fileOf(b), "ko", { numeric: true });

  /** Rule that produced a pair: "name", "exam" (one original with the same five fields) or "subject". */
  function pairSimilarSets(exams) {
    const list = Array.isArray(exams) ? exams : [];
    const originals = list.filter(isOriginalExam).map((exam) => ({ exam, id: identityOf(exam), title: titleOf(exam), subject: compact(exam.subject) }));
    const byTitle = new Map();
    for (const original of originals) {
      if (!original.title) continue;
      if (!byTitle.has(original.title)) byTitle.set(original.title, []);
      byTitle.get(original.title).push(original);
    }
    const byIdentity = new Map();
    for (const original of originals) {
      if (!IDENTITY_FIELDS.every((field) => original.id[field])) continue;
      const key = IDENTITY_FIELDS.map((field) => original.id[field]).join("|");
      if (!byIdentity.has(key)) byIdentity.set(key, []);
      byIdentity.get(key).push(original);
    }

    const similarByOriginal = new Map(); // original file -> [similar exam]
    const originalBySimilar = new Map(); // similar file -> original file | null
    const ruleBySimilar = new Map(); // similar file -> "name" | "exam" | "subject"
    const unlinked = []; // [{ exam, reason }]

    const link = (set, original, rule) => {
      const file = fileOf(original.exam);
      if (!similarByOriginal.has(file)) similarByOriginal.set(file, []);
      similarByOriginal.get(file).push(set);
      originalBySimilar.set(fileOf(set), file);
      ruleBySimilar.set(fileOf(set), rule);
    };

    for (const set of list.filter(isSimilarSet)) {
      const id = identityOf(set);
      const title = titleOf(set);
      let rule = "";
      let original = null;
      let reason = "";

      // 1. The set's own name says which exam it belongs to: "<original title>_유사…".
      const named = [];
      const cut = title.indexOf(SIMILAR_TAIL);
      if (cut > 0) {
        for (let at = cut; at > 0; at = title.indexOf(SIMILAR_TAIL, at + 1)) {
          for (const candidate of byTitle.get(title.slice(0, at)) || []) named.push(candidate);
        }
      }
      const namedFit = named.filter((candidate) => !conflicts(id, candidate.id));
      if (namedFit.length === 1) {
        original = namedFit[0];
        rule = "name";
      } else if (named.length) {
        reason = namedFit.length ? "같은 이름의 기출이 둘 이상" : "이름이 같은 기출과 학교·학년·연도·학기·시험이 다름";
      }

      // 2./3. Same school, grade, year, semester and exam kind; the subject only breaks a tie.
      if (!original && !reason) {
        if (!IDENTITY_FIELDS.every((field) => id[field])) {
          const missing = IDENTITY_FIELDS.filter((field) => !id[field]).map((field) => ({
            school: "학교", grade: "학년", year: "연도", semester: "학기", examType: "시험 종류",
          })[field]);
          reason = `${missing.join("·")} 정보가 없음`;
        } else {
          const candidates = byIdentity.get(IDENTITY_FIELDS.map((field) => id[field]).join("|")) || [];
          if (candidates.length === 1) {
            const own = knownSubject(set.subject);
            const theirs = knownSubject(candidates[0].subject);
            if (own && theirs && own !== theirs) {
              reason = `과목이 다름(유사문제 ${own}, 기출 ${theirs})`;
            } else {
              original = candidates[0];
              rule = "exam";
            }
          } else if (candidates.length === 0) {
            reason = "같은 학교·학년·연도·학기·시험의 기출이 없음";
          } else {
            const subject = compact(set.subject);
            const narrowed = subject ? candidates.filter((candidate) => candidate.subject === subject) : [];
            if (narrowed.length === 1) {
              original = narrowed[0];
              rule = "subject";
            } else {
              reason = `같은 조건의 기출이 ${candidates.length}개라 어느 것인지 알 수 없음`;
            }
          }
        }
      }

      if (original) link(set, original, rule);
      else {
        originalBySimilar.set(fileOf(set), null);
        unlinked.push({ exam: set, reason: reason || "연결할 기출을 찾지 못함" });
      }
    }
    for (const sets of similarByOriginal.values()) sets.sort(compareSets);
    unlinked.sort((a, b) => compareSets(a.exam, b.exam));

    const total = originalBySimilar.size;
    const counts = { name: 0, exam: 0, subject: 0 };
    for (const rule of ruleBySimilar.values()) counts[rule]++;
    return {
      similarByOriginal,
      originalBySimilar,
      ruleBySimilar,
      unlinked,
      stats: {
        sets: total,
        linked: total - unlinked.length,
        unlinked: unlinked.length,
        originalsWithSimilar: similarByOriginal.size,
        byRule: counts,
      },
      setsFor: (file) => similarByOriginal.get(String(file || "")) || [],
      originalFileFor: (file) => originalBySimilar.get(String(file || "")) || null,
    };
  }

  const EMPTY = pairSimilarSets([]);
  // One computation per catalog object; the screens ask for it on every render.
  const cache = new WeakMap();
  function pairsFor(catalog) {
    const exams = catalog?.exams;
    if (!Array.isArray(exams)) return EMPTY;
    let pairs = cache.get(exams);
    if (!pairs) {
      pairs = pairSimilarSets(exams);
      cache.set(exams, pairs);
    }
    return pairs;
  }

  return { pairSimilarSets, pairsFor, isSimilarSet, isOriginalExam, identityOf };
});
