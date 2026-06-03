function getPokemonInformationTemplate(pokemon, pokemonBgClass) {
    let pokemonImg = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    return `   
        <div class="pokemon-card">
            <div class="pokemon-card-header">
                <p>#${pokemon.id}</p>
                <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            </div>
            <div class="pokemon-image-container ${pokemonBgClass}">
                <button class="pokemon-img-button"><img class="pkmn-img" src="${pokemonImg}" alt="${pokemon.name}"></button>
            </div>
            <div class="pkmn-card-footer">${renderTypes(pokemon)}</div>
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