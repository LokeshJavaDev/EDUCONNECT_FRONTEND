// src/api/api.js
export const api = {
    signup: async (data) => {
        const res = await fetch('http://localhost:9191/valido/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    login: async (data) => {
        const res = await fetch('http://localhost:9191/valido/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
};
