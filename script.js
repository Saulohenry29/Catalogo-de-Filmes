const API_KEY = '0763c1e601be9ad6e6196f0ad83011d2'; 
const API_URL = 'https://api.themoviedb.org/3';

async function fetchMovies() {
    try {
        const response = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc`);

        if (!response.ok) throw new Error("Erro ao buscar filmes");

        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível carregar os filmes. Tente novamente mais tarde.");
    }
}

async function searchMovies() {
    const query = document.getElementById('search').value.trim();
    if (!query) {
        alert("Digite um nome de filme para pesquisar!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`);

        if (!response.ok) throw new Error("Erro ao buscar filmes");

        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível carregar os filmes. Tente novamente mais tarde.");
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    if (!movies || movies.length === 0) {
        movieList.innerHTML = "<p>Nenhum filme encontrado</p>";
        return;
    }

    movies.forEach(movie => {
        const stars = getStars(movie.vote_average);
        const homepage = movie.homepage && movie.homepage !== "null" ? movie.homepage : `https://www.themoviedb.org/movie/${movie.id}`;

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <a href="${homepage}" target="_blank">
                <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300'}" alt="${movie.title}">
            </a>
            <h3>${movie.title}</h3> 
            <p class="stars">${stars}</p>
            <p class="synopsis">${movie.overview ? movie.overview.substring(0, 150) + "..." : 'Sem descrição disponível'}</p>
            <button class="details-btn" onclick="openMovieDetails('${movie.title}')">Mais detalhes</button>
        `;
        movieList.appendChild(movieElement);
    });
}

// 🔥 Função para gerar estrelas corretamente
function getStars(vote) {
    const maxStars = 5; 
    const scaledVote = Math.round(vote / 2); 
    let stars = '';

    for (let i = 0; i < maxStars; i++) {
        stars += i < scaledVote ? '⭐' : '☆';
    }
    
    return stars;
}

// 🔹 Função para abrir uma pesquisa no Google sobre o filme
function openMovieDetails(movieTitle) {
    const searchQuery = encodeURIComponent(movieTitle + " filme");
    const url = `https://www.google.com/search?q=${searchQuery}`;
    window.open(url, '_blank'); // 🔥 Redireciona para a pesquisa no Google
}

// 🔹 Adicionando evento para buscar ao pressionar "Enter"
document.getElementById('search').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchMovies();
    }
});

// Chama os filmes populares ao carregar a página
document.addEventListener("DOMContentLoaded", fetchMovies);
