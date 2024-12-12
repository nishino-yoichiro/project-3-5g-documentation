"use client";
import React, { createContext, useState } from 'react';

export const SelectedItems = createContext();

/**
 * SelectedItemsProvider component that provides the selected items context to its children.
 * 
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} - The provider component that wraps its children with the selected items context.
 */
export const SelectedItemsProvider = ({ children }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    //add price fetching
    return (
        <SelectedItems.Provider value={{ selectedItems, setSelectedItems }}>
            {children}
        </SelectedItems.Provider>
    );
};