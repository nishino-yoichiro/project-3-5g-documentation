"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import menuStyles from './MenuBoard.module.css';
// Combine all images into a single array
const menuItems = [
  {
    image: '/images/ALaCarte.avif',
    name: 'A La Carte',
    description: 'Choose your favorite entree for a customized meal experience',
    price: '$5.50+ *additional charges may apply*'
  },
  {
    image: '/images/Bowl.avif',
    name: 'Bowl',
    description: 'Perfect portion with one side and one entree of your choice',
    price: '$8.30+ *additional charges may apply*'
  },
  {
    image: '/images/Plate.avif',
    name: 'Plate',
    description: 'Satisfying combo with one side and two entrees for variety',
    price: '$9.20+ *additional charges may apply*'
  },
  {
    image: '/images/BiggerPlate.avif',
    name: 'Bigger Plate',
    description: 'Hearty meal with one side and three entrees for big appetites',
    price: '$11.30+ *additional charges may apply*'
  },
  {
    image: '/images/Family.avif',
    name: 'Family Meal',
    description: 'Generous portions to feed the whole family, with multiple sides and entrees',
    price: '$43.00+ *additional charges may apply*'
  },
  {
    image: '/images/Sides_WhiteSteamedRice.png',
    name: 'White Steamed Rice',
    description: 'Fluffy, perfectly cooked rice to complement any entree',
    price: 'Basic Side'
  },
  {
    image: '/images/Sides_FriedRice.png',
    name: 'Fried Rice',
    description: 'Savory rice stir-fried with eggs and vegetables',
    price: 'Basic Side'
  },
  {
    image: '/images/Vegetables_SuperGreens.png',
    name: 'Super Greens',
    description: 'A mix of nutritious, stir-fried seasonal vegetables',
    price: 'Basic Side'
  },
  {
    image: '/images/Sides_ChowMein.png',
    name: 'Chow Mein',
    description: 'Stir-fried noodles with crisp vegetables in a light sauce',
    price: 'Basic Side'
  },
  {
    image: '/images/Chicken_OrangeChicken.png',
    name: 'Orange Chicken',
    description: 'Crispy chicken wok-tossed in a sweet and tangy orange sauce',
    price: 'Basic Entree'
  },
  {
    image: '/images/ChickenBreast_HoneySesameChickenBreast.png',
    name: 'Honey Sesame Chicken',
    description: 'Tender chicken breast strips glazed with honey sesame sauce',
    price: 'Basic Entree'
  },
  {
    image: '/images/Beef_BroccoliBeef.png',
    name: 'Broccoli Beef',
    description: 'Sliced beef and fresh broccoli in a savory ginger soy sauce',
    price: 'Basic Entree'
  },
  {
    image: '/images/Seafood_HoneyWalnutShrimp.png',
    name: 'Honey Walnut Shrimp',
    description: 'Lightly battered shrimp tossed in a creamy sauce with glazed walnuts',
    price: 'Premium Entree'
  },
  {
    image: '/images/Chicken_KungPaoChicken.png',
    name: 'Kung Pao Chicken',
    description: 'Spicy chicken with peanuts, vegetables, and chili peppers',
    price: 'Basic Entree'
  },
  {
    image: '/images/Beef_BeijingBeef.png',
    name: 'Black Pepper Steak',
    description: 'Wok-seared steak and vegetables in a bold black pepper sauce',
    price: 'Premium Entree'
  },
  {
    image: '/images/Chicken_GrilledTeriyakiChicken.png',
    name: 'Grilled Teriyaki Chicken',
    description: 'Grilled chicken breast hand-sliced and served with teriyaki sauce',
    price: 'Basic Entree'
  },
  {
    image: '/images/Chicken_BlackPepperChicken.png',
    name: 'Black Pepper Chicken',
    description: 'Diced chicken and vegetables in a zesty black pepper sauce',
    price: 'Basic Entree'
  },
  {
    image: '/images/Chicken_MushroomChicken.png',
    name: 'Mushroom Chicken',
    description: 'Tender chicken slices with mushrooms in a light ginger soy sauce',
    price: 'Basic Entree'
  },
  {
    image: '/images/ChickenBreast_StringBeanChickenBreast.png',
    name: 'String Bean Chicken Breast',
    description: 'Chicken breast strips and crisp string beans in a mild ginger soy sauce',
    price: 'Basic Entree'
  },
  {
    image: '/images/Rangoon.avif',
    name: 'Cream Cheese Rangoon',
    description: 'Crispy wonton wraps filled with cream cheese and green onions',
    price: '$2.00'
  },
  {
    image: '/images/Veggie_EggRoll.avif',
    name: 'Vegetable Spring Roll',
    description: 'Crispy roll filled with cabbage, celery, carrots, and onions',
    price: '$2.00'
  },
  {
    image: '/images/Chicken_EggRoll.avif',
    name: 'Chicken Egg Roll',
    description: 'Classic egg roll filled with chicken and vegetables',
    price: '$2.00'
  },
  {
    image: '/images/ApplePie.avif',
    name: 'Cream Cheese Rangoon',
    description: 'Warm and flaky pastry filled with cinnamon-spiced apples',
    price: '$2.00'
  },
  {
    image: '/images/Drink.avif',
    name: 'Fountain Drink',
    description: 'Refreshing selection of soft drinks to complement your meal',
    price: '$2.30'
  }
];

/**
 * Displays the menu board with a carousel of menu items.
 * 
 * Features:
 * - Carousel display cycles through the menu items every 2 seconds.
 * - Allows customers to place an order by clicking the "Order Now" button.
 * 
 * State Variables:
 * @state {number} currentIndex - The index of the currently displayed menu item.
 * @state {object[]} voices - The available speech synthesis voices.
 * @state {object[]} utterances - The speech synthesis utterances for menu items.
 */
function MenuBoard() {
  /**
   * @description The index of the currently displayed menu item.
   * @type {number}
   * @default 0
   * */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * @description The available speech synthesis voices.
   * @type {object[]}
   * @default []
   * */
  const [voices, setVoices] = useState([]);

  /**
   * @description The speech synthesis utterances for menu items.
   * @type {object[]}
   * @default []
   * */
  const [utterances, setUtterances] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % menuItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Handles the "Order Now" button click event. Redirects to the order page.
   */
  const handleOrderNowClick = () => {
    router.push('/customer/order1');
  };

  return (
    <div className={menuStyles.menuBoard}>
      <div className={menuStyles.carouselContainer}>
        <div className={menuStyles.imageContainer}>
          <Image
            src={menuItems[currentIndex].image}
            alt={menuItems[currentIndex].name}
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <div className={menuStyles.textContainer}>
          <h2>{menuItems[currentIndex].name}</h2>
          <p>{menuItems[currentIndex].description}</p>
          {menuItems[currentIndex].type && (
            <p className={menuStyles.type}>{menuItems[currentIndex].type}</p>
          )}
          <p className={menuStyles.price}>
            {menuItems[currentIndex].price}
            {menuItems[currentIndex].note && (
              <span className={menuStyles.note}>{menuItems[currentIndex].note}</span>
            )}
          </p>
        </div>
      </div>
      <div className={menuStyles.indicators}>
        {menuItems.map((_, index) => (
          <span
            key={index}
            className={`${menuStyles.indicator} ${index === currentIndex ? menuStyles.active : ''}`}
          />
        ))}
      </div>
      <footer className={menuStyles.footer}>
        <div className={menuStyles.footerContent}>
          <div className={menuStyles.footerSection}>
            <h3>CONTACT US</h3>
            <p>📞 1-800-877-8988</p>
            <p>✉️ guest.services@pandaexpress.com</p>
          </div>
          <div className={menuStyles.footerSection}>
            <h3>SOCIAL MEDIA</h3>
            <p>𝕏 @PandaExpress</p>
            <p>📸 @officialpandaexpress</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MenuBoard;