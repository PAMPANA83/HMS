import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { UserLogoutService } from "../services/UserLogin.service";

export function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Optional: Call your backend logout service
     const response = await UserLogoutService.logout();

    console.log("Logout successful:", response);
    localStorage.removeItem("token");
        localStorage.removeItem("user");
           navigate("/", { replace: true });
      } catch (error) {
        console.error("Logout API failed:", error);
      } 
    };

    performLogout();
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Spin tip="Logging out..." size="large" />
    </div>
  );
}

export default LogoutPage;