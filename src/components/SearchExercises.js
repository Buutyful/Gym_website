import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { exerciseOptions, fetchData } from '../utils/fetchData'; // Ensure this path is correct
import HorizontalScrollbar from './HorizontalScrollbar';       // Ensure this path is correct

// Props definition for clarity (optional but good practice)
// interface SearchExercisesProps {
//   setExercises: React.Dispatch<React.SetStateAction<any[]>>; // Replace 'any' with your Exercise type if available
//   bodyPart: string;
//   setBodyPart: React.Dispatch<React.SetStateAction<string>>;
// }

// Component: SearchExercises
// Removed the mistakenly included index.js code here.
const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
    const [search, setSearch] = useState('');
    const [bodyParts, setBodyParts] = useState([]); // Initialize as empty array

    // --- Fetch Body Parts on Initial Mount ---
    useEffect(() => {
        const fetchBodyPartsData = async () => { // Renamed for clarity
            try {
                console.log("Attempting to fetch body parts list...");
                const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);

                // *** IMPORTANT: Check if data is valid before setting state ***
                if (Array.isArray(bodyPartsData)) {
                    console.log("Successfully fetched body parts:", bodyPartsData);
                    setBodyParts(['all', ...bodyPartsData]);
                } else {
                    console.error("Failed to fetch body parts or response is not an array:", bodyPartsData);
                    // Set a default or empty state to prevent errors down the line
                    setBodyParts(['all']);
                }
            } catch (error) {
                console.error("Error fetching body parts data:", error);
                // Set a default or empty state in case of fetch error
                setBodyParts(['all']);
            }
        };

        fetchBodyPartsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array means this runs once on mount

    // --- Handle Search Action ---
    const handleSearch = async () => {
        if (search) {
            try {
                console.log(`Attempting to fetch exercises for search term: "${search}"`);
                // Fetch *all* exercises first (consider fetching filtered exercises if API supports it)
                const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

                // *** IMPORTANT: Check if data is valid before filtering ***
                if (Array.isArray(exercisesData)) {
                    console.log("Successfully fetched all exercises for filtering.");
                    const searchedExercises = exercisesData.filter(
                        (item) => item.name.toLowerCase().includes(search)
                            || item.target.toLowerCase().includes(search)
                            || item.equipment.toLowerCase().includes(search)
                            || item.bodyPart.toLowerCase().includes(search),
                    );

                    console.log(`Found ${searchedExercises.length} exercises matching the search.`);
                    setSearch(''); // Clear search input
                    setExercises(searchedExercises); // Update the exercises state in the parent component

                    // Scroll to results section
                    window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });

                } else {
                    console.error("Failed to fetch exercises or response is not an array:", exercisesData);
                    setExercises([]); // Clear exercises if fetch failed
                }
            } catch (error) {
                console.error("Error fetching exercises data during search:", error);
                setExercises([]); // Clear exercises if fetch failed
            }
        } else {
            // Optional: Handle empty search input case (e.g., show a message)
            console.log("Search input is empty.");
        }
    };

    // --- Render Component ---
    return (
        <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
            <Typography fontWeight={700} sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="49px" textAlign="center">
                Awesome Exercises You <br /> Should Know
            </Typography>
            <Box position="relative" mb="72px">
                <TextField
                    height="76px"
                    sx={{ input: { fontWeight: '700', border: 'none', borderRadius: '4px' }, width: { lg: '1170px', xs: '350px' }, backgroundColor: '#fff', borderRadius: '40px' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    placeholder="Search Exercises"
                    type="text"
                    onKeyPress={(e) => { // Optional: Allow search on Enter key
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <Button className="search-btn" sx={{ bgcolor: '#FF2625', color: '#fff', textTransform: 'none', width: { lg: '173px', xs: '80px' }, height: '56px', position: 'absolute', right: '0px', fontSize: { lg: '20px', xs: '14px' } }} onClick={handleSearch}>
                    Search
                </Button>
            </Box>
            <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
                {/* Pass the potentially limited bodyParts array */}
                <HorizontalScrollbar data={bodyParts} bodyParts setBodyPart={setBodyPart} bodyPart={bodyPart} isBodyParts />
            </Box>
        </Stack>
    );
};

export default SearchExercises;