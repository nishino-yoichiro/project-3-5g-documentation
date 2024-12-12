//Checkout
"use client";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Checkout.module.css';
import { SelectedItems } from '../../SelectedItemsProvider';
import { useTTS } from '../../context/TTSContext';

const AlaCarteImg = '/images/ALaCarte.avif';
const bowlImg = '/images/Bowl.avif';
const plateImg = '/images/Plate.avif';
const biggerPlateImg = '/images/BiggerPlate.avif';
const familyImg = '/images/Family.avif';
const cubMealImg = '/images/cubMeal.avif'
const whiteRiceImg = '/images/Sides_WhiteSteamedRice.png';
const friedRiceImg = '/images/Sides_FriedRice.png';
const superGreensImg = '/images/Vegetables_SuperGreens.png';
const chowMeinImg = '/images/Sides_ChowMein.png';

const orangeChickenImg = '/images/Chicken_OrangeChicken.png';
const honeySesameChickenImg = '/images/ChickenBreast_HoneySesameChickenBreast.png';
const broccoliBeefImg = '/images/Beef_BroccoliBeef.png';
const honeyWalnutShrimpImg = '/images/Seafood_HoneyWalnutShrimp.png';
const kungPaoChickenImg = '/images/Chicken_KungPaoChicken.png';
const blackPepperSteakImg = '/images/Beef_BeijingBeef.png';
const grilledTeriyakiChickenImg = '/images/Chicken_GrilledTeriyakiChicken.png';
const blackPepperChickenImg = '/images/Chicken_BlackPepperChicken.png';
const mushroomChickenImg = '/images/Chicken_MushroomChicken.png';
const stringBeanChickenImg = '/images/ChickenBreast_StringBeanChickenBreast.png';

const rangoonImg = '/images/Rangoon.avif';
const springRollImg = '/images/Veggie_EggRoll.avif';
const eggRollImg = '/images/Chicken_EggRoll.avif';

const applePieImg = '/images/ApplePie.avif';
const drinkImg = '/images/Drink.avif';

const images = {
    'Bowl': bowlImg,
    'Plate': plateImg,
    'Bigger Plate': biggerPlateImg,
    'Family Meal': familyImg,
    'A La Carte': AlaCarteImg,
    'Cub Bowl': cubMealImg,
    'Drinks': drinkImg,
    'Drink': drinkImg,
    'Desserts': applePieImg,
    'Appetizers': eggRollImg,
    'Cream Cheese Rangoon': rangoonImg,
    'Chicken Egg Roll': eggRollImg,
    'Spring Roll': springRollImg,
    'Apple Pie': applePieImg,
    'Fried Rice': friedRiceImg,
    'Chow Mein': chowMeinImg,
    'Super Greens': superGreensImg,
    'White Rice': whiteRiceImg,
    'Orange Chicken': orangeChickenImg,
    'Honey Sesame Chicken': honeySesameChickenImg,
    'Broccoli Beef': broccoliBeefImg,
    'Honey Walnut Shrimp': honeyWalnutShrimpImg,
    'Kung Pao Chicken': kungPaoChickenImg,
    'Black Pepper Angus Steak': blackPepperSteakImg,
    'Grilled Teriyaki Chicken': grilledTeriyakiChickenImg,
    'Black Pepper Chicken': blackPepperChickenImg,
    'Mushroom Chicken': mushroomChickenImg,
    'String Bean Chicken Breast': stringBeanChickenImg,
};

const prices = {
    'Bowl': 8.3,
    'Plate': 9.8,
    'Bigger Plate': 11.3,
    'Family Meal': 43,
    'A La Carte': 5.2,
    'Cub Bowl': 8.25,
    'Drinks': 2.3,
    'Appetizers': 0,
    'Desserts': 2,
    'Cream Cheese Rangoon': 2,
    'Chicken Egg Roll': 2,
    'Spring Roll': 2,
    'Apple Pie': 0,
    'Orange Chicken': 0,
    'Honey Sesame Chicken': 0,
    'Broccoli Beef': 0,
    'Honey Walnut Shrimp': 1.5,
    'Kung Pao Chicken': 0,
    'Black Pepper Angus Steak': 1.5,
    'Grilled Teriyaki Chicken': 0,
    'Black Pepper Chicken': 0,
    'Mushroom Chicken': 0,
    'String Bean Chicken Breast': 0,
    'Fried Rice': 0,
    'Chow Mein': 0,
    'White Rice': 0,
    'Super Greens': 0,
};
/**
 * Checkout - A React component that displays the order summary and handles the checkout process.
 * 
 * Features:
 * - Displays the order summary with images and prices.
 * - Calculates the subtotal, tax, and total price.
 * - Handles brightness adjustment.
 * - Handles proceed to payment and order more actions.
 * - Includes Text-to-Speech (TTS) functionality for accessibility.
 *
 * State Variables:
 * @state {number} brightness - The brightness level of the page.
 * @state {Array} voices - The available voices for TTS.
 * 
 * @returns {JSX.Element} The rendered Checkout component.
 */
const Checkout = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { selectedItems, setSelectedItems } = useContext(SelectedItems);
    const orderHistory = JSON.parse(searchParams.get('orderHistory') || '[]');
    const initialOrderHistory = useRef(orderHistory);
    const [brightness, setBrightness] = useState(100); // Brightness starts at 100%
    const [voices, setVoices] = useState([]);
    const { isTTSEnabled } = useTTS(); // Use TTS context

    useEffect(() => {
        setSelectedItems(initialOrderHistory.current);
    }, [setSelectedItems]);

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

    /**
     * Speaks the given utterance using the Text-to-Speech (TTS) functionality.
     * 
     * @param {SpeechSynthesisUtterance} utterance - The utterance to be spoken.
     */
    function speak(utterance) {
        if (isTTSEnabled) {
            if (voices.length > 0) {
                utterance.voice = voices[0]; // Use the first available voice
            }
            speechSynthesis.speak(utterance);
        }
    }

    /**
     * Handles the brightness adjustment.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the brightness slider.
     */
    const handleBrightnessChange = (e) => {
        setBrightness(e.target.value); // Update brightness value
    };

    /**
     * Handles the proceed to payment action.
     */
    const handleProceedToPayment = () => {
        const queryString = `selectedItems=${encodeURIComponent(JSON.stringify(selectedItems))}`;
        router.push(`/customer/payment?${queryString}`);
    };

    /**
     * Renders the main header for the given item.
     * 
     * @param {Object} item - The item to be rendered.
     * @param {string} item.name - The name of the item.
     * @returns {JSX.Element} The rendered main header.
     */
    const renderMainHeader = (item) => {
        // Exclude price display for these categories
        const excludePriceFor = ['Appetizers', 'Drinks', 'Desserts'];
    
        return (
            <div className={styles.mainHeader} key={item.name}>
                <img src={images[item.name] || '/path/to/default-image.png'} alt={item.name} className={styles.mainImage} />
                <div className={styles.mainDetails}>
                    <h2 className={styles.mainTitle}>{item.name}</h2>
                    {!excludePriceFor.includes(item.name) && (
                        <p className={styles.mainPrice}>${prices[item.name]?.toFixed(2)}</p>
                    )}
                </div>
            </div>
        );
    };

    /**
     * Renders the supporting item for the given item.
     * 
     * @param {Object} item - The item to be rendered.
     * @param {string} item.name - The name of the item.
     * @param {number} item.count - The count of the item.
     * @returns {JSX.Element} The rendered supporting item.
     */
    const renderSupportingItem = (item) => {
        const quantity = item.count || 1; // Retrieve the correct count for the item
        const totalPrice = prices[item.name] * quantity; // Calculate the total price
    
        return (
            <div className={styles.supportingItem} key={item.name}>
                <img src={images[item.name] || '/path/to/default-image.png'} alt={item.name} className={styles.supportingImage} />
                <div className={styles.supportingDetails}>
                    <h4 className={styles.supportingTitle}>
                        {item.name} {quantity > 1 ? `(x${quantity})` : ''}
                    </h4>
                    {/* Only display the price if it is greater than 0 */}
                    {totalPrice > 0 && (
                        <p className={styles.supportingPrice}>
                            ${totalPrice.toFixed(2)}
                        </p>
                    )}
                </div>
            </div>
        );
    };
    
    
    /**
     * Calculates the subtotal, tax, and total price for the order.
     * 
     * @returns {Object} An object containing the subtotal, tax, and total price.
     */
    const calculateTotal = () => {
        const taxRate = 0.07; // Tax rate of 7%
        let subtotal = 0;

        // Calculate the total for each order
        orderHistory.forEach((order) => {
            subtotal += prices[order.mealType] || 0;
            [...order.sides, ...order.entrees, ...order.otherItems].forEach((item) => {
                const itemName = item.name;
                const itemCount = item.count || 1;
                subtotal += (prices[itemName] || 0) * itemCount;
            });
        });

        const tax = subtotal * taxRate; // Calculate tax
        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: (subtotal + tax).toFixed(2),
        };
    };
    
    /**
     * Handles the order more action.
     */
    const handleOrderMore = () => {
        const updatedOrderHistory = JSON.stringify([...orderHistory]);
        router.push(`/customer/order1?orderHistory=${encodeURIComponent(updatedOrderHistory)}`);
    };

    const { subtotal, tax, total } = calculateTotal();

    return (
        <div
            className={styles.checkoutContainer}
            style={{ filter: `brightness(${brightness}%)` }} // Apply brightness
        >
            <h2 className={styles.title}>Order Summary</h2>
            {orderHistory.map((order, index) => (
                <div key={index}>
                    {renderMainHeader({ name: order.mealType })}
                    <div className={styles.supportingContainer}>
                        {order.sides.map(renderSupportingItem)}
                        {order.entrees.map(renderSupportingItem)}
                        {order.otherItems.map(renderSupportingItem)}
                    </div>
                </div>
            ))}

            {/* Display Subtotal, Tax, and Total */}
            <p className={styles.subtotal}>Subtotal: ${subtotal}</p>
            <p className={styles.tax}>Tax: ${tax}</p>
            <p className={styles.total}>Total: ${total}</p>

            {/* Action Buttons */}
            <button
                className={styles.proceedButton}
                onClick={handleProceedToPayment}
                onMouseEnter={() => speak(new SpeechSynthesisUtterance("Proceed to Payment"))}
            >
                Proceed to Payment
            </button>
            <button
                className={styles.orderMoreButton}
                onClick={handleOrderMore}
                onMouseEnter={() => speak(new SpeechSynthesisUtterance("Order More"))}
            >
                Order More
            </button>

            {/* Brightness Adjustment Slider */}
            <div className={styles.brightnessControl}>
                <label htmlFor="brightness-slider">Adjust Brightness:</label>
                <input
                    type="range"
                    id="brightness-slider"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={handleBrightnessChange}
                />
            </div>
        </div>
    );
};

export default Checkout;