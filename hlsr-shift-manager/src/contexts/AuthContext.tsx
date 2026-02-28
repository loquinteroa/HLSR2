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
    await signInWithEmailAndPassword(auth!, email, password);
  }

  async function logout(): Promise<void> {
    await signOut(auth!);
  }

  async function resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth!, email);
  }

  async function grantUserRole(email: string, roleName: string): Promise<void>{
    const callGrantRole = httpsCallable(firebaseFunctions, 'grantUserRole');
    await callGrantRole({ email, roleName });
    const token = await currentUser?.getIdTokenResult(true);
    setUserRole((token?.claims.role as string) || "");
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
            setUserRole((token.claims.role as string) || "");
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
