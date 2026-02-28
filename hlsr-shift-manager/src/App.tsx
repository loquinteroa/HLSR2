import { useRoutes } from "react-router-dom";
import router from "./router";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "notistack";
import NavigationLayout from "./layouts/NavigationLayout";
import { useAuth } from "./contexts/AuthContext";

/**
 * Wrapper that conditionally renders either:
 *   • The full MUI shell (header + routed content) when the user IS logged in, or
 *   • Just the routed content (login / forgot-password cards) when they are not.
 *
 * This keeps the public login pages free of the navigation chrome while still
 * giving authenticated routes the MUI layout.
 */
function AppShell() {
  const { currentUser } = useAuth();
  const content = useRoutes(router);

  if (currentUser) {
    // Authenticated – wrap in the full navigation layout
    return (
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            <NavigationLayout />
            <div className="mainContent">{content}</div>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    );
  }

  // Not authenticated – render public routes (login / forgot-password)
  // inside a centred bootstrap-style card layout matching hlsr2
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", fontFamily: "sans-serif" }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>{content}</div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
