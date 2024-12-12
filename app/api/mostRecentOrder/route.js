import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the most recent customer order from the Customer table.
 * The most recent order is determined by the highest Customer_Id.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the most recent order data in JSON format.
 */
export async function GET() {
    const query = `
        SELECT *
        FROM Customer 
        Order By Customer_Id DESC
        LIMIT 1;
    `;

    try {
        const client = await pool.connect();
        const { rows } = await client.query(query);
        client.release();

        // Return the result as JSON using NextResponse
        return NextResponse.json({ rows });
    } catch (error) {
        console.error('Error fetching most recent order from database:', err);

        // Handle errors gracefully using NextResponse
        return NextResponse.json({ error: 'Failed to fetch most recent order' }, { status: 500 });
    }
}