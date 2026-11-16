"use client";
import { Brain, Mail } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<null | number>(null);
  const footerLink = {
    Product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "API", href: "/api-docs" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
    Legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  };
  const socialLinks = [
    {
      icon: (
        <svg
          className="h-5 w-5"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>GitHub</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
      href: "https://github.com",
      label: "Github",
    },
    {
      icon: (
        <svg
          className="h-5 w-5"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>X</title>
          <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
        </svg>
      ),
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: "https://github.com",
      label: "Email",
    },
  ];

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">DocuAI</span>
            </div>
            <p>
              AI-powered document analysis for teams. Upload, analyze, and
              collaborate on documents with your organization
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          {/* footer links */}
          {Object.entries(footerLink).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <Suspense fallback={<div>timer</div>}>
            <div className="text-gray-600 mb-4 md:mb-0">
              {year} DocuAI. All rights reserved
            </div>
          </Suspense>

          <div className="flex gap-6 text-sm text-gray-600">
            <Link href={"/privacy"} className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href={"/terms"} className="hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href={"/cookies"} className="hover:text-gray-900">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
