let BASE_URL = "https://pokeapi.co/api/v2/";

let allPokemon = [];
let currentPokemon = [];

async function fetchPokemon(id) {
    let response = await fetch(`${BASE_URL}pokemon/${id}`);
    let pokeResponse = await response.json();
    console.log(pokeResponse);
    
}

fetchPokemon(1);

