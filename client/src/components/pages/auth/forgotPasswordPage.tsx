"use client";

import { SubmitEvent, useState } from "react";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import { LuArrowLeft } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import AuthLayout from "@/components/auth/authLayout";
import InputField from "@/components/auth/inputField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you instructions to reset your password"
    >
      {success ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex justify-center items-center bg-green-500/10 mb-6 border border-green-500/20 rounded-full w-16 h-16 text-green-400">
            <FiCheckCircle size={32} />
          </div>
          <h3 className="mb-2 font-semibold text-white text-xl">
            Check your email
          </h3>
          <p className="mb-8 text-text-secondary leading-relaxed">
            We've sent a password reset link to{" "}
            <span className="font-medium text-white">{email}</span>. Click the
            link to set a new password.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
          >
            <LuArrowLeft size={16} />
            Back to log in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col">
          <InputField
            label="Email address"
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-primary hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-70 shadow-lg shadow-primary/20 mt-4 py-3 rounded-xl w-full font-medium text-white text-sm uppercase tracking-wider transition-all disabled:cursor-not-allowed"
          >
            {loading ? (
              <TbLoader3 size={20} className="animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>

          <Link
            href="/login"
            className="flex justify-center items-center gap-2 mt-8 text-text-secondary hover:text-white text-sm transition-colors"
          >
            <LuArrowLeft size={16} />
            Back to log in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
