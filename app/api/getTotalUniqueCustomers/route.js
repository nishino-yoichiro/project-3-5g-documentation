import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the total number of unique customers for the current day.
 * The total number of unique customers is calculated by counting the distinct customer emails
 * in the Order_History table for the current date.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the total number of unique customers in JSON format.
 */
export async function GET() {
    const query = `
        SELECT COUNT(DISTINCT c.customer_email) AS total_unique_customers
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE oh.date_time::date = CURRENT_DATE
    `;

    try {
        const client = await pool.connect();
        const { rows } = await client.query(query);
        client.release();

        // Return the result as JSON using NextResponse
        return NextResponse.json({ rows });
    } catch (error) {
        console.error('Error fetching total unique customers from database:', err);

        // Handle errors gracefully using NextResponse
        return NextResponse.json({ error: 'Failed to fetch total unique customers' }, { status: 500 });
  }
}