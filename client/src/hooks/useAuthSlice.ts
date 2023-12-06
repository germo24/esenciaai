import { useDispatch, useSelector } from "react-redux";
import {
  clearErrorMessage,
  onChecking,
  onLogOut,
  onLogin,
} from "../store/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";

import { useNavigateTo } from ".";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  onLogOutUser,
  onSetUserTeams,
} from "../store/dashboard/dashboardSlice";
import axios from "axios";
import api from "../helpers/apiToken";

export const useAuthSlice = () => {
  const { loading, errorMessage, status } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { handleNavigate } = useNavigateTo();

  const firstLog = localStorage.getItem("firstLoggin");
  if (!firstLog) localStorage.setItem("firstLoggin", "0");

  useEffect(() => {}, [loading]);
  const startCheckingUser = async () => {
    dispatch(onChecking());

    try {
      const user = await api.get(`/users`);
      console.log(user.data);

      dispatch(onLogin(user.data.user));
    } catch (error) {
      console.log(error);
      localStorage.removeItem("authToken");
      dispatch(onLogOut());
    }

    // try {
    //   const resp = await axios.post(`http://localhost:3000/auth/login`, data);
    //   dispatch(clearErrorMessage());
    //   localStorage.setItem("token", JSON.stringify(resp.data.token));

    //   if (tkn) {
    //     dispatch(onLogin());
    //     handleNavigate("/dashboard");
    //   }
    // } catch (error) {
    //   const { payload } = error.response.data;
    //   dispatch(onLogOut(payload));
    // }
  };
  const startLoginUser = async (data) => {
    const user = { user: data };
    console.log(user);

    try {
      const resp = await axios.post(`http://localhost:3000/auth/login`, user);
      console.log(resp);

      dispatch(clearErrorMessage());
      localStorage.setItem("authToken", JSON.stringify(resp.data.token));

      const checkUser = await startCheckingUser();
      checkUser().then(() => {
        handleNavigate("/dashboard");
      });
    } catch (error) {
      const { payload } = error.response.data;
      dispatch(onLogOut(payload));
    }
  };

  const startRegisteringUser = async (data: string[]): void => {
    const user = { user: data };
    console.log(user);

    try {
      const resp = await axios.post(
        `http://localhost:3000/auth/register`,
        user
      );
      toast.success("Successfully registered. Redirecting to login. 👍", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      handleNavigate("/auth/login");
      console.log(resp);
    } catch (error) {
      const { payload } = error.response.data;
      dispatch(onLogOut(payload));
    }
  };

  const startLogingOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userLogged");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userTeams");
    dispatch(onLogOut());
    dispatch(onLogOutUser());
    handleNavigate("/auth/login");
  };
  return {
    startCheckingUser,
    loading,
    errorMessage,
    status,
    startRegisteringUser,
    startLogingOut,
    firstLog,
    startLoginUser,
  };
};
