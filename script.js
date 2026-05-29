let BASE_URL = "https://pokeapi.co/api/v2/";

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
        let type = pokeResponse.types[i].type.name;
        typeText += `<span><b>${type} </b></span>`;
    }
    return typeText;
}

fetchPokemon(151);

