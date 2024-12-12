// app/components/NavBar.jsx
import { useTTS } from '../context/TTSContext';
import styles from './NavBar.module.css';
import GoogleTranslate from '../GoogleTranslate';

/**
 * NavBar component that provides a navigation bar with a toggle switch for text-to-speech (TTS)
 * and a language selection dropdown using Google Translate.
 * 
 * @returns {JSX.Element} - The rendered NavBar component.
 */
const NavBar = () => {
  const { isTTSEnabled, setIsTTSEnabled } = useTTS();

  const handleToggle = () => {
    setIsTTSEnabled(!isTTSEnabled);
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.toggleContainer}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            id="tts-toggle"
            checked={isTTSEnabled}
            onChange={handleToggle}
          />
          <span className={styles.slider}></span>
        </label>
        <label htmlFor="tts-toggle" className={styles.label}>
          Toggle Text-to-Speech
        </label>
      </div>
      <GoogleTranslate />
    </nav>
  );
};

export default NavBar;