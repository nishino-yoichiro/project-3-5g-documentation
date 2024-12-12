"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CustomerGreet.module.css";
import { useTTS } from "../context/TTSContext";

/**
 * CustomerWelcome component that greets the customer and provides options to adjust brightness and use text-to-speech (TTS).
 * 
 * @returns {JSX.Element} - The rendered CustomerWelcome component.
 */
export default function CustomerWelcome() {
  const router = useRouter();
  const [brightness, setBrightness] = useState(100); // Brightness percentage (default 100%)
  const [voices, setVoices] = useState([]);
  const [utterances, setUtterances] = useState([]);
  const { isTTSEnabled } = useTTS(); // Use TTS context

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setVoices(voices);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    // Create and store utterances when voices are updated
    const utteranceTexts = ["Press Here to Start", "View Menu"];
    const newUtterances = utteranceTexts.map((text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voices.length > 0) {
        utterance.voice = voices[0]; // Use the first available voice
      }
      return utterance;
    });
    setUtterances(newUtterances);
  }, [voices]);

  const handleStart = () => {
    router.push("/customer/order1");
  };

  const handleMenu = () => {
    router.push("/menuboard");
  };

    /**
   * Handles the change event for the brightness slider.
   * Sets the brightness state to the selected value.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event object.
   */
  const handleBrightnessChange = (event) => {
    setBrightness(event.target.value);
  };

    /**
   * Speaks the given text using speech synthesis.
   * 
   * @param {string} text - The text to speak.
   */
  const speak = (index) => {
    if (isTTSEnabled && utterances[index]) {
      speechSynthesis.speak(utterances[index]);
    } else {
      console.log("No utterance available for index:", index);
    }
  };

  return (
    <div
      style={{
        filter: `brightness(${brightness}%)`,
        height: `100vh`,
        width: `100vw`,
        display: `flex`,
        background: `#d32f2f`,
        'flexDirection': `column`,
        'justifyContent': `center`,
        'alignItems': `center`
        }}
    >
      <div className={styles.brightnessSliderContainer}>
        <label htmlFor="brightnessSlider">Adjust Brightness:</label>
        <input
          type="range"
          id="brightnessSlider"
          className={styles.brightnessSlider}
          min="50"
          max="150"
          value={brightness}
          onChange={handleBrightnessChange}
        />
      </div>
      <div className={styles["main-content"]}>
        <img
          className={styles.pandaLogo}
          src="/pandaLogo3.png"
          draggable="false"
          alt="Panda Logo"
        />
        <button
          className={styles["menu-button"]}
          onClick={handleStart}
          onFocus={() => speak(0)}
        >
          <strong>Press Here to Start!</strong>
        </button>
        <button
          className={styles["menu-button"]}
          onClick={handleMenu}
          onFocus={() => speak(1)}
        >
          <strong>View Menu</strong>
        </button>
      </div>
    </div>
  );
}
