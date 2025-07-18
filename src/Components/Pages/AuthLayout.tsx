import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6">
        {/* Branding and Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo192.png" alt="Logo" className="w-16 h-16 mb-2" />
          <span className="text-3xl font-bold text-primary font-sans tracking-tight">Project Manager</span>
        </div>
        {/* Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 