import loadable from "@loadable/component";
import { Navigate, RouteObject } from "react-router-dom";
import PrivateRoute from "./components/utils/PrivateRoutes";
import PrivateAdminRoutes from "./components/utils/PrivateAdminRoutes";

// ─── Auth pages (public – rendered inside the bootstrap card wrapper) ────────
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";

// ─── App pages (lazy-loaded) ─────────────────────────────────────────────────
const Shifts = loadable(() => import("./pages/Shifts"));
const Roster = loadable(() => import("./pages/Roster"));
const VolunteerShiftsPage = loadable(() => import("./pages/VolunteerShifts"));
const Admin = loadable(() => import("./pages/Admin"));
const RegisteredUsersPage = loadable(() => import("./pages/RegisteredUsers"));
const Logout = loadable(() => import("./components/Logout"));

// ─── Status pages (lazy-loaded) ──────────────────────────────────────────────
const Status401 = loadable(() => import("./pages/Status/Status401"));
const Status404 = loadable(() => import("./pages/Status/Status404"));
const Status500 = loadable(() => import("./pages/Status/Status500"));
const StatusMaintenance = loadable(() => import("./pages/Status/Maintenance"));

const routes: RouteObject[] = [
  // ── Public routes ───────────────────────────────────────────────────────
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // ── Protected routes (require Firebase auth) ───────────────────────────
  {
    path: "",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <Navigate replace to="/home" />,
      },
      {
        path: "home",
        element: <Shifts />,
      },
      {
        path: "roster",
        element: <Roster />,
      },
      {
        path: "volunteer-shifts",
        element: <VolunteerShiftsPage />,
      },
      {
        path: "registered-users",
        element: <RegisteredUsersPage />,
      },
      {
        path: "logout",
        element: <Logout />,
      }
    ],
  },

  // ── Admin-only routes ───────────────────────────────────────────────────
  {
    path: "/",
    element: <PrivateAdminRoutes />,
    children: [
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "registered-users",
        element: <RegisteredUsersPage />,
      },
    ],
  },

  // ── Status / error pages (public) ───────────────────────────────────────
  {
    path: "status",
    children: [
      { path: "", element: <Status404 /> },
      { path: "401", element: <Status401 /> },
      { path: "404", element: <Status404 /> },
      { path: "500", element: <Status500 /> },
      { path: "maintenance", element: <StatusMaintenance /> },
    ],
  },

  // ── Catch-all ───────────────────────────────────────────────────────────
  {
    path: "*",
    element: <Status404 />,
  },
];

export default routes;
