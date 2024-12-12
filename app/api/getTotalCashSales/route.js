import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the total number of cash sales for the current day.
 * The total number of cash sales is calculated by counting the orders in the Order_History table
 * where the payment method is 'Cash' and the order date is the current date.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the total number of cash sales in JSON format.
 */
export async function GET() {
    const query = `
        SELECT COUNT(*) AS total_cash
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.pay_method = 'Cash'
        AND oh.date_time::date = CURRENT_DATE
    `;

  try {
    const client = await pool.connect();
    const { rows } = await client.query(query);
    client.release();

    // Return the result as JSON using NextResponse
    return NextResponse.json({ rows });
  } catch (error) {
    console.error('Error fetching total cash sales from database:', err);

    // Handle errors gracefully using NextResponse
    return NextResponse.json({ error: 'Failed to fetch total cash sales' }, { status: 500 });
  }
}