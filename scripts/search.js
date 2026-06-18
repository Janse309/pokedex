const inputElement = document.querySelector("#search-input-field");
const searchIcon = document.querySelector("#search-icon");

inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleSearch();
});

searchIcon.addEventListener("click", () => {
    handleSearch();
});

function handleSearch() {
    const inputValue = inputElement.value.trim().toLowerCase();
    if (inputValue.length >= 0 && inputValue.length < 3) {
        inputElement.setCustomValidity("Bitte gib mindestens 3 Buchstaben ein.");
        inputElement.focus();
        return inputElement.reportValidity();
    }
    inputElement.setCustomValidity("");
    currentPokemon = allPokemon.filter(pokemon =>
        inputValue === "" || pokemon.name.toLowerCase().includes(inputValue));
    renderFilteredPokemon();
    hideLoadMoreBtn();
    showSearchResetBtn();
}

function resetSearch() {
    inputElement.value = "";
    inputElement.setCustomValidity("");

    currentPokemon = allPokemon;

    renderFilteredPokemon();
    hideSearchResetBtn();

    let loadMoreBtn = document.getElementById('load-more-pokemon');
    loadMoreBtn.innerHTML = `<button data-id="load-more-button" id="load-more-button" class="load-more-and-reset-btn" onclick="loadPokemon()">Load more</button>`;
    showLoadMoreBtn();
}

function showSearchResetBtn() {
    let resetButton = document.getElementById('load-more-pokemon');
    resetButton.innerHTML = `<button id="reset-pokemon-btn" class="load-more-and-reset-btn" onclick="resetSearch()">reset search</button>`;
    resetButton.classList.remove('d-none');
}

function hideSearchResetBtn() {
    let resetButton = document.getElementById('load-more-pokemon');
    resetButton = "";
}

function renderFilteredPokemon() {
    const pokemonContainer = document.getElementById('pokedex-gallery');

    if (currentPokemon.length === 0) {
        pokemonContainer.innerHTML = '<h2 class="no-pokemon-found-text" data-id="not-found" class="no-results">no pokemon found ...</h2>';
        return;
    }
    pokemonContainer.innerHTML = buildPokemonHtmlList(currentPokemon);
}

function buildPokemonHtmlList(pokemonArray) {
    let htmlContent = "";
    for (let i = 0; i < pokemonArray.length; i++) {
        let pokemon = pokemonArray[i];
        let mainType = pokemon.types[0].type.name;
        let pokemonImg = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        htmlContent += getPokemonInformationTemplate(pokemon, mainType, i, pokemonImg);
    }
    return htmlContent;
}