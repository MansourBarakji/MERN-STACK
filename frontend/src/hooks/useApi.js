import { useState, useEffect, useCallback } from "react";
import userApi from "../api/user/index";
import ProductApi from "../api/product/index";
import orderApi from "../api/order/index";
import { useNavigate } from "react-router-dom";

export default function useApi() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token") || ""); 
   const navigate = useNavigate();


  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [accessToken]);


  const login = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await userApi.loginUser(data);
      const {refreshToken}  = response;
      localStorage.setItem("token", refreshToken);
      setAccessToken(refreshToken);
      setIsAuthenticated(true);
      setError(null);
      console.log(accessToken)
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

 const refreshAccessToken = useCallback(async () => {
  try {
    const response = await userApi.refreshToken();
    console.log({response})
    const { refreshToken } = response;
    localStorage.setItem("token", refreshToken);
    setAccessToken(refreshToken);
  } catch (err) {
    console.error("Failed to refresh access token", err);
    setIsAuthenticated(false);
    navigate("/login");
  }
}, [navigate]);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getUserProfile();
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const editUserProfile = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await userApi.editUserProfile(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendResetPasswordEmail = useCallback(async (email) => {
    setLoading(true);
    try {
      const response = await userApi.sendResetPasswordEmail(email);
      setError(null);
      return response;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset password email"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (resetToken, newPassword) => {
    setLoading(true);
    try {
      const response = await userApi.resetPassword(resetToken, newPassword);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }, []);


  const logout = useCallback(async () => {
    try {
     
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      setIsAuthenticated(false);
      setAccessToken(null);
       navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, [navigate]);
  

 
  const getProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await ProductApi.getProduct(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get this Product");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (data) => {
    setLoading(true);
    try {
      
      const response = await ProductApi.search(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get Products");
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await orderApi.createOrder(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create Order");
    } finally {
      setLoading(false);
    }
  }, []);

  const completeOrder = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await orderApi.completeOrder(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create Order");
    } finally {
      setLoading(false);
    }
  }, []);


  const getMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getMyOrders();
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await orderApi.cancelOrder(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this Books");
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreOrder = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await orderApi.restoreOrder(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this Books");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await orderApi.deleteOrder(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete this Books");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    refreshAccessToken,
    loading,
    error,
    login,
    getUserProfile,
    editUserProfile,
    sendResetPasswordEmail,
    resetPassword,
    logout, 
    getProduct,
    createOrder,
    completeOrder,
    getMyOrders,
    cancelOrder,
    restoreOrder,
    deleteOrder,
    search,
  };
}
