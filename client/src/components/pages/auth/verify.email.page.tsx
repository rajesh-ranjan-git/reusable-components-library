"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import { LuArrowLeft, LuShieldQuestion } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
import { VerifyEmailResponseType } from "@/types/types/response.types";
import { useToast } from "@/hooks/toast";
import { defaultRoutes } from "@/lib/routes/routes";
import { verifyEmail } from "@/lib/actions/auth.actions";
import AuthLayout from "@/components/auth/auth.layout";

const VerifyEmailPage = () => {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { showToast } = useToast();

  const emailVerification = async (token: string) => {
    const verifyEmailResponse = await verifyEmail(token);

    if (!verifyEmailResponse.success) {
      showToast({
        title: verifyEmailResponse.code,
        message: verifyEmailResponse.message,
        variant: "error",
      });
    } else {
      const data = verifyEmailResponse.data as VerifyEmailResponseType;

      setVerifiedEmail(data.email);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);

    emailVerification(token as string);
  }, [token]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle={`${verifiedEmail ? "Thank you for verifying your email!" : ""}`}
    >
      <div className="flex flex-col items-center py-4 text-center">
        {isLoading ? (
          <p className="flex items-center gap-2">
            <span>
              <TbLoader3 size={28} className="animate-spin" />
            </span>
            <span>Verifying email...</span>
          </p>
        ) : (
          <>
            {verifiedEmail ? (
              <>
                <div className="flex justify-center items-center bg-status-success-bg mb-6 border border-status-success-border rounded-full w-16 h-16 text-status-success-text">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="mb-2">Email Verification Success</h3>
                <p className="mb-4 text-text-secondary leading-relaxed">
                  <span>
                    Your email&nbsp;
                    <span className="font-medium text-white">
                      {verifiedEmail}
                    </span>
                    &nbsp;has been verified successfully!
                  </span>
                </p>

                <Link
                  href={defaultRoutes.landing}
                  className="group flex justify-center items-center gap-2 rounded-full transition-all ease-in-out btn btn-ghost"
                >
                  <LuArrowLeft
                    size={16}
                    className="group-hover:scale-x-120 transition-all group-hover:-translate-x-1.5 ease-in-out"
                  />
                  Go to home page
                </Link>
              </>
            ) : (
              <>
                <div className="flex justify-center items-center bg-status-error-bg mb-6 border border-status-error-border rounded-full w-16 h-16 text-status-error-text">
                  <LuShieldQuestion size={32} />
                </div>
                <h3 className="mb-2 text-status-error-text">
                  Email Verification Failed
                </h3>
                <p className="mb-4 text-status-error-text leading-relaxed">
                  We were not able to verify your email, please try again!
                </p>

                <Link
                  href={defaultRoutes.landing}
                  className="group flex justify-center items-center gap-2 rounded-full transition-all ease-in-out btn btn-ghost"
                >
                  <LuArrowLeft
                    size={16}
                    className="group-hover:scale-x-120 transition-all group-hover:-translate-x-1.5 ease-in-out"
                  />
                  Go to home page
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
