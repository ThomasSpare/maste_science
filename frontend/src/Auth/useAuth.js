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
        "openid profile email read:news read:files delete:files read:folders delete:folders create:folders read:users read:roles"; // Add other scopes as needed
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
