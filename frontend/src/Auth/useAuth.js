import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const getRoles = () => {
    if (user && user[`${process.env.REACT_APP_AUTH0_NAMESPACE}/roles`]) {
      return user[`${process.env.REACT_APP_AUTH0_NAMESPACE}/roles`];
    }
    return [];
  };

  const hasRole = (role) => {
    const roles = getRoles();
    return roles.includes(role);
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
