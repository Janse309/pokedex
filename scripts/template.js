function getPokemonInformationTemplate(pokeResponse, pokemonBgClass) {
    let pokemonImg = pokeResponse.sprites.other['official-artwork'].front_default || pokeResponse.sprites.front_default;
    return `
        <div class="pokemon-card">
            <div class="pokemon-card-header">
            <h2>${pokeResponse.name.toUpperCase()}</h2>
            </div>
            <div class="pokemon-image-container ${pokemonBgClass}">
                <img class="pkmn-img" src="${pokemonImg}" alt="${pokeResponse.name}">
            </div>
            <div class="pkmn-card-footer">${renderTypes(pokeResponse)}</div>
        </div>
    `
}

// function getPokemonInformationTemplate(pokeResponse, pokemonBgClass) {
//     return `
//         <div class="pokemon-card ${pokemonBgClass}">
//             <div class="pokemon-header">
//                 <h2>${pokeResponse.name.toUpperCase()}</h2>
//                 <img src="${pokeResponse.sprites.other['official-artwork'].front_default}" alt="${pokeResponse.name}">
//             </div>
            
//             <div class="pokemon-types">
//                 ${renderTypes(pokeResponse)}
//             </div>
//         </div>
//     `;
// }