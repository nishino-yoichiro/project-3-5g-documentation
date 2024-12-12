"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; // Next.js equivalent of useNavigate
import startStyles from './start.module.css';

/**
 * Home component that serves as the landing page for the application.
 * Provides navigation options to the Customer View and Employee View.
 * 
 * @returns {JSX.Element} - The rendered Home component.
 */
export default function Home() {
  const router = useRouter();

  /**
   * Navigates to the Customer View.
   */
  const goToCustomerView = () => {
    router.push('/customer');
  };

  /**
   * Navigates to the Employee View.
   */
  const goToEmployeeView = () => {
    router.push('/login');
  };

  return (
    <div className={startStyles.startContainer}>
      <header className={startStyles.startHeader}>
        <img src="/pandaLogo.png" className={startStyles.startLogo} alt="Panda Express Logo" />
        <h2>Welcome To Panda Express!</h2>
      </header>
      <div className={startStyles.buttonContainer}>
        <button className={startStyles.viewButton} onClick={goToCustomerView}>
          Customer View
        </button>
        <button className={startStyles.viewButton} onClick={goToEmployeeView}>
          Employee View
        </button>
      </div>
    </div>
  );
}
