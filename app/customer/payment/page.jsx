"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import paymentStyles from "./Payment.module.css";
import Modal from "../../reviews/Modal";
import ReviewForm from "../../reviews/ReviewForm";
import { set } from "rsuite/esm/internals/utils/date";
import { useTTS } from '../../context/TTSContext';

/**
 * Payment component that handles the payment process and displays the selected items, total price, and tax.
 * It also provides options for adjusting brightness and submitting a review.
 * 
 * @returns {JSX.Element} - The rendered Payment component.
 */
const Payment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalPriceWithTax, setTotalPriceWithTax] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings, setRatings] = useState({});
  const [brightness, setBrightness] = useState(100); // Default brightness at 100%
  const [customerEmail, setCustomerEmail] = useState("");
  const [payMethod, setPayMethod] = useState("Card");
  const [voices, setVoices] = useState([]);
  const { isTTSEnabled } = useTTS(); // Use TTS context

  useEffect(() => {
    const itemsParam = searchParams.get("selectedItems");
    if (itemsParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam));
        setSelectedItems(items);
      } catch (error) {
        console.error("Failed to parse selectedItems:", error);
      }
    }
  }, [searchParams]);

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

  useEffect(() => {
    const fetchMenuItemsAndCalculateTotal = async () => {
      console.log('Selected items:', selectedItems);
      try {
        const menuItemsResponse = await fetch('/api/data/menu_items', {
          method: 'GET'
        });
        if (!menuItemsResponse.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const menuItems = await menuItemsResponse.json();

        let calculatedTotalPrice = 0;
        for (const item of selectedItems) {
          if (item.mealType === 'Appetizers' || item.mealType === 'Desserts' || item.mealType === 'Drinks') {
          } else if (item.mealType === 'A La Carte') {
            const menuItem = menuItems.find(menuItem => menuItem.menu_name === "Carte");
            if (!menuItem) {
              throw new Error(`Menu item not found for ${item.mealType}`);
            }
            calculatedTotalPrice += menuItem.charge;
          } else {
            const menuItem = menuItems.find(menuItem => menuItem.menu_name === item.mealType);
            if (!menuItem) {
              throw new Error(`Menu item not found for ${item.mealType}`);
            }
            calculatedTotalPrice += menuItem.charge;
          }
            for (const side of item.sides) {
              const sideItem = menuItems.find(menuItem => menuItem.menu_name === side.name);
              if (!sideItem) {
                throw new Error(`Menu item not found for ${side.name}`);
              }
              calculatedTotalPrice += sideItem.charge * side.count;
            }

            for (const entree of item.entrees) {
              const entreeItem = menuItems.find(menuItem => menuItem.menu_name === entree.name);
              if (!entreeItem) {
                throw new Error(`Menu item not found for ${entree.name}`);
              }
              calculatedTotalPrice += entreeItem.charge * entree.count;
            }

            for (const otherItem of item.otherItems) {
              const otherMenuItem = menuItems.find(menuItem => menuItem.menu_name === otherItem.name);
              if (!otherMenuItem) {
                throw new Error(`Menu item not found for ${otherItem.name}`);
              }
              calculatedTotalPrice += otherMenuItem.charge * otherItem.count;
            }
        }
        setTotalPrice(calculatedTotalPrice);

        const calculatedTax = calculatedTotalPrice * 0.07;
        setTax(calculatedTax);

        const calculatedTotalPriceWithTax = calculatedTotalPrice + calculatedTax;
        setTotalPriceWithTax(calculatedTotalPriceWithTax);
      } catch (error) {
        console.error('Error calculating total price:', error);
      }
    };

    fetchMenuItemsAndCalculateTotal();
  }, [selectedItems]);

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

  const handleBack = () => {
    router.push("/customer/order1");
  };

  const handleFinish = async () => {
    try {
      // Fetch all menu items
      const menuItemsResponse = await fetch('/api/data/menu_items', {
        method: 'GET'
      });
      if (!menuItemsResponse.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const menuItems = await menuItemsResponse.json();

      // console.log("MENU ITEMS", menuItems);

      const response1 = await fetch(`/api/data/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Customer_Email: customerEmail,
          Pay_Method: payMethod,
          Paid_Amt: totalPrice,
        }),
      });
  
      let customerId = null;
      if (response1.ok) {
        const data1 = await response1.json();
        customerId = data1.customer_id;
      } else {
        throw new Error('Failed to create new customer');
      }
  
      const timestamp = getCurrentTimestamp();
      const response2 = await fetch('/api/data/order_history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Customer_Id: customerId,
          Date_Time: timestamp,
          price: totalPrice,
        }),
      });
  
      let order_id = null;
      if (response2.ok) {
        const data2 = await response2.json();
        order_id = data2.order_id;
      } else {
        throw new Error('Failed to create new order_history');
      }
  
      // Traverse selectedItems and add to order_items
      for (const item of selectedItems) {
        console.log("ITEM", item);
        //Add meal type
        let mealType = item.mealType;
        if (item.mealType === 'Appetizers' || item.mealType === 'Desserts' || item.mealType === 'Drinks') {
        } else if(item.mealType === 'A La Carte') {
          const menuItem = menuItems.find(menuItem => menuItem.menu_name === "Carte");
          if (!menuItem) {
            throw new Error(`Menu item not found for ${mealType}`);
          }
          const price = menuItem.charge;
  
          const response3 = await fetch('/api/data/order_items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Order_Id: order_id,
              Order_Item: mealType,
              Price: price
            })
          });
  
          if (!response3.ok) {
            throw new Error('Failed to create new order_items');
          }

          // Update inventory
          const menu_id = menuItem.menu_id;
          const response4 = await fetch('/api/data/updateInventory?menu_id=' + menu_id);
          if (!response4.ok) {
            throw new Error('Failed to fetch inventory');
          }
          const inventoryData = await response4.json();
          const inventoryIds = inventoryData.map(inventory => inventory.inventory_id);

          for (const inventory of inventoryIds) {
            const response5 = await fetch('/api/data/updateInventory', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                inventory_id: inventory,
                amount: 2
              })
            });
            if (!response5.ok) {
              throw new Error('Failed to update inventory');
            }
            console.log(response5);
          }
        }
        else{
          const menuItem = menuItems.find(menuItem => menuItem.menu_name === mealType);
          if (!menuItem) {
            throw new Error(`Menu item not found for ${mealType}`);
          }
          const price = menuItem.charge;
  
          const response3 = await fetch('/api/data/order_items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Order_Id: order_id,
              Order_Item: mealType,
              Price: price
            })
          });
  
          if (!response3.ok) {
            throw new Error('Failed to create new order_items');
          }

          // Update inventory
          const menu_id = menuItem.menu_id;
          const response4 = await fetch('/api/data/updateInventory?menu_id=' + menu_id);
          if (!response4.ok) {
            throw new Error('Failed to fetch inventory');
          }
          const inventoryData = await response4.json();
          const inventoryIds = inventoryData.map(inventory => inventory.inventory_id);

          for (const inventory of inventoryIds) {
            const response5 = await fetch('/api/data/updateInventory', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                inventory_id: inventory,
                amount: 2
              })
            });
            if (!response5.ok) {
              throw new Error('Failed to update inventory');
            }
            console.log(response5);
          }
        }

        // Add sides
        for (const side of item.sides) {
          const menuItem = menuItems.find(menuItem => menuItem.menu_name === side.name);
          if (!menuItem) {
            throw new Error(`Menu item not found for ${side.name}`);
          }
          const price = menuItem.charge;
  
          const response3 = await fetch('/api/data/order_items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Order_Id: order_id,
              Order_Item: side.name,
              Price: price
            })
          });
  
          if (!response3.ok) {
            throw new Error('Failed to create new order_items');
          }

          // Update inventory
          const menu_id = menuItem.menu_id;
          const response4 = await fetch('/api/data/updateInventory?menu_id=' + menu_id);
          if (!response4.ok) {
            throw new Error('Failed to fetch inventory');
          }
          const inventoryData = await response4.json();
          const inventoryIds = inventoryData.map(inventory => inventory.inventory_id);

          for (const inventory of inventoryIds) {
            const response5 = await fetch('/api/data/updateInventory', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                inventory_id: inventory,
                amount: 1
              })
            });
            if (!response5.ok) {
              throw new Error('Failed to update inventory');
            }
            console.log(response5);
          }
        }
  
        // Add entrees
        for (const entree of item.entrees) {
          const menuItem = menuItems.find(menuItem => menuItem.menu_name === entree.name);
          if (!menuItem) {
            throw new Error(`Menu item not found for ${entree.name}`);
          }
          const price = menuItem.charge;
          console.log("PRICE", price);
  
          const response3 = await fetch('/api/data/order_items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Order_Id: order_id,
              Order_Item: entree.name,
              Price: price
            })
          });
  
          if (!response3.ok) {
            throw new Error('Failed to create new order_items');
          }

          // Update inventory
          const menu_id = menuItem.menu_id;
          const response4 = await fetch('/api/data/updateInventory?menu_id=' + menu_id);
          if (!response4.ok) {
            throw new Error('Failed to fetch inventory');
          }
          const inventoryData = await response4.json();
          const inventoryIds = inventoryData.map(inventory => inventory.inventory_id);

          for (const inventory of inventoryIds) {
            const response5 = await fetch('/api/data/updateInventory', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                inventory_id: inventory,
                amount: 2
              })
            });
            if (!response5.ok) {
              throw new Error('Failed to update inventory');
            }
            console.log(response5);
          }
        }
  
        // Add other items
        for (const otherItem of item.otherItems) {
          const menuItem = menuItems.find(menuItem => menuItem.menu_name === otherItem.name);
          if (!menuItem) {
            throw new Error(`Menu item not found for ${otherItem.name}`);
          }
          const price = menuItem.charge;
          console.log("PRICE", price);
  
          const response3 = await fetch('/api/data/order_items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              Order_Id: order_id,
              Order_Item: otherItem.name,
              Price: price
            })
          });
  
          if (!response3.ok) {
            throw new Error('Failed to create new order_items');
          }

          // Update inventory
          const menu_id = menuItem.menu_id;
          const response4 = await fetch('/api/data/updateInventory?menu_id=' + menu_id);
          if (!response4.ok) {
            throw new Error('Failed to fetch inventory');
          }
          const inventoryData = await response4.json();
          const inventoryIds = inventoryData.map(inventory => inventory.inventory_id);

          for (const inventory of inventoryIds) {
            const response5 = await fetch('/api/data/updateInventory', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                inventory_id: inventory,
                amount: 1
              })
            });
            if (!response5.ok) {
              throw new Error('Failed to update inventory');
            }
            console.log(response5);
          }
        }
      }
  
      console.log('Order items added successfully');
      setIsModalOpen(true); // Open the modal to rate items
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  /**
   * Handles the change event for the rating input.
   * 
   * @param {string} menuItemId - The ID of the menu item being rated.
   * @param {number} rating - The rating value.
   */
  const handleRatingChange = (menuItemId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [menuItemId]: { ...prevRatings[menuItemId], rating },
    }));
  };

    /**
   * Handles the change event for the comment input.
   * 
   * @param {string} menuItemId - The ID of the menu item being commented on.
   * @param {string} comment - The comment text.
   */
  const handleCommentChange = (menuItemId, comment) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [menuItemId]: { ...prevRatings[menuItemId], comment },
    }));
  };

  /**
   * Handles the submission of the ratings and comments.
   */
  const handleSubmitRatings = async () => {
    try {
      console.log(ratings);
      const updatedRatings = await Promise.all(
        Object.entries(ratings).map(async ([menuItemName, { rating, comment }]) => {
          const response = await fetch(`/api/data/reviews?menuItemName=${encodeURIComponent(menuItemName)}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch menu item ID for ${menuItemName}`);
          }
          const { menu_id: menuItemId } = await response.json();
          return { menuItemId, rating, comment };
        })
      );

      await Promise.all(
        updatedRatings.map(async ({ menuItemId, rating, comment }) => {
          const response = await fetch('/api/data/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ menu_item_id: menuItemId, rating, comment }),
          });
          if (!response.ok) {
            throw new Error('Failed to submit review');
          }
        })
      );

      console.log('Ratings submitted:', updatedRatings);
      setIsModalOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error submitting ratings:', error);
    }
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

  const uniqueItems = [
    ...selectedItems
      .flatMap(item => [
        ...(item.sides || []),
        ...(item.entrees || []),
        ...(item.otherItems || []),
      ])
      .reduce((map, current) => {
        if (!map.has(current.name)) {
          map.set(current.name, current);
        }
        return map;
      }, new Map())
      .values()
  ];

  return (
    <div
      style={{
        filter: `brightness(${brightness}%)`,
        transition: "filter 0.2s ease-in-out",
      }}
    >
      <div className={paymentStyles.pageWrapper}>
        <div className={paymentStyles.paymentContainer}>
          <div className={paymentStyles.paymentForm}>
            <h2>Payment Information</h2>
            <form>
              <div className={paymentStyles.formGroup}>
                <label htmlFor="customerEmail">Email</label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  onMouseDown={() => speak(new SpeechSynthesisUtterance("Enter Your Email"))}
                  required
                />
              </div>
              <label htmlFor="payMethod">Payment Method</label> 
              <select 
                id="payMethod"
                value={payMethod}
                name="payMethod"
                onChange={(e) => setPayMethod(e.target.value)}
                // onSelect={speak(new SpeechSynthesisUtterance(payMethod))} 
                required
                >
                    <option value="Card">Card</option>
                    <option value="Dinning Dollars">Dining Dollars</option>
                    <option value="Retail Swipe">Retail Swipe</option>
                    <option value="Cash">Cash</option>
              </select>
              {/* <div className={paymentStyles.formGroup}>
                <label htmlFor="paidAmt">Amount Paid</label>
                <input
                  type="number"
                  id="paidAmt"
                  name="paidAmt"
                  value={paidAmt}
                  onChange={(e) => setPaidAmt(e.target.value)}
                  required
                />
              </div> */}
            </form>
          </div>
          <div className={paymentStyles.checkoutSummary}>
            <div>
              <h2>Order Summary</h2>
            </div>
            <ul className={paymentStyles.checkoutItems}>
              {selectedItems.map((item, index) => (
                <li key={index} className={paymentStyles.checkoutItem}>
                  <div>{item.mealType}</div>
                  {item.sides.map((side, sideIndex) => (
                    <div key={`side-${sideIndex}`}>
                      {side.name} (x{side.count})
                    </div>
                  ))}
                  {item.entrees.map((entree, entreeIndex) => (
                    <div key={`entree-${entreeIndex}`}>
                      {entree.name} (x{entree.count})
                    </div>
                  ))}
                  {item.otherItems.map((otherItem, otherItemIndex) => (
                    <div key={`otherItem-${otherItemIndex}`}>
                      {otherItem.name} (x{otherItem.count})
                    </div>
                  ))}
                  <strong>Tax: ${tax.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
            <div className={paymentStyles.totalPrice}>
              <strong>Total Price: ${totalPriceWithTax.toFixed(2)}</strong>
            </div>
          </div>
        </div>
        <div className={paymentStyles.buttonsContainer}>
          <div className={paymentStyles.brightnessSliderContainer}>
            <label htmlFor="brightnessSlider">Adjust Brightness:</label>
            <input
              type="range"
              id="brightnessSlider"
              className={paymentStyles.brightnessSlider}
              min="50"
              max="150"
              value={brightness}
              onChange={handleBrightnessChange}
            />
          </div>
          <button className={paymentStyles.backButton} onClick={handleBack} onMouseEnter={() => speak(new SpeechSynthesisUtterance("Back"))}>
            Back
          </button>
          <button className={paymentStyles.finishButton} onClick={handleFinish} onMouseEnter={() => speak(new SpeechSynthesisUtterance("Finish"))}>
            Finish
          </button>
        </div>
        <Modal className={paymentStyles.modal} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Rate Your Items</h2>
          <ul className={paymentStyles.reviewList}>
            {uniqueItems.map((item, index) => (
            <li key={index} className={paymentStyles.reviewItem}>
              <ReviewForm
                menuItemName={item.name}
                onRatingChange={handleRatingChange}
                onCommentChange={handleCommentChange}
              />
            </li>
            ))}
          </ul>
          <button className={paymentStyles.button} onClick={handleSubmitRatings}>Submit Ratings</button>
        </Modal>
      </div>
    </div>
  );
};

export default Payment;