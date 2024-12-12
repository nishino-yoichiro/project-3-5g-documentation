import { NextResponse } from 'next/server';
import axios from 'axios';
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;
const DEFAULT_CITY_ID = '4682464'; // Default city as College Station

/**
 * Handles the GET request to generate the X report.
 * The X report provides a summary of sales by hour for the current day, including total sales and breakdown by payment method.
 * 
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the X report data in JSON format.
 */
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    let city_id = DEFAULT_CITY_ID;

    // If city is provided, get city ID first
    if (city) {
        try {
            // get city ID based on city name
            const cityResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            city_id = cityResponse.data.id;
        } catch (err) {
            console.error('Error fetching city ID:', err);
            return NextResponse.json({ error: 'Failed to fetch city ID' }, { status: 500 });
        }
    }

    // Construct weather API URL
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?id=${city_id}&appid=${API_KEY}&units=imperial`;

    // Fetch weather data
    try {
        const response = await axios.get(WEATHER_URL);
        // console.log('Weather data:', response.data);
        return NextResponse.json(response.data);
    } catch (err) {
        console.error('Error fetching weather data:', err);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
}