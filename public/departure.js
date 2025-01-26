


// let departures = [];

// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     // Fetch airport data from cleaned_airports.json
//     const response = await fetch('/cleaned_airports.json');
//     const airportData = await response.json();

//     // Populate the dropdown with airport data
//     populateAirportDropdown(airportData);
//   } catch (error) {
//     console.error('Error loading airport data:', error);
//     alert('Failed to load airport data. Please refresh the page.');
//   }
// });

// // Function to populate the dropdown
// function populateAirportDropdown(airports) {
//   const dropdown = document.getElementById('departureSelect');
//   airports.forEach((airport) => {
//     const option = document.createElement('option');
//     option.value = JSON.stringify({
//       city: airport.city,
//       country: airport.country,
//       iata_code: airport.iata_code,
//     });
//     option.textContent = `${airport.airport_name} (${airport.iata_code}) - ${airport.city}, ${airport.country}`;
//     dropdown.appendChild(option);
//   });
// }

// // Handle form submission
// document.getElementById('itineraryForm').addEventListener('submit', async (event) => {
//   event.preventDefault(); // Prevent default form submission

//   const startDate = document.getElementById('startDate').value;
//   const endDate = document.getElementById('endDate').value;
//   const departureSelect = document.getElementById('departureSelect');
//   const selectedDeparture = departureSelect.value;

//   if (!startDate || !endDate) {
//     alert('Please select both start and end dates.');
//     return;
//   }

//   if (!selectedDeparture) {
//     alert('Please select a departure location.');
//     return;
//   }

//   try {
//     // Parse the selected departure
//     const departureData = JSON.parse(selectedDeparture);
//     departures.push(departureData);

//     // Save the itinerary with the selected departure
//     const response = await fetch('/api/itineraries', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include', // Include cookies for authentication
//       body: JSON.stringify({
//         start_date: startDate,
//         end_date: endDate,
//         departures,
//       }),
//     });

//     const result = await response.json();

//     if (response.ok) {
//       alert('Itinerary saved successfully!');
//       window.location.href = '/dashboard.html'; // Redirect to the dashboard
//     } else {
//       alert(result.message || 'Failed to save itinerary');
//     }
//   } catch (error) {
//     console.error('Error saving itinerary:', error);
//     alert('An error occurred while saving the itinerary. Please try again.');
//   }
// });

let departures = [];
let airports = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch airport data from cleaned_airports.json
    const response = await fetch('/cleaned_airports.json');
    airports = await response.json();
  } catch (error) {
    console.error('Error loading airport data:', error);
    alert('Failed to load airport data. Please refresh the page.');
  }

  const inputField = document.getElementById('departureInput');
  const dropdown = document.getElementById('departureDropdown');

  inputField.addEventListener('input', () => {
    const query = inputField.value.toLowerCase().trim();
    dropdown.innerHTML = '';
    dropdown.classList.add('hidden');

    if (query.length > 0) {
      const filteredAirports = airports.filter((airport) =>
        `${airport.airport_name} (${airport.iata_code}) - ${airport.city}, ${airport.country}`
          .toLowerCase()
          .includes(query)
      );

      if (filteredAirports.length > 0) {
        filteredAirports.forEach((airport) => {
          const listItem = document.createElement('li');
          listItem.className = 'px-3 py-2 hover:bg-gray-200 cursor-pointer';
          listItem.textContent = `${airport.airport_name} (${airport.iata_code}) - ${airport.city}, ${airport.country}`;
          listItem.dataset.value = JSON.stringify({
            city: airport.city,
            country: airport.country,
            iata_code: airport.iata_code,
          });

          listItem.addEventListener('click', () => {
            inputField.value = listItem.textContent;
            inputField.dataset.selected = listItem.dataset.value;
            dropdown.classList.add('hidden');
          });

          dropdown.appendChild(listItem);
        });

        dropdown.classList.remove('hidden');
      }
    }
  });
});

// Handle form submission
document.getElementById('itineraryForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const inputField = document.getElementById('departureInput');
  const selectedDeparture = inputField.dataset.selected;

  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  if (!selectedDeparture) {
    alert('Please select a valid departure location.');
    return;
  }

  try {
    const departureData = JSON.parse(selectedDeparture);
    departures.push(departureData);

    const response = await fetch('/api/itineraries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        departures,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Itinerary saved successfully!');
      window.location.href = '/dashboard.html'; // Redirect to the dashboard
    } else {
      alert(result.message || 'Failed to save itinerary');
    }
  } catch (error) {
    console.error('Error saving itinerary:', error);
    alert('An error occurred while saving the itinerary. Please try again.');
  }
});