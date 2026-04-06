"use client";

import { useEffect } from "react";

const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker/serviceWorker.js")
        .then(() => console.log("SW registered"))
        .catch((err) => console.log("SW error", err));
    }
  }, []);

  return null;
};

export default ServiceWorkerRegister;
