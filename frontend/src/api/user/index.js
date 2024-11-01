import Axios from "../lib/axios";
import { USER_API_ROUTES } from "./routes";

const loginUser = async (data = {}) => {
  const res = await Axios.post(USER_API_ROUTES.POST.LOGIN_USER, data);
  return res.data;
};

const refreshToken = async () => {
  const res = await Axios.get(USER_API_ROUTES.PUT.REFRESH_TOKEN);
  return res.data;
};

const getUserProfile = async () => {
  const res = await Axios.get(USER_API_ROUTES.GET.PROFILE_USER);
  return res.data;
};

const logoutUser = async () => {
  const res = await Axios.get(USER_API_ROUTES.PUT.LOGOUT_USER);
  return res.data;
};

const editUserProfile = async (data = {}) => {
  const res = await Axios.put(USER_API_ROUTES.PUT.EDIT_USER, data);
  return res.data;
};

const sendResetPasswordEmail = async (email) => {
  const res = await Axios.post(USER_API_ROUTES.POST.SEND_EMAIL, { email });
  return res.data;
};

const resetPassword = async (resetToken, newPassword) => {
  const res = await Axios.post(USER_API_ROUTES.POST.RESET_PASS, {
    resetToken,
    newPassword,
  });
  return res.data;
};

const userApi = {
  loginUser,
  getUserProfile,
  editUserProfile,
  sendResetPasswordEmail,
  resetPassword,
  logoutUser,
  refreshToken
};
export default userApi;
