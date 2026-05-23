import React, { createContext, useContext, useMemo, useState } from 'https://esm.sh/react@18.3.1?dev';
const AuthContext = createContext({});

const localUser = {
  id: "local-workspace",
  email: "local@launchpilot.ai",
  user_metadata: {
    full_name: "Local Workspace",
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localUser);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authPending, setAuthPending] = useState(false);

  const startLocalWorkspace = async () => {
    setAuthPending(true);
    setAuthError("");
    setUser(localUser);
    setAuthPending(false);
  };

  const logout = async () => {
    setUser(localUser);
  };

  const clearAuthError = () => setAuthError("");

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      authPending,
      startLocalWorkspace,
      logout,
      clearAuthError,
    }),
    [user, loading, authError, authPending]
  );

  return (
    React.createElement(AuthContext.Provider, { value: value,}
      , children
    )
  );
};

export const useAuth = () => useContext(AuthContext);
