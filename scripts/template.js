function getPokemonInformationTemplate(pokemon, mainType) { // card
    let pokemonImg = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    return `   
        <section class="pokemon-card">
            <div class="pokemon-card-header">
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <p>#${pokemon.id}</p>
            </div>
            <div id="card-image-background" class="pokemon-card-image pokemon-background-color" data-type="${mainType}">
                <button data-id="card" onclick="openDialog(${pokemon.id})" class="pokemon-img-button"><img data-id="card-image" class="pkmn-img" src="${pokemonImg}" alt="${pokemon.name}"></button>
            </div>
            <div class="pkmn-card-footer">${renderTypes(pokemon)}</div>
        </section>
    `
}

// dialog
function getPokemonDialogTemplate(pokemon, fontColor) {

    return `
        <article class="dialog-container" onclick="event.stopPropagation()">

            <div class="dialog-image-container pokemon-background-color">
                <header class="dialog-header">
                    <span>#${pokemon.id}</span>
                    <h2 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <button data-id="close-dialog-button" class="control-btn close-btn" onclick="closeDialog()">
                        <img class="close-img" src="./assets/icon/close.svg" alt="close">
                    </button>
                </header>

                <div class="mobile-button-and-image-container">
                    <button data-id="prev-button" class="control-btn" onclick="prevPokemon(${currentPokemonIndex})">
                        <img src="./assets/icon/left.svg" alt="prev">
                    </button>
                    <img data-id="dialog-image" class="pkmn-img dialog-img" src="${IMG_URL + pokemon.id}.png" alt="${pokemon.name}">
                    <button data-id="next-button" class="control-btn" onclick="nextPokemon(${currentPokemonIndex})">
                        <img src="./assets/icon/right.svg" alt="next">
                    </button>
                </div>
            </div>

            <section class="dialog-type-container">
                <div class="type-gap">${renderTypes(pokemon)}</div>
            </section>

            <nav class="information-btn-section" aria-label="Pokémon Details Navigation">
                <button onclick="changeTab('main')" id="about-btn" class="dialog-button">
                    <h3 class="${fontColor}">about</h3>
                </button>
                <button onclick="changeTab('base-stats')" id="base-stats-btn" class="dialog-button">
                    <h3 class="${fontColor}">base stats</h3>
                </button>
                <button onclick="changeTab('evo-chain')" id="evo-chain-btn" class="dialog-button">
                    <h3 class="${fontColor}">evo chain</h3>
                </button>
            </nav>

            <div class="dialog-about-content" id="switch-case-section">
                <p>Loading...</p>
            </div>

        </article>
    `
}

function getAboutTemplate(weightKg, heightM, abilitiesList, flavorText, fontColor) {

    return `
        <table>
            <tr class="flavour-text-container">
                <th class="pokemon-description">Description:</th>
                <td class="${fontColor} flavour-text-size-mobile">${flavorText}</td>
            </tr>
            <tr class="about-table-row">
                <th>Weight:</th>
                <td class="${fontColor}">${weightKg}</td>
            </tr>
            <tr class="about-table-row">
                <th>Height:</th>
                <td class="${fontColor}">${heightM}</td>
            </tr>
            <tr class="about-table-row">
                <th>Abilities:</th>
                <td class="${fontColor}">${abilitiesList}</td>
            </tr>

        </table> 
    `
}

function getPokemonStatsTemplate(pokemon, fontColor) {
    // Hilfsvariable, um die Stats leicht herauszusuchen
    let stats = {};
    pokemon.stats.forEach(pokemonStats => {
        stats[pokemonStats.stat.name] = pokemonStats.base_stat;
    });

    return `
        <table class="base-stats-table">
            <tr class="base-stats-table-row">
                <th>HP:</th>
                <td class="${fontColor}">${stats['hp'] || 0}</td>
            </tr>
            <tr class="base-stats-table-row">
                <th>ATK:</th>
                <td class="${fontColor}">${stats['attack'] || 0}</td>
            </tr>
            <tr class="base-stats-table-row">
                <th>DEF:</th>
                <td class="${fontColor}">${stats['defense'] || 0}</td>
            </tr>
            <tr class="base-stats-table-row">
                <th>S-ATK:</th>
                <td class="${fontColor}">${stats['special-attack'] || 0}</td>
            </tr>
            <tr class="base-stats-table-row">
                <th>S-DEF:</th>
                <td class="${fontColor}">${stats['special-defense'] || 0}</td>
            </tr>
            <tr class="base-stats-table-row">
                <th>SPEED:</th>
                <td class="${fontColor}">${stats['speed'] || 0}</td>
            </tr>
        </table> 
    `;
}

function getEvoChainTemplate(innerHtml) {
    return `<div class="evo-chain-container">${innerHtml}</div>`;
}

function getSingleEvoTemplate(evo, fontColor) {
    return `
        <section class="evo-stage">
            <img class="evo-img" src="${IMG_URL}${evo.id}.png" alt="${evo.name}">
            <p class="evo-name ${fontColor}">${evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</p>
        </section>
    `;
}

function loadingSpinnerTemplate(cssClass) {
  return `
    <div class="${cssClass}">
      <img class="loading-spinner" src="./assets/icon/pokeball.png" alt="pokeball">
    </div>
  `;
}





//About
// base stats
// evo chain