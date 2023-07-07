import React from 'react';
import { useUserContext } from '../features/context/auth';
import Link from 'next/link';
import Button from './button';

const Header = () => {
  const { user } = useUserContext();
  return (
    <header className="bg-slate-300 flex p-3">
      <Link href="/" className="text-slate-100 ">
        <a>Career Finder</a>
      </Link>
      <span className="flex-1" />

      {user && (
        <Link href="/create-post">
          <a className="mr-4">
            <Button>投稿</Button>
          </a>
        </Link>
      )}
      {user ? (
        <Link href="/profile">
          <a>
            <img
              src={user?.avatarURL}
              className="w-10 h-10 bg-white block rounded-full"
            />
          </a>
        </Link>
      ) : (
        <Link href="/login">
          <a>ログイン</a>
        </Link>
      )}
    </header>
  );
};

export default Header;
