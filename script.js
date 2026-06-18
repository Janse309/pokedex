const BASE_URL = "https://pokeapi.co/api/v2/";
const SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";
let dialog = document.getElementById('pokemon-dialog');

const spinnerOverlay = document.createElement('div');
spinnerOverlay.id = 'global-spinner';

let allPokemon = [];
let currentPokemon = [];
let currentPokemonIndex = 0;

let OFFSET = 0;
const LIMIT = 25;

let activePokemonInformation = "main";
let about = {};
let baseStats = {};

async function init() {
    await loadPokemon();
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

async function loadPokemon() { // 21 Zeilen
    let loadMoreBtn = document.getElementById("load-more-button");
    if (loadMoreBtn) loadMoreBtn.disabled = true;
    showFullscreenSpinner();
    try {
        let pkmnListData = await fetchPokemonList();
        for (let i = 0; i < pkmnListData.results.length; i++) {
            allPokemon.push(await loadPokemonDetails(pkmnListData.results[i].url));
        }
        currentPokemon = allPokemon;
        renderAllPokemon();
        OFFSET += LIMIT;
    } catch (error) {
        console.error("Fehler beim Laden der Pokemon", error);
    }
    finally {
        hideFullscreenSpinner();
        if (loadMoreBtn) loadMoreBtn.disabled = false;
    }
}

async function fetchFlavorText(pokemonId) {
    let response = await fetch(`${SPECIES_URL}${pokemonId}/`);
    let data = await response.json();

    let entry = findEnglishEntry(data.flavor_text_entries || []);

    return entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : 'No description available.';
}

function findEnglishEntry(entries) {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].language.name === 'en' && entries[i].version.name === 'ruby') {
            return entries[i];
        }
    }
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].language.name === 'en') {
            return entries[i];
        }
    }
    return null;
}

async function fetchEvolutionChain(pokemonId) {
    let responseSpecies = await fetch(`${SPECIES_URL}${pokemonId}/`);
    let speciesData = await responseSpecies.json();

    let evoChainUrl = speciesData.evolution_chain.url;
    let evoResponse = await fetch(evoChainUrl);
    let evoData = await evoResponse.json();

    return evoData.chain;
}

function renderAllPokemon() {
    let pokemonContainer = document.getElementById('pokedex-gallery');
    let htmlContent = "";

    for (let index = 0; index < allPokemon.length; index++) {

        let pokemon = allPokemon[index];
        let mainType = pokemon.types[0].type.name;
        let pokemonImg = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

        htmlContent += getPokemonInformationTemplate(pokemon, mainType, index, pokemonImg);
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

async function openDialog(index) {
    currentPokemonIndex = index;
    let pokemon = currentPokemon[currentPokemonIndex];
    if (!pokemon.flavorText) {
        pokemon.flavorText = await fetchFlavorText(pokemon.id);
    }
    let mainType = pokemon.types[0].type.name;
    dialog.innerHTML = getPokemonDialogTemplate(pokemon);
    dialog.setAttribute('data-type', mainType);
    getMainPokemonInformation(pokemon);
    updateButtonStyles();
    dialog.showModal();
}

function closeDialog() {
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

async function updateDialog() {
    let pokemon = currentPokemon[currentPokemonIndex];
    activePokemonInformation = 'main';

    if (!pokemon.flavorText) {
        pokemon.flavorText = await fetchFlavorText(pokemon.id);
    }
    
    let mainType = pokemon.types[0].type.name;
    dialog.innerHTML = getPokemonDialogTemplate(pokemon);
    dialog.setAttribute('data-type', mainType);

    getMainPokemonInformation(pokemon);
    updateButtonStyles();
}

function changeTab(tabName) {
    activePokemonInformation = tabName;
    renderDetailInfo();
    updateButtonStyles();
}

async function renderDetailInfo() {
    let container = document.getElementById('switch-case-section');
    let pokemon = currentPokemon[currentPokemonIndex];
    let mainType = pokemon.types[0].type.name;
    switch (activePokemonInformation) {
        case "main": getMainPokemonInformation(pokemon);
            break;
        case "base-stats": container.innerHTML = getPokemonStatsTemplate(pokemon);
            break;
        case "evo-chain": await renderEvoChain(pokemon);
            break;
    }
}

async function getMainPokemonInformation(pokemon) {
    let abilitiesList = "";
    for (let i = 0; i < pokemon.abilities.length; i++) {
        let abilityName = pokemon.abilities[i].ability.name;
        abilitiesList += abilityName;
        if (i < pokemon.abilities.length - 1) { abilitiesList += ", "; }
    }
    let weightKg = (pokemon.weight / 10).toFixed(2).replace(".", ",") + "kg";
    let heightM = (pokemon.height * 10).toFixed() + "cm";
    let flavorText = pokemon.flavorText || 'No description available.';
    let mainType = pokemon.types[0].type.name;
    document.getElementById('switch-case-section').innerHTML = getAboutTemplate(weightKg, heightM, abilitiesList, flavorText);
}

function collectEvolutions(chain, evolutions) {
    let urlParts = chain.species.url.split('/');
    let speciesId = urlParts[urlParts.length - 2];

    evolutions.push({ name: chain.species.name, id: speciesId });

    if (chain.evolves_to.length > 0) {
        collectEvolutions(chain.evolves_to[0], evolutions);
    }
}

async function renderEvoChain(pokemon) {
    const evoId = 'switch-case-section';
    showContainerSpinner(evoId);

    let chain = await fetchEvolutionChain(pokemon.id);
    let evolutions = [];
    collectEvolutions(chain, evolutions);
    hideContainerSpinner(evoId);
    let mainType = pokemon.types[0].type.name;
    let parts = renderEvoParts(evolutions);
    let container = document.getElementById(evoId);
    container.innerHTML = getEvoChainTemplate(parts.join(''));
}

function renderEvoParts(evolutions) {
    let parts = [];
    for (let i = 0; i < evolutions.length; i++) {
        parts.push(getSingleEvoTemplate(evolutions[i]));
        if (i < evolutions.length - 1) {
            parts.push(`<div id="evo-arrow" class="evo-arrow"><p class="arrow">>>></p></div>`);
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

function showContainerSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = loadingSpinnerTemplate('loading-spinner-container-evo');
    }
}

function hideContainerSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = "";
    }
}

function showFullscreenSpinner() {
    if (document.querySelector('.loading-spinner-container')) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = loadingSpinnerTemplate('loading-spinner-container');

    const spinnerElement = tempDiv.firstElementChild;
    document.body.appendChild(spinnerElement);
}

function hideFullscreenSpinner() {
    const spinner = document.querySelector('.loading-spinner-container');
    if (spinner) {
        spinner.remove();
    }
}

// wenn ich suche den loadmorebutton verstecken
//loading spinner transparenter
// template von logik trennen
// neuen loading spinner für evo
// functionen under 14 lines