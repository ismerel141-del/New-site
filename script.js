const API_KEY = 'a83a16584e228d5eaaa7f34ada3c3566'; 
const BASE_URL = 'https://themoviedb.org';
const IMG_URL = 'https://tmdb.org';

window.onload = () => {
    getTrendingMovies();
    setupEventListeners();
};

function setupEventListeners() {
    document.getElementById('searchBtn').onclick = handleSearch;
    document.getElementById('closeModalBtn').onclick = closeVideo;
    
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

function getTrendingMovies() {
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                setupHeroBanner(data.results[0]); // Targets first item for cinematic showcase
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
    
    document.getElementById('heroPlayBtn').onclick = () => playMovieTrailer(movie.id);
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
        card.onclick = () => playMovieTrailer(movie.id);

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

// UPGRADED MOBILE STREAMING ENGINE
function playMovieTrailer(movieId) {
    fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            // Priority 1: Look for an Official Trailer
            let video = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            
            // Priority 2: Fallback to Teasers or Featurettes if trailer is missing
            if (!video) {
                video = data.results.find(v => v.site === 'YouTube');
            }
            
            if (video) {
                const player = document.getElementById('videoPlayer');
                const modal = document.getElementById('videoModal');
                
                // Construct standard embed link
                const embedUrl = `https://youtube.com{video.key}?autoplay=1&rel=0&modestbranding=1`;
                
                // Attempt to open the inline video modal overlay
                player.src = embedUrl;
                modal.style.display = 'flex';
                
                // Safety net: If mobile browser aggressively restricts video iframe loading,
                // give the user a direct link so they aren't stuck on a blank screen
                setTimeout(() => {
                    try {
                        if (player.contentWindow.length === 0) {
                             throw new Error("Blocked by browser policy");
                        }
                    } catch(e) {
                         // Opens seamlessly directly into the YouTube mobile application
                         window.open(`https://youtube.com{video.key}`, '_blank');
                         closeVideo();
                    }
                }, 800);

            } else {
                // Absolute fallback: Search YouTube via title if TMDB has no video key linked
                alert("Trailer asset not found. Searching external video servers...");
                window.open(`https://youtube.com{movieId}+official+trailer`, '_blank');
            }
        })
        .catch(err => {
            console.error('Trailer error:', err);
            alert("Streaming network busy. Retrying stream initialization...");
        });
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    if(modal) modal.style.display = 'none';
    if(player) player.src = ''; 
}
