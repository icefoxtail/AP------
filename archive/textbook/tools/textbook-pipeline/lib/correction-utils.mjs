export const correctionAllowedFields = new Set(["content", "choices", "answer"]);

export function normalizeCorrection(raw) {
  return raw && typeof raw === "object" ? raw : null;
}
