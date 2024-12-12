import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch the average rating for a specific menu item.
 * 
 * @param {Request} req - The incoming request object containing the menu item ID as a query parameter.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the average rating in JSON format.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const menuItemId = searchParams.get('menuItemId');

  if (!menuItemId) {
    return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 });
  }

  const query = `
    SELECT AVG(rating) as average_rating
    FROM reviews
    WHERE menu_item_id = $1
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query, [menuItemId]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No ratings found for this menu item' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching average rating from database:', err);
    return NextResponse.json({ error: 'Failed to fetch average rating' }, { status: 500 });
  }
}