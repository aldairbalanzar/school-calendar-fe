import React, { useCallback, useContext, createContext, useState } from 'react';
import useGapi from '../hooks/useGapi';
import calendarApi from '../utils/calendarApi';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [api, setApi] = useState(null);
  const googleApi = useGapi({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
    ],
    ux_mode: 'redirect',
    redirect_uri: `${process.env.REACT_APP_BASE_URL}/authenticate/google`,
    onLoaded: useCallback(gapi => {
      setApi(calendarApi(gapi));
    }, [])
  });

  return (
    <AuthContext.Provider
      value={{
        googleApi,
        api
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };
