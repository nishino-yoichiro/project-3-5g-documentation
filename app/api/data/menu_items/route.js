// app/api/menu_items/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the POST request to add a new order to the Order_History table.
 * The new order is added with the provided customer ID, date and time, and price.
 * The added order is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the order details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the added order data in JSON format.
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Menu_Items');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items from database:', err);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing menu item in the Menu_Items table.
 * The menu item is updated with the provided menu ID, menu name, and charge.
 * 
 * @param {Request} req - The incoming request object containing the menu item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function PUT(req) {
  try {
    const { menu_id, menu_name, charge, menu_type, max_sides, max_entrees} = await req.json();
    console.log(menu_id, menu_name, charge, menu_type, max_sides, max_entrees);
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE Menu_Items SET Menu_Name = $2, Charge = $3, menu_type = $4, max_sides = $5, max_entrees = $6 WHERE Menu_Id = $1',
      [menu_id, menu_name, charge, menu_type, max_sides, max_entrees]
    );
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating menu item in database:', err);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing menu item in the Menu_Items table.
 * The menu item is updated with the provided menu ID, menu name, and charge.
 * 
 * @param {Request} req - The incoming request object containing the menu item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function POST(req) {
  try {
    const { menu_name, charge, menu_type, max_sides, max_entrees } = await req.json();

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO Menu_Items (menu_name, charge, menu_type, max_sides, max_entrees) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ menu_name, charge, menu_type, max_sides, max_entrees ]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new menu item to database:', err);
    return NextResponse.json({ error: 'Failed to add new menu item' }, { status: 500 });
  }
}

/**
 * Handles the DELETE request to delete an existing item from the menu_item table.
 * The item is deleted based on the provided menu ID.
 * 
 * @param {Request} req - The incoming request object containing the inventory ID.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the delete operation.
 */
export async function DELETE(req) {
  try {
    const { menu_id } = await req.json();
    const client = await pool.connect();
    const result = await client.query('DELETE FROM menu_items WHERE menu_id = $1', [menu_id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting inventory item from database:', err);
    return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
  }
}

