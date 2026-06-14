// ==========================================
// SEARCH
// ==========================================

const inputElement = document.querySelector("#search-input-field"); // ID aus HTML korrigiert
const searchIcon = document.querySelector("#search-icon");

searchIcon.addEventListener("click", () => {
    handleSearch();
});

// Optional: Suche auch per Enter-Taste auslösen
inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleSearch();
});

function handleSearch() {
    const inputValue = inputElement.value.trim().toLowerCase();

    if (inputValue === "") {
        // Leere Eingabe → alles zurücksetzen
        currentPokemon = allPokemon;
        renderFilteredPokemon();
        return;
    }

    const filtered = allPokemon.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(inputValue);
        const matchesId = pokemon.id.toString() === inputValue;
        return matchesName || matchesId;
    });

    currentPokemon = filtered;
    renderFilteredPokemon();
}

function renderFilteredPokemon() {
    const pokemonContainer = document.getElementById('pokedex-gallery');

    if (currentPokemon.length === 0) {
        pokemonContainer.innerHTML = `
            <p class="no-results">Kein Pokémon gefunden.</p>
        `;
        return;
    }

    let htmlContent = "";
    for (let i = 0; i < currentPokemon.length; i++) {
        let pokemon = currentPokemon[i];
        let mainType = pokemon.types[0].type.name;
        htmlContent += getPokemonInformationTemplate(pokemon, mainType);
    }
    pokemonContainer.innerHTML = htmlContent;
}