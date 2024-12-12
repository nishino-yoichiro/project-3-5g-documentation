// app/api/menu_items/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the POST request to update an existing order item in the Order_Items table.
 * The order item is updated with the provided order ID, order item, and price.
 * The updated order item is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the order item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the updated order item data in JSON format.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const menuItemId = searchParams.get('menuItemName');

  if (!menuItemId) {
    return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 });
  }

  const query = `
    SELECT menu_id
    FROM menu_items
    WHERE menu_name = $1
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query, [menuItemId]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching menu item details from database:', err);
    return NextResponse.json({ error: 'Failed to fetch menu item details' }, { status: 500 });
  }
}

/**
 * Handles the POST request to update an existing order item in the Order_Items table.
 * The order item is updated with the provided order ID, order item, and price.
 * The updated order item is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the order item details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the updated order item data in JSON format.
 */
export async function POST(req) {
    try {
      const { menu_item_id, rating, comment } = await req.json();
  
      if (!menu_item_id || !rating) {
        return NextResponse.json({ error: 'Menu item ID and rating are required' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO reviews (menu_item_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
        [menu_item_id, rating, comment]
      );
      client.release();
      return NextResponse.json(result.rows[0]);
    } catch (err) {
      console.error('Error adding review to database:', err);
      return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
  }