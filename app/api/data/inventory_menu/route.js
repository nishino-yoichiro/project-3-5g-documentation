// app/api/data/menu_items/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch all menu items.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing all menu items in JSON format.
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM inventory_menu ORDER BY menu_id ASC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items from database:', err);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing menu item in the inventory_menu table.
 * The menu item is updated with the provided menu ID, inventory name, and inventory ID.
 * 
 * @param {Request} req - The incoming request object containing the menu item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function PUT(req) {
  try {
    const { menu_id, inventory_name, inventory_id } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE inventory_menu SET inventory_name = $1, inventory_id = $2 WHERE menu_id = $3',
      [inventory_name, inventory_id, menu_id]
    );
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating menu item in database:', err);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// app/api/data/menu_items/route.js

/**
 * Handles the POST request to add a new menu item to the inventory_menu table.
 * The new menu item is added with the provided inventory name, menu ID, and inventory ID.
 * The added menu item is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the menu item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the added menu item data in JSON format.
 */
export async function POST(req) {
  try {
    const { inventory_name, menu_id, inventory_id } = await req.json();
    console.log('Received data for new menu item:', { inventory_name, menu_id, inventory_id });

    const client = await pool.connect();
    console.log('Database connection established');

    const query = 'INSERT INTO inventory_menu (inventory_name, menu_id, inventory_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [inventory_name, menu_id, inventory_id];
    console.log('Executing query:', query, 'with values:', values);

    const result = await client.query(query, values);
    client.release();
    console.log('New menu item added:', result.rows[0]);

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new menu item to database:', err);
    return NextResponse.json({ error: 'Failed to add new menu item' }, { status: 500 });
  }
}

/**
 * Handles the DELETE request to delete an existing menu item from the inventory_menu table.
 * The menu item is deleted based on the provided menu ID and inventory ID.
 * 
 * @param {Request} req - The incoming request object containing the menu ID and inventory ID.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the delete operation.
 */
export async function DELETE(req) {
  try {
    const { menu_id, inventory_id } = await req.json();
    const client = await pool.connect();
    const result = await client.query('DELETE FROM inventory_menu WHERE menu_id = $1 AND inventory_id = $2', [menu_id, inventory_id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting menu item from database:', err);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}