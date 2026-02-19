import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export function AutoAuth() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      const data = jwtDecode(token);
      let userData = { ...data, token: token };
      const currentTime = Math.floor(Date.now() / 1000);
      if (userData?.exp > currentTime) {
        if(userData.role){
          login(userData)
          // navigate(`/dashboard/${userData?.role}`)
        }
        
      } else {
        localStorage.removeItem("token");
        navigate("/auth/login");
      }
    }
  }, []);
  return <></>;
}
