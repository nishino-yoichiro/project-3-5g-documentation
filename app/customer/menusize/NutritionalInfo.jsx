"useclient"
import React from 'react';
import styles from './NutritionalInfo.module.css';

/**
 * NutritionalInfo component that displays the nutritional information for a given menu item.
 * 
 * @param {Object} props - The props object.
 * @param {string} props.item - The name of the menu item.
 * @returns {JSX.Element} - The rendered NutritionalInfo component.
 */
const NutritionalInfo = ({ item }) => {
  const nutritionalData = {
    'White Rice': { servingSize: 11, calories: 520, fat: 0, carbs: 118, protein: 10, sodium: 0, cholesterol: 0, fiber: 0, sugars: 0 },
    'Fried Rice': { servingSize: 11, calories: 620, fat: 19, carbs: 101, protein: 13, sodium: 1000, cholesterol: 140, fiber: 1, sugars: 4 },
    'Super Greens': { servingSize: 10, calories: 130, fat: 4, carbs: 14, protein: 9, sodium: 370, cholesterol: 0, fiber: 7, sugars: 6 },
    'Chow Mein': { servingSize: 11, calories: 600, fat: 23, carbs: 94, protein: 15, sodium: 1000, cholesterol: 0, fiber: 7, sugars: 11 },
    'Orange Chicken': { servingSize: 5.92, calories: 510, fat: 24, carbs: 53, protein: 26, sodium: 850, cholesterol: 86, fiber: 2, sugars: 20 },
    'Honey Sesame Chicken': { servingSize: 5.3, calories: 340, fat: 15, carbs: 35, protein: 16, sodium: 540, cholesterol: 45, fiber: 1, sugars: 16 },
    'Broccoli Beef': { servingSize: 5.44, calories: 150, fat: 7, carbs: 13, protein: 9, sodium: 520, cholesterol: 12, fiber: 2, sugars: 7 },
    'Honey Walnut Shrimp': { servingSize: 4.39, calories: 430, fat: 28, carbs: 32, protein: 13, sodium: 700, cholesterol: 70, fiber: 1, sugars: 9 },
    'Kung Pao Chicken': { servingSize: 6.73, calories: 320, fat: 21, carbs: 15, protein: 17, sodium: 1050, cholesterol: 60, fiber: 2, sugars: 7 },
    'Black Pepper Angus Steak': { servingSize: 5.1, calories: 210, fat: 10, carbs: 13, protein: 19, sodium: 560, cholesterol: 45, fiber: 1, sugars: 7 },
    'Grilled Teriyaki Chicken': { servingSize: 6, calories: 275, fat: 10, carbs: 14, protein: 33, sodium: 470, cholesterol: 160, fiber: 0, sugars: 9 },
    'Black Pepper Chicken': { servingSize: 6.3, calories: 280, fat: 19, carbs: 15, protein: 13, sodium: 1130, cholesterol: 55, fiber: 1, sugars: 7 },
    'Mushroom Chicken': { servingSize: 5.7, calories: 220, fat: 14, carbs: 10, protein: 13, sodium: 840, cholesterol: 50, fiber: 1, sugars: 5 },
    'String Bean Chicken Breast': { servingSize: 5.6, calories: 210, fat: 12, carbs: 13, protein: 12, sodium: 560, cholesterol: 30, fiber: 5, sugars: 5 },
    'Cream Cheese Rangoon': { servingSize: 2.4, calories: 190, fat: 8, carbs: 24, protein: 5, sodium: 180, cholesterol: 35, fiber: 2, sugars: 1 },
    'Spring Roll': { servingSize: 3.5, calories: 240, fat: 14, carbs: 24, protein: 4, sodium: 560, cholesterol: 0, fiber: 2, sugars: 0 },
    'Chicken Egg Roll': { servingSize: 2.75, calories: 200, fat: 10, carbs: 20, protein: 6, sodium: 340, cholesterol: 20, fiber: 2, sugars: 2 },
    'Apple Pie Roll': { servingSize: 1.94, calories: 150, fat: 3, carbs: 30, protein: 2, sodium: 90, cholesterol: 0, fiber: 1, sugars: 13 },
    'Drink': { servingSize: 0, calories: 0, fat: 0, carbs: 0, protein: 0, sodium: 0, cholesterol: 0, fiber: 0, sugars: 0 }
  };

  const allergenData = {
    'White Rice': [],
    'Fried Rice': ['Wheat', 'Soy', 'Eggs'],
    'Super Greens': ['Wheat', 'Soy'],
    'Chow Mein': ['Wheat', 'Soy'],
    'Orange Chicken': ['Wheat', 'Soy', 'Eggs', 'Milk', 'Sesame Oil'],
    'Honey Sesame Chicken': ['Wheat', 'Sesame Oil'],
    'Broccoli Beef': ['Wheat', 'Soy', 'Sesame Oil'],
    'Honey Walnut Shrimp': ['Wheat', 'Soy', 'Tree Nuts', 'Shellfish', 'Eggs', 'Milk'],
    'Kung Pao Chicken': ['Wheat', 'Soy', 'Peanuts', 'Sesame Oil'],
    'Black Pepper Angus Steak': ['Wheat', 'Soy'],
    'Grilled Teriyaki Chicken': ['Wheat', 'Soy', 'Sesame Oil'],
    'Black Pepper Chicken': ['Wheat', 'Soy', 'Sesame Oil'],
    'Mushroom Chicken': ['Wheat', 'Soy', 'Sesame Oil'],
    'String Bean Chicken Breast': ['Wheat', 'Soy', 'Sesame Oil'],
    'Cream Cheese Rangoon': ['Wheat', 'Milk'],
    'Spring Roll': ['Wheat', 'Soy', 'Shellfish', 'Eggs'],
    'Chicken Egg Roll': ['Wheat', 'Soy', 'Milk', 'Sesame Oil'],
    'Apple Pie Roll': ['Wheat'],
    'Drink': []
  };

  const data = nutritionalData[item.name] || {};
  const allergens = allergenData[item.name] || [];

  return (
    <div className={styles.infoIcon}>
      i
      <div className={styles.tooltip}>
        <h4>{item.name} Nutrition Facts</h4>
        <p>Serving Size: {data.servingSize} oz</p>
        <p>Calories: {data.calories}</p>
        <p>Fat: {data.fat}g</p>
        <p>Carbs: {data.carbs}g</p>
        <p>Protein: {data.protein}g</p>
        <p>Sodium: {data.sodium}mg</p>
        <p>Cholesterol: {data.cholesterol}mg</p>
        <p>Dietary Fiber: {data.fiber}g</p>
        <p>Sugars: {data.sugars}g</p>
        <h5>Allergens:</h5>
        <p>{allergens.length > 0 ? allergens.join(', ') : 'None'}</p>
      </div>
    </div>
  );
};

export default NutritionalInfo;