"use client";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerLink?: {
    text: string;
    href: string;
    linkText: string;
  };
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">SIGAE</h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">{title}</p>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>

        {children}

        {footerLink && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {footerLink.text}{" "}
            <a href={footerLink.href} className="font-semibold text-blue-600 hover:text-blue-700">
              {footerLink.linkText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}