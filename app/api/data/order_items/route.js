// app/api/order_items/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch all order items.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing all order items in JSON format.
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Order_Items');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching order items from database:', err);
    return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing order item in the Order_Items table.
 * The order item is updated with the provided order ID, order item, and price.
 * The updated order item is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the order item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the updated order item data in JSON format.
 */
export async function PUT(req) {
  try {
    const { Order_Id, Order_Item, Price } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE Order_Items SET Order_Item = $1, Price = $2 WHERE Order_Id = $3',
      [Order_Item, Price, Order_Id]
    );
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating order item in database:', err);
    return NextResponse.json({ error: 'Failed to update order item' }, { status: 500 });
  }
}

/**
 * Handles the POST request to insert a new order item into the Order_Items table.
 * The new order item is inserted with the provided order ID, order item, and price.
 * The inserted order item is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the order item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the inserted order item data in JSON format.
 */
export async function POST(req) {
  try {
    const { Order_Id, Order_Item, Price } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO Order_Items (Order_Id, Order_Item, Price) VALUES ($1, $2, $3) RETURNING *',
      [Order_Id, Order_Item, Price]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new order item to database:', err);
    return NextResponse.json({ error: 'Failed to add new order item' }, { status: 500 });
  }
}
