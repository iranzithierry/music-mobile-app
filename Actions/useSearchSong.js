import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useSearchSong(searchQuery) {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [errorSearching, setErrorSearching] = useState(null);

    useEffect(() => {
        if (searchQuery && searchQuery.length > 2) {
            const fetchData = async () => {
                setIsSearching(true);
                try {
                    const formData = new FormData();
                    formData.append('user_input', searchQuery);

                    const response = await axios.post('http://127.0.0.1:8000/request', formData);

                    setSearchResults(response.data);
                } catch (err) {
                    setErrorSearching(err.message);
                } finally {
                    setIsSearching(false);
                }
            };

            fetchData();
        }
    }, [searchQuery]);

    return { searchResults, isSearching, errorSearching, setIsSearching, setErrorSearching };
}