"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={6_000}
      toastOptions={{
        classNames: {
          toast: "appToasterToast",
          title: "appToasterTitle",
          description: "appToasterDescription",
        },
      }}
    />
  );
}
