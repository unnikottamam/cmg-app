import { WEB_URL } from "../config";

const signIn = async (email, _password) => {
  const response = await fetch(`${WEB_URL}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: email,
      password: _password,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const authService = {
  signIn,
};
