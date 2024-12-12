import React from 'react';
import navbarStyles from './Navbar.module.css';

/**
 * Navbar component that provides navigation buttons to filter items by category.
 * 
 * @param {Object} props - The props object.
 * @param {Function} props.setItems - The function to set the items to be displayed.
 * @param {Array} props.sideItems - The array of side items.
 * @param {Array} props.entreeItems - The array of entree items.
 * @param {Array} props.appetizerItems - The array of appetizer items.
 * @returns {JSX.Element} - The rendered Navbar component.
 */
const Navbar = ({ setItems, sideItems, entreeItems, appetizerItems }) => {
  return (
    <nav className={navbarStyles.nav}>
      <ul className={navbarStyles.ul}>
        <li className={navbarStyles.li}><button className={navbarStyles.button} onClick={() => setItems(sideItems)}>Sides</button></li>
        <li className={navbarStyles.li}><button className={navbarStyles.button} onClick={() => setItems(entreeItems)}>Entrees</button></li>
        <li className={navbarStyles.li}><button className={navbarStyles.button} onClick={() => setItems(appetizerItems)}>Appetizers</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;