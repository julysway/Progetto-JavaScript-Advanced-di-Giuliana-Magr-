import axios from 'axios';

// Funzione per effettuare una chiamata alle API e visualizzare i risultati
async function searchCity() {
  const cityName = document.getElementById('city-input').value;
  const resultsDiv = document.getElementById('results');

  // Effettua la chiamata alle API utilizzando Axios
  try {
    const response = await axios.get(`https://api.teleport.org/api/cities/?search=${cityName}`);
    const data = response.data;

    // Visualizza i risultati nell'HTML
    if (data._embedded && data._embedded['city:search-results']) {
      const cityData = data._embedded['city:search-results'][0];
      resultsDiv.innerHTML = `
        <h1>${cityData.matching_full_name}</h1>
        <h2>Population: ${cityData.matching_alternate_names[0].population}</h2>
        <h3>Country: ${cityData.matching_alternate_names[0].country}</h3>
        <p>Description: ${cityData.matching_full_name}</p>
      `;
    } else {
      resultsDiv.innerHTML = `<p>No results found for ${cityName}</p>`;
    }
  } catch (error) {
    console.error('Error fetching data from the API:', error);
    resultsDiv.innerHTML = `<p>An error occurred while fetching data.</p>`;
  }
}

// Aggiungi un gestore di eventi per il pulsante "Search"
const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', searchCity);


























