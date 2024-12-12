"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import loginStyles from "./login.module.css";
import { signIn, useSession } from "next-auth/react";

const managerEmails = ['davxgnu@tamu.edu', 'djw9699@tamu.edu', 'oscartsai26@tamu.edu'];

/**
 * Login - A React component that provides a login form for workers to sign in.
 * 
 * Features:
 * - Allows workers to sign in using Google authentication.
 * - Redirects authenticated users to the appropriate dashboard based on their role.
 * 
 * State Variables:
 * @state {string} email - The email entered by the user for login.
 * @state {string} password - The password entered by the user for login.
 * @state {array} voices - An array of available voices for speech synthesis.
 * @state {array} utterances - An array of utterances for speech synthesis.
 */
export default function Login() {
  const router = useRouter();

  /**
   * @description The email entered by the user for login.
   * @type {string}
   * @default ""
   * */
  const { data: session, status } = useSession();

  /**
   * @description The email entered by the user for login.
   * @type {string}
   * @default ""
   * */
  const [email, setEmail] = useState('');

  /** 
   * @description The password entered by the user for login.
   * @type {string}
   * @default ""
   * */
  const [password, setPassword] = useState('');

  /**
   * @description An array of available voices for speech synthesis.
   * @type {array}
   * @default []
   * */
  const [voices, setVoices] = useState([]);

   /**
   * @description An array of utterances for speech synthesis.
   * @type {array}
   * @default []
   * */
  const [utterances, setUtterances] = useState([]);

  /**
   * Runs once on component load to load available voices and create utterances.
   * Sets the available voices and creates utterances for speech synthesis.
   * */
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Loaded voices:', voices);
      setVoices(voices);

      // Create and store utterances
      const utteranceTexts = ["Sign in with Google"];
      const newUtterances = utteranceTexts.map(text => {
        const utterance = new SpeechSynthesisUtterance(text);
        if (voices.length > 0) {
          utterance.voice = voices[0]; // Use the first available voice
        }
        return utterance;
      });
      setUtterances(newUtterances);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  /**
   * useEffect hook to handle authentication status and redirect the user based on their email.
   * 
   * This effect runs whenever the `status`, `session`, or `router` dependencies change.
   * If the user is authenticated and their email is available in the session, they are redirected
   * to either the manager or cashier page based on their email.
   * 
   * @param {string} status - The authentication status.
   * @param {object} session - The session object containing user information.
   * @param {object} router - The Next.js router object for navigation.
   */
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const callbackUrl = managerEmails.includes(session.user.email) ? '/manager' : '/cashier';
      router.push(callbackUrl);
    }
  }, [status, session, router]);

  /**
   * Speaks the utterance at the specified index using speech synthesis.
   * 
   * @param {number} index - The index of the utterance to speak.
   */
  function speak(index) {
    if (utterances[index]) {
      speechSynthesis.speak(utterances[index]);
    } else {
      console.log('No utterance available for index:', index);
    }
  }

  /**
   * Handles the submitting sign in credentials in with Google authentication.
   * */
  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }); 
  }

  /**
   * Handles the sign in with Google authentication.
   * */
  const handleSignIn = async () => {
    await signIn('google');
  };

  return (
    <div className={loginStyles.loginContainer}>
      <header className={loginStyles.loginHeader}>
        <Image src='/pandaLogo.png' className={loginStyles.loginLogo} alt="Panda Express Logo" width={400} height={400} />
        <h2><strong>Panda Express Worker Login</strong></h2>
      </header>
      <form className={loginStyles.loginForm} onSubmit={handleSubmit}>
        <button 
          type="submit" 
          onFocus={() => speak(0)} // Speak "Log In" when focused
          onClick={handleSignIn}
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}