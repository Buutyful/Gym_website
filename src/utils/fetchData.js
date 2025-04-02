// src/utils/fetchData.js

// Options for the ExerciseDB API
export const exerciseOptions = {
    method: 'GET',
    headers: {
        // Ensure REACT_APP_RAPID_API_KEY is set correctly in your .env file
        // and you have restarted your development server.
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
};

// Options for the YouTube Search and Download API
export const youtubeOptions = {
    method: 'GET',
    headers: {
        // Ensure REACT_APP_RAPID_API_KEY is set correctly in your .env file
        // and you have restarted your development server.
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
        'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    }
};

/**
 * Fetches data from a given URL with specified options.
 * Handles basic error checking for the fetch operation.
 * @param {string} url - The URL to fetch data from.
 * @param {object} options - The options object for the fetch request (e.g., method, headers).
 * @returns {Promise<any|null>} - A promise that resolves with the JSON data, or null if an error occurs.
 */
export const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);

        // Check if the response status indicates success (e.g., 200-299)
        if (!response.ok) {
            // Throw an error with the HTTP status to be caught below
            // This handles errors like 403 Forbidden, 429 Too Many Requests, 404 Not Found, etc.
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response body
        const data = await response.json();
        return data;

    } catch (error) {
        // Log the specific error encountered during the fetch process
        console.error("Error fetching data:", error);

        // Return null to indicate failure, allowing calling components to handle it
        // (e.g., by checking if the result is null or not an array)
        return null;
    }
};