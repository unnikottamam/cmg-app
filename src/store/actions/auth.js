import AsyncStorage from "@react-native-async-storage/async-storage";

export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";

export const authenticate = (data) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://stag.coastmachinery.com/wp-json/jwt-auth/v1/token/validate/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: data.token,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: AUTHENTICATE,
      isUserLogged: true,
    });
  };
};

export const login = (data) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://stag.coastmachinery.com/wp-json/jwt-auth/v1/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    dispatch({
      type: LOGIN,
      token: resData.token,
      roles: resData.roles,
      userid: resData.userid,
      isUserLogged: true,
    });
    saveDateToStorage(resData.token, resData.roles, resData.userid);
  };
};

const saveDateToStorage = (token, roles, userid) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      roles: roles,
      userid: userid,
    })
  );
};
