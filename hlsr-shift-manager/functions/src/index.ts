import { onCall, onRequest, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

// ── Auth guard ────────────────────────────────────────────────────────────────
// Throws if the caller is not authenticated or does not hold the Admin role.
function requireAdmin(request: CallableRequest): void {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
  if (request.auth.token["role"] !== "Admin") {
    throw new HttpsError("permission-denied", "Admin role required.");
  }
}

// ── Azure API proxy ───────────────────────────────────────────────────────────
// Forwards /api/** requests to the Azure backend server-side, removing the
// CORS problem that occurs when the browser calls Azure directly from the
// Firebase Hosting domain.
const AZURE_API_URL = process.env.AZURE_API_URL || "";
const AZURE_API_KEY = process.env.AZURE_API_KEY || "";

export const apiProxy = onRequest({ cors: true, invoker: "public" }, async (req, res) => {
  try {
    // req.path is the full path e.g. "/api/committee/data"
    // AZURE_API_URL already ends in "/api", so strip the leading "/api" prefix
    const apiPath = req.path.replace(/^\/api/, "") || "/";
    const azureUrl = `${AZURE_API_URL}${apiPath}`;

    const response = await axios({
      method: req.method as any,
      url: azureUrl,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        "X-Functions-Key": AZURE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err: any) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// ── Functions ─────────────────────────────────────────────────────────────────

export const getRegisteredUsers = onCall(async (request) => {
  requireAdmin(request);
  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map((user) => ({
      displayName: user.displayName || "",
      email: user.email || "",
      role: (user.customClaims as any)?.role || "",
    }));
    users.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return { users };
  } catch (err: any) {
    throw new HttpsError("internal", err.message ?? "Failed to list users");
  }
});

export const grantUserRole = onCall(async (request) => {
  requireAdmin(request);
  const { email, roleName } = request.data;

  if (!email) {
    throw new HttpsError("invalid-argument", "email is required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (user.customClaims && (user.customClaims as any).role === roleName) {
      return { message: "Role already set" };
    }

    await admin.auth().setCustomUserClaims(user.uid, { role: roleName || null });

    return { message: "Role updated successfully" };
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      throw new HttpsError(
        "not-found",
        `No Firebase Auth account found for ${email}. The user must sign in at least once before a role can be assigned.`
      );
    }
    throw new HttpsError("internal", err.message ?? "Unexpected error");
  }
});

export const registerUser = onCall(async (request) => {
  requireAdmin(request);
  const { email, password, displayName } = request.data;

  if (!email || !password) {
    throw new HttpsError("invalid-argument", "email and password are required");
  }

  try {
    const user = await admin.auth().createUser({ email, password, displayName: displayName || "" });
    return { message: "User registered successfully", uid: user.uid };
  } catch (err: any) {
    if (err.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", `A Firebase account for ${email} already exists.`);
    }
    throw new HttpsError("internal", err.message ?? "Failed to register user");
  }
});

export const resetUserPassword = onCall(async (request) => {
  requireAdmin(request);
  const { email, password } = request.data;

  if (!email || !password) {
    throw new HttpsError("invalid-argument", "email and password are required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password });
    return { message: "Password reset successfully" };
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      throw new HttpsError("not-found", `No Firebase Auth account found for ${email}.`);
    }
    throw new HttpsError("internal", err.message ?? "Failed to reset password");
  }
});

export const updateUserDisplayName = onCall(async (request) => {
  requireAdmin(request);
  const { email, displayName } = request.data;

  if (!email || !displayName) {
    throw new HttpsError("invalid-argument", "email and displayName are required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { displayName });
    return { message: "Display name updated successfully" };
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      throw new HttpsError("not-found", `No Firebase Auth account found for ${email}.`);
    }
    throw new HttpsError("internal", err.message ?? "Failed to update display name");
  }
});

export const deleteUser = onCall(async (request) => {
  requireAdmin(request);
  const { email } = request.data;

  if (!email) {
    throw new HttpsError("invalid-argument", "email is required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(user.uid);
    return { message: "User deleted successfully" };
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      throw new HttpsError("not-found", `No Firebase Auth account found for ${email}.`);
    }
    throw new HttpsError("internal", err.message ?? "Failed to delete user");
  }
});
