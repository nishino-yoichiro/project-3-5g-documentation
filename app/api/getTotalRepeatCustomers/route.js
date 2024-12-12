import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the total number of repeat customers for the current day.
 * The total number of repeat customers is calculated by counting the distinct customer emails
 * in the Order_History table for the current date where the customer has made more than one order.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the total number of repeat customers in JSON format.
 */
export async function GET() {
    const query = `
        SELECT COUNT(DISTINCT c.customer_email) AS repeat_customers
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.customer_email IN (
            SELECT c2.customer_email
            FROM Order_History oh2
            JOIN customer c2 ON oh2.customer_id = c2.customer_id
            WHERE oh2.date_time::date = CURRENT_DATE
            GROUP BY c2.customer_email
            HAVING COUNT(oh2.customer_id) > 1
        )
    `;

    try {
        const client = await pool.connect();
        const { rows } = await client.query(query);
        client.release();

        // Return the result as JSON using NextResponse
        return NextResponse.json({ rows });
    } catch (error) {
        console.error('Error fetching total repeat customers from database:', err);

        // Handle errors gracefully using NextResponse
        return NextResponse.json({ error: 'Failed to fetch total repeat customers' }, { status: 500 });
    }
}