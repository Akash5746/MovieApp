// TMDB API configuration object
const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3', // The base URL for all TMDB API endpoints
    
    API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY, // Your TMDB API key (loaded from environment variables for security)

    headers: {
        accept: 'application/json', // We want the response in JSON format
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`, 
        // TMDB requires Bearer token authentication
    }
}


// Async function that fetches movies (search or discover)
export const fetchMovies = async ({ query }: { query: string }) => {
    // async → tells JS that this function will handle asynchronous operations (like fetch)

    // Decide the endpoint:
    // If a query is provided → use "search/movie"
    // If not → use "discover/movie"
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        // encodeURIComponent → encodes special characters (like spaces, &, ?, etc.)
        // into a URL-safe format, so the API request doesn't break.
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    // Fetch data from the endpoint
    const response = await fetch(endpoint, {
        // await → pauses the execution of this line until the fetch() promise resolves
        // Without await, response would just be a pending promise.
        method: 'GET', // HTTP method: GET (used to retrieve data)
        headers: TMDB_CONFIG.headers, // Pass our auth headers
    });

    // If the response is not OK (status code not 200-299)
    if (!response.ok) {
        // Throw an error so we can catch it in our app
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
        // response.statusText → gives error message from the server (like "Unauthorized", "Not Found")
    }

    // Convert response into JSON
    const data = await response.json();
    // again await → waits until the JSON body is fully parsed

    // Return only the "results" array from TMDB's response
    return data.results;
    console.log("useFetch result:", data.result);
};

// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OWRmZWMzZTZiNGJmZmM0MzFlZjdlMTM3NDgxMTM3NiIsIm5iZiI6MTc1Njg0Mzc5OC43MzksInN1YiI6IjY4Yjc0ZjE2OGIxYWQyODQ0OTNjZGU5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-KqJLubqy7P3jXAkjDSiyacRTf88053g3JjgE88QdLQ'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));