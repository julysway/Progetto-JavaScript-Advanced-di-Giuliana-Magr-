import "../css/style.css";
import "../css/media-query.css";
import "../img/home1.jpg";
import axios from "axios";

const searchButton = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const resultsDiv = document.getElementById("results");


searchButton.addEventListener("click", () => performSearch());


//parametri ricerca
async function performSearch() {
    const cityName = cityInput.value.trim();

    if (cityName.length === 0) {
        displayError(`Please, enter a city name.`);
        return;
    }

    try {
        const data = await fetchCityData(cityName);
        displayResults(data);
        cityInput.value = "";
    } catch (error) {
        console.error(error);
        displayError(`City not found.`);
    }
}

//chiamata API
async function fetchCityData(cityName) {
 try {
    const response = await axios.get(`https://api.teleport.org/api/cities/?search=${cityName}`);
    const data = response.data;

    if (data.count === 0) {
        throw new Error("City not found.");
    }
    //dati città
    const cityId = data._embedded["city:search-results"][0]._links["city:item"].href;
    const cityResponse = await axios.get(cityId);
    const cityData = cityResponse.data;
    //punteggio città
    const urbanAreaId = cityData._links["city:urban_area"].href;
    const urbanAreaScoresResponse = await axios.get(`${urbanAreaId}scores/`);
    const urbanAreaScoresData = urbanAreaScoresResponse.data;
    //img città
    const urbanAreaSlug = cityData._links["city:urban_area"].href.split("/").slice(-2)[0];
    const urbanAreaImagesResponse = await axios.get(`https://api.teleport.org/api/urban_areas/${urbanAreaSlug}/images/`);
    const urbanAreaImagesData = urbanAreaImagesResponse.data;

    //ritorno dei dati
    return {
        teleport_cityName: data._embedded["city:search-results"][0].matching_full_name,
        teleport_city_score: urbanAreaScoresData.teleport_city_score,
        summary: urbanAreaScoresData.summary,
        categories: urbanAreaScoresData.categories,
        imageUrl: urbanAreaImagesData.photos[0].image.web
    };
 }catch(error) {
    throw new Error("error during api call");
 }
}

async function displayResults(data) {
    const homeImage = document.getElementById("home-img");
    homeImage.src = data.imageUrl;

    
    const resultsDiv = document.getElementById("results");
    const cityImage = document.createElement("img");
    cityImage.src = data.imageUrl;
    cityImage.style.width = "100%";
    cityImage.style.height = "auto";


    // risultati HTML
    resultsDiv.innerHTML = `
        <h1>${data.teleport_cityName}</h1>
        <h3>Teleport City Score</h3>
        <h2>${data.teleport_city_score.toFixed(2)}</h2>
        <p>${data.summary}</p>
        `;
}
  
function displayError(message) {
    resultsDiv.innerHTML = `<p class="error">${message}</p>`;
}

























