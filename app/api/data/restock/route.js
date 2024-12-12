import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the PUT request to restock an existing item in the inventory table.
 * The stock amount is updated with the provided inventory ID and restocking amount.
 * 
 * @param {Request} req - The incoming request object containing the restocking details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the restocking operation.
 */
export async function PUT(req) {
  try {
    const { inventory_id, amount_restocking, employee_id } = await req.json();

    const client = await pool.connect();
    console.log('Database connection established');

    const result = await client.query(
      'UPDATE inventory SET stock_amt = stock_amt + $1, employee_id = $2 WHERE inventory_id = $3 RETURNING *',
      [amount_restocking, employee_id, inventory_id]
    );

    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error restocking inventory item in database:', err);
    return NextResponse.json({ error: 'Failed to restock inventory item' }, { status: 500 });
  }
}