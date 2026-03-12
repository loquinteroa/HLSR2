import React, { useContext, useState, useEffect, createContext } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "../firebase";
import app from "../firebase";
import { ActivityLogger, setCurrentRole } from "../api/ActivityLogger";

const firebaseFunctions = getFunctions(app!);

// ─── Context shape ───────────────────────────────────────────────────────────
interface AuthContextType {
  currentUser: User | null;
  userRole: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  grantUserRole: (email: string, roleName: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

// ─── Provider ────────────────────────────────────────────────────────────────
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth!, email, password);
    } catch (err: any) {
      ActivityLogger.logLoginFailed(email, err.code || err.message);
      throw err;
    }
  }

  async function logout(): Promise<void> {
    if (currentUser?.email) ActivityLogger.logLogout(currentUser.email);
    await signOut(auth!);
  }

  async function resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth!, email);
  }

  async function grantUserRole(email: string, roleName: string): Promise<void>{
    const callGrantRole = httpsCallable(firebaseFunctions, 'grantUserRole');
    await callGrantRole({ email, roleName });
    const token = await currentUser?.getIdTokenResult(true);
    const newRole = (token?.claims.role as string) || "";
    setUserRole(newRole);
    setCurrentRole(newRole);
  }

  useEffect(() => {
    if (!auth) {
      console.warn(
        "Firebase auth is not initialized. Check your .env variables."
      );
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          setCurrentUser(user);
          if (user) {
            const token = await user.getIdTokenResult();
            const role = (token.claims.role as string) || "";
            setUserRole(role);
            setCurrentRole(role);
            // Log only fresh logins (not session restores on page reload)
            const lastSignIn = new Date(user.metadata.lastSignInTime!).getTime();
            if (Date.now() - lastSignIn < 10000) {
              ActivityLogger.logLogin(user.email!, role);
            }
          } else {
            setUserRole("");
          }
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.error("Firebase auth error:", err);
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    userRole,
    login,
    logout,
    resetPassword,
    grantUserRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
