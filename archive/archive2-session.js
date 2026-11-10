/* One place that decides whether the shared AP Math OS session is a teacher's.
   The left menu (archive2-navigation.js) and 단원별 기출 (unit-past-exams.js) both use it, so a student or
   parent account can never look "logged in" in one and "login required" in the other.
   Login itself is owned by AP Math OS (../apmath/); the archive only reads the session. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Session = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const compact = (value) => String(value ?? "").replace(/\s+/g, "").toLowerCase();

  // Teacher, admin and owner roles, or the built-in admin account. The server is stricter for some roles
  // (it refuses `owner` on the saved-paper API), so a screen must never promise more than "teacher account".
  function isTeacher(session) {
    if (!session || typeof session !== "object") return false;
    const role = compact(session.role || session.user?.role || session.auth?.role);
    const id = compact(session.id || session.user?.id || session.auth?.id);
    const loginId = compact(session.login_id || session.loginId || session.user?.login_id || session.user?.loginId);
    return ["teacher", "admin", "owner"].includes(role) || id === "t_admin" || loginId === "admin";
  }

  function isExpired(session, now = Date.now()) {
    const expires = Date.parse(session?.expires_at || "");
    return Number.isFinite(expires) && expires < now;
  }

  // loggedIn: a usable teacher session. needsTeacher: some other account is signed in (not a teacher).
  function state(session, now = Date.now()) {
    const none = { loggedIn: false, needsTeacher: false, name: "" };
    if (!session || typeof session !== "object" || Array.isArray(session)) return none;
    if (isExpired(session, now)) return none;
    const name = String(session.name || session.user?.name || "").trim().slice(0, 12);
    if (!isTeacher(session)) {
      const signedIn = Boolean(session.session_token || session.sessionToken || session.login_id || session.loginId ||
        session.user?.login_id || session.id);
      return { loggedIn: false, needsTeacher: signedIn, name: "" };
    }
    return { loggedIn: true, needsTeacher: false, name };
  }

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem("APMATH_SESSION") || "null");
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  return { isTeacher, isExpired, state, read };
});
