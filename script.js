let BASE_URL = "https://pokeapi.co/api/v2/";
// let ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/";
let ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";
let IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
let FLAVOUR_TEXT = "https://pokeapi.co/api/v2/pokemon-species/{name oder id}/(ruby)";

let allPokemon = [];
let currentPokemon = [];

let OFFSET = 0;
let LIMIT = 25;

async function init() {
    await loadPokemon();
    currentPokemon = allPokemon;
    
}

async function fetchPokemonList() {
    let pokemonListUrl = `${BASE_URL}pokemon?limit=${LIMIT}&offset=${OFFSET}`; // den ersten Link in der Poke API für Limits
    let fetchPkmnResponse = await fetch(pokemonListUrl); // pokemon informationen herunter laden
    return await fetchPkmnResponse.json(); // hier wird es zu json umgewandelt
}

async function loadPokemonDetails(pokemonDetailUrl) {
    let response = await fetch(pokemonDetailUrl);
    return await response.json();
}

function renderAllPokemon() {
    let pokemonContainer = document.getElementById('pokedex-gallery');

    let htmlContent = "";
    for (let index = 0; index < allPokemon.length; index++) {
        let pokemon = allPokemon[index];
        let mainType = pokemon.types[0].type.name;
        let pokemonBgClass = "bg_" + mainType;
        htmlContent += getPokemonInformationTemplate(pokemon, pokemonBgClass);
    }
    pokemonContainer.innerHTML = htmlContent;
}

async function loadPokemon() {

    try {
        let pkmnListData = await fetchPokemonList();
        for (let i = 0; i < pkmnListData.results.length; i++) {
            const singlePokemon = await loadPokemonDetails(pkmnListData.results[i].url);
            allPokemon.push(singlePokemon);
        }

        renderAllPokemon();
        OFFSET += LIMIT;

    } catch (error) {
        console.error("Fehler beim laden der Pokemon", error);
        
    }
}

// async function fetchPokemon(id) {

//     try {
//         let response = await fetch(`${BASE_URL}pokemon/${id}`);
//         let pokeResponse = await response.json();

//         renderSinglePokemon(pokeResponse);

//     } catch (error) {
//         console.error("Fehler beim laden der Daten", error);
//     }
// }

// function renderSinglePokemon(pokeResponse) {
//     let pokemonContentContainer = document.getElementById('pokedex-gallery');

//     let mainType = pokeResponse.types[0].type.name;
//     let pokemonBgClass = "bg_" + mainType;
//     pokemonContentContainer.innerHTML = getPokemonInformationTemplate(pokeResponse, pokemonBgClass);
// }

function renderTypes(pokemon) {
    let typeText = "";

    for (let i = 0; i < pokemon.types.length; i++) {
        let typeName = pokemon.types[i].type.name;
        let typeUrl = pokemon.types[i].type.url;
        let urlParts = typeUrl.split('/');
        let typeId = urlParts[urlParts.length - 2];

        typeText += `<img class="type-icon" src="${ICON_URL}${typeId}.png" alt="${typeName}">`;
    }

    return typeText;
}

function openDialog(id) {
    let dialog = document.getElementById('pokemon-dialog');

    let pokemon = allPokemon.find(pokemon => pokemon.id === id);
    let mainType = pokemon.types[0].type.name;
    let pokemonBgClass = "bg_" + mainType;
    let fontColor = "color-" + mainType;
    dialog.innerHTML = getPokemonDialogTemplate(pokemon, pokemonBgClass, fontColor);
    dialog.showModal();
}

