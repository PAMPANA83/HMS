import { useState, type FormEvent } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
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
      <Container className="px-3">
        <Card className="login-box border-0 mx-auto">
          <Card.Body>
            <h2 className="login-header">Login</h2>

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="login-username">
                <Form.Label className="login-form-label">Username</Form.Label>
                <Form.Control
                  className="login-input"
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="login-password">
                <Form.Label className="login-form-label">Password</Form.Label>
                <Form.Control
                  className="login-input"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="login-submit w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;