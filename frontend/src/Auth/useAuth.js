import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const hasRole = (role) => {
    return (
      user &&
      user[
        "https://manage.auth0.com/dashboard/us/dev-h6b2f6mjco5pu6wz/roles"
      ]?.includes(role)
    );
  };

  return {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
    hasRole,
  };
};
