"use client";

import React from "react";

export default function LoginScreen(props: {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onSignIn: () => void;
}) {
  const { email, password, setEmail, setPassword, onSignIn } = props;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "linear-gradient(150deg, var(--hero-from), var(--hero-to))",
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          padding: "32px 24px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "var(--shadow)",
          color: "white",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ fontSize: 52, marginBottom: 12 }}>❤︎</div>

        <div style={{ fontSize: 32, fontWeight: 800 }}>
          MedAssist AI
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            opacity: 0.85,
          }}
        >
          Transforming Healthcare with AI
        </div>

        {/* Panel */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 18,
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            textAlign: "left",
            display: "grid",
            gap: 16,
          }}
        >
          {/* Email */}
          <div>
            <div
              style={{
                fontSize: 13,
                marginBottom: 8,
                opacity: 0.85,
              }}
            >
              Email Address
            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@hospital.com"
              style={{
                width: "100%",
                minHeight: 44,
                padding: "12px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.18)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <div
              style={{
                fontSize: 13,
                marginBottom: 8,
                opacity: 0.85,
              }}
            >
              Password
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{
                width: "100%",
                minHeight: 44,
                padding: "12px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.18)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          {/* Sign In */}
          <button
            onClick={onSignIn}
            style={{
              width: "100%",
              minHeight: 48,
              borderRadius: 999,
              border: "none",
              background: "var(--secondary)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </div>

        {/* Links */}
        <div style={{ marginTop: 20, fontSize: 14, opacity: 0.9 }}>
          <div>Forgot Password?</div>

          <div style={{ marginTop: 10, fontWeight: 600 }}>
            Sign Up
          </div>

          <div style={{ marginTop: 18 }}>
            Login with Face ID
          </div>
        </div>
      </div>
    </div>
  );
}