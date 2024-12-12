import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the total number of dining dollars sales for the current day.
 * The total number of dining dollars sales is calculated by counting the orders in the Order_History table
 * where the payment method is 'Dining Dollars' and the order date is the current date.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the total number of dining dollars sales in JSON format.
 */
export async function GET() {
    const query = `
        SELECT COUNT(*) AS total_dining_dollars
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.pay_method = 'Dining Dollars'
        AND oh.date_time::date = CURRENT_DATE
    `;

  try {
    const client = await pool.connect();
    const { rows } = await client.query(query);
    client.release();

    // Return the result as JSON using NextResponse
    return NextResponse.json({ rows });
  } catch (error) {
    console.error('Error fetching total dining dollars sales from database:', err);

    // Handle errors gracefully using NextResponse
    return NextResponse.json({ error: 'Failed to fetch total dining dollars sales' }, { status: 500 });
  }
}