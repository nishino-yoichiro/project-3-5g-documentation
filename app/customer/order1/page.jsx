//Landing page
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./LandingPage.module.css";
import { useTTS } from '../../context/TTSContext';

// Import images
const alacarteImg = "/images/ALaCarte.avif";
const bowlImg = "/images/Bowl.avif";
const plateImg = "/images/Plate.avif";
const biggerPlateImg = "/images/BiggerPlate.avif";
const familyImg = "/images/Family.avif";
const applePieImg = "/images/ApplePie.avif";
const drinkImg = "/images/Drink.avif";
const rangoonImg = "/images/Rangoon.avif";
const cubMealImg = "/images/cubMeal.avif";

const mealOptions = [
  { name: "A La Carte", image: alacarteImg, price: 5.2 },
  { name: "Bowl", image: bowlImg, price: 8.3 },
  { name: "Plate", image: plateImg, price: 9.8 },
  { name: "Bigger Plate", image: biggerPlateImg, price: 11.3 },
  { name: "Appetizers", image: rangoonImg, price: 2 },
  { name: "Desserts", image: applePieImg, price: 2 },
  { name: "Drinks", image: drinkImg, price: 2.3 },
  { name: "Family Meal", image: familyImg, price: 43 },
  { name: "Cub Bowl", image: cubMealImg, price: 8.25}
];

/**
 * LandingPage component that displays a grid of meal options.
 * Clicking on a meal option navigates to the meal selection page with the selected meal type.
 * 
 * @returns {JSX.Element} - The rendered LandingPage component.
 */
const LandingPage = () => {
  const router = useRouter();
  const [brightness, setBrightness] = useState(100); // Brightness percentage (default 100%)
  const { isTTSEnabled } = useTTS(); // Use TTS context
  const [voices, setVoices] = useState([]);

  /**
   * Handles the selection of a meal type.
   * Navigates to the meal selection page with the selected meal type as a query parameter.
   * 
   * @param {string} mealType - The selected meal type.
   */
  const handleSelection = (mealType) => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderHistory = searchParams.get('orderHistory') || '[]';
    router.push(`/customer/menusize?mealType=${mealType}&orderHistory=${orderHistory}`);
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

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Loaded voices:', voices);
      setVoices(voices);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  function speak(utterance) {
    if (isTTSEnabled) {
      if (voices.length > 0) {
        utterance.voice = voices[0]; // Use the first available voice
      }
      speechSynthesis.speak(utterance);
    } else {
      console.log('TTS is disabled');
    }
  }

  return (
    <div style={{ filter: `brightness(${brightness}%)` }}>
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
      <div className={styles.gridContainer}>
        {mealOptions.map((option, index) => (
          <div
            key={index}
            className={styles.gridItem}
            onClick={() => handleSelection(option.name)}
            onMouseEnter={() => speak(new SpeechSynthesisUtterance(option.name))} // Speak the option name when hovered
          >
            <img
              src={option.image}
              alt={option.name}
              className={styles.gridImage}
            />
            <div className={styles.gridTextContainer}>
              <span className={styles.gridText}>{option.name}</span> 
              <span className={styles.gridPrice}>
                {option.price > 0
                  ? `$${option.price.toFixed(2)}`
                  : "Price varies"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;