'use client';

import Link from 'next/link';

export default function AuthFooter() {
  const links = [
    { href: '/support', label: 'Help Center' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <footer className="bg-white py-4 shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} martXmart. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}