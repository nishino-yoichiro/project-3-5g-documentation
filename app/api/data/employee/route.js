// app/api/data/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

/**
 * Handles the GET request to fetch all Employee data.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing all inventory items in JSON format.
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM employee ORDER BY employee_id ASC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching data from database:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

/**
 * Handles the PUT request to update an existing employee in the employee table.
 * The employee is updated with the provided employee ID, employee name, manager ID, SSN, DOB, phone number, salary, email, and password.
 * 
 * @param {Request} req - The incoming request object containing the employee details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the update operation.
 */
export async function PUT(req) {
  try {
    const { employee_id, employee_name, manager_id, ssn, dob, phone_num, salary, email, pword } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE employee SET employee_name = $1, manager_id = $2, ssn = $3, dob = $4, phone_num = $5, salary = $6, email = $7, pword = $8 WHERE employee_id = $9',
      [employee_name, manager_id, ssn, dob, phone_num, salary, email, pword, employee_id]
    );
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating data in database:', err);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

/**
 * Handles the POST request to add a new employee to the employee table.
 * The new employee is added with the provided employee name, manager ID, SSN, DOB, phone number, salary, email, and password.
 * The added employee is returned in the response.
 * 
 * @param {Request} req - The incoming request object containing the employee details.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the added employee data in JSON format.
 */
export async function POST(req) {
  try {
    const { employee_name, manager_id, ssn, dob, phone_num, salary, email, pword } = await req.json();
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO employee (employee_name, manager_id, ssn, dob, phone_num, salary, email, pword) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [employee_name, manager_id, ssn, dob, phone_num, salary, email, pword]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new employee to database:', err);
    return NextResponse.json({ error: 'Failed to add new employee' }, { status: 500 });
  }
}

/**
 * Handles the DELETE request to delete an existing employee from the employee table.
 * The employee is deleted based on the provided employee ID.
 * 
 * @param {Request} req - The incoming request object containing the employee ID.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object indicating the success of the delete operation.
 */
export async function DELETE(req) {
  try {
    const { employee_id } = await req.json();
    const client = await pool.connect(); // Estbaslish a connection to the database
    const result = await client.query('DELETE FROM employee WHERE employee_id = $1', [employee_id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting employee from database:', err);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}