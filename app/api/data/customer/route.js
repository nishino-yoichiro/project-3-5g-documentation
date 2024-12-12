// app/api/customer/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch all customers.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing all customers in JSON format.
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Customer ORDER BY Customer_Id ASC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching customers from database:', err);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing customer in the Customer table.
 * The customer is updated with the provided customer ID, customer email, payment method, and paid amount.
 * 
 * @param {Request} req - The incoming request object containing the customer details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function PUT(req) {
  try {
    const { Customer_Id, Customer_Email, Pay_Method, Paid_Amt } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE Customer SET Customer_Email = $1, Pay_Method = $2, Paid_Amt = $3 WHERE Customer_Id = $4',
      [Customer_Email, Pay_Method, Paid_Amt, Customer_Id]
    );
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating customer in database:', err);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

/**
 * Handles the POST request to add a new customer to the Customer table.
 * The new customer is added with the provided customer email, payment method, and paid amount.
 * The added customer is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the customer details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the added customer data in JSON format.
 */
export async function POST(req) {
  try {
    const { Customer_Email, Pay_Method, Paid_Amt } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO Customer (Customer_Email, Pay_Method, Paid_Amt) VALUES ($1, $2, $3) RETURNING *',
      [Customer_Email, Pay_Method, Paid_Amt]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new customer to database:', err);
    return NextResponse.json({ error: 'Failed to add new customer' }, { status: 500 });
  }
}
