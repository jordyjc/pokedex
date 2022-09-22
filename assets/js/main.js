const baseApiUrl = "https://pokeapi.co/api/v2/pokemon/";
const maxPokeNumber = 905;

var red = "rgb(255, 0, 0)";
var white = "rgb(255, 255, 255)";
let nIntervId;
let refresh = 0;
const back = document.getElementById("pokeball-center");
let myDivObjBgColor = window.getComputedStyle(back).backgroundColor;

function changeColor() {
  if (!nIntervId) {
    let myDivObjBgColor = window.getComputedStyle(back).backgroundColor;
    if (myDivObjBgColor === red) {
      console.log("rojo");
      nIntervId = setInterval(flash, 2000);
    } else {
      console.log("blanco");
      nIntervId = setInterval(flash, 30000);
    }
  }
}

function flash() {
  refresh++;
  console.log(refresh);

  const oElem = document.getElementById("pokeball-center");
  let myDivObjBgColor = window.getComputedStyle(back).backgroundColor;

  if (myDivObjBgColor === white) {
    oElem.style.background = red;
    // Remove current Pokémon
    list.querySelectorAll(":scope > *").forEach((pokemon) => pokemon.remove());

    // Fetch the Pokémon data using the API
    getPokemonData(getRandomIntInclusive(1, maxPokeNumber));
  } else {
    oElem.style.background = white;
  }
  if ((refresh = 1)) {
    console.log("paro");
    clearInterval(nIntervId);
    nIntervId = null;
    refresh = 0;
    changeColor();
  }
}

// Elements in the DOM
const formNumber = document.querySelector("#form-number");
const formRandom = document.querySelector("#form-random");
const list = document.querySelector("#cards");

formNumber.addEventListener("submit", (e) => {
  e.preventDefault();
  e.preventDefault();
  clearInterval(nIntervId);
  nIntervId = null;
  refresh = 0;
  changeColor();

  const inputNumber = e.currentTarget.elements["input-number"];

  // Sanitize and store the number that the user has entered
  const pokeNumber = parseInt(inputNumber.value);

  // Clear the input value
  inputNumber.value = "";

  // Remove current Pokémon
  list.querySelectorAll(":scope > *").forEach((pokemon) => pokemon.remove());

  // Fetch the Pokémon data using the API
  getPokemonData(pokeNumber);
});

formRandom.addEventListener("submit", (e) => {
  e.preventDefault();
  clearInterval(nIntervId);
  nIntervId = null;
  refresh = 0;
  changeColor();
  list.querySelectorAll(":scope > *").forEach((pokemon) => pokemon.remove());
  getPokemonData(getRandomIntInclusive(1, maxPokeNumber));
});

function getPokemonData(idNumber) {
  const requestURL = baseApiUrl + idNumber;

  fetch(requestURL)
    .then((response) => response.json())
    .then((pokemonData) => {
      createPokemon(pokemonData);
    })
    .catch((error) => console.log(error));
}

function capitalizarPrimeraLetra(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return "-----";
}

function createPokemon({ id, name, sprites, types, stats, abilities }) {
  type = types.map(({ type }) => {
    return type.name;
  });

  type.length <= 1
    ? (typeText = `${type[0]}`)
    : (typeText = `${type[0]} ${type[1]} `);

  ability = abilities.map(({ ability }) => {
    return ability.name;
  });

  stat = stats.map(({ base_stat }) => {
    return base_stat;
  });

  ability[0] = capitalizarPrimeraLetra(ability[0].replace("-", " "));
  ability[1] = capitalizarPrimeraLetra(ability[1]?.replace("-", " "));

  console.log(ability);

  var pokemonToShow = [
    {
      id: id,
      name: name.toUpperCase(),
      imageAddress: `${sprites["other"]["official-artwork"]["front_default"]}`,
      type: typeText,
      hp: stat[0],
      attack: stat[1],
      defense: stat[2],
      spAttack: stat[3],
      spDefense: stat[4],
      speed: stat[5],
      ability1: ability[0],
      ability2: ability[1],
    },
  ];

  console.log(pokemonToShow);

  var source = document.getElementById("card-template").innerHTML;
  var template = Handlebars.compile(source);
  var container = document.getElementById("cards");
  var html = template(pokemonToShow[0]);
  container.insertAdjacentHTML("beforeend", html);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  return randomNumber;
}
