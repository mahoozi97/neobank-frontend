import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const Homepage = ({ user, admin }) => {
  useDocumentTitle("Home | NeoBank");
  const navigate = useNavigate();

  const navigateTo = () => {
    if (user) {
      navigate("/dashboard");
    } else if (admin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/sign-up");
    }
  };
  return (
    <div className="hero bg-base-200 min-h-full">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Banking for the Digital Age</h1>
          <p className="py-6">
            Secure, fast, and transparent. Open an account in minutes and manage
            your finances with ease.
          </p>
          <button className="btn btn-outline" onClick={navigateTo}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
