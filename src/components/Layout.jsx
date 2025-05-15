import React from 'react';
import { Container } from 'reactstrap';
import Head from 'next/head';

import NavBar from './NavBar'
import Footer from './Footer';

const Layout = ({ children }) => (
<>
    <Head>
      <title>Auth0 GenAI Demo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <NavBar />
      <main className="flex-grow w-full bg-black text-white px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default Layout;
