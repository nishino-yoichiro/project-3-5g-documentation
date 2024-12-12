import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the total number of card sales for the current day.
 * The total number of card sales is calculated by counting the orders in the Order_History table
 * where the payment method is 'Card' and the order date is the current date.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the total number of card sales in JSON format.
 */
export async function GET() {
    const query = `
    SELECT COUNT(*) AS total_card
    FROM Order_History oh
    JOIN customer c ON oh.customer_id = c.customer_id
    WHERE c.pay_method = 'Card'
    AND oh.date_time::date = CURRENT_DATE;
  `;
  
    try {
    const { rows } = await pool.query(query);

    const totalCardSales = rows[0]?.total_card || 0;

    return NextResponse.json({ rows: [{ total_card: totalCardSales }] });
  } catch (error) {
    console.error('Error fetching total card sales:', error);

    return NextResponse.json({ error: 'Failed to fetch total card sales.' }, { status: 500 });
  }
}