import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form);

      navigate("/admin");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || err.message || "Error al iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Panel de Administración</h1>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          className="button-primary login-submit"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
