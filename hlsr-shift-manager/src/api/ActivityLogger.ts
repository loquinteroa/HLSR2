import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { db, analytics, auth } from "../firebase";

let _currentRole = "";
export const setCurrentRole = (role: string) => { _currentRole = role; };

const getUserName = (email: string): string => {
  try {
    const members = JSON.parse(localStorage.getItem("members") || "[]");
    const match = members.find((m: any) =>
      m.email?.toLowerCase() === email.toLowerCase()
    );
    return match?.screenName || "";
  } catch {
    return "";
  }
};

const userDetail = () => {
  const u = auth?.currentUser;
  if (!u) return {};
  const email = u.email || "";
  const displayName = u.displayName || getUserName(email);
  return { uid: u.uid, email, displayName, role: _currentRole };
};

const write = (col: string, data: Record<string, any>) =>
  addDoc(collection(db, col), { ...data, ...userDetail(), timestamp: serverTimestamp() }).catch(
    (err) => console.error(`ActivityLogger [${col}]:`, err)
  );

export const ActivityLogger = {
  logLogin(email: string, role: string) {
    logEvent(analytics, "login", { email });
    write("auth_logs", { event: "login", email, role });
  },

  logLoginFailed(email: string, reason: string) {
    logEvent(analytics, "login_failed", { email });
    write("auth_logs", { event: "login_failed", email, reason });
  },

  logLogout(email: string) {
    logEvent(analytics, "logout", { email });
    write("auth_logs", { event: "logout", email });
  },

  logPageView(page: string, email: string) {
    logEvent(analytics, "page_view", { page_title: page, email });
    write("activity_logs", { action: "page_view", page, email });
  },

  logActivity(action: string, email: string, details?: Record<string, any>) {
    logEvent(analytics, action, { email, ...details });
    write("activity_logs", { action, email, ...details });
  },
};
