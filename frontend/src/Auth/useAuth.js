import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const getAccessToken = async () => {
    try {
      const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
      const scope =
        "read:users update:users delete:users create:users read:roles create:roles delete:roles update:roles"; // Add other scopes as needed
      const token = await getAccessTokenSilently({
        audience,
        scope,
      });
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  };

  return {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessToken,
  };
};
