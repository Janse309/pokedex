let BASE_URL = "https://pokeapi.co/api/v2/";
// let ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/";
let ICON_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";
let IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
let FLAVOUR_TEXT = "https://pokeapi.co/api/v2/pokemon-species/";

let allPokemon = [];
let currentPokemon = [];
let OFFSET = 0;
let LIMIT = 25;

let activePokemonInformation = "main";
let about = {};
let baseStats = {};

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

async function loadPokemon() {

    try {
        let pkmnListData = await fetchPokemonList();
        for (let i = 0; i < pkmnListData.results.length; i++) {
            allPokemon.push(await loadPokemonDetails(pkmnListData.results[i].url));
        }

        renderAllPokemon();
        OFFSET += LIMIT;

    } catch (error) {
        console.error("Fehler beim laden der Pokemon", error);
    }
}

async function fetchFlavorText(pokemonId) {
    let response = await fetch(`${FLAVOUR_TEXT}${pokemonId}/`);
    let data = await response.json();

    let goldEntry = null;

    for (let i = 0; i < data.flavor_text_entries.length; i++) {
        let entry = data.flavor_text_entries[i];
        if (entry.language.name === 'en' && entry.version.name === 'ruby') {
            goldEntry = entry;
            break; // stoppt die Schleife sobald wir den richtigen flavour text gefunden haben
        }
    }

    // Falls kein Gold-Eintrag, nimm ersten englischen
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
    // Index im aktuellen Array finden und global speichern
    currentPokemonIndex = currentPokemon.findIndex(pokemon => pokemon.id === id);
    activePokemonInformation = 'main';

    let pokemon = currentPokemon[currentPokemonIndex];
    let mainType = pokemon.types[0].type.name;
    let pokemonBgClass = "bg_" + mainType;
    let fontColor = "color-" + mainType;

    dialog.innerHTML = getPokemonDialogTemplate(pokemon, pokemonBgClass, fontColor);
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

function outsideClick() {
    document.getElementById('pokemon-dialog').close();
}

function nextPokemon() {
    currentPokemonIndex++; // Index um 1 erhöhen

    // Wenn wir am Ende sind, springe zum Anfang (0)
    if (currentPokemonIndex >= currentPokemon.length) {
        currentPokemonIndex = 0;
    }
    updateDialog();
}

function prevPokemon() {
    currentPokemonIndex--; // Index um 1 verringern

    // Wenn wir am Anfang sind, springe zum Ende
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
    let pokemonBgClass = "bg_" + mainType;
    let fontColor = "color-" + mainType;

    // Dialog-Inhalt mit den neuen Pokémon-Daten austauschen
    dialog.innerHTML = getPokemonDialogTemplate(pokemon, pokemonBgClass, fontColor);
    getMainPokemonInformation(pokemon);
    updateButtonStyles();
}

// dialog functions (der inhalt der einzelnen cases);

function changeTab(tabName) {
    activePokemonInformation = tabName;
    renderDetailInfo();
    updateButtonStyles(); // Optionale Funktion, um den aktiven Button zu markieren
}

async function renderDetailInfo() {
    let container = document.getElementById('switch-case-section');
    let pokemon = currentPokemon[currentPokemonIndex]; // Das aktuell offene Pokémon
    let mainType = pokemon.types[0].type.name;
    let fontColor = "color-" + mainType;

    switch (activePokemonInformation) {
        case "main":
            // Hier nutzen wir deine bestehende Funktion für die "About"-Infos
            await getMainPokemonInformation(pokemon);
            break;

        case "base-stats":
            // Hier übergeben wir die echten Stats an dein Stats-Template
            container.innerHTML = getPokemonStatsTemplate(pokemon, fontColor);
            break;

        case "evo-chain":
            container.innerHTML = `<p class="${fontColor}">Evolutionskette folgt...</p>`;
            break;
    }
}

async function getMainPokemonInformation(pokemon) {
    let abilitiesList = "";
    for (let i = 0; i < pokemon.abilities.length; i++) {
        let abilityName = pokemon.abilities[i].ability.name;
        abilitiesList += abilityName + abilityName;
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

function updateButtonStyles() {
    // Entferne die aktive Klasse von allen Buttons
    document.getElementById('about-btn').classList.remove('active');
    document.getElementById('base-stats-btn').classList.remove('active');
    document.getElementById('evo-chain-btn').classList.remove('active');

    // Füge sie dem aktuell aktiven Button hinzu
    if (activePokemonInformation === 'main') {
        document.getElementById('about-btn').classList.add('active');
    } else if (activePokemonInformation === 'base-stats') {
        document.getElementById('base-stats-btn').classList.add('active');
    } else if (activePokemonInformation === 'evo-chain') {
        document.getElementById('evo-chain-btn').classList.add('active');
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
