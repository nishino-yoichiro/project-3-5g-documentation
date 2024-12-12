import { useEffect } from 'react';
import cashierStyles from './cashier_index.module.css';

/**
 * Items - A React component responsible for displaying a list of menu items
 * and handling user interactions, such as selecting meals, sides, entrees, 
 * and extra sides. Integrates with the parent `CashierView` component.
 * 
 * Props:
 * @param {Array} items - The list of menu items to display, each item contains:
 *   - name: The name of the item.
 *   - price: The price of the item.
 *   - maxSides: The maximum number of sides allowed for this item (only applicable to meal sizes).
 *   - maxEntrees: The maximum number of entrees allowed for this item (only applicable to meal sizes).
 * @param {string} type - The category of the menu items (e.g., "Meal-Size", "Side", "Entree", "Extra-Sides").
 * @param {Function} addToCart - Function to add an item to the cart in the parent component.
 * @param {Function} setMeal - Function to set the selected meal size in the parent component.
 * @param {Function} setSide - Function to add a side to the selected sides in the parent component.
 * @param {Function} setSelectedEntree - Function to add an entree to the selected entrees in the parent component.
 * @param {Object} selectedMeal - The currently selected meal size, containing:
 *   - name: The name of the selected meal size.
 *   - maxSides: The maximum sides allowed for this meal.
 *   - maxEntrees: The maximum entrees allowed for this meal.
 * @param {Array} selectedSide - The list of selected sides.
 * @param {Array} selectedEntree - The list of selected entrees.
 */
function Items(props) {

  /**
   * Handles user interaction when a menu item is clicked.
   * Based on the item type, updates the selection states and cart.
   * 
   * @param {string} type - The type of the menu item ("Meal-Size", "Side", "Entree", "Extra-Sides").
   * @param {string} name - The name of the selected menu item.
   * @param {number} price - The price of the selected menu item.
   * @param {number} maxS - The maximum sides allowed (only applicable for meal sizes).
   * @param {number} maxE - The maximum entrees allowed (only applicable for meal sizes).
   */
  const handleClick = (type, name, price, maxS, maxE) => {
    // Meal size selection
    if (type === "Meal-Size") {
      if (props.selectedMeal.length === 0) {
        props.setMeal({name: name, maxSides: maxS, maxEntrees: maxE});
        props.addToCart(type, name, price, maxS, maxE);
      }
      else {
        alert("Warning: You have already selected a meal size. Hit NEXT to choose sides or DELETE the current meal size to start over.");
      }
    }
    // Side selection
    else if (type === "Side") {
      if (props.selectedSide.length < props.selectedMeal.maxSides) {
        props.setSide(name);
        props.addToCart(type, name, price, maxS, maxE);
      }
      else {
        alert("Warning: You have already selected the maximum number of sides.");
      }
    }
    // Entree selection
    else if (type === "Entree") {
      if (props.selectedEntree.length < props.selectedMeal.maxEntrees) {
        props.setSelectedEntree(name);
        props.addToCart(type, name, price, maxS, maxE);
      }
      else {
        alert("Warning: You have already selected the maximum number of entrees.");
      }
    }
    // Extra sides selection
    else if (type === "Extra-Sides") {
      props.addToCart(type, name, price, maxS, maxE);
    }
  };

  /**
   * Renders the list of menu items as buttons.
   * Each button displays the name of the menu item and is clickable to trigger selection.
   */
  return (
    <div className={cashierStyles.Panel}>
      {props.items.map((item, id) => (
        <button className={cashierStyles.menuButtons} key={id} onClick={() => handleClick(props.type, item.name, item.price, item.maxSides, item.maxEntrees)}>
          <p>{item.name}</p>
          {/* <p>{selectedMeal.length}</p> */}
        </button>
      ))}
    </div>
  );
}

export default Items;
