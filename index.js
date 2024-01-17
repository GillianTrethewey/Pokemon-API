const imageCardImage = document.querySelector(".image-card__image");

class PokemonAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://pokeapi.co/api/v2/pokemon/";
    this.pokemonArray = [];
  }

  async getPokemons() {
    let getUrl = this.baseUrl + "?limit=665&offset=0" + this.apiKey;
    try {
      const response = await axios.get(getUrl);
      this.pokemonArray = response.data.results;
      return this.pokemonArray;
    } catch (error) {
      console.log("failed to return pokemon data: ", error);
    }
  }

  async getPokemonDetails(url) {
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data;
    } catch (error) {
      console.log("failed to return pokemon details: ", error);
    }
  }
}

const api = new PokemonAPI("1ffe5090-cde0-4bfe-9061-ea3e60a2bb42");
let hasPikachuLoaded = false;

const gameLogic = async () => {
  const pokemonReveal = document.querySelector(".pokemon__reveal");
  pokemonReveal.innerText = "Make Your Guess!";

  const pokemonData = await api.getPokemons();

  let pokemonIndex = hasPikachuLoaded ? getRandomInt(0, 665) : 23;
  hasPikachuLoaded = true;
  let pokemonName = pokemonData[pokemonIndex].name;

  let pokemonDetails = await api.getPokemonDetails(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`
  );

  let pokemonAbilities = [];
  let pokemonAbilityString = "";

  pokemonDetails.abilities.forEach((ability) => {
    pokemonAbilities.push(ability.ability.name);
  });

  pokemonAbilities.forEach((ability) => {
    pokemonAbilityString += `${ability}, `;
  });

  pokemonAbilityString = pokemonAbilityString.replace(/,\s*$/, "");

  let pokemonImage = pokemonDetails.sprites.front_default;

  imageCardImage.src = pokemonImage;
  const statsCardWeight = document.querySelector(".stats-card__weight");
  statsCardWeight.innerText = pokemonDetails.weight;

  const statsCardHeight = document.querySelector(".stats-card__height");
  statsCardHeight.innerText = pokemonDetails.height;

  const statsCardAbility = document.querySelector(".stats-card__ability");
  statsCardAbility.innerText = pokemonAbilityString;

  const guessForm = document.querySelector(".guess__form");
  guessForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = e.target[0].value;
    if (
      userInput.trim().toLowerCase() ===
      pokemonDetails.name.trim().toLowerCase()
    ) {
      pokemonReveal.innerText = `You guessed right! It was ${pokemonDetails.name}!`;
    } else {
      pokemonReveal.innerText = `You guessed wrong! It was ${pokemonDetails.name}!`;
    }
    setTimeout(() => {
      e.target[0].value = "";
      gameLogic();
    }, 3000);
  });
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

gameLogic();
