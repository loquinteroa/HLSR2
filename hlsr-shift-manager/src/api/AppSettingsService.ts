/**
 * Centralised access to environment variables.
 *
 * MSAL keys have been removed – auth is now handled by Firebase.
 * Firebase config is read directly inside firebase.ts via REACT_APP_FIREBASE_* vars.
 */
class AppSettingsService {
  GetWebApiBaseUri(): string {
    // Always use a relative /api path so requests go through the Firebase
    // Hosting rewrite (production) or the craco dev-server proxy (development).
    return "/api";
  }

  GetWebApiKey(): string {
    return process.env.REACT_APP_API_KEY as string;
  }

  GetShiftboardAccessKey(): string {
    return process.env.REACT_APP_SHIFTBOARD_ACCESS_KEY_ID as string;
  }

  GetShiftboardSecretKey(): string {
    return process.env.REACT_APP_SHIFTBOARD_SECRET_KEY as string;
  }

  GetITCId(): string {
    return process.env.REACT_APP_ITC_ID as string;
  }
}

export default AppSettingsService;
