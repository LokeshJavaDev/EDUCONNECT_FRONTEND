import React, { useState } from "react";
import { api } from "../../../api/api";

const SignupPage = ({ onSignupSuccess, goLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            const res = await api.signup({ email, password });
            if (res.success) {
                onSignupSuccess(email);
            } else {
                alert(res.message || "Signup failed");
            }
        } catch (err) {
            alert("Server error");
        }
    };

    return (
        <div className="auth-card">
            <h2>Signup</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Signup</button>
            <p onClick={goLogin} className="switch-link">Already have an account? Login</p>
        </div>
    );
};

export default SignupPage;
