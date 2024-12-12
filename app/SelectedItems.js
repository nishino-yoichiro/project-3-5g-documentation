import React, { createContext, useContext, useState } from 'react';

// Create the context
const SelectedItemsContext = createContext();

/**
* Handles the change event for the language selection dropdown.
* Sets the selected language in the state and in a cookie.
* 
* @param {React.ChangeEvent<HTMLSelectElement>} event - The change event object.
*/
export const SelectedItemsProvider = ({ children }) => {
    const [orderHistory, setOrderHistory] = useState([]);

    return (
        <SelectedItemsContext.Provider value={{ orderHistory, setOrderHistory }}>
            {children}
        </SelectedItemsContext.Provider>
    );
};

/**
 * Custom hook to use the SelectedItems context.
 * 
 * @returns {Object} - The context value containing orderHistory and setOrderHistory.
 * @throws {Error} - Throws an error if the hook is used outside of a SelectedItemsProvider.
 */
export const useSelectedItems = () => {
    const context = useContext(SelectedItemsContext);
    if (!context) {
        throw new Error('useSelectedItems must be used within a SelectedItemsProvider');
    }
    return context;
};