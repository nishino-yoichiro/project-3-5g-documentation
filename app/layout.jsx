"use client";

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { SelectedItemsProvider } from './SelectedItemsProvider';
import { TTSProvider } from './context/TTSContext';
import NavBar from './components/NavBar';

/**
 * RootLayout component that provides the overall layout for the entire project application.
 * 
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} - The rendered RootLayout component.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <SessionProvider>
          <SelectedItemsProvider>
            {children}
          </SelectedItemsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}