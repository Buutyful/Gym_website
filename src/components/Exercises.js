// src/components/Exercises.js

import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Box, Stack, Typography } from '@mui/material';

// Ensure these imports are correct relative to this file's location
import ExerciseCard from './ExerciseCard';
import { exerciseOptions, fetchData } from '../utils/fetchData';

// Define types for props and state for better code clarity and safety (optional but recommended)
// interface Exercise {
//   id: string;
//   name: string;
//   // ... other properties of your exercise object
// }
//
// interface ExercisesProps {
//   exercises: Exercise[];
//   setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
//   bodyPart: string;
// }

const Exercises = ({ exercises, setExercises, bodyPart }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const exercisesPerPage = 9; // Or any number you prefer

    // Calculate exercises for the current page
    // Ensure 'exercises' is an array before slicing to prevent errors
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = Array.isArray(exercises)
        ? exercises.slice(indexOfFirstExercise, indexOfLastExercise)
        : []; // Default to empty array if exercises is not an array

    // Handler for pagination changes
    const paginate = (event, value) => {
        setCurrentPage(value);
        // Scroll to the top of the exercises section smoothly
        window.scrollTo({ top: 1800, behavior: 'smooth' }); // Adjust scroll target if needed
    };

    // Effect hook to fetch exercises when the selected bodyPart changes
    useEffect(() => {
        const fetchExercisesData = async () => {
            // Determine the API endpoint based on the selected body part
            const url = (bodyPart === 'all')
                ? 'https://exercisedb.p.rapidapi.com/exercises'
                : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;

            console.log(`Fetching exercises from: ${url}`); // Log which URL is being fetched

            try {
                // Use the fetchData utility with appropriate options
                const exerciseData = await fetchData(url, exerciseOptions);

                // *** Crucial Check ***: Verify the fetched data is an array
                if (Array.isArray(exerciseData)) {
                    console.log("Successfully fetched exercises:", exerciseData);
                    setExercises(exerciseData); // Update the state with fetched data
                } else {
                    // Handle cases where fetchData returned null (due to fetch error)
                    // or the API response was not an array as expected
                    console.error("Failed to fetch exercises or API response format is invalid.", exerciseData);
                    setExercises([]); // Set to empty array to clear previous results and prevent errors
                }
            } catch (error) {
                // This catch block might be redundant if fetchData always returns null on error,
                // but it's safe to keep for unexpected issues.
                console.error("Unexpected error in fetchExercisesData:", error);
                setExercises([]); // Ensure state is cleared on unexpected errors
            } finally {
                // Optional: Reset current page to 1 when the body part changes or data is fetched/failed
                // setCurrentPage(1); // Uncomment if you want pagination to reset on bodyPart change
            }
        };

        fetchExercisesData();
        // Dependency array: re-run the effect when bodyPart changes
        // setExercises is generally stable and doesn't need to be included,
        // but adding it satisfies exhaustive-deps linting if needed.
    }, [bodyPart/*, setExercises*/]); // Only re-fetch when bodyPart changes

    // Render the component
    return (
        <Box id="exercises" sx={{ mt: { lg: '110px', xs: '50px' } }} p="20px">
            <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="46px" textAlign="center">
                Showing Results
            </Typography>
            <Stack direction="row" sx={{ gap: { lg: '107px', xs: '50px' } }} flexWrap="wrap" justifyContent="center">
                {/* Map over the exercises calculated for the *current page* */}
                {currentExercises.length > 0 ? (
                    currentExercises.map((exercise, index) => (
                        <ExerciseCard key={exercise.id || index} exercise={exercise} /> // Use exercise.id if available and unique
                    ))
                ) : (
                    // Optional: Display a message if no exercises are found or loaded
                    <Typography>No exercises found.</Typography>
                )}
            </Stack>
            <Stack sx={{ mt: { lg: '114px', xs: '70px' } }} alignItems="center">
                {/* Render pagination only if there are exercises and more than one page */}
                {Array.isArray(exercises) && exercises.length > exercisesPerPage && (
                    <Pagination
                        color="standard" // Or "primary" or "secondary" based on your theme
                        shape="rounded"
                        defaultPage={1} // Initial page
                        count={Math.ceil(exercises.length / exercisesPerPage)} // Total number of pages
                        page={currentPage} // Controlled component: current page state
                        onChange={paginate} // Handler for page changes
                        size="large"
                    />
                )}
            </Stack>
        </Box>
    );
};

export default Exercises;