import Cookies from "js-cookie";
import type { IUser } from "../models/User";

export const getToken = () => Cookies.get("token");
export const getRole = () => Cookies.get("role");
export const getUserId = () => Cookies.get("userId");
export const getMobileNumber = () => Cookies.get("mobileNumber");

export const getUser = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

export const setToken = (token: string, role: string, user: IUser) => {
  Cookies.set("token", token, { expires: 24 });
  Cookies.set("role", role, { expires: 24 });
  Cookies.set("userId", user._id, { expires: 24 });
  Cookies.set("user", JSON.stringify(user), { expires: 24 });
  Cookies.set("mobileNumber", user.mobileNumber, { expires: 24 });
};

export const clearToken = () => {
  Cookies.remove("token");
  Cookies.remove("role");
  Cookies.remove("userId");
  Cookies.remove("mobileNumber");
};
