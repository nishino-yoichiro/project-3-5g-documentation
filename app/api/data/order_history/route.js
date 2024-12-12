// app/api/order_history/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch the order history.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the order history in JSON format.
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Order_History ORDER BY Order_Id ASC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching order history from database:', err);
    return NextResponse.json({ error: 'Failed to fetch order history' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing order in the Order_History table.
 * The order is updated with the provided order ID, customer ID, date and time, and price.
 * 
 * @param {Request} req - The incoming request object containing the order details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function PUT(req) {
  try {
    const { Order_Id, Customer_Id, Date_Time, price } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE Order_History SET Customer_Id = $1, Date_Time = $2, price = $3 WHERE Order_Id = $4',
      [Customer_Id, Date_Time, price, Order_Id]
    );
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating order in database:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

/**
 * Handles the POST request to add a new order to the Order_History table.
 * The new order is added with the provided customer ID, date and time, and price.
 * The added order is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the order details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the added order data in JSON format.
 */
export async function POST(req) {
    try {
      const { Customer_Id, Date_Time, price } = await req.json();
  
      if (!Customer_Id || !price) {
        return NextResponse.json({ error: 'Customer_Id and price are required' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO Order_History (Customer_Id, Date_Time, price) VALUES ($1, $2, $3) RETURNING *',
        [Customer_Id, Date_Time , price]
      );
      client.release();
      return NextResponse.json(result.rows[0]);
    } catch (err) {
      console.error('Error adding new order to database:', err);
      return NextResponse.json({ error: 'Failed to add new order' }, { status: 500 });
    }
}
