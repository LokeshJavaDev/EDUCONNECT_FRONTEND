// src/components/Auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { api } from '@/api/api';

const LoginPage = ({ goSignup, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await api.login({ email, password });
            if (result.success) {
                onLoginSuccess(result.user);
            } else {
                alert(result.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 p-3 mb-4 w-full rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-3 mb-4 w-full rounded"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white w-full p-3 rounded hover:bg-blue-600 transition"
                >
                    Login
                </button>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{' '}
                    <span onClick={goSignup} className="text-blue-500 cursor-pointer hover:underline">
            Signup
          </span>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
