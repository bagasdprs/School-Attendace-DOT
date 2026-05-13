import React from "react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  visualContent: React.ReactNode;
  reverse?: boolean;
}

function AuthSplitLayout({ children, visualContent, reverse = false }: AuthSplitLayoutProps) {
  return (
    <div className={`flex min-h-screen w-full ${reverse ? "flex-row-reverse" : "flex-row"}`}>
      <div className="relative hidden w-1/2 overflow-hidden bg-dot-900 lg:block">{visualContent}</div>

      <div className="flex w-full flex-col items-center justify-center bg-white p-8 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

export default AuthSplitLayout;
