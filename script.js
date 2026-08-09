const API_KEY = 'a83a16584e228d5eaaa7f34ada3c3566'; 
const BASE_URL = 'https://themoviedb.org';
const IMG_URL = 'https://tmdb.org';

window.onload = function() {
    getTrendingMovies();
    setupEventListeners();
};

function setupEventListeners() {
    var btn = document.getElementById('searchBtn');
    if (btn) btn.onclick = handleSearch;
    
    var input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

function getTrendingMovies() {
    fetch(BASE_URL + '/trending/movie/week?api_key=' + API_KEY)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data.results && data.results.length > 0) {
                setupHeroBanner(data.results[0]); 
                displayMovies(data.results);
            }
        })
        .catch(function(err) { console.error(err); });
}

function handleSearch() {
    var query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    var titleNode = document.getElementById('sectionTitle');
    if (titleNode) titleNode.innerText = 'Search Results for "' + query + '"';

    fetch(BASE_URL + '/search/movie?api_key=' + API_KEY + '&query=' + encodeURIComponent(query))
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data.results) {
                displayMovies(data.results);
            }
        })
        .catch(function(err) { console.error(err); });
}

function setupHeroBanner(movie) {
    var banner = document.getElementById('heroBanner');
    if (!banner || !movie) return;

    banner.style.backgroundImage = "url('https://tmdb.org" + movie.backdrop_path + "')";
    document.getElementById('heroTitle').innerText = movie.title;
    document.getElementById('heroOverview').innerText = movie.overview ? movie.overview.substring(0, 120) + '...' : '';
    
    document.getElementById('heroPlayBtn').onclick = function() {
        playMovieTrailer(movie.title);
    };
}

function displayMovies(movies) {
    var grid = document.getElementById('movieGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (movies.length === 0) {
        grid.innerHTML = '<p style="padding: 20px; color: #888;">No results found.</p>';
        return;
    }

    movies.forEach(function(movie) {
        if (!movie.poster_path) return; 
        
        var card = document.createElement('div');
        card.classList.add('movie-card');
        
        card.onclick = function() {
            playMovieTrailer(movie.title);
        };

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

// SIMPLIFIED ZERO-BRACKET ROUTING
function playMovieTrailer(movieTitle) {
    var cleanTitle = encodeURIComponent(movieTitle + ' official trailer');
    var targetUrl = 'https://youtube.com' + cleanTitle;
    window.open(targetUrl, '_blank');
}
