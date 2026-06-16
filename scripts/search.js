// ==========================================
// SEARCH
// ==========================================

const inputElement = document.querySelector("#search-input-field"); // ID aus HTML korrigiert
const searchIcon = document.querySelector("#search-icon");

// Optional: Suche auch per Enter-Taste auslösen
inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleSearch();
});

searchIcon.addEventListener("click", () => {
    handleSearch();
});

function handleSearch() {
    const inputValue = inputElement.value.trim().toLowerCase();

    // Validierung: Wenn Text da ist, aber weniger als 3 Zeichen
    if (inputValue.length > 0 && inputValue.length < 3) {
        inputElement.setCustomValidity("Bitte gib mindestens 3 Buchstaben ein.");
        inputElement.focus();
        inputElement.reportValidity(); // Sprechblase sofort anzeigen
        return; // Suche abbrechen!
    } 
    
    // WICHTIG: Validierung zurücksetzen, falls die Eingabe jetzt korrekt ist
    inputElement.setCustomValidity("");

    // Wenn das Feld komplett leer ist -> Alles zurücksetzen
    if (inputValue === "") {
        currentPokemon = allPokemon;
        renderFilteredPokemon();
        return;
    }

    // Filtert erst jetzt nach dem Namen
    const filtered = allPokemon.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(inputValue);
    });

    currentPokemon = filtered;
    renderFilteredPokemon();
}

function renderFilteredPokemon() {
    const pokemonContainer = document.getElementById('pokedex-gallery');

    if (currentPokemon.length === 0) {
        pokemonContainer.innerHTML = `
            <p data-id="not-found" class="no-results">Kein Pokémon gefunden.</p>
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