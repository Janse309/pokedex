function getPokemonInformationTemplate(pokeResponse) {
    return `
            <div class="pokemon-card">
                <div class="pokemon-image-container">
                    <h2>${pokeResponse.name.toUpperCase()}</h2>
                    <img class="pkmn-img" src="${pokeResponse.sprites.other['official-artwork'].front_default}" alt="${pokeResponse.name}">
                </div>
                <div class="type-text">${renderTypes(pokeResponse)}</div>
            </div>
    `
}