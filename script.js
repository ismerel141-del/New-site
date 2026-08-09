const API_KEY = 'a83a16584e228d5eaaa7f34ada3c3566'; 
const BASE_URL = 'https://themoviedb.org';
const IMG_URL = 'https://tmdb.org';

window.onload = () => {
    getTrendingMovies();
    setupEventListeners();
};

function setupEventListeners() {
    const btn = document.getElementById('searchBtn');
    if (btn) btn.onclick = handleSearch;
    
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

function getTrendingMovies() {
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.results && data.results.length > 0) {
                setupHeroBanner(data.results[0]); 
                displayMovies(data.results);
            }
        })
        .catch(err => console.error('Fetch error:', err));
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    const titleNode = document.getElementById('sectionTitle');
    if (titleNode) titleNode.innerText = `Search Results for "${query}"`;

    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.results) {
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
    document.getElementById('heroOverview').innerText = movie.overview ? movie.overview.substring(0, 120) + '...' : '';
    
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
        card.onclick = () => playMovieTrailer(movie.id, movie.title);

        card.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span style="color: #ffc107; font-size: 0.8rem;">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function playMovieTrailer(movieId, movieTitle) {
    fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const video = data.results && data.results.find(v => v.site === 'YouTube');
            if (video && video.key) {
                window.open(`https://youtube.com{video.key}`, '_blank');
            } else {
                const query = encodeURIComponent(`${movieTitle} official trailer`);
                window.open(`https://youtube.com{query}`, '_blank');
            }
        })
        .catch(() => {
            const query = encodeURIComponent(`${movieTitle} official trailer`);
            window.open(`https://youtube.com{query}`, '_blank');
        });
}
