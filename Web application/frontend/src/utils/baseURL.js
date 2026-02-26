export const getBackendApiUrl = () => {
  // Development → local backend
  const isDev = import.meta.env.DEV;
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (isDev && isLocalhost) {
    return "http://localhost:8001"; // your backend dev server
  }

  // Production → Render backend
  return import.meta.env.VITE_API_BASE_URL ||
         "https://chasecart-backend.onrender.com";
};

/*
// ROBOT API (Raspberry Pi)
// Only used in development for direct testing
//Keep this commented out.
export const getRobotApiUrl = () => {
  const isDev = import.meta.env.DEV;
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isDev && isLocalhost) {
    // When developing locally
    return "http://172.20.10.12:8001"; 
  }
    // In production, use the environment variable
  return import.meta.env.VITE_ROBOT_API_URL || "http://172.20.10.12:8001";
};
*/