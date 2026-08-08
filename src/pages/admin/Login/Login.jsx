import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../auth/AuthContext";
import { login as loginRequest } from "../../../services/authService";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import Button from "../../../components/admin/ui/Button";
import Input from "../../../components/admin/ui/Input";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginRequest({
        email: form.email.trim(),
        password: form.password,
      });

      login(data.user);

      navigate("/admin");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "No se pudo iniciar sesión.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Panel de Administración</h1>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="correo@indienow.com"
            value={form.email}
            onChange={handleChange}
            icon={<Mail size={18} />}
            fullWidth
            required
          />

          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            icon={<LockKeyhole size={18} />}
            fullWidth
            required
            rightElement={
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            }
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <div className="login-submit">
            <Button
              type="submit"
              fullWidth
              loading={loading}
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}