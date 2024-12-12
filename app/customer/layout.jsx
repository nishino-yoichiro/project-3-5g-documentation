"use client";

import '../globals.css';
import { SessionProvider } from 'next-auth/react';
import { SelectedItemsProvider } from '../SelectedItemsProvider';
import { TTSProvider } from '../context/TTSContext';
import NavBar from '../components/NavBar';
import { Suspense } from 'react';

/**
 * RootLayout component for customer view that provides the overall layout for the KIOSK system.
 * It includes providers for session management, selected items, and text-to-speech (TTS) context.
 * It also includes a navigation bar and a suspense fallback for loading states.
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
            <TTSProvider>
              <NavBar />
              <Suspense fallback={<div>Loading...</div>}> 
              {children}
              </Suspense>
            </TTSProvider>
          </SelectedItemsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}