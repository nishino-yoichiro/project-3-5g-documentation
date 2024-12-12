// app/api/inventory/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch all inventory items.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing all inventory items in JSON format.
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM inventory ORDER BY inventory_id ASC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching inventory data from database:', err);
    return NextResponse.json({ error: 'Failed to fetch inventory data' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing item in the inventory table.
 * The item is updated with the provided inventory ID, item name, stock amount, usage per month, price, and employee ID.
 * 
 * @param {Request} req - The incoming request object containing the inventory item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function PUT(req) {
  try {
    const { inventory_id, stock_amt, employee_id } = await req.json();

    const client = await pool.connect();
    console.log('Database connection established');

    const result = await client.query(
      'UPDATE inventory SET inven_name = $1, stock_amt = $2, use_per_month = $3, price = $4, employee_id = $5 WHERE inventory_id = $6',
      [inven_name, stock_amt, use_per_month, price, employee_id, inventory_id]
    );
    

    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating inventory data in database:', err);
    return NextResponse.json({ error: 'Failed to update inventory data' }, { status: 500 });
  }
}

/**
 * Handles the POST request to add a new item to the inventory table.
 * The new item is added with the provided inventory ID, item name, stock amount, usage per month, price, and employee ID.
 * The added item is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the inventory item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the added inventory item data in JSON format.
 */
export async function POST(req) {
  try {
    const { inven_name, stock_amt, use_per_month, price, employee_id } = await req.json();

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO inventory (inven_name, stock_amt, use_per_month, price, employee_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [inven_name, stock_amt, use_per_month, price, employee_id]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new inventory item to database:', err);
    return NextResponse.json({ error: 'Failed to add new inventory item' }, { status: 500 });
  }
}

/**
 * Handles the DELETE request to delete an existing item from the inventory table.
 * The item is deleted based on the provided inventory ID.
 * 
 * @param {Request} req - The incoming request object containing the inventory ID.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the delete operation.
 */
export async function DELETE(req) {
  try {
    const { inventory_id } = await req.json();
    const client = await pool.connect();
    const result = await client.query('DELETE FROM inventory WHERE inventory_id = $1', [inventory_id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting inventory item from database:', err);
    return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
  }
}
