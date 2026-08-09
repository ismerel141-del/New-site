const API_KEY = 'a83a16584e228d5eaaa7f34ada3c3566''; 
const BASE_URL = 'https://themoviedb.org';
const IMG_URL = 'https://tmdb.org';

// Download trending data when the page opens
window.onload = () => {
    getTrendingMovies();
};

function getTrendingMovies() {
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            setupHeroBanner(data.results[0]);
            displayMovies(data.results);
        });
}

function setupHeroBanner(movie) {
    const banner = document.getElementById('heroBanner');
    banner.style.backgroundImage = `linear-gradient(to top, #0b0c10, transparent), url('https://tmdb.org{movie.backdrop_path}')`;
    document.getElementById('heroTitle').innerText = movie.title;
    document.getElementById('heroOverview').innerText = movie.overview.substring(0, 150) + '...';
}

function displayMovies(movies) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = '';

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span style="color: #ffc107;">★ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}
