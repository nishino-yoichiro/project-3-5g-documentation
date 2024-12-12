"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './LandingPage.module.css';

// Import images
import alacarteImg from '/public/images/ALaCarte.avif';
import bowlImg from '/public/images/Bowl.avif';
import plateImg from '/public/images/Plate.avif';
import biggerPlateImg from '/public/images/BiggerPlate.avif';
import familyImg from '/public/images/Family.avif';
import applePieImg from '/public/images/ApplePie.avif';
import drinkImg from '/public/images/Drink.avif';
import rangoonImg from '/public/images/Rangoon.avif';

const mealOptions = [
    { name: 'A La Carte', image: alacarteImg, price: 5.2 },
    { name: 'Bowl', image: bowlImg, price: 8.3 },
    { name: 'Plate', image: plateImg, price: 9.8 },
    { name: 'Bigger Plate', image: biggerPlateImg, price: 11.3 },
    { name: 'Appetizers', image: rangoonImg, price: 2 },
    { name: 'Desserts', image: applePieImg, price: 2 },
    { name: 'Drinks', image: drinkImg, price: 2.3 },
    { name: 'Family Meal', image: familyImg, price: 43 }
];

/**
 * LandingPage component that displays a grid of meal options.
 * Clicking on a meal option navigates to the meal selection page with the selected meal type.
 * 
 * @returns {JSX.Element} - The rendered LandingPage component.
 */
const LandingPage = () => {
    const router = useRouter();

    const handleSelection = (mealType) => {
        router.push(`/meal-selection?mealType=${mealType}`);
    };

    return (
        <div className={styles.gridContainer}>
            {mealOptions.map((option, index) => (
                <div key={index} className={styles.gridItem} onClick={() => handleSelection(option.name)}>
                    <img src={option.image} alt={option.name} className={styles.gridImage} />
                    <div className={styles.gridTextContainer}>
                        <span className={styles.gridText}>{option.name}</span>
                        <span className={styles.gridPrice}>{option.price > 0 ? `$${option.price.toFixed(2)}` : 'Price varies'}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LandingPage;