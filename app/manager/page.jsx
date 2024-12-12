"use client";

import React, { useState, useEffect } from 'react';
import managerStyles from './manager.module.css';
import WeatherComponent from '../WeatherComponent/WeatherComponent';
import WeatherToday from './WeatherToday';
import { signOut } from 'next-auth/react';
import { set } from 'rsuite/esm/internals/utils/date';

/**
 * Manager - A React component that serves as the main interface for managing employees, inventory, menu items, and reports.
 * 
 * Features:
 * - Displays different views based on the active tab (Employee, Inventory, Menu, Reports).
 * - Fetches and displays data for employees, inventory, and menu items.
 * - Allows adding, editing, and deleting employees, inventory items, and menu items.
 * - Provides weather information through a popup.
 * - Handles user sign-out.
 * 
 * State Variables:
 * @state {string} activeTab - The currently active tab.
 * @state {Array} employeeData - The data for employees.
 * @state {Object} newEmployee - The data for a new employee being added.
 * @state {boolean} weatherPopUp - Whether the weather popup is visible.
 * @state {boolean} loginPopUp - Whether the login popup is visible.
 * @state {Array} InventoryData - The data for inventory items.
 * @state {Array} MenuData - The data for menu items.
 * 
 * @returns {JSX.Element} The rendered Manager component.
 */
function Manager() {
    /**
   * @description The currently active tab.
   * @type {string}
   * @default "Employee"
   */
  const [activeTab, setActiveTab] = useState('Employee');

  /**
   * @description The data for employees.
   * @type {Array}
   * @default []
   */
  const [employeeData, setEmployeeData] = useState([]);

  /**
   * @description The data for a new employee being added.
   * @type {Object}
   * @default { employee_name: '', manager_id: '', ssn: '', dob: '', phone_num: '', salary: '', email: '', pword: '' }
   */
  const [newEmployee, setNewEmployee] = useState({
    employee_name: '',
    manager_id: '',
    ssn: '',
    dob: '',
    phone_num: '',
    salary: '',
    email: '',
    pword: ''
  });

  /**
   * @description Whether the weather popup is visible.
   * @type {boolean}
   * @default false
   */
  const [weatherPopUp, setWeatherPopUp] = useState(false);

  /**
   * @description Whether the login popup is visible.
   * @type {boolean}
   * @default false
   */
  const [loginPopUp, setLoginPopUp] = useState(false);

  /**
   * @description The data for inventory items.
   * @type {Array}
   * @default []
   */
  const [InventoryData, setInventoryData] = useState([]);

  /**
   * @description The data for menu items.
   * @type {Array}
   * @default []
   */
  const [MenuData, setMenuData] = useState([]);

  /**
   * Runs once on component load to fetch employee, inventory, and menu data from corresponding API route.
   */
  useEffect(() => {
    // Fetch data from the API route
    async function fetchEmployee() {
      try {
        const response = await fetch('/api/data/employee');
        const result = await response.json();
        setEmployeeData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    //fetch inventory data
    async function fetchInventory() {
      try {
        const response = await fetch('/api/data/inventory');
        const result = await response.json();
        setInventoryData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    async function fetchMenu() {
      try {
        const response = await fetch('/api/data/menu_items');
        const result = await response.json();
        setMenuData(result);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchEmployee();
    fetchInventory();
    fetchMenu();
    setLoginPopUp(true);
  }, []);

  /**
   * Renders the view based on the active tab.
   * 
   * @returns {JSX.Element} The rendered view component.
   */
  const renderView = () => {
    switch (activeTab) {
      case 'Employee':
        return <EmployeeView data={employeeData} setData={setEmployeeData} />;
      case 'Inventory':
        return <InventoryView data={InventoryData} setData={setInventoryData}/>;
      case 'Menu':
        return <MenuView data={MenuData} setData={setMenuData}/>;
      case 'Reports':
        return <ReportView />;
      default:
        return <EmployeeView data={employeeData} setData={setEmployeeData} />;
    }
  };

  /**
   * Handles user sign-out.
   */
  function handleExit() {
    signOut('google', { callbackUrl: '/login' });
  }

  /**
   * Toggles the visibility of the weather popup.
   */
  const togglePopUp = () => {
    setWeatherPopUp(!weatherPopUp);
  }

  return (
    <div className={managerStyles.app}>
      {loginPopUp && (
        <div className={managerStyles.popUp}>
          <div className={managerStyles.overlay}></div>
            <div className={managerStyles.popUpContent}>
              <button className={managerStyles.close_popUp} onClick={() => setLoginPopUp(false)}>
                X
              </button>
              <WeatherToday />
            </div>
        </div>
      )}
      {weatherPopUp && (
        <div className={managerStyles.popUp}>
          <div className={managerStyles.overlay}></div>
            <div className={managerStyles.popUpContent}>
              <button className={managerStyles.close_popUp} onClick={togglePopUp}>
                X
              </button>
              <WeatherComponent />
          </div>
        </div>
      )}
      <nav className={managerStyles.tabNav}>
        <button onClick={setWeatherPopUp}>Weather</button>
        <button onClick={() => setActiveTab('Employee')}>Employee</button>
        <button onClick={() => setActiveTab('Inventory')}>Inventory</button>
        <button onClick={() => setActiveTab('Menu')}>Menu</button>
        <button onClick={() => setActiveTab('Reports')}>Reports</button>
        <button onClick={() => handleExit()}>Sign Out</button>
      </nav>
      <div className={managerStyles.viewContainer}>
        {renderView()}
      </div>
    </div>
  );
}

/**
 * EmployeeView - A React component that displays and manages employee data.
 * 
 * Features:
 * - Displays a table of employee data.
 * - Allows adding, editing, and deleting employees.
 * 
 * State Variables:
 * @state {Object} newEmployee - The data for a new employee being added.
 * @state {number|null} editIndex - The index of the employee being edited.
 * 
 * @param {Object} props - The properties object.
 * @param {Array} props.data - The employee data.
 * @param {Function} props.setData - The function to set the employee data.
 */
function EmployeeView({ data, setData }) {
  /**
   * The data for a new employee being added.
   * @type {Object}
   * @default { employee_name: '', manager_id: '', ssn: '', dob: '', phone_num: '', salary: '', email: '', pword: '' }
   * */
  const [newEmployee, setNewEmployee] = useState({
    employee_name: '',
    manager_id: '',
    ssn: '',
    dob: '',
    phone_num: '',
    salary: '',
    email: '',
    pword: ''
  });

  /**
   * The index of the employee being edited.
   * @type {number|null}
   * @default null
   * */
  const [editIndex, setEditIndex] = useState(null);

  /**
   * Handles input change for employee data.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the employee being edited.
   * @param {string} field - The field being edited.
   */
  const handleInputChange = (e, index, field) => {
    const newData = [...data];
    newData[index][field] = e.target.value;
    setData(newData);
  };

  /**
   * Handles edit click for an employee.
   * 
   * @param {number} index - The index of the employee being edited.
   */
  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  /**
   * Handles save action for an employee.
   * 
   * @param {number} index - The index of the employee being saved.
   */
  const handleSave = async (index) => {
    setEditIndex(null);
    const employee = data[index];
    try {
      const response = await fetch('/api/data/employee', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      const result = await response.json();
      if (result.success) {
        alert('Employee data updated successfully');

        async function fetchData() {
          try {
            const response = await fetch('/api/data/employee');
            const result = await response.json();
            setData(result);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

        fetchData();
      } else {
        alert('Failed to update employee data');
      }
    } catch (error) {
      console.error('Error updating employee data:', error);
      alert('Failed to update employee data');
    }
  };

  /**
   * Formats a date string for display.
   * 
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  /**
   * Formats a date string for input.
   * 
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string for input.
   */
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Return an empty string or a default value if the date is invalid
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  /**
   * Handles input change for new employee data.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles adding a new employee.
   */
  const handleAddEmployee = async () => {
    try {
      const response = await fetch('/api/data/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      const result = await response.json();
      if (result.error) {
        alert('Failed to add new employee');
      } else {
        setData((prev) => [...prev, result]);
        // Reset the New Employee object to its initial state to accept future additions
        setNewEmployee({
          employee_name: '',
          manager_id: '',
          ssn: '',
          dob: '',
          phone_num: '',
          salary: '',
          email: '',
          pword: ''
        });
        alert('New employee added successfully');
      }
    } catch (error) {
      console.error('Error adding new employee:', error);
      alert('Failed to add new employee');
    }
  };

  /**
   * Handles deleting an employee.
   * 
   * @param {number} id - The ID of the employee to delete.
   */
  const handleDeleteEmployee = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this employee?');
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await fetch(`/api/data/employee`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_id: id }),
      });
      const result = await response.json();
      if (result.error) {
        alert('Failed to delete employee');
      } else {
        setData((prev) => prev.filter((employee) => employee.employee_id !== id)); // Rerender the employee table but filtering out the deleted employee
        console.log(`Employee with ID ${id} deleted successfully`);
        alert('Employee deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  return (
    <div className={managerStyles.view}>
      <h2 className={managerStyles.head2}>Employee View</h2>
      <table className={managerStyles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Manager ID</th>
            <th>SSN</th>
            <th>DOB</th>
            <th>Phone Number</th>
            <th>Salary</th>
            <th>Email</th>
            <th>Password</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.map((employee, index) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>
                <input
                  type="text"
                  value={employee.employee_name}
                  onChange={(e) => handleInputChange(e, index, 'employee_name')}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={employee.manager_id}
                  onChange={(e) => handleInputChange(e, index, 'manager_id')}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={employee.ssn}
                  onChange={(e) => handleInputChange(e, index, 'ssn')}
                />
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="date"
                    value={formatDateForInput(employee.dob)}
                    onChange={(e) => handleInputChange(e, index, 'dob')}
                  />
                ) : (
                  <span onClick={() => handleEditClick(index)}>
                    {formatDate(employee.dob)}
                  </span>
                )}
              </td>
              <td>
                <input
                  type="text"
                  value={employee.phone_num}
                  onChange={(e) => handleInputChange(e, index, 'phone_num')}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={employee.salary}
                  onChange={(e) => handleInputChange(e, index, 'salary')}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={employee.email}
                  onChange={(e) => handleInputChange(e, index, 'email')}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={employee.pword}
                  onChange={(e) => handleInputChange(e, index, 'pword')}
                />
              </td>
              <td>
                <button onClick={() => handleSave(index)}>Save</button>
              </td>
              <td>
                <button onClick={() => handleDeleteEmployee(employee.employee_id)}>Remove</button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={managerStyles.newEmployeeForm}>
        <h2>Add New Employee</h2>
        <input
          type="text"
          name="employee_name"
          placeholder="Name"
          value={newEmployee.employee_name}
          onChange={handleNewEmployeeChange}
        />
        <input
          type="text"
          name="manager_id"
          placeholder="Manager ID"
          value={newEmployee.manager_id}
          onChange={handleNewEmployeeChange}
        />
        <input
          type="text"
          name="ssn"
          placeholder="SSN"
          value={newEmployee.ssn}
          onChange={handleNewEmployeeChange}
        />
        <input
          type="date"
          name="dob"
          placeholder="DOB"
          value={newEmployee.dob}
          onChange={handleNewEmployeeChange}
        />
        <input
          type="text"
          name="phone_num"
          placeholder="Phone Number"
          value={newEmployee.phone_num}
          onChange={handleNewEmployeeChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={newEmployee.salary}
          onChange={handleNewEmployeeChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={handleNewEmployeeChange}
        />
        <input
          type="text"
          name="pword"
          placeholder="Password"
          value={newEmployee.pword}
          onChange={handleNewEmployeeChange}
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>
    </div>
  );
}

/**
 * InventoryView - A React component that displays and manages inventory data.
 * 
 * Features:
 * - Displays a table of inventory data.
 * - Allows adding, editing, and deleting inventory items.
 * - Handles restocking of inventory items.
 * 
 * State Variables:
 * @state {Object} newInventory - The data for a new inventory item being added.
 * @state {number|null} editIndex - The index of the inventory item being edited.
 * @state {Array} restockData - The data for items that need to be restocked.
 * @state {boolean} showRestockPopup - Whether the restock popup is visible.
 * @state {Object} restockInput - The data for restocking an inventory item.
 * 
 * @param {Object} props - The properties object.
 * @param {Array} props.data - The inventory data.
 * @param {Function} props.setData - The function to set the inventory data.
 * 
 * @returns {JSX.Element} The rendered InventoryView component.
 */
function InventoryView({ data, setData }) {
  /**
   * The data for a new inventory item being added.
   * @type {Object}
   * @default { inven_name: '', stock_amt: '', use_per_month: '', price: '', employee_id: '' }
   * */
  const [newInventory, setNewInventory] = useState({
    inven_name: '',
    stock_amt: '',
    use_per_month: '',
    price: '',
    employee_id: '',
  });

  /**
   * The index of the inventory item being edited.
   * @type {number|null}
   * @default null
   * */
  const [editIndex, setEditIndex] = useState(null);

  /**
   * The data for items that need to be restocked.
   * @type {Array}
   * @default []
   * */
  const [restockData, setRestockData] = useState([]);

  /**
   * Whether the restock popup is visible.
   * @type {boolean}
   * @default false
   * */
  const [showRestockPopup, setShowRestockPopup] = useState(false);

  /**
   * The data for restocking an inventory item.
   * @type {Object}
   * @default { inventory_id: '', amount_restocking: '', employee_id: '' }
   * */
  const [restockInput, setRestockInput] = useState({
    inventory_id: '',
    amount_restocking: '',
    employee_id: '',
  });

  /**
   * Handles input change for inventory data.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the inventory item being edited.
   * @param {string} field - The field being edited.
   */
  const handleInputChange = (e, index, field) => {
    const newData = [...data];
    newData[index][field] = e.target.value;
    setData(newData);
  };

  /**
   * Handles edit click for an inventory item.
   * 
   * @param {number} index - The index of the inventory item being edited.
   */
  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  /**
   * Handles save action for an employee.
   * 
   * @param {number} index - The index of the employee being saved.
   */
  const handleSave = async (index) => {
    setEditIndex(null);
    const inventory = data[index];
    try {
      const response = await fetch('/api/data/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventory),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Inventory data updated successfully');
      } else {
        alert('Failed to update inventory data');
      }
    } catch (error) {
      console.error('Error updating inventory data:', error);
      alert('Failed to update inventory data');
    }
  };

  /**
   * Handles saving changes to a new inventory item.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleNewInventoryChange = (e) => {
    const { name, value } = e.target;
    setNewInventory((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles adding a new inventory item.
   * 
   * @param {React.MouseEvent<HTMLButtonElement>} e - The click event.
   */
  const handleAddInventory = async () => {
    try {
      const response = await fetch('/api/data/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInventory),
      });

      if (response.ok) {
        const result = await response.json();
        setData((prev) => [...prev, result]);
        setNewInventory({
          inven_name: '',
          stock_amt: '',
          use_per_month: '',
          price: '',
          employee_id: '',
        });
      } else {
        console.error('Failed to add inventory:', result.error);
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
      alert('Failed to add inventory');
    }
  };

  /**
   * Handles deleting an inventory item.
   * 
   * @param {number} id - The ID of the inventory item to delete.
   */
  const handleDeleteInventory = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this inventory item?');
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/data/inventory`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventory_id: id }),
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) => prev.filter((item) => item.inventory_id !== id));
        alert('Inventory deleted successfully');
      } else {
        alert('Failed to delete inventory');
      }
    } catch (error) {
      console.error('Error deleting inventory:', error);
      alert('Failed to delete inventory');
    }
  };

  /**
   * Handles fetching data for items that need to be restocked.
   */
  const handleNeedToRestock = async () => {
    try {
      const response = await fetch('/api/NeedToRestock');
      if (!response.ok) {
        throw new Error('Failed to fetch restock data');
      }
      const data = await response.json();
      // console.log('Restock data:', data); // Debugging statement
      setRestockData(Array.isArray(data) ? data : []);
      setShowRestockPopup(true);
    } catch (error) {
      console.error('Error fetching restock data:', error);
      alert('Failed to fetch restock data');
    }
  };

  /**
   * Closes the restock popup.
   */
  const closeRestockPopup = () => {
    setShowRestockPopup(false);
  };

  /**
   * Handles input change for restocking an inventory item.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleRestockInputChange = (e) => {
    const { name, value } = e.target;
    setRestockInput((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 
   * Handles restocking an inventory item.
   */
  const handleRestock = async () => {
    try {
      const response = await fetch('/api/data/restock', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restockInput),
      });

      if (response.ok) {
        const result = await response.json();
        setData((prev) =>
          prev.map((item) =>
            item.inventory_id === result.inventory_id ? result : item
          )
        );
        setRestockInput({
          inventory_id: '',
          amount_restocking: '',
          employee_id: '',
        });
        setShowRestockPopup(false);
        alert('Inventory restocked successfully');
      } else {
        console.error('Failed to restock inventory:', result.error);
        alert('Failed to restock inventory');
      }
    } catch (error) {
      console.error('Error restocking inventory:', error);
      alert('Failed to restock inventory');
    }
  };

  return (
    <div className={managerStyles.view}>
      <h2 className={managerStyles.head2}>Inventory View</h2>
      <table className={managerStyles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Price</th>
            <th>Stock Amount</th>
            <th>Use Per Month</th>
            <th>Employee ID</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((item, index) => (
              <tr key={item.inventory_id}>
                <td>{item.inventory_id}</td>
                <td>
                  <input
                    type="text"
                    value={item.inven_name}
                    onChange={(e) => handleInputChange(e, index, 'inven_name')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleInputChange(e, index, 'price')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.stock_amt}
                    onChange={(e) => handleInputChange(e, index, 'stock_amt')}
                    readOnly={true}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.use_per_month}
                    onChange={(e) => handleInputChange(e, index, 'use_per_month')}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.employee_id}
                    onChange={(e) => handleInputChange(e, index, 'employee_id')}
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(index)}>Save</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteInventory(item.inventory_id)}>Remove</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={managerStyles.newInventoryForm}>
        <h2 className={managerStyles.head2}>Add New Inventory</h2>
        <input
          type="text"
          name="inven_name"
          placeholder="Item Name"
          value={newInventory.inven_name}
          onChange={handleNewInventoryChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newInventory.price}
          onChange={handleNewInventoryChange}
        />
        <input
          type="number"
          name="stock_amt"
          placeholder="Stock Amount"
          value={newInventory.stock_amt}
          onChange={handleNewInventoryChange}
        />
        <input
          type="number"
          name="use_per_month"
          placeholder="Use Per Month"
          value={newInventory.use_per_month}
          onChange={handleNewInventoryChange}
        />
        <input
          type="text"
          name="employee_id"
          placeholder="Employee ID"
          value={newInventory.employee_id}
          onChange={handleNewInventoryChange}
        />
        <button onClick={handleAddInventory}>Add Inventory</button>
        <button onClick={handleNeedToRestock}>Needs to Restock</button>
      </div>

      {showRestockPopup && (
        <div className={managerStyles.popUp}>
          <div className={managerStyles.overlay}></div>
          <div className={managerStyles.popUpContent}>
            <button className={managerStyles.close_popUp} onClick={closeRestockPopup}>x</button>
            <h2 className={managerStyles.head2}>Need to Restock</h2>
            {restockData.length === 0 ? (
              <p>No Items Need to Restock</p>
            ) : (
              <>
                <p>Total Items to Restock: {restockData.length}</p>
                <table className={managerStyles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Item Name</th>
                      <th>Stock Amount</th>
                      <th>Use Per Month</th>
                      <th>Employee ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restockData.map((item) => (
                      <tr key={item.inventory_id}>
                        <td>{item.inventory_id}</td>
                        <td>{item.inven_name}</td>
                        <td>{item.stock_amt}</td>
                        <td>{item.use_per_month}</td>
                        <td>{item.employee_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <h2 className={managerStyles.head2}>Restock Inventory</h2>
            <input
              type="text"
              name="inventory_id"
              placeholder="Inventory ID"
              value={restockInput.inventory_id}
              onChange={handleRestockInputChange}
            />
            <input
              type="number"
              name="amount_restocking"
              placeholder="Amount Restocking"
              value={restockInput.amount_restocking}
              onChange={handleRestockInputChange}
            />
            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              value={restockInput.employee_id}
              onChange={handleRestockInputChange}
            />
            <button onClick={handleRestock}>Restock</button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * MenuView - A React component that displays and manages menu item data.
 * 
 * Features:
 * - Displays a table of menu item data.
 * - Allows adding, editing, and deleting menu items.
 * 
 * State Variables:
 * @state {Object} newMenuItem - The data for a new menu item being added.
 * @state {number|null} editIndex - The index of the menu item being edited.
 */
function MenuView({ data, setData }) {
  /**
   * The data for a new menu item being added.
   * @type {Object}
   * @default { menu_name: '', charge: '', menu_type: '', max_sides: '', max_entrees: '' }
   * */
  const [newMenuItem, setNewMenuItem] = useState({
    menu_name: '',
    charge: '',
    menu_type: '',
    max_sides: '',
    max_entrees: '',
  });

  /**
   * The index of the menu item being edited.
   * @type {number|null}
   * @default null
   * */
  const [editIndex, setEditIndex] = useState(null);

  /**
   * Handles input change for menu item data.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the menu item being edited.
   * @param {string} field - The field being edited.
   */
  const handleInputChange = (e, index, field) => {
    const newData = [...data];
    newData[index][field] = e.target.value;
    setData(newData);
  };

  /**
   * Handles edit click for a menu item.
   * @param {number} index - The index of the menu item being edited.
   */
  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  /**
   * Handles saving changes to a menu item.
   * @param {number} index - The index of the menu item being saved.
   */
  const handleSave = async (index) => {
    setEditIndex(null);
    const menuItem = data[index];
    try {
      const response = await fetch('/api/data/menu_items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem),
      });
      if (response.ok) {
        alert('Menu item updated successfully');
      } else {
        alert('Failed to update menu item');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Failed to update menu item');
    }
  };

  /**
   * Handles input change for new menu item data.
   */
  const handleNewMenuItemChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Adds a new menu item to the database.
   */
  const handleAddMenuItem = async () => {
    try {
      const response = await fetch('/api/data/menu_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMenuItem),
      });

      if (response.ok) {
        const result = await response.json();
        setData((prev) => [...prev, result]);
        setNewMenuItem({
          menu_name: '',
          charge: '',
          menu_type: '',
          max_sides: '',
          max_entrees: '',
        });
      } else {
        alert('Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item');
    }
  };

  /**
   * Deletes a menu item from the database.
   * @param {*} id - The ID of the menu item to delete.
   */
  const handleDeleteMenuItem = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this menu item?');
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch('/api/data/menu_items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menu_id: id }),
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) => prev.filter((item) => item.menu_id !== id));
        alert('Menu item deleted successfully');
      } else {
        alert('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item');
    }
  };

  return (
    <div className={managerStyles.view}>
      <h2 className={managerStyles.head2}>Menu Items View</h2>
      <table className={managerStyles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Menu Name</th>
            <th>Charge</th>
            <th>Type</th>
            <th>Max Sides</th>
            <th>Max Entrees</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((item, index) => (
              <tr key={item.menu_id}>
                <td>{item.menu_id}</td>
                <td>
                  <input
                    type="text"
                    value={item.menu_name}
                    onChange={(e) => handleInputChange(e, index, 'menu_name')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.charge}
                    onChange={(e) => handleInputChange(e, index, 'charge')}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.menu_type}
                    onChange={(e) => handleInputChange(e, index, 'menu_type')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.max_sides}
                    onChange={(e) => handleInputChange(e, index, 'max_sides')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.max_entrees}
                    onChange={(e) => handleInputChange(e, index, 'max_entrees')}
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(index)}>Save</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteMenuItem(item.menu_id)}>Remove</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={managerStyles.newMenuItemForm}>
        <h2 className={managerStyles.head2}>Add New Menu Item</h2>
        <input
          type="text"
          name="menu_name"
          placeholder="Menu Name"
          value={newMenuItem.menu_name}
          onChange={handleNewMenuItemChange}
        />
        <input
          type="number"
          name="charge"
          placeholder="Charge"
          value={newMenuItem.charge}
          onChange={handleNewMenuItemChange}
        />
        <input
          type="text"
          name="menu_type"
          placeholder="Menu Type"
          value={newMenuItem.menu_type}
          onChange={handleNewMenuItemChange}
        />
        <input
          type="number"
          name="max_sides"
          placeholder="Max Sides"
          value={newMenuItem.max_sides}
          onChange={handleNewMenuItemChange}
        />
        <input
          type="number"
          name="max_entrees"
          placeholder="Max Entrees"
          value={newMenuItem.max_entrees}
          onChange={handleNewMenuItemChange}
        />
        <button onClick={handleAddMenuItem}>Add Menu Item</button>
      </div>
    </div>
  );
}

/**
 * ReportView - A React component that displays and manages report data.
 * 
 * Features:
 * - Displays X report data.
 * - Displays Z report data.
 * - Displays sales by items data.
 * 
 * State Variables:
 * @state {Array} xReportData - The X report data.
 * @state {boolean} showXReport - Whether to show the X report data.
 * @state {boolean} showZReportButtons - Whether to show the Z report buttons.
 * @state {boolean} showZReportTable - Whether to show the Z report table.
 * @state {Array} zReportTableData - The Z report table data.
 * @state {boolean} showDateInput - Whether to show the date input.
 * @state {string} startDate - The start date for sales by items data.
 * @state {string} endDate - The end date for sales by items data.
 * 
 */
function ReportView() {
  const [xReportData, setXReportData] = useState([]);
  const [showXReport, setShowXReport] = useState(false);
  const [showZReportButtons, setShowZReportButtons] = useState(false);
  const [showZReportTable, setShowZReportTable] = useState(false);
  const [zReportTableData, setZReportTableData] = useState([]);
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /**
   * Fetches X report data from the server.
   */
  const fetchXReport = async () => {
    try {
      const response = await fetch('/api/XReport');
      if (!response.ok) {
        throw new Error('Failed to fetch X report data');
      }
      const data = await response.json();
      setXReportData(data);
      setShowXReport(true);
      setShowZReportButtons(false);
      setShowZReportTable(false);
      setShowDateInput(false);
    } catch (error) {
      console.error('Error fetching X report data:', error);
      alert('Failed to fetch X report data');
    }
  };

  /**
   * Fetches Z report data from the server.
   * 
   * @param {string} endpoint - The endpoint to fetch Z report data from.
   */
  const fetchZReport = async (endpoint) => {
    try {

      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint} data`);
      }
      const data = await response.json();
      setZReportTableData(Array.isArray(data.rows) ? data.rows : []);
      setShowZReportTable(true);
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
      alert(`Failed to fetch ${endpoint} data`);
    }
  };

  /**
   * Handles Z report button click.
   */
  const handleZReportClick = () => {
    setShowZReportButtons(true);
    setShowXReport(false);
    setShowZReportTable(false);
    setShowDateInput(false);
  };

  /**
   * Fetches sales by items data from the server.
   */
  const fetchSalesByItems = async () => {
    try {
      const response = await fetch('/api/salesByItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch sales by items data');
      }
      const data = await response.json();
      console.log('Sales by items data:', data);
      setZReportTableData(Array.isArray(data.rows) ? data.rows : []);
      setShowZReportTable(true);
    } catch (error) {
      console.error('Error fetching sales by items data:', error);
      alert('Failed to fetch sales by items data');
    }
  };

  /**
   * Handles date input click.
   */
  const handleDateInputClick = () => {
    setShowDateInput(true);
    setShowXReport(false);
    setShowZReportButtons(false);
    setShowZReportTable(false);
  };

  return (
    <div className={managerStyles.view}>
      <h2 className={managerStyles.head2}>Report View</h2>
      <button onClick={fetchXReport}>XReport</button>
      <button onClick={handleZReportClick}>ZReport</button>
      <button onClick={handleDateInputClick}>Sales By Items</button>

      {showXReport && (
        <div>
          <h3 className={managerStyles.head3}>X Report</h3>
          <table className={managerStyles.table}>
            <thead>
              <tr>
                <th>Hour</th>
                <th>Total Sales</th>
                <th>Card Total</th>
                <th>Retail Swipe Total</th>
                <th>Dining Dollars Total</th>
                <th>Cash Total</th>
              </tr>
            </thead>
            <tbody>
              {xReportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.hour}</td>
                  <td>{item.total_sales}</td>
                  <td>{item.card_total}</td>
                  <td>{item.retail_swipe_total}</td>
                  <td>{item.dining_dollars_total}</td>
                  <td>{item.cash_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showZReportButtons && (
        <div>
          <h3 className={managerStyles.head3}>Z Report</h3>
          <button onClick={() => fetchZReport('totalSales')}>Total Sales</button>
          <button onClick={() => fetchZReport('totalCardSales')}>Total Card Sales</button>
          <button onClick={() => fetchZReport('getTotalRetailSales')}>Total Retail Sales</button>
          <button onClick={() => fetchZReport('getTotalDinningDollarsSales')}>Total Dining Dollars Sales</button>
          <button onClick={() => fetchZReport('getTotalCashSales')}>Total Cash Sales</button>
          <button onClick={() => fetchZReport('getTotalUniqueCustomers')}>Total Unique Customers</button>
          <button onClick={() => fetchZReport('getTotalRepeatCustomers')}>Total Repeat Customers</button>
          <button onClick={() => fetchZReport('mostRecentOrder')}>Most Recent Order</button>
        </div>
      )}

      {showDateInput && (
        <div>
          <h3 className={managerStyles.head3}>Sales By Items</h3>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button onClick={fetchSalesByItems}>Fetch Sales By Items</button>
        </div>
      )}

      {showZReportTable && (
        <div>
          <h3 className={managerStyles.head3}>Z Report Data</h3>
          {zReportTableData.length === 0 ? (
            <p>No data available</p>
          ) : (
            <table className={managerStyles.table}>
              <thead>
                <tr>
                  {Object.keys(zReportTableData[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zReportTableData.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Manager;