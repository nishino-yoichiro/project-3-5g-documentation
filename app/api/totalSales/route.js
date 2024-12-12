import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the total sales for the current day.
 * The total sales are calculated by summing the prices of all orders in the Order_History table for the current date.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the total sales in JSON format.
 */
export async function GET() {
  try {
    // Query the database to calculate total sales for today
    const query = `
      SELECT SUM(price) AS total_sales
      FROM Order_History
      WHERE date_time::date = CURRENT_DATE;
    `;
    const { rows } = await pool.query(query);

    // Extract the total sales from the query result
    const totalSales = rows[0]?.total_sales || 0;

    // Return the result as JSON using NextResponse
    return NextResponse.json({ rows: [{ total_sales: totalSales }] });
  } catch (error) {
    console.error('Error fetching total sales:', error);

    // Handle errors gracefully using NextResponse
    return NextResponse.json({ error: 'Failed to fetch total sales.' }, { status: 500 });
  }
}