import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import DashboardPage from "./pages/DashboardPage";
import EduConnect from "@/components/Auth/pages/EduConnect.jsx";

const Auth = () => {
    const [page, setPage] = useState("login");
    const [emailForOtp, setEmailForOtp] = useState("");

    const goLogin = () => setPage("login");
    const goSignup = () => setPage("signup");
    const goDashboard = () => setPage("dashboard");

    return (
        <>
            {page === "login" && <LoginPage onLoginSuccess={goDashboard} goSignup={goSignup} />}
            {page === "signup" && <SignupPage onSignupSuccess={(email) => { setEmailForOtp(email); setPage("verifyOtp"); }} goLogin={goLogin} />}
            {page === "verifyOtp" && <VerifyOtpPage email={emailForOtp} onVerified={goDashboard} goLogin={goLogin} />}
            {page === "dashboard" && <EduConnect />}
        </>
    );
};

export default Auth;
