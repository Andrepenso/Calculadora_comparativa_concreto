import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      window.history.replaceState({}, document.title); // limpa o estado
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        username,
        password
      });

      localStorage.setItem("token", response.data.token);

      // Redireciona para o painel de administração
      navigate("/admin/dashboard");
    } catch (error) {
      setError("Usuário ou senha inválidos!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">🔐 Login do Admin</h2>
        
        {error && (
          <p className="text-red-500 text-sm mb-2 bg-red-100 p-2 rounded">{error}</p>
        )}
        
        <input className="border p-2 w-full mb-2" type="text" placeholder="Usuário" 
          value={username} onChange={(e) => setUsername(e.target.value)} required />
        
        <input className="border p-2 w-full mb-2" type="password" placeholder="Senha" 
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
