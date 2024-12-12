import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

/**
 * Handles the POST request to fetch the order count for each menu item within a specified date range.
 * The order count is calculated by counting the occurrences of each menu item in the Order_Items table
 * within the specified date range.
 * 
 * @param {Request} req - The incoming object with startDate and endDate for our queries.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the order count data in JSON format.
 */
export async function POST(req) {
  try {
    // Parse the request body
    const { startDate, endDate } = await req.json();

    // Validate the input
    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required.' }, { status: 400 });
    }

    // SQL query
    const query = `
      SELECT mi.Menu_Name, COUNT(oi.Order_Item) AS order_count
      FROM Menu_Items mi
      LEFT JOIN Order_Items oi ON mi.Menu_Name = oi.Order_Item
      LEFT JOIN Order_History oh ON oi.Order_Id = oh.Order_Id
      WHERE oh.Date_Time >= $1 AND oh.Date_Time <= $2
      GROUP BY mi.Menu_Name
      ORDER BY order_count DESC
    `;

    // Execute the query with parameterized input
    const { rows } = await pool.query(query, [startDate, endDate]);
    // console.log('Query result:', rows); // Debug query result

    // Return the query result using NextResponse
    return NextResponse.json({ rows });
  } catch (error) {
    console.error('Error in salesByItems API route:', error); // Log the error
    return NextResponse.json({ error: 'Failed to fetch sales by items.' }, { status: 500 });
  }
}