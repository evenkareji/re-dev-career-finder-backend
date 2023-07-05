import Link from 'next/link';
import React from 'react';
const links: { label: string; href: string }[] = [
  { label: 'トップ', href: '/' },
  { label: '検索', href: '/search' },
  { label: '投稿', href: '/create-post' },
  { label: 'プロフィール', href: '/profile' },
];
const Footer = () => {
  return (
    <header className="bg-slate-200 p-2">
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <a className="text-sky-600">{link.label}</a>
            </Link>
          </li>
        ))}
      </ul>
      {/* command g */}
      <p>© 2023 tomo.</p>
    </header>
  );
};

export default Footer;
