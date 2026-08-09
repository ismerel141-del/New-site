const API_KEY = 'a83a16584e228d5eaaa7f34ada3c3566'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://tmdb.org';

window.onload = () => {
    // Show a message to prove JavaScript has actually started running
    const statusText = document.getElementById('heroOverview');
    if (statusText) statusText.innerText = "JavaScript Engine Started. Pinging database servers...";
    
    getTrendingMovies();
};

function getTrendingMovies() {
    const statusText = document.getElementById('heroOverview');
    
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Server returned code: ${res.status}. Your API Key might be invalid or suspended.`);
            }
            return res.json();
        })
        .then(data => {
            if (data && data.results && data.results.length > 0) {
                setupHeroBanner(data.results[0]); // Fixed: Targets first movie correctly
                displayMovies(data.results);
            } else {
                throw new Error("Connection successful, but the server returned zero movies.");
            }
        })
        .catch(err => {
            console.error(err);
            // INJECT ERROR DIRECTLY ON SCREEN
            if (statusText) {
                statusText.style.color = "#ff4d4d";
                statusText.innerHTML = `<strong>⚠️ CRITICAL ERROR DETECTED:</strong><br>${err.message}<br><br><em>Tip: Open an Incognito Tab or check if your API Key matches TMDB exactly.</em>`;
            }
            const title = document.getElementById('heroTitle');
            if (title) title.innerText = "App Failed to Load";
        });
}

function setupHeroBanner(movie) {
    const banner = document.getElementById('heroBanner');
    if (!banner || !movie) return;

    banner.style.backgroundImage = `url('${IMG_URL}${movie.backdrop_path}')`;
    document.getElementById('heroTitle').innerText = movie.title;
    document.getElementById('heroOverview').innerText = movie.overview ? movie.overview.substring(0, 140) + '...' : '';
    
    const playBtn = document.getElementById('heroPlayBtn');
    if (playBtn) playBtn.onclick = () => playMovieTrailer(movie.id, movie.title);
}

function displayMovies(movies) {
    const grid = document.getElementById('movieGrid');
    if (!grid) return;
    grid.innerHTML = '';

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
                // FIXED: Using precise template strings so it opens a real YouTube link
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
