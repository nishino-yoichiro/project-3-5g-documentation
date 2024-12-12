import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to generate the X report.
 * The X report provides a summary of sales by hour for the current day, including total sales and breakdown by payment method.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the X report data in JSON format.
 */
export async function GET() {
  const query = `
    SELECT EXTRACT(HOUR FROM oh.Date_Time) AS hour,
      SUM(oh.price) AS total_sales,
      SUM(CASE WHEN c.Pay_Method = 'Card' THEN oh.price ELSE 0 END) AS card_total,
      SUM(CASE WHEN c.Pay_Method = 'Retail Swipe' THEN oh.price ELSE 0 END) AS retail_swipe_total,
      SUM(CASE WHEN c.Pay_Method = 'Dining Dollars' THEN oh.price ELSE 0 END) AS dining_dollars_total,
      SUM(CASE WHEN c.Pay_Method = 'Cash' THEN oh.price ELSE 0 END) AS cash_total
    FROM Order_History oh
    JOIN Customer c ON oh.Customer_Id = c.Customer_Id
    WHERE oh.Date_Time >= CURRENT_DATE
    GROUP BY EXTRACT(HOUR FROM oh.Date_Time)
    ORDER BY hour
  `;

  try {
    const client = await pool.connect();
    const { rows } = await client.query(query);
    client.release();

    // Return the result as JSON using NextResponse (this fixed the issue, but why?)
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching X report:', error);

    // Handle errors gracefully using NextResponse
    return NextResponse.json({ error: 'Failed to fetch X report.' }, { status: 500 });
  }
}