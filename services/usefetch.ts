// this hook will allow us to handle the API key request without clustering the components by abstracting the away the logic for fetching the data, managing loading states, and handling errors. and it will even provide us the way to manually trigger a readonly when needed

// import { useEffect, useState } from "react"

// the useFetch hook will take a fetchFunction as a parameter

// and the fetchFunction can be fetchMovies, can be fetchTVShows, or can be fetchMovieDetais, or any other function that returns a promise

//<T> is a generic type parameter that allows us to specify the type of data that the fetchFunction will return. This makes the hook flexible and reusable for different types of data.
import { useEffect, useState } from "react"

// ✅ Custom hook: useFetch
// - Takes a fetch function as a parameter
// - That fetch function must return a Promise (e.g., fetchMovies, fetchTVShows, etc.)
// - <T> = Generic type → allows this hook to work with ANY data type returned by the fetch function

// autoFetch:boolean = controls whether the hook should call fetch automatically when mounted
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch: boolean =  true) => {
    // State variables
    const [data, setData] = useState<T | null>(null) // Store the fetched data (can be null initially)
    const [loading, setLoading] = useState(false)    // Boolean → true when fetching is in progress
    const [error, setError] = useState<Error | null>(null) // Stores error if something goes wrong

    // ✅ Core function to fetch data
    const fetchData = async () => {
        try {
            setLoading(true)   // Start loading
            setError(null)     // Reset any previous error

            const result = await fetchFunction() // Call the passed fetch function
            // await → pauses until fetchFunction() resolves
            setData(result)    // Save the fetched data in state
            console.log("useFetch result:", result);

        } catch (err) {
            // If error is instance of Error → use it, else create a new Error
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            // finally → runs no matter success or failure
            setLoading(false); // Stop loading
        }
    }

    // ✅ Function to reset state (clear all data)
    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }

    // ✅ Side effect: automatically fetch data on component mount if autoFetch is true
    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
        // Empty dependency array [] → runs only once on mount
    }, []);

    // ✅ Return values so the component using this hook can access them
    return {
        data,        // The actual fetched data
        loading,     // Loading state
        error,       // Any error that occurred
        refetch: fetchData, // Function to manually trigger fetch again
        reset        // Function to reset state
    };
};

export default useFetch;