// let departures = [];
// let airports = [];

// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     // Fetch airport data from cleaned_airports.json
//     const response = await fetch('/cleaned_airports.json');
//     airports = await response.json();
//   } catch (error) {
//     console.error('Error loading airport data:', error);
//     alert('Failed to load airport data. Please refresh the page.');
//   }

//   const inputField = document.getElementById('departureInput');
//   const dropdown = document.getElementById('departureDropdown');

//   inputField.addEventListener('input', () => {
//     const query = inputField.value.toLowerCase().trim();
//     dropdown.innerHTML = '';
//     dropdown.classList.add('hidden');

//     if (query.length > 0) {
//       const filteredAirports = airports.filter((airport) =>
//         `${airport.airport_name} (${airport.iata_code}) - ${airport.city}, ${airport.country}`
//           .toLowerCase()
//           .includes(query)
//       );

//       if (filteredAirports.length > 0) {
//         filteredAirports.forEach((airport) => {
//           const listItem = document.createElement('li');
//           listItem.className = 'px-3 py-2 hover:bg-gray-200 cursor-pointer';
//           listItem.textContent = `${airport.airport_name} (${airport.iata_code}) - ${airport.city}, ${airport.country}`;
//           listItem.dataset.value = JSON.stringify({
//             city: airport.city,
//             country: airport.country,
//             iata_code: airport.iata_code,
//           });

//           listItem.addEventListener('click', () => {
//             inputField.value = listItem.textContent;
//             inputField.dataset.selected = listItem.dataset.value;
//             dropdown.classList.add('hidden');
//           });

//           dropdown.appendChild(listItem);
//         });

//         dropdown.classList.remove('hidden');
//       }
//     }
//   });
// });

// // Handle form submission
// document.getElementById('itineraryForm').addEventListener('submit', async (event) => {
//   event.preventDefault(); // Prevent default form submission

//   const startDate = document.getElementById('startDate').value;
//   const endDate = document.getElementById('endDate').value;
//   const inputField = document.getElementById('departureInput');
//   const selectedDeparture = inputField.dataset.selected;

//   if (!startDate || !endDate) {
//     alert('Please select both start and end dates.');
//     return;
//   }

//   if (!selectedDeparture) {
//     alert('Please select a valid departure location.');
//     return;
//   }

//   try {
//     const departureData = JSON.parse(selectedDeparture);
//     departures.push(departureData);

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

let airports = [];
let departures = [];
let userNationality = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch airport data
    const response = await fetch('/cleaned_airports.json');
    airports = await response.json();
  } catch (error) {
    console.error('Error loading airport data:', error);
    alert('Failed to load airport data. Please refresh the page.');
  }

  // Fetch user's nationality
  try {
    const profileResponse = await fetch('/api/profile', { credentials: 'include' });
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const userData = await profileResponse.json();
    userNationality = userData.nationality;
  } catch (error) {
    console.error('Error fetching nationality:', error);
    alert('Failed to fetch user nationality. Please log in again.');
    return;
  }

  const inputField = document.getElementById('departureInput');
  const dropdown = document.getElementById('departureDropdown');

  // Handle input to filter airports
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
  event.preventDefault();

  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const inputField = document.getElementById('departureInput');
  const selectedDeparture = inputField.dataset.selected;

  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  if (!selectedDeparture) {
    alert('Please select a valid departure location from the dropdown.');
    return;
  }

  if (!userNationality) {
    alert('Failed to retrieve user nationality. Please log in again.');
    return;
  }

  try {
    const departureData = JSON.parse(selectedDeparture);
    departures.push(departureData);

    const visaDataResponse = await fetch('/visa_data.json');
    const visaData = await visaDataResponse.json();

    const visaFreeAndOnArrivalCountries = visaData.filter(
      (country) =>
        country['From Code'] === userNationality &&
        (country['Visa Category'] === 'Visa-Free' || country['Visa Category'] === 'Visa-On-Arrival')
    );

    sessionStorage.setItem('visaFreeCountries', JSON.stringify(visaFreeAndOnArrivalCountries));
    sessionStorage.setItem('departure', JSON.stringify(departureData));
    sessionStorage.setItem('dates', JSON.stringify({ startDate, endDate }));

    window.location.href = '/destinations.html';
  } catch (error) {
    console.error('Error processing destinations:', error);
    alert('An error occurred. Please try again.');
  }
});