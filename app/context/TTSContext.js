// app/context/TTSContext.js
import { createContext, useContext, useState } from 'react';

const TTSContext = createContext();

/**
 * TTSProvider component that provides the TTS context to its children.
 * 
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} - The provider component that wraps its children with the TTS context.
 */
export const TTSProvider = ({ children }) => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);

  return (
    <TTSContext.Provider value={{ isTTSEnabled, setIsTTSEnabled }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);