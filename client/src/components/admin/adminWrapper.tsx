"use client";

import { useAppStore } from "@/store/store";
import { ReactNodeProps } from "@/types/propTypes";
import { notFound, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const AdminWrapper = ({ children }: ReactNodeProps) => {
  const [isChecking, setIsChecking] = useState(true);

  const pathname = usePathname();

  const loggedInUser = useAppStore((state) => state.loggedInUser);

  useEffect(() => {
    let isMounted = true;

    const validateAdmin = () => {
      const allowedRoles = ["ADMIN", "SUPER_ADMIN"];

      if (!loggedInUser || !allowedRoles.includes(loggedInUser.role)) {
        return notFound();
      }

      if (isMounted) setIsChecking(false);
      return;
    };

    validateAdmin();

    return () => {
      isMounted = false;
    };
  }, [pathname, loggedInUser]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
};

export default AdminWrapper;
