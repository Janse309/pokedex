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

    if (inputValue.length > 0 && inputValue.length < 3) {
        inputElement.setCustomValidity("Bitte gib mindestens 3 Buchstaben ein.");
        inputElement.focus();
        return inputElement.reportValidity();
    }
    inputElement.setCustomValidity("");

    currentPokemon = allPokemon.filter(pokemon =>
        inputValue === "" || pokemon.name.toLowerCase().includes(inputValue)
    );

    renderFilteredPokemon();
}

function renderFilteredPokemon() {
    const pokemonContainer = document.getElementById('pokedex-gallery');

    if (currentPokemon.length === 0) {
        pokemonContainer.innerHTML = '<h2 data-id="not-found" class="no-results">no pokemon found ...</h2>';
        return;
    }

    pokemonContainer.innerHTML = buildPokemonHtmlList(currentPokemon);
}

function buildPokemonHtmlList(pokemonArray) {
    let htmlContent = "";
    for (let i = 0; i < pokemonArray.length; i++) {
        let pokemon = pokemonArray[i];
        let mainType = pokemon.types[0].type.name;
        htmlContent += getPokemonInformationTemplate(pokemon, mainType);
    }
    return htmlContent;
}