const API_KEY = 'a83a16584e228d5eaaa7f34ada3c3566'; 
const BASE_URL = 'https://themoviedb.org';
const IMG_URL = 'https://tmdb.org';

window.onload = () => {
    getTrendingMovies();
    setupEventListeners();
};

function setupEventListeners() {
    document.getElementById('searchBtn').onclick = handleSearch;
    
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

function getTrendingMovies() {
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                setupHeroBanner(data.results[0]); // Fix: target first movie item for banner
                displayMovies(data.results);
            }
        })
        .catch(err => console.error('Fetch Error:', err));
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    document.getElementById('sectionTitle').innerText = `Search Results for "${query}"`;

    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if (data.results) {
                displayMovies(data.results);
            }
        })
        .catch(err => console.error('Search error:', err));
}

function setupHeroBanner(movie) {
    const banner = document.getElementById('heroBanner');
    if (!banner || !movie) return;

    banner.style.backgroundImage = `url('https://tmdb.org{movie.backdrop_path}')`;
    document.getElementById('heroTitle').innerText = movie.title;
    document.getElementById('heroOverview').innerText = movie.overview ? movie.overview.substring(0, 140) + '...' : '';
    
    // Bind Android-proof link to Hero action button
    document.getElementById('heroPlayBtn').onclick = () => playMovieTrailer(movie.id, movie.title);
}

function displayMovies(movies) {
    const grid = document.getElementById('movieGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (movies.length === 0) {
        grid.innerHTML = `<p style="padding: 20px; color: #888;">No results found.</p>`;
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return; 
        
        const card = document.createElement('div');
        card.classList.add('movie-card');
        
        // Pass title as a backup search term
        card.onclick = () => playMovieTrailer(movie.id, movie.title);

        card.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" loading="lazy">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span style="color: #ffc107; font-size: 0.85rem;">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ANDROID DIRECT-APP ROUTING LAUNCHER
function playMovieTrailer(movieId, movieTitle) {
    fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            // Locate video components
            const video = data.results.find(v => v.site === 'YouTube');
            
            if (video && video.key) {
                // Instantly opens deep link to launch Android's native YouTube app player
                window.open(`https://youtube.com{video.key}`, '_blank');
            } else {
                // Absolute fallback: executes title query keyword optimization search if key doesn't load
                const searchQuery = encodeURIComponent(`${movieTitle} official trailer`);
                window.open(`https://youtube.com{searchQuery}`, '_blank');
            }
        })
        .catch(err => {
            console.error('Trailer error:', err);
            // General query fallback link if API completely fails on mobile
            const searchQuery = encodeURIComponent(`${movieTitle} official trailer`);
            window.open(`https://youtube.com{searchQuery}`, '_blank');
        });
}
