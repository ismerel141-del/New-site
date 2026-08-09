/* Resets and Core Layout Framework */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: #0b0c10;
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding-top: 70px;
}

/* Floating Navigation Header Placement */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 5%;
    background-color: #0b0c10;
    border-bottom: 1px solid #1f2833;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 1.5px;
}

.logo span {
    color: #e50914;
}

.search-bar {
    display: flex;
    width: 50%;
    max-width: 400px;
}

.search-bar input {
    flex: 1;
    padding: 10px 15px;
    background-color: #1f2833;
    border: 1px solid #45a29e;
    border-radius: 4px 0 0 4px;
    color: #fff;
    outline: none;
}

.search-bar button {
    padding: 10px 20px;
    background-color: #e50914;
    color: #fff;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-weight: bold;
}

/* Big Hero Banner Showcase Layout */
.hero-banner {
    height: 55vh;
    background-size: cover;
    background-position: center top;
    display: flex;
    align-items: flex-end;
    padding: 40px 5%;
    position: relative;
}

.hero-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, #0b0c10 10%, transparent 90%);
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 600px;
}

.hero-content h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.hero-content p {
    font-size: 1rem;
    color: #c5a059;
    margin-bottom: 20px;
    line-height: 1.4;
}

.play-btn {
    background-color: #e50914;
    color: white;
    padding: 12px 28px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
}

.play-btn:hover {
    transform: scale(1.05);
}

/* Movie Cards Grid */
.container {
    padding: 30px 5%;
}

.container h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    border-left: 4px solid #e50914;
    padding-left: 10px;
}

.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;
}

/* Individual Movie Posters Display Card */
.movie-card {
    background-color: #1f2833;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
}

.movie-card:hover {
    transform: translateY(-5px);
}

.movie-card img {
    width: 100%;
    height: 210px;
    object-fit: cover;
    display: block;
}

.movie-info {
    padding: 10px;
}

.movie-info h3 {
    font-size: 0.9rem;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Video Player Overlays */
.modal {
    display: none;
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-content {
    position: relative;
    width: 100%;
    max-width: 800px;
    aspect-ratio: 16/9;
}

.modal-content iframe {
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

.close-btn {
    position: absolute;
    top: -45px;
    right: 0;
    color: #fff;
    font-size: 36px;
    cursor: pointer;
}
