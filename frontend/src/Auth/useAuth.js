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
    console.log("getAccessToken called"); // Log to verify function call
    try {
      const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
      const scope =
        "read:users update:users delete:users create:users read:roles create:roles delete:roles update:roles"; // Add other scopes as needed
      console.log("Audience:", audience);
      console.log("Scope:", scope);

      const token = await getAccessTokenSilently({
        audience,
        scope,
      });
      console.log("Access token:", token); // Log the token
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
