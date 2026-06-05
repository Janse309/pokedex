function getPokemonInformationTemplate(pokemon, pokemonBgClass) {
    let pokemonImg = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    return `   
        <div class="pokemon-card">
            <div class="pokemon-card-header">
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <p>#${pokemon.id}</p>
            </div>
            <div class="pokemon-image-container ${pokemonBgClass}">
                <button onclick="openDialog(${pokemon.id})" class="pokemon-img-button"><img class="pkmn-img" src="${pokemonImg}" alt="${pokemon.name}"></button>
            </div>
            <div class="pkmn-card-footer">${renderTypes(pokemon)}</div>
        </div>
    `
}

function getPokemonDialogTemplate(pokemon, pokemonBgClass, fontColor) {
    return `
        <div class="dialog-container">
            <div class="dialog-header ${pokemonBgClass}">
                <div class="name-and-id">
                    <span>#${pokemon.id}</span>
                    <h2 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <p>X</p>
                </div>
                    <img class="pkmn-img dialog-img" src="${IMG_URL + pokemon.id}.png" alt="${pokemon.name}">
            </div>
            <div class="dialog-type-container">
                <div class="type-gap">${renderTypes(pokemon)}</div>
            </div>
            <div class="information-btn-section">
                <button class="dialog-button"><h3 class="${fontColor}">about</h3></button>
                <button class="dialog-button"><h3 class="${fontColor}">base stats</h3></button>
                <button class="dialog-button"><h3 class="${fontColor}">evon chain</h3></button>
            </div>
        </div>
    `
}

//About
// base stats
// evo chain