let BASE_URL = "https://pokeapi.co/api/v2/";
let ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/";

console.log(ICON_URL);


let allPokemon = [];
let currentPokemon = [];

let LIMIT = 25;
let OFFSET = 0;

async function fetchPokemon(id) {

    try {
        let response = await fetch(`${BASE_URL}pokemon/${id}`);
        let pokeResponse = await response.json();
        console.log(pokeResponse);

        renderSinglePokemon(pokeResponse);

    } catch (error) {
        console.error("Fehler beim laden der Daten", error);
    }
}


function renderSinglePokemon(pokeResponse) {
    let pokemonContentContainer = document.getElementById('pokemon-content');
    pokemonContentContainer.innerHTML = getPokemonInformationTemplate(pokeResponse);
}

function renderTypes(pokeResponse) {
    let typeText = "";
    for (let i = 0; i < pokeResponse.types.length; i++) {
        let typeName = pokeResponse.types[i].type.name;
        let typeUrl = pokeResponse.types[i].type.url;
        
        let urlParts = typeUrl.split('/');
        let typeId = urlParts[urlParts.length - 2];
        typeText += `
            <span>
                <img src="${ICON_URL}${typeId}.png" alt="${typeName}">
            </span>`;
    }
    return typeText;
}

fetchPokemon(1);

