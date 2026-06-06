function getPokemonInformationTemplate(pokemon, pokemonBgClass) {
    let pokemonImg = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    return `   
        <div class="pokemon-card">
            <div class="pokemon-card-header">
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <p>#${pokemon.id}</p>
            </div>
            <div class="pokemon-card-image ${pokemonBgClass}">
                <button onclick="openDialog(${pokemon.id})" class="pokemon-img-button"><img class="pkmn-img" src="${pokemonImg}" alt="${pokemon.name}"></button>
            </div>
            <div class="pkmn-card-footer">${renderTypes(pokemon)}</div>
        </div>
    `
}

function getPokemonDialogTemplate(pokemon, pokemonBgClass, fontColor) {
    return `
        <div class="dialog-container">
            <div class="dialog-image-container ${pokemonBgClass}">
                <div class="dialog-header">
                    <span>#${pokemon.id}</span>
                    <h2 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <button class="control-btn close-btn" onclick="closeDialog()"><img class="close-img" src="./assets/icon/close.svg" alt="close"></button>
                </div>
                <div>
                    <button data-id="prev-button" class="control-btn"><img src="./assets/icon/left.svg" alt="prev"></button>
                    <img data-id="dialog-image" class="pkmn-img dialog-img" src="${IMG_URL + pokemon.id}.png" alt="${pokemon.name}">
                    <button data-id="next-button" class="control-btn"><img src="./assets/icon/right.svg" alt="next"></button>
                </div>
            </div>
            <div class="dialog-type-container">
                <div class="type-gap">${renderTypes(pokemon)}</div>
            </div>
            <div class="information-btn-section">
                <button class="dialog-button"><h3 class="${fontColor}">about</h3></button>
                <button class="dialog-button"><h3 class="${fontColor}">base stats</h3></button>
                <button class="dialog-button"><h3 class="${fontColor}">evo chain</h3></button>
            </div>
            <div class="dialog-about-content" id="dialog-about-content">
                <p>Loading...</p>
            </div>
        </div>
    `
}

function getPokemonMainInformationTemplate(weightKg, heightM, abilitiesList, flavorText, fontColor) {

    return `
        <table>
            <tr class="flavour-text-container">
                <th class="pokemon-description">Description:</th>
                <td class="${fontColor}">${flavorText}</td>
            </tr>
            <tr class="table-row">
                <th>Weight:</th>
                <td class="${fontColor}">${weightKg}</td>
            </tr>
            <tr class="table-row">
                <th>Height:</th>
                <td class="${fontColor}">${heightM}</td>
            </tr>
            <tr class="table-row">
                <th>Abilities:</th>
                <td class="${fontColor}">${abilitiesList}</td>
            </tr>

        </table> 
    `
}

function getStatsTemplate() {
    return `
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