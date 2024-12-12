// app/api/data/inventory/update_stock.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch all inven_name from inventory_menu given a menu_id.
 * 
 * @param {Request} req - The incoming request object containing the menu_id.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the inven_name in JSON format.
 */
export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const menu_id = searchParams.get('menu_id');
  
      if (!menu_id) {
        return NextResponse.json({ error: 'menu_id is required' }, { status: 400 });
      }
  
      const client = await pool.connect();
      console.log('Database connection established');
  
      const query = 'SELECT inventory_id FROM inventory_menu WHERE menu_id = $1';
      const values = [menu_id];
      console.log('Executing query:', query, 'with values:', values);
  
      const result = await client.query(query, values);
      client.release();
      console.log('Fetched inven_name:', result.rows);
  
      return NextResponse.json(result.rows);
    } catch (err) {
      console.error('Error fetching inven_name from database:', err);
      return NextResponse.json({ error: 'Failed to fetch inven_name' }, { status: 500 });
    }
  }

/**
 * Handles the PUT request to update the stock amount of an inventory item.
 * The stock amount is decreased by the specified amount for the given inventory name.
 * 
 * @param {Request} req - The incoming request object containing the inventory name and amount.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function PUT(req) {
  try {
    const { inventory_id, amount } = await req.json();
    console.log('Received data for updating stock:', { inventory_id, amount });

    const client = await pool.connect();
    console.log('Database connection established');

    // Update the stock amount
    const query = 'UPDATE inventory SET stock_amt = stock_amt - $1 WHERE inventory_id = $2 RETURNING *';
    const values = [amount, inventory_id];
    console.log('Executing query:', query, 'with values:', values);

    const result = await client.query(query, values);
    client.release();
    console.log('Stock amount updated:', result.rows[0]);

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating stock amount in database:', err);
    return NextResponse.json({ error: 'Failed to update stock amount' }, { status: 500 });
  }
}