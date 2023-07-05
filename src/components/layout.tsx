import React, { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
