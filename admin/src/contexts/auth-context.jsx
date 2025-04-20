import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { ROLES } from "@/config/roles";
import { PageLoader } from "@/components/page-loader/page-loader";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    // Fetch user data if token exists
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/auth/me");
      const userData = response.data.user;

      // Validate role
      if (!Object.values(ROLES).includes(userData.role)) {
        throw new Error("Invalid user role");
      }

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // If token is invalid, clear everything
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user: userData } = response.data.data;

      // Validate role
      if (!Object.values(ROLES).includes(userData.role)) {
        throw new Error("Invalid user role");
      }

      // Set tokens in cookies
      Cookies.set("accessToken", accessToken, { expires: 3 }); // 3 days
      Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/dashboard");

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    // Clear tokens from cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <PageLoader isLoading={isLoading} /> : children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
