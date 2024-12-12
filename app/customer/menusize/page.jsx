//Meal Selection
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './MealSelection.module.css';
import NutritionalInfo from './NutritionalInfo.jsx';
import { useTTS } from '../../context/TTSContext';

// Images
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

const sides = [
    { name: 'White Rice', image: whiteRiceImg },
    { name: 'Fried Rice', image: friedRiceImg },
    { name: 'Super Greens', image: superGreensImg },
    { name: 'Chow Mein', image: chowMeinImg }
];

const entrees = [
    { name: 'Orange Chicken', image: orangeChickenImg },
    { name: 'Honey Sesame Chicken', image: honeySesameChickenImg },
    { name: 'Broccoli Beef', image: broccoliBeefImg },
    { name: 'Honey Walnut Shrimp', image: honeyWalnutShrimpImg },
    { name: 'Kung Pao Chicken', image: kungPaoChickenImg },
    { name: 'Black Pepper Angus Steak', image: blackPepperSteakImg },
    { name: 'Grilled Teriyaki Chicken', image: grilledTeriyakiChickenImg },
    { name: 'Black Pepper Chicken', image: blackPepperChickenImg },
    { name: 'Mushroom Chicken', image: mushroomChickenImg },
    { name: 'String Bean Chicken Breast', image: stringBeanChickenImg }
];

const appetizers = [
    { name: 'Cream Cheese Rangoon', image: rangoonImg },
    { name: 'Spring Roll', image: springRollImg },
    { name: 'Chicken Egg Roll', image: eggRollImg }
];

const dessert = { name: 'Apple Pie', image: applePieImg };
const drink = { name: 'Drink', image: drinkImg };

/**
 * MealSelection component that allows users to select meal items.
 * 
 * @returns {JSX.Element} - The rendered MealSelection component.
 */
const MealSelection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedItems, setSelectedItems] = useState({});
    const [selectedALaCarte, setSelectedALaCarte] = useState(null);
    const [mealType, setMealType] = useState('');
    const [orderHistory, setOrderHistory] = useState([]);
    const [averageRatings, setAverageRatings] = useState({});
    const [brightness, setBrightness] = useState(1);
    const [voices, setVoices] = useState([]);
    const { isTTSEnabled } = useTTS(); // Use TTS context



    const maxEntrees = mealType === 'Bowl' ? 1 : mealType === 'Cub Bowl' ? 1: mealType === 'Plate' ? 2 : mealType === 'Bigger Plate' ? 3 : mealType === 'Family Meal' ? 3 : 1000;
    const maxSides = mealType === 'Family Meal' ? 2 : 2;

    useEffect(() => {
        const mealTypeParam = searchParams.get('mealType');
        const orderHistoryParam = searchParams.get('orderHistory');
        if (mealTypeParam) {
            setMealType(mealTypeParam);
        }
        if (orderHistoryParam) {
            setOrderHistory(JSON.parse(orderHistoryParam));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchAverageRatings = async () => {
            const allMenuItems = [...new Set([...sides, ...entrees, ...appetizers, dessert, drink].map(item => item.name))];
            const ratings = await Promise.all(
                allMenuItems.map(async (menuItemName) => {
                    const menuItemIdResponse = await fetch(`/api/data/reviews?menuItemName=${encodeURIComponent(menuItemName)}`);
                    if (!menuItemIdResponse.ok) {
                        throw new Error(`Failed to fetch menu item ID for ${menuItemName}`);
                    }
                    const { menu_id: menuItemId } = await menuItemIdResponse.json();
                    // console.log("Combo", menuItemId, menuItemName);

                    const averageRatingResponse = await fetch(`/api/data/averageReviews?menuItemId=${menuItemId}`);
                    if (!averageRatingResponse.ok) {
                        return { menuItemName, averageRating: 0 };
                    }
                    const { average_rating } = await averageRatingResponse.json();
                    return { menuItemName, averageRating: average_rating };
                })
            );
            const ratingsMap = ratings.reduce((acc, { menuItemName, averageRating }) => {
                acc[menuItemName] = averageRating;
                return acc;
            }, {});
            setAverageRatings(ratingsMap);
        };

        fetchAverageRatings();
    }, []);

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

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? styles.filledStar : styles.emptyStar}>
                    ★
                </span>
            );
        }
        return stars;
    }
    const handleBrightnessChange = (event) => {
        setBrightness(event.target.value);
    };

    const handleIncrement = (item) => {
      const isSide = sides.some(side => side.name === item.name);
      const isEntree = entrees.some(entree => entree.name === item.name);
      const currentSideCount = Object.values(selectedItems).reduce(
          (total, selectedItem) => (sides.some(side => side.name === selectedItem.name) ? total + selectedItem.count : total),
          0
      );
      const currentEntreeCount = Object.values(selectedItems).reduce(
          (total, selectedItem) => (entrees.some(entree => entree.name === selectedItem.name) ? total + selectedItem.count : total),
          0
      );
  
      // Prevent exceeding the maximum count for sides or entrees
      if ((isSide && currentSideCount >= maxSides) || (isEntree && currentEntreeCount >= maxEntrees)) {
          alert(`You can only select up to ${isSide ? maxSides : maxEntrees} ${isSide ? 'side' : 'entree'}${(isSide ? maxSides : maxEntrees) > 1 ? 's' : ''}.`);
          return;
      }
  
      // Increment the item count
      const currentCount = selectedItems[item.name]?.count || 0;
      setSelectedItems({
          ...selectedItems,
          [item.name]: {
              ...item,
              count: currentCount + 1, // Increment the count
          },
      });
  };
  
  const handleDecrement = (item) => {
      const currentCount = selectedItems[item.name]?.count || 0;
      if (currentCount > 1) {
          // Decrease the count
          setSelectedItems({
              ...selectedItems,
              [item.name]: {
                  ...item,
                  count: currentCount - 1, // Decrement the count
              },
          });
      } else if (currentCount === 1) {
          // Remove the item if the count reaches 0
          const updatedItems = { ...selectedItems };
          delete updatedItems[item.name];
          setSelectedItems(updatedItems);
      }
  };

    const handleALaCarteSelection = (item) => {
      setSelectedALaCarte(selectedALaCarte?.name === item.name ? null : item);
  };

    const handleCancel = () => {
        router.push('/customer');
    };

    const handleSubmitOrder = () => {
      // If no items are selected, alert the user and return
      if (!selectedALaCarte && Object.keys(selectedItems).length === 0) {
          alert('Please select items before proceeding to checkout.');
          return;
      }
  
      let sidesSelected = [];
      let entreesSelected = [];
      let otherSelectedItems = [];
  
      switch (mealType) {
          case 'Bowl':
              sidesSelected = Object.keys(selectedItems).filter(item => sides.some(side => side.name === item));
              entreesSelected = Object.keys(selectedItems).filter(item => entrees.some(entree => entree.name === item));
              if (sidesSelected.length < 1 || entreesSelected.length < 1) {
                  alert('A Bowl requires 1 side and 1 entree.');
                  return;
              }
              if (sidesSelected.length > 2 || entreesSelected.length > 1) {
                  alert('A Bowl allows only 1 side and 1 entree.');
                  return;
              }
              break;
          case 'Cub Bowl':
              sidesSelected = Object.keys(selectedItems).filter(item => sides.some(side => side.name === item));
              entreesSelected = Object.keys(selectedItems).filter(item => entrees.some(entree => entree.name === item));
              if (sidesSelected.length < 1 || entreesSelected.length < 1) {
                  alert('A Bowl requires 1 side and 1 entree.');
                  return;
              }
              if (sidesSelected.length > 2 || entreesSelected.length > 1) {
                  alert('A Bowl allows only 1 side and 1 entree.');
                  return;
              }
              break;
          case 'Plate':
              sidesSelected = Object.keys(selectedItems).filter(item => sides.some(side => side.name === item));
              entreesSelected = Object.keys(selectedItems).filter(item => entrees.some(entree => entree.name === item));
              if (sidesSelected.length < 1 || entreesSelected.length < 1) {
                  alert('A Plate requires at least 1 side and 1 entree.');
                  return;
              }
              if (sidesSelected.length > 2 || entreesSelected.length > 2) {
                  alert('A Plate allows only 1 side and up to 2 entrees.');
                  return;
              }
              break;
          case 'Bigger Plate':
              sidesSelected = Object.keys(selectedItems).filter(item => sides.some(side => side.name === item));
              entreesSelected = Object.keys(selectedItems).filter(item => entrees.some(entree => entree.name === item));
              if (sidesSelected.length < 1 || entreesSelected.length < 1) {
                  alert('A Bigger Plate requires at least 1 side and 1 entree.');
                  return;
              }
              if (sidesSelected.length > 2 || entreesSelected.length > 3) {
                  alert('A Bigger Plate allows only 1 side and up to 3 entrees.');
                  return;
              }
              break;
          case 'Family Meal':
              sidesSelected = Object.keys(selectedItems).filter(item => sides.some(side => side.name === item));
              entreesSelected = Object.keys(selectedItems).filter(item => entrees.some(entree => entree.name === item));
              if (sidesSelected.length < 1 || entreesSelected.length < 1) {
                  alert('A Family Meal requires at least 1 side and 1 entree.');
                  return;
              }
              if (sidesSelected.length > 4 || entreesSelected.length > 3) {
                  alert('A Family Meal allows up to 2 sides and 3 entrees.');
                  return;
              }
              break;
          case 'Appetizers':
              otherSelectedItems = Object.keys(selectedItems).filter(item => appetizers.some(appetizer => appetizer.name === item));
              if (otherSelectedItems.length < 1) {
                  alert('Please select at least 1 appetizer.');
                  return;
              }
              break;
          case 'Desserts':
              otherSelectedItems = selectedItems[dessert.name] ? [dessert.name] : [];
              if (otherSelectedItems.length < 1) {
                  alert('Please select at least 1 dessert.');
                  return;
              }
              break;
          case 'Drinks':
              otherSelectedItems = selectedItems[drink.name] ? [drink.name] : [];
              if (otherSelectedItems.length < 1) {
                  alert('Please select at least 1 drink.');
                  return;
              }
              break;
          case 'A La Carte':
              if (!selectedALaCarte) {
                  alert('Please select at least 1 item for A La Carte.');
                  return;
              }
              if (sides.some(side => side.name === selectedALaCarte.name)) {
                  sidesSelected.push(selectedALaCarte.name);
              } else if (entrees.some(entree => entree.name === selectedALaCarte.name)) {
                  entreesSelected.push(selectedALaCarte.name);
              } else {
                  otherSelectedItems.push(selectedALaCarte.name);
              }
              break;
          default:
              alert('Please select a valid meal type.');
              return;
      }
  
      // Navigate to checkout with the selected items based on mealType
      const currentOrder = {
        mealType,
        sides: sidesSelected.map(side => ({
            name: side,
            count: selectedItems[side]?.count || 1,
        })),
        entrees: entreesSelected.map(entree => ({
            name: entree,
            count: selectedItems[entree]?.count || 1,
        })),
        otherItems: otherSelectedItems.map(item => ({
            name: item,
            count: selectedItems[item]?.count || 1,
        })),
    };
  
      const updatedOrderHistory = [...orderHistory, currentOrder];
      const queryString = `orderHistory=${encodeURIComponent(JSON.stringify(updatedOrderHistory))}`;
      router.push(`/customer/checkout?${queryString}`);
  };
  
    

    const renderSidesAndEntrees = () => (
        <div>
          <h3 className={styles.subheading}>Choose Up to {maxSides} Side{maxSides > 1 ? 's' : ''}</h3>
          <div className={styles.optionGrid}>
            {sides.map((side, index) => (
              <div key={index} className={styles.optionItem}>
                <img src={side.image} alt={side.name} className={styles.optionImage} onMouseDownCapture={() => speak(new SpeechSynthesisUtterance(side.name))}/>
                <div 
                  className={styles.optionText}
                  onMouseDownCapture={() => speak(new SpeechSynthesisUtterance(side.name))}
                  >
                  {side.name}
                </div>
                <div className={styles.rating}>
                  {renderStars(averageRatings[side.name] || 0)}
                </div>
                <div className={styles.counter}>
                  <button onClick={() => handleDecrement(side)}>-</button>
                  <span>{selectedItems[side.name]?.count || 0}</span>
                  <button onClick={() => handleIncrement(side)}>+</button>
                </div>
                <NutritionalInfo item={side} />
              </div>
            ))}
          </div>
          <h3 className={styles.subheading}>Choose Up to {maxEntrees} Entree{maxEntrees > 1 ? 's' : ''}</h3>
          <div className={styles.optionGrid}>
            {entrees.map((entree, index) => (
              <div 
                key={index} 
                className={styles.optionItem}
              >
                <img src={entree.image} alt={entree.name} className={styles.optionImage} onMouseDownCapture={() => speak(new SpeechSynthesisUtterance(entree.name))}/>
                <div 
                  className={styles.optionText} 
                  onMouseDownCapture={() => speak(new SpeechSynthesisUtterance(entree.name))}
                >
                  {entree.name}
                </div>
                <div className={styles.rating}>
                  {renderStars(averageRatings[entree.name] || 0)}
                </div>
                <div className={styles.counter}>
                  <button onClick={() => handleDecrement(entree)}>-</button>
                  <span>{selectedItems[entree.name]?.count || 0}</span>
                  <button onClick={() => handleIncrement(entree)}>+</button>
                </div>
                <NutritionalInfo item={entree} />
              </div>
            ))}
          </div>
        </div>
      );
      
      const renderAppetizers = () => (
        <div>
          <h3 className={styles.subheading}>Select Your Appetizer(s)</h3>
          <div className={styles.optionGrid}>
            {appetizers.map((appetizer, index) => (
              <div key={index} className={styles.optionItem}>
                <img src={appetizer.image} alt={appetizer.name} className={styles.optionImage} onMouseDownCapture={() => speak(new SpeechSynthesisUtterance(appetizer.name))}/>
                <div className={styles.optionText}>{appetizer.name}</div>
                <div className={styles.rating}>
                  {renderStars(averageRatings[appetizer.name] || 0)}
                </div>
                <div className={styles.counter}>
                  <button onClick={() => handleDecrement(appetizer)}>-</button>
                  <span>{selectedItems[appetizer.name]?.count || 0}</span>
                  <button onClick={() => handleIncrement(appetizer)}>+</button>
                </div>
                <NutritionalInfo item={appetizer} />
              </div>
            ))}
          </div>
        </div>
      );
      
      const renderDesserts = () => (
        <div>
          <h3 className={styles.subheading}>Select Your Dessert</h3>
          <div className={styles.optionGrid}>
            <div className={styles.optionItem}>
              <img src={dessert.image} alt={dessert.name} className={styles.optionImage} />
              <div className={styles.optionText}>{dessert.name}</div>
              <div className={styles.rating}>
                {renderStars(averageRatings[dessert.name] || 0)}
              </div>
              <div className={styles.counter}>
                <button onClick={() => handleDecrement(dessert)}>-</button>
                <span>{selectedItems[dessert.name]?.count || 0}</span>
                <button onClick={() => handleIncrement(dessert)}>+</button>
              </div>
              <NutritionalInfo item={dessert} />
            </div>
          </div>
        </div>
      );
      
      const renderDrinks = () => (
        <div>
          <h3 className={styles.subheading}>Select Your Drink</h3>
          <div className={styles.optionGrid}>
            <div className={styles.optionItem}>
              <img src={drink.image} alt={drink.name} className={styles.optionImage} onMouseDownCapture={() => speak(new SpeechSynthesisUtterance("Fountain Drink"))}/>
              <div className={styles.optionText}>{drink.name}</div>
              <div className={styles.rating}>
                {renderStars(averageRatings[drink.name] || 0)}
              </div>
              <div className={styles.counter}>
                <button onClick={() => handleDecrement(drink)}>-</button>
                <span>{selectedItems[drink.name]?.count || 0}</span>
                <button onClick={() => handleIncrement(drink)}>+</button>
              </div>
              <NutritionalInfo item={drink} />
            </div>
          </div>
        </div>
      );
      
      const renderALaCarte = () => (
        <div>
          <h3 className={styles.subheading}>Select One</h3>
          <div className={styles.optionGrid}>
            {[...sides, ...entrees].map((item, index) => (
              <div
                key={index}
                className={`${styles.optionItem} ${
                  selectedALaCarte && selectedALaCarte.name === item.name ? styles.selected : ''
                }`}
                onClick={() => handleALaCarteSelection(item)}
                onMouseDownCapture={() => speak(new SpeechSynthesisUtterance(item.name))}
              >
                <img src={item.image} alt={item.name} className={styles.optionImage} />
                <div className={styles.optionText}>{item.name}</div>
                <div className={styles.rating}>
                  {renderStars(averageRatings[item.name] || 0)}
                </div>
                <NutritionalInfo item={item} />
              </div>
            ))}
          </div>
        </div>
      );

    return (
        <div
            className={styles.container}
            style={{
                filter: `brightness(${brightness})`, // Adjust brightness dynamically
            }}
        >
            <h2 className={styles.heading}>Select Your {mealType}</h2>
            
            {/* Brightness Slider */}
            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="brightness-slider">
                    <strong>Adjust Brightness: </strong>
                </label>
                <input
                    id="brightness-slider"
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={brightness}
                    onChange={handleBrightnessChange}
                />
                <span style={{ marginLeft: "10px" }}>{brightness}x</span>
            </div>
    
            {mealType === 'Bowl' || mealType === 'Plate' || mealType === 'Bigger Plate' || mealType === 'Family Meal' || mealType === 'Cub Bowl'
                ? renderSidesAndEntrees()
                : null}
                        {mealType === 'Appetizers' ? renderAppetizers() : null}
            {mealType === 'Desserts' ? renderDesserts() : null}
            {mealType === 'Drinks' ? renderDrinks() : null}
            {mealType === 'A La Carte' ? renderALaCarte() : null}

            {/* Action Buttons */}
            <div className={styles.actions}>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleSubmitOrder}>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default MealSelection;
