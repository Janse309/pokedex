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
    hideLoadMoreBtn();
    await loadPokemon();
    showLoadMoreBtn();
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
    toggleLoadButton(true);
    showFullscreenSpinner();
    try {
        let pkmnListData = await fetchPokemonList();
        await fetchAndSaveDetails(pkmnListData.results);
        currentPokemon = allPokemon;
        renderAllPokemon();
        OFFSET += LIMIT;
    } catch (error) {
        console.error("Fehler beim Laden der Pokemon", error);
    } finally {
        hideFullscreenSpinner();
        toggleLoadButton(false);
    }
}

async function fetchAndSaveDetails(pokemonResults) {
    for (let i = 0; i < pokemonResults.length; i++) {
        let details = await loadPokemonDetails(pokemonResults[i].url);
        allPokemon.push(details);
    }
}

function toggleLoadButton(disable) {
    let loadMoreBtn = document.getElementById("load-more-button");
    if (loadMoreBtn) loadMoreBtn.disabled = disable;
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

async function ensureFlavorText(pokemon) {
    if (pokemon.flavorText) return;
    try {
        pokemon.flavorText = await fetchFlavorText(pokemon.id);
    } catch (error) {
        console.error("Fehler beim Laden des Flavor Textes", error);
    }
}

async function openDialog(index) {
    currentPokemonIndex = index;
    let pokemon = currentPokemon[currentPokemonIndex];
    activePokemonInformation = 'main';

    await ensureFlavorText(pokemon);

    dialog.innerHTML = getPokemonDialogTemplate(pokemon);
    dialog.setAttribute('data-type', pokemon.types[0].type.name);
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

    await ensureFlavorText(pokemon);

    dialog.innerHTML = getPokemonDialogTemplate(pokemon);
    dialog.setAttribute('data-type', pokemon.types[0].type.name);

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
    let stats = {};
    pokemon.stats.forEach(pokemonStats => { stats[pokemonStats.stat.name] = pokemonStats.base_stat; });
    try {
        switch (activePokemonInformation) {
            case "main": getMainPokemonInformation(pokemon); break;
            case "base-stats": container.innerHTML = getPokemonStatsTemplate(stats); break;
            case "evo-chain": await renderEvoChain(pokemon); break;
        }
    } catch (error) {
        console.error("Fehler beim Tab-Wechsel:", error);
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
    try {
        let chain = await fetchEvolutionChain(pokemon.id);
        let evolutions = [];
        collectEvolutions(chain, evolutions);
        let parts = renderEvoParts(evolutions);
        document.getElementById(evoId).innerHTML = getEvoChainTemplate(parts.join(''));
    } catch (error) {
        console.error("Fehler beim Laden der Evolutionskette");
    }
    finally {
        hideContainerSpinner(evoId);
    }
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

function showLoadMoreBtn() {
    let loadMoreButton = document.getElementById('load-more-button');
    loadMoreButton.classList.remove('d-none');
}

function hideLoadMoreBtn() {
    let loadMoreButton = document.getElementById('load-more-button');
    loadMoreButton.classList.add('d-none');
}