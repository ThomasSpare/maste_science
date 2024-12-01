import axios from "axios";

export const getAuth0AccessToken = async () => {
  const options = {
    method: "POST",
    url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
      client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
    }),
  };

  try {
    const response = await axios.request(options);
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Auth0 access token:", error);
    throw error;
  }
};

export const getUserInfo = async (email) => {
  const accessToken = await getAuth0AccessToken();

  const options = {
    method: "GET",
    url: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params: {
      email: email,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data[0]; // Assuming the email is unique and returns a single user
  } catch (error) {
    console.error("Error getting user info from Auth0:", error);
    throw error;
  }
};
