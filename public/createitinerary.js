let destinations = [];
let countryCodes = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/countrycode.json'); 
    const data = await response.json();
    countryCodes = data.countries; 
  } catch (error) {
    console.error('Error loading country codes:', error);
    alert('Failed to load country codes. Please refresh the page.');
  }
});
class Destination {
  constructor(city, country) {
    this.city = city;
    this.country = country;
  }
}

function addDestination() {
  const input = document.getElementById('destinationInput');
  const destination = input.value.trim();

  if (destination) {
    const [city, countryName] = destination.split(', ');

    if (!city || !countryName) {
      alert("Please enter the destination in 'City, Country' format.");
      return;
    }

    const country = countryCodes.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) {
      alert('Country not found. Please check the spelling or try again.');
      return;
    }

    const newDestination = new Destination(city, country.code);
    destinations.push(newDestination);
    renderDestinations();
    input.value = ''; 
  } else {
    alert('Please enter a destination.');
  }
}
function renderDestinations() {
  const container = document.getElementById('destinationsContainer');
  container.innerHTML = destinations
    .map(
      (dest, index) => `
      <div class="destination-tag">
        ${dest.city}, ${dest.country}
        <span onclick="removeDestination(${index})">×</span>
      </div>
    `
    )
    .join('');
}

function removeDestination(index) {
  destinations.splice(index, 1);
  renderDestinations();
}

document.getElementById('itineraryForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  if (destinations.length === 0) {
    alert('Please add at least one destination.');
    return;
  }

  try {
    const response = await fetch('/api/itineraries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        destinations,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Itinerary saved successfully!');
      window.location.href = '/dashboard'; 
    } else {
      alert(result.message || 'Failed to save itinerary');
    }
  } catch (error) {
    console.error('Error saving itinerary:', error);
    alert('An error occurred while saving the itinerary. Please try again.');
  }
});
