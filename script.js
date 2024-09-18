const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("searchInput");
let i = 0;
let allPokemon = [];
let currentPokemonIndex = 0;

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const fetchPokemon = async (i) => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${i}`;
  const response = await fetch(url);
  const data = await response.json();
  const promises = data.results.map((result) =>
    fetch(result.url).then((res) => res.json())
  );
  const pokemon = await Promise.all(promises);
  allPokemon = [...allPokemon, ...pokemon];
  displayPokemon(pokemon);
};

const displayPokemon = (pokemon) => {
  const pokemonHTMLString = pokemon
    .map((pokeman) => {
      const types = pokeman.types.map((typeInfo) => typeInfo.type.name);
      const backgroundColor = typeColors[pokeman.types[0].type.name];

      return `
      <div class="pokemon" style="background-color: ${backgroundColor}" onclick="openPopup(${
        pokeman.id
      })">
        <img src="${
          pokeman.sprites.other["official-artwork"].front_default
        }" alt="${pokeman.name}">
        <h2>${pokeman.name.charAt(0).toUpperCase() + pokeman.name.slice(1)}</h2>
        <div>
          ${types
            .map(
              (type) =>
                `<span class="type">${
                  type.charAt(0).toUpperCase() + type.slice(1)
                }</span>`
            )
            .join("")}
        </div>
        <p>#${pokeman.id.toString().padStart(3, "0")}</p>
      </div>
    `;
    })
    .join("");
  pokedex.innerHTML += pokemonHTMLString;
};

const getMorePokemon = () => {
  i += 20;
  fetchPokemon(i);
};

let statsChart;

const openPopup = async (id) => {
  currentPokemonIndex = allPokemon.findIndex((pokeman) => pokeman.id === id);
  updatePopup(currentPokemonIndex);
  document.getElementById("overlay").style.display = "flex";
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    renderChart();
  }, 300);
};

const renderChart = () => {
  const ctx = document.getElementById("popup-stats-chart").getContext("2d");
  if (statsChart) {
    statsChart.destroy();
  }
  statsChart = new Chart(ctx, chartConfig);
};

const updatePopup = (index) => {
  const pokeman = allPokemon[index];
  const types = pokeman.types.map((typeInfo) => typeInfo.type.name).join(", ");

  const popupImage = document.querySelector("#overlay img");
  const popupName = document.getElementById("popup-name");
  const popupId = document.getElementById("popup-id");
  const popupTypes = document.getElementById("popup-types");
  const popupHp = document.getElementById("popup-hp");
  const popupAttack = document.getElementById("popup-attack");
  const popupDefense = document.getElementById("popup-defense");

  if (popupImage)
    popupImage.src = pokeman.sprites.other["official-artwork"].front_default;
  if (popupName)
    popupName.innerText =
      pokeman.name.charAt(0).toUpperCase() + pokeman.name.slice(1);
  if (popupId) popupId.innerText = `#${pokeman.id.toString().padStart(3, "0")}`;
  if (popupTypes) popupTypes.innerText = `Type: ${types}`;
  if (popupHp)
    popupHp.innerText = `HP: ${
      pokeman.stats.find((stat) => stat.stat.name === "hp").base_stat
    }`;

  const hp = pokeman.stats.find((stat) => stat.stat.name === "hp").base_stat;
  const attack = pokeman.stats.find(
    (stat) => stat.stat.name === "attack"
  ).base_stat;
  const defense = pokeman.stats.find(
    (stat) => stat.stat.name === "defense"
  ).base_stat;
  const speed = pokeman.stats.find(
    (stat) => stat.stat.name === "speed"
  ).base_stat;
  const specialAttack = pokeman.stats.find(
    (stat) => stat.stat.name === "special-attack"
  ).base_stat;
  const specialDefense = pokeman.stats.find(
    (stat) => stat.stat.name === "special-defense"
  ).base_stat;

  chartConfig.data.datasets[0].data = [
    hp,
    attack,
    defense,
    speed,
    specialAttack,
    specialDefense,
  ];

  
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (index === 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
  }

  if (index === allPokemon.length - 1) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "block";
  }
};

const chartConfig = {
  type: "bar",
  data: {
    labels: [
      "HP",
      "Attack",
      "Defense",
      "Speed",
      "Special Attack",
      "Special Defense",
    ],
    datasets: [
      {
        label: "Stats",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

document.getElementById("overlay").addEventListener("click", (e) => {
  if (e.target.id === "overlay") {
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = "auto";
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    updatePopup(currentPokemonIndex);
    renderChart();
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentPokemonIndex < allPokemon.length - 1) {
    currentPokemonIndex++;
    updatePopup(currentPokemonIndex);
    renderChart();
  }
});

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  pokedex.innerHTML = "";

  if (query.length >= 3) {
    const filteredPokemon = allPokemon
      .filter((pokemon) => pokemon.name.toLowerCase().includes(query))
      .slice(0, 10);
    displayPokemon(filteredPokemon);
  } else {
    displayPokemon(allPokemon.slice(0, 20));
  }
});

fetchPokemon(i);
