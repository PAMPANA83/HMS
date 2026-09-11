import { useState, type FormEvent } from "react";
import "../../Login.css";
import { UserLoginService } from "../services/UserLogin.service";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

type LoginData = {
  email?: string;
  name?: string;
  role?: string;
  tokens?: string;
};

type LoginResponse = {

  isSuccess?: boolean;
  data?: LoginData;
  errorMessage?: string | null;
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    const hashedPassword = generateHash(password);
    try {
      const response = (await UserLoginService.login(username, hashedPassword)) as LoginResponse;

      console.log(response);
      if (response?.isSuccess===true) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data?.tokens ?? "");
        alert("Login Successful");
        navigate("/dashboard");
      } else {
        alert(response?.errorMessage ?? "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed");
    }
  };

const generateHash = (password: string) => {
  // Default cost factor in BCrypt.Net is typically 10 or 11
  const salt = bcrypt.genSaltSync(11);
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  console.log("Hashed Password:", hashedPassword);
  return hashedPassword;
};

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;