import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

/**
 * Handles the GET request to fetch the inventory items that need to be restock.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the total number of repeat customers in JSON format.
 */
export async function GET() {
    const query = `
        SELECT * FROM inventory WHERE Stock_Amt < Use_Per_Month ORDER BY Inventory_Id
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        // Return the result as JSON using NextResponse
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching total repeat customers from database:', err);

        // Handle errors gracefully using NextResponse
        return NextResponse.json({ error: 'Failed to fetch total repeat customers' }, { status: 500 });
    }
}