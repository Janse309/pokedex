// ==========================================
// 1. GLOBALE VARIABLEN & CONFIG
// ==========================================
const BASE_URL = "https://pokeapi.co/api/v2/";
const SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
// const ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/";
const ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";

let allPokemon = [];
let currentPokemon = [];
let currentPokemonIndex = 0; // Ergänzt, da sie im Code genutzt wird

let OFFSET = 0;
const LIMIT = 25; // Als Konstante definiert, da sich das Limit selten im Lauf ändert

let activePokemonInformation = "main";
let about = {};
let baseStats = {};

// ==========================================
// 2. INITIALISIERUNG & API-FETCHES
// ==========================================
async function init() {
    await loadPokemon();
    currentPokemon = allPokemon;
}

async function fetchPokemonList() {
    let pokemonListUrl = `${BASE_URL}pokemon?limit=${LIMIT}&offset=${OFFSET}`;
    let fetchPkmnResponse = await fetch(pokemonListUrl);
    return await fetchPkmnResponse.json();
}

async function loadPokemonDetails(pokemonDetailUrl) {
    let response = await fetch(pokemonDetailUrl);
    return await response.json();
}

async function loadPokemon() {
    try {
        let pkmnListData = await fetchPokemonList();
        for (let i = 0; i < pkmnListData.results.length; i++) {
            allPokemon.push(await loadPokemonDetails(pkmnListData.results[i].url));
        }

        renderAllPokemon();
        OFFSET += LIMIT;
    } catch (error) {
        console.error("Fehler beim Laden der Pokemon", error);
    }
}

async function fetchFlavorText(pokemonId) {
    let response = await fetch(`${SPECIES_URL}${pokemonId}/`);
    let data = await response.json();
    let goldEntry = null;

    // Suche nach speziellem Ruby-Eintrag
    for (let i = 0; i < data.flavor_text_entries.length; i++) {
        let entry = data.flavor_text_entries[i];
        if (entry.language.name === 'en' && entry.version.name === 'ruby') {
            goldEntry = entry;
            break;
        }
    }

    // Falls kein Ruby-Eintrag, nimm ersten englischen
    if (!goldEntry) {
        for (let i = 0; i < data.flavor_text_entries.length; i++) {
            if (data.flavor_text_entries[i].language.name === 'en') {
                goldEntry = data.flavor_text_entries[i];
                break;
            }
        }
    }
    return goldEntry ? goldEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'No description available.';
}

async function fetchEvolutionChain(pokemonId) {
    let responseSpecies = await fetch(`${SPECIES_URL}${pokemonId}/`);
    let speciesData = await responseSpecies.json();

    let evoChainUrl = speciesData.evolution_chain.url;
    let evoResponse = await fetch(evoChainUrl);
    let evoData = await evoResponse.json();

    return evoData.chain;
}

// ==========================================
// 3. RENDERING (HAUPTANSICHT)
// ==========================================
function renderAllPokemon() {
    let pokemonContainer = document.getElementById('pokedex-gallery');
    let htmlContent = "";

    for (let index = 0; index < allPokemon.length; index++) {
        let pokemon = allPokemon[index];
        let mainType = pokemon.types[0].type.name;
        htmlContent += getPokemonInformationTemplate(pokemon, mainType);
    }
    pokemonContainer.innerHTML = htmlContent;
}

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

// ==========================================
// 4. DIALOG LOGIK (ÖFFNEN / SCHLIESSEN / NAVI)
// ==========================================
function openDialog(id) {
    let dialog = document.getElementById('pokemon-dialog');

    currentPokemonIndex = currentPokemon.findIndex(pokemon => pokemon.id === id);
    activePokemonInformation = 'main';

    let pokemon = currentPokemon[currentPokemonIndex];
    let mainType = pokemon.types[0].type.name;
    let fontColor = "color-" + mainType;

    dialog.innerHTML = getPokemonDialogTemplate(pokemon, fontColor);
    dialog.setAttribute('data-type', mainType);

    getMainPokemonInformation(pokemon);
    updateButtonStyles();
    dialog.showModal();
}

function closeDialog() {
    let dialog = document.getElementById('pokemon-dialog');
    dialog.close();
}

function outsideClick(event) {
    if (event.target.id === "pokemon-dialog") {
        document.getElementById('pokemon-dialog').close();
    }
}

function nextPokemon() {
    currentPokemonIndex++;
    if (currentPokemonIndex >= currentPokemon.length) {
        currentPokemonIndex = 0;
    }
    updateDialog();
}

function prevPokemon() {
    currentPokemonIndex--;
    if (currentPokemonIndex < 0) {
        currentPokemonIndex = currentPokemon.length - 1;
    }
    updateDialog();
}

function updateDialog() {
    let dialog = document.getElementById('pokemon-dialog');
    let pokemon = currentPokemon[currentPokemonIndex];
    activePokemonInformation = 'main';

    let mainType = pokemon.types[0].type.name;
    let fontColor = "color-" + mainType;

    dialog.innerHTML = getPokemonDialogTemplate(pokemon, fontColor);
    dialog.setAttribute('data-type', mainType);

    getMainPokemonInformation(pokemon);
    updateButtonStyles();
}

// ==========================================
// 5. DIALOG REITER (TABS) & DETAILS
// ==========================================
function changeTab(tabName) {
    activePokemonInformation = tabName;
    renderDetailInfo();
    updateButtonStyles();
}

async function renderDetailInfo() {
    let container = document.getElementById('switch-case-section');
    let pokemon = currentPokemon[currentPokemonIndex];
    let mainType = pokemon.types[0].type.name;
    let fontColor = "color-" + mainType;

    switch (activePokemonInformation) {
        case "main":
            await getMainPokemonInformation(pokemon);
            break;
        case "base-stats":
            container.innerHTML = getPokemonStatsTemplate(pokemon, fontColor);
            break;
        case "evo-chain":
            await renderEvonChain(pokemon);
            break;
    }
}

async function getMainPokemonInformation(pokemon) {
    let abilitiesList = "";
    for (let i = 0; i < pokemon.abilities.length; i++) {
        let abilityName = pokemon.abilities[i].ability.name;
        abilitiesList += abilityName;
        if (i < pokemon.abilities.length - 1) {
            abilitiesList += ", ";
        }
    }

    let weightKg = (pokemon.weight / 10).toFixed(2).replace(".", ",") + "kg";
    let heightM = (pokemon.height * 10).toFixed() + "cm";
    let flavorText = await fetchFlavorText(pokemon.id);
    let aboutContainer = document.getElementById('switch-case-section');
    let mainType = pokemon.types[0].type.name;
    let fontColor = "color-" + mainType;

    aboutContainer.innerHTML = getAboutTemplate(weightKg, heightM, abilitiesList, flavorText, fontColor);
}

function collectEvolutions(chain, evolutions) {
    let urlParts = chain.species.url.split('/');
    let speciesId = urlParts[urlParts.length - 2];

    evolutions.push({ name: chain.species.name, id: speciesId });

    if (chain.evolves_to.length > 0) {
        collectEvolutions(chain.evolves_to[0], evolutions);
    }
}

async function renderEvonChain(pokemon) {
    let container = document.getElementById('switch-case-section');
    let mainType = pokemon.types[0].type.name;
    let fontColor = "color-" + mainType;

    container.innerHTML = `<p class="${fontColor}">Evolutionskette lädt...</p>`;

    let chain = await fetchEvolutionChain(pokemon.id);
    let evolutions = [];
    collectEvolutions(chain, evolutions);

    let parts = renderEvoParts(evolutions, fontColor);
    container.innerHTML = getEvoChainTemplate(parts.join(''));
}

function renderEvoParts(evolutions, fontColor) {
    let parts = [];
    for (let i = 0; i < evolutions.length; i++) {
        parts.push(getSingleEvoTemplate(evolutions[i], fontColor));
        if (i < evolutions.length - 1) {
            parts.push(`<div class="evo-arrow ${fontColor}">▼</div>`);
        }
    }
    return parts;
}

function updateButtonStyles() {
    let aboutBtn = document.getElementById('about-btn');
    let statsBtn = document.getElementById('base-stats-btn');
    let evoBtn = document.getElementById('evo-chain-btn');

    aboutBtn.classList.remove('active');
    statsBtn.classList.remove('active');
    evoBtn.classList.remove('active');

    if (activePokemonInformation === 'main') {
        aboutBtn.classList.add('active');
    } else if (activePokemonInformation === 'base-stats') {
        statsBtn.classList.add('active');
    } else if (activePokemonInformation === 'evo-chain') {
        evoBtn.classList.add('active');
    }
}

// ==========================================
// 6. AUSKOMMENTIERTER / ALTER CODE
// ==========================================
// async function fetchPokemon(id) {
//     try {
//         let response = await fetch(`${BASE_URL}pokemon/${id}`);
//         let pokeResponse = await response.json();
//         renderSinglePokemon(pokeResponse);
//     } catch (error) {
//         console.error("Fehler beim laden der Daten", error);
//     }
// }
//
// function renderSinglePokemon(pokeResponse) {
//     let pokemonContentContainer = document.getElementById('pokedex-gallery');
//     let mainType = pokeResponse.types[0].type.name;
//     let pokemonBgClass = "bg_" + mainType;
//     pokemonContentContainer.innerHTML = getPokemonInformationTemplate(pokeResponse, pokemonBgClass);
// }