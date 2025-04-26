import React, { useState } from 'react';
import api from '../services/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) { // ALTEREI AQUI!
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/login', { username, password });
      console.log(response.data); // Sucesso
      onLoginSuccess();
    } catch (err) {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="elegant-card p-8 max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Login Administrador</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuário</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="elegant-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="elegant-input"
          />
        </div>
        <button type="submit" className="elegant-button-primary w-full">
          Entrar
        </button>
      </form>
    </div>
  );
}
