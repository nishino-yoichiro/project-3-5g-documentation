"use client";
import { useState, useEffect } from 'react';
import Items from './Items.jsx';
import cashierStyles from './cashier_index.module.css';
import { NEXT_CACHE_REVALIDATED_TAGS_HEADER } from 'next/dist/lib/constants.js';
import { signOut } from 'next-auth/react';

/**
 * CashierView - A React component that simulates a cashier's interface for managing
 * customer orders, including selecting menu items, adding items to a cart,
 * managing the cart, and completing payment.
 */
function CashierView() {
  const [mealSize, setMealSize] = useState([{ type: 'Meal-Size', items: [] }]);
  const [sides, setSides] = useState([{ type: 'Side', items: [] }]);
  const [entrees, setEntrees] = useState([{ type: 'Entree', items: [] }]);
  const [extraSides, setExtraSides] = useState([{ type: 'Extra-Sides', items: [] }]);
  const [MenuPanel, setMenuPanel] = useState(mealSize); // Initialize with mealSize
  const [email, setEmail] = useState('');
  const [payMethod, setPayMethod] = useState('Card');

  /**
   * Runs when the cashier view is first rendered.
   * Fetches menu items from the API and categorizes them into appropriate
   * menu sections: Meal-Size, Side, Entree, and Extra-Sides.
   * Updates the corresponding states with fetched data.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data/menu_items');
        const data = await response.json();

        const mealSizeItems = [];
        const sidesItems = [];
        const entreesItems = [];
        const extraSidesItems = [];

        data.forEach(item => {
          const formattedItem = {
            name: item.menu_name,
            price: item.charge,
            maxSides: item.max_sides,
            maxEntrees: item.max_entrees
          };

          switch (item.menu_type) {
            case 'Meal':
              mealSizeItems.push(formattedItem);
              break;
            case 'Sides':
              sidesItems.push(formattedItem);
              break;
            case 'Entrees':
              entreesItems.push(formattedItem);
              break;
            case 'Extra':
              extraSidesItems.push(formattedItem);
              break;
            default:
              break;
          }
        });

        setMealSize([{ type: 'Meal-Size', items: mealSizeItems }]);
        setSides([{ type: 'Side', items: sidesItems }]);
        setEntrees([{ type: 'Entree', items: entreesItems }]);
        setExtraSides([{ type: 'Extra-Sides', items: extraSidesItems }]);
        setMenuPanel([{ type: 'Meal-Size', items: mealSizeItems }]); // Update MenuPanel after fetching data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [prevMP, setPrevMP] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState([]);
  const [selectedSide, setSelectedSide] = useState([]);
  const [selectedEntree, setSelectedEntree] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);

  /**
   * Handles the sign out process by calling the signOut function from the next-auth library.
   * Clears the current session and redirects the user to the login page.
   * 
   */
  const handleSignOut = async () => {
    await signOut('google', { callbackUrl: '/login' })
  };

  /**
   * Handles the checkout process by validating the current selection
   * and updating the UI to the checkout panel if all requirements are met.
   */
  const handleCheckout = () => {
    setMenuPanel((prevMenuPanel) => {
      setPrevMP(prevMenuPanel);  // Store the current panel in prevMP before changing

      if (prevMenuPanel[0].type === "Entree" && selectedEntree.length === selectedMeal.maxEntrees) {
        setIsCheckout(true);
        return prevMenuPanel;
      }
      else{
        alert("Warning: Finish the order. Proceed to the Sides Menu and then checkout");
        return prevMenuPanel;
      }
    });
  };

    /**
   * Handles the back button to return to the main menu panel from the checkout panel.
   */
  const handleBackToMenu = () => {
    setIsCheckout(false);
  };


  /**
   * Adds a new item to the cart and tracks its type, name, price,
   * and the maximum allowable sides and entrees for the selected meal.
   * 
   * @param {string} type - The type of the menu item (e.g., 'Meal-Size', 'Side', 'Entree').
   * @param {string} name - The name of the menu item.
   * @param {number} price - The price of the menu item.
   * @param {number} maxS - The maximum sides allowed for the selected meal.
   * @param {number} maxE - The maximum entrees allowed for the selected meal.
   */
  function addToCart(type, name, price, maxS, maxE) {
    setCart(c => [...c, {Type: type, Name: name, Price: price, max_sides: maxS, max_entrees: maxE}]);
  }

  /**
   * Deletes an item from the cart by its index and adjusts the
   * selection states for meal, sides, or entrees accordingly.
   * 
   * @param {number} index - The index of the item to be removed from the cart.
   */
  function deleteFromCart(index) {
    const itemToDelete = cart[index];
    setCart(c => c.filter((_, i) => i !== index));

    // Find the most recent Meal-Size in the cart
    let recentMealIndex = -1;
    for (let i = cart.length -1; i >= 0; i--) {
      if (cart[i].Type === "Meal-Size") {
        recentMealIndex = i;
        break;
      }
    }
  
    if (recentMealIndex !== -1 && recentMealIndex <= index && selectedMeal.length !== 0) {
      if (itemToDelete.Type === "Meal-Size") {
        setSelectedMeal([]);
      } else if (itemToDelete.Type === "Side") {
        setSelectedSide(s => s.filter(side => side !== itemToDelete.Name));
      } else if (itemToDelete.Type === "Entree") {
        setSelectedEntree(e => e.filter(entree => entree !== itemToDelete.Name));
      }
    }
    else if (recentMealIndex === -1) {
      if (itemToDelete.Type === "Meal-Size") {
        setSelectedMeal([]);
      } else if (itemToDelete.Type === "Side") {
        setSelectedSide(s => s.filter(side => side !== itemToDelete.Name));
      } else if (itemToDelete.Type === "Entree") {
        setSelectedEntree(e => e.filter(entree => entree !== itemToDelete.Name));
      }
    }
  }

  /**
   * Checks if the cashier has selected a meal size and if the selected meal
   * has the correct number of sides and entrees before adding a new meal.
   */
  function AddNewMeal() {
    if (selectedMeal.length === 0) {
      alert("Warning: You have not selected a meal size.");
      return;
    }
    else {
      if(selectedSide.length < selectedMeal.maxSides || selectedEntree.length < selectedMeal.maxEntrees) {
        alert("Warning: You have complete and order yet.");
        return;
      }
    }

    setSelectedMeal([]);
    setSelectedSide([]);
    setSelectedEntree([]);

    setPrevMP(null); // Clear the previous panel after adding a new meal
    setMenuPanel(mealSize);
  }

  /**
   * Updates the menu panel to the next panel based on the current selection
   * and the number of sides and entrees selected for the meal.
   * Displays a warning message if the user tries to proceed without completing the order.
   * Checks if the user has selected the correct number of sides and entrees for the meal before proceeding to the next panel.
   */
  const NextMenuPanel = () => {
    setMenuPanel((prevMenuPanel) => {
      setPrevMP(prevMenuPanel);  // Store the current panel in prevMP before changing
      if (prevMenuPanel[0].type === "Meal-Size" && selectedMeal.length !== 0) {
        return sides;
      } else if (prevMenuPanel[0].type === "Side" && selectedSide.length === selectedMeal.maxSides) {
        return entrees;
      } else if (prevMenuPanel[0].type === "Entree" && selectedEntree.length === selectedMeal.maxEntrees) {
        alert("Warning: Hit EXTRA SIDES to order more or hit ADD NEW MEAL button to order another meal or CHECKOUT to complete order.");
        return prevMenuPanel;
      } else if (prevMenuPanel[0].type === "Extra-Sides") {
        alert("Warning: You cannot proceed from the Extra-Sides panel. Hit BACK button to return to the previous panel or CHECKOUT to complete your order.");
        return prevMenuPanel;  // Stay on Extra-Sides
      }
      else{
        alert("Warning: Finish the order.");
        return prevMenuPanel;
      }
    });
  };
  
  /**
   * Update the meal size selection state when a meal size is selected.
   * @param {object} meal - The selected meal size object.
   */
  const handleSetMeal = (meal) => {
    setSelectedMeal(meal);
  };

  /**
   * Update the side selection state when a side is selected.
   * @param {string} name - The name of the selected side.
   */
  const handleSetSide = (name) => {
    setSelectedSide(n => [...n, name]);
  };

  /**
   * Update the entree selection state when an entree is selected.
   * @param {string} name - The name of the selected entree.
   */
  const handleSetEntree = (name) => {
    setSelectedEntree(n => [...n, name]);
  };


  /**
   * Update the menu panel to the Extra-Sides panel when the user selects the Extra-Sides button.
   * Stores the current panel in prevMP before changing if we are not already in Extra-Sides.
   */
  const ExtraSidesPanel = () => {
    setMenuPanel((prevMenuPanel) => {
      // if we were not in Extra-Sides, we update our previous panel.
      if(prevMenuPanel[0].type !== "Extra-Sides"){
        setPrevMP(prevMenuPanel);  // Store the current panel in prevMP before changing if we are not already in Extra-Sides
      }
      
      return extraSides;
    });
  };

  /**
   * Handles the back button to return to the previous menu panel.
   */
  const BackMenuPanel = () => {
    setMenuPanel((prevMenuPanel) => {
      setPrevMP(prevMenuPanel);  // Store the current panel in prevMP before changing
      if (prevMenuPanel[0].type === "Entree" && selectedSide.length < selectedMeal.maxSides) {
        return sides;
      } else if (prevMenuPanel[0].type === "Side" && selectedMeal.length === 0) {
        return mealSize;
      }
      else if(prevMP){
        setPrevMP(null);  // Clear the previous panel after going back
        return prevMP;
      }
      else{
        alert("Warning: Select CHECKOUT or ADD NEW MEAL.");
        return prevMenuPanel
      }
    });
  };

  /**
   * Returns the current timestamp in the format 'YYYY-MM-DD HH:MM:SS'.
   */
  function getCurrentTimestamp() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Handles the payment process, including creating a new customer,
   * adding order history, and recording ordered items in the database.
   */
  const handlePay = async () => {
    const orderData = {
      Customer_Email: email,
      Pay_Method: payMethod,
      Paid_Amt: (cart.reduce((acc, curr) => acc + curr.Price, 0) * 1.07).toFixed(2)
    };
  
    try {
      // Create new customer
      const response1 = await fetch('/api/data/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
  
      // Get the customer ID from the response
      let customerId = null;
      if (response1.ok) {
        const data1 = await response1.json();
        customerId = data1.customer_id;
      } else {
        throw new Error('Failed to create new customer');
      }
  
      // Create new order history
      const timestamp = getCurrentTimestamp();
      const response2 = await fetch('/api/data/order_history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Customer_Id: customerId,
          Date_Time: timestamp,
          price: orderData.Paid_Amt
        })
      });
  
      let order_id = null;
      if (response2.ok) {
        const data2 = await response2.json();
        order_id = data2.order_id;
      } else {
        throw new Error('Failed to create new order_history');
      }

      // Create new order items
      for (const item of cart) {
        const response3 = await fetch('/api/data/order_items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Order_Id: order_id,
            Order_Item: item.Name,
            Price: item.Price
          })
        });

        if (!response3.ok) {
          throw new Error('Failed to create new order_items');
        }
      }
  
      alert('Payment successful! Customer ID: ' + customerId + ', Order ID: ' + order_id);
      setCart([]);
      setEmail('');
      setPayMethod('Card');
      setIsCheckout(false);
      setSelectedMeal([]);
      setSelectedSide([]);
      setSelectedEntree([]);
      setPrevMP(null); // Clear the previous panel after adding a new meal
      setMenuPanel(mealSize);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };


  return (
    <div className={cashierStyles.root}>
      {isCheckout ? (
      <>
        <div className={cashierStyles.checkoutContainer}>
          <h2>Checkout</h2>
          <ul>
            <h2>Ordered Items:</h2>
            {cart.map((menu, id) => (
              <li key={id}>
                <p>{menu.Name}</p>
                <p>{menu.Price.toFixed(2)}</p>
                <button className={cashierStyles.cartDeleteButton} onClick={() => deleteFromCart(id)}>➖</button>
              </li>
            ))}
          </ul>
          <div className={cashierStyles.totals}>
            <p>Subtotal: {cart.reduce((acc, curr) => acc + curr.Price, 0).toFixed(2)}</p>
            <p>Tax: {(cart.reduce((acc, curr) => acc + curr.Price, 0) * 0.07).toFixed(2)}</p>
            <p>Total: {(cart.reduce((acc, curr) => acc + curr.Price, 0) * 1.07).toFixed(2)}</p>
          </div>
          <div className={cashierStyles.formGroup}>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Payment Method:
              <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                <option value="Card">Credit Card</option>
                <option value="Dinning Dollars">Dinning Dollars</option>
                <option value="Retail Swipe">Retail Swipe</option>
                <option value="Cash">Cash</option>
              </select>
            </label>
          </div>
          <div className={cashierStyles.actionButtons}>
            <button onClick={handlePay}>Pay</button>
            <button onClick={handleBackToMenu}>Back to Menu</button>
          </div>
        </div>
      </>
      ) : (
        <>
          <div className={cashierStyles.itemWrapper}>
            <div className={cashierStyles.menuItemButtonsWrap}>
              <Items items={MenuPanel[0].items} type={MenuPanel[0].type} addToCart={addToCart} setMeal={handleSetMeal} setSide={handleSetSide} setSelectedEntree={handleSetEntree} selectedMeal={selectedMeal} selectedSide={selectedSide} selectedEntree={selectedEntree}></Items>
            </div>
            <div className={cashierStyles.menuBottomButtonsWrapper}>
              <button className={cashierStyles.bottomButtons} onClick={BackMenuPanel}>
                Back
              </button>
              <button className={cashierStyles.bottomButtons} onClick={NextMenuPanel}>
                Next
              </button>
              <button className={cashierStyles.bottomButtons} onClick={ExtraSidesPanel}>
                Extra Sides
              </button>
              <button className={cashierStyles.bottomButtons} onClick={AddNewMeal}>
                Add New Meal
              </button>
              <button className={cashierStyles.bottomButtons} onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
          <div className={cashierStyles.cart}>
            <ul className={cashierStyles.cartItems}>
              <h2>Ordered Items:</h2>
              {cart.map((menu, id) => 
                <li className={cashierStyles.cartItem} key={id}>
                  <p className={cashierStyles.menuName}>{menu.Name}</p>
                  <p className={cashierStyles.menuPrice}>{menu.Price.toFixed(2)}</p>
                  <button className={cashierStyles.cartDeleteButton} onClick={() => deleteFromCart(id)}>➖</button>
                </li>
              )}
            </ul>
            <div className={cashierStyles.cartTotal}>
              <p className={cashierStyles.accumluatePrice}>Subtotal: {cart.reduce((acc, curr) => acc + curr.Price, 0).toFixed(2)}</p>
              <p className={cashierStyles.accumluatePrice}>Tax: {(cart.reduce((acc, curr) => acc + curr.Price, 0) * 0.07).toFixed(2)}</p>
              <p className={cashierStyles.accumluatePrice}>Total: {(cart.reduce((acc, curr) => acc + curr.Price, 0) * 1.07).toFixed(2)}</p>
              <button className={cashierStyles.checkout} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CashierView;