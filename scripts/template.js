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

function getPokemonMainInformationTempalte() {
    return`
        <table>
            <tr>
                <th>Weight:</th>
                <th>gewicht</th>
            </tr>
            <tr>
                <th>Height:</th>
                <td>größe</td>
            </tr>
            <tr>
                <th>Abilities:</th>
                <td>ability</td>
            </tr>
            <tr>
                <th>Flavour Text:</th>
                <td>text</td>
            </tr>
        </table> 
    `
}

function getStatsTemplate() {
    return`
        <table>
            <tr>
                <th>HP</th>
                <th>HP-Wert</th>
            </tr>
            <tr>
                <th>ATK:</th>
                <td>ATK-Wert</td>
            </tr>
            <tr>
                <th>DEF:</th>
                <td>DEF-Wert</td>
            </tr>
            <tr>
                <th>S-ATK:</th>
                <td>S-ATK-Wert</td>
            </tr>
            <tr>
                <th>S-DEF:</th>
                <td>S-DEF-Wert</td>
            </tr>
            <tr>
                <th>SPEED:</th>
                <td>SPEED-Wert</td>
            </tr>
        </table> 
    `
}

//About
// base stats
// evo chain