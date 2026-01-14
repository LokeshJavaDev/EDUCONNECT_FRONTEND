import React, { useState } from "react";
import { api } from "../../../api/api";

const VerifyOtpPage = ({ email, onVerified, goLogin }) => {
    const [otp, setOtp] = useState("");

    const handleVerify = async () => {
        try {
            const res = await api.verifyOtp({ email, otp });
            if (res.success) {
                onVerified();
            } else {
                alert(res.message || "OTP verification failed");
            }
        } catch (err) {
            alert("Server error");
        }
    };

    return (
        <div className="auth-card">
            <h2>Verify OTP</h2>
            <p>OTP sent to: {email}</p>
            <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button onClick={handleVerify}>Verify</button>
            <p onClick={goLogin} className="switch-link">Back to Login</p>
        </div>
    );
};

export default VerifyOtpPage;
