
// let airports = [];
// let departures = [];
// let userNationality = null;

// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     // Fetch airport data
//     const response = await fetch('/cleaned_airports.json');
//     airports = await response.json();
//   } catch (error) {
//     console.error('Error loading airport data:', error);
//     alert('Failed to load airport data. Please refresh the page.');
//   }

//   // Fetch user's nationality
//   try {
//     const profileResponse = await fetch('/api/profile', { credentials: 'include' });
//     if (!profileResponse.ok) {
//       throw new Error('Failed to fetch profile data');
//     }
//     const userData = await profileResponse.json();
//     userNationality = userData.nationality;
//   } catch (error) {
//     console.error('Error fetching nationality:', error);
//     alert('Failed to fetch user nationality. Please log in again.');
//     return;
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
//         dropdown.classList.remove('hidden');
//         filteredAirports.forEach((airport) => {
//           const listItem = document.createElement('li');
//           listItem.className = 'dropdown-item';
//           listItem.innerHTML = `<strong>${airport.airport_name}</strong> (${airport.iata_code})<br>
//                                 <span class="dropdown-subtext">${airport.city}, ${airport.country}</span>`;
//           listItem.dataset.value = JSON.stringify({
//             city: airport.city,
//             country: airport.country,
//             iata_code: airport.iata_code,
//           });

//           listItem.addEventListener('click', () => {
//             inputField.value = `${airport.airport_name} (${airport.iata_code})`;
//             inputField.dataset.selected = listItem.dataset.value;
//             dropdown.classList.add('hidden'); // Hide dropdown after selection
//           });

//           dropdown.appendChild(listItem);
//         });
//       }
//     }
//   });

//   // Hide dropdown when clicking outside
//   document.addEventListener('click', (event) => {
//     if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
//       dropdown.classList.add('hidden');
//     }
//   });
// });

// // Handle form submission
// document.getElementById('itineraryForm').addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const startDate = document.getElementById('startDate').value;
//   const endDate = document.getElementById('endDate').value;
//   const inputField = document.getElementById('departureInput');
//   const selectedDeparture = inputField.dataset.selected;

//   if (!startDate || !endDate) {
//     alert('Please select both start and end dates.');
//     return;
//   }

//   if (!selectedDeparture) {
//     alert('Please select a valid departure location from the dropdown.');
//     return;
//   }

//   if (!userNationality) {
//     alert('Failed to retrieve user nationality. Please log in again.');
//     return;
//   }

//   try {
//     const departureData = JSON.parse(selectedDeparture);
//     departures.push(departureData);

//     const visaDataResponse = await fetch('/visa_data.json');
//     const visaData = await visaDataResponse.json();

//     const visaFreeAndOnArrivalCountries = visaData.filter(
//       (country) =>
//         country['From Code'] === userNationality &&
//         (country['Visa Category'] === 'Visa-Free' || country['Visa Category'] === 'Visa-On-Arrival')
//     );

//     sessionStorage.setItem('visaFreeCountries', JSON.stringify(visaFreeAndOnArrivalCountries));
//     sessionStorage.setItem('departure', JSON.stringify(departureData));
//     sessionStorage.setItem('dates', JSON.stringify({ startDate, endDate }));

//     window.location.href = '/destinations.html';
//   } catch (error) {
//     console.error('Error processing destinations:', error);
//     alert('An error occurred. Please try again.');
//   }
// });

let airports = [];
let departures = [];
let userNationality = null;

// ✅ Function to format date from MM-DD-YYYY → YYYY-MM-DD
function formatDateToYYYYMMDD(dateString) {
    const [year, month, day] = new Date(dateString).toISOString().split("T")[0].split("-");
    return `${year}-${month}-${day}`;
}

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
        dropdown.classList.remove('hidden');
        filteredAirports.forEach((airport) => {
          const listItem = document.createElement('li');
          listItem.className = 'dropdown-item';
          listItem.innerHTML = `<strong>${airport.airport_name}</strong> (${airport.iata_code})<br>
                                <span class="dropdown-subtext">${airport.city}, ${airport.country}</span>`;
          listItem.dataset.value = JSON.stringify({
            city: airport.city,
            country: airport.country,
            iata_code: airport.iata_code,
          });

          listItem.addEventListener('click', () => {
            inputField.value = `${airport.airport_name} (${airport.iata_code})`;
            inputField.dataset.selected = listItem.dataset.value;
            dropdown.classList.add('hidden'); // Hide dropdown after selection
          });

          dropdown.appendChild(listItem);
        });
      }
    }
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.add('hidden');
    }
  });
});

// ✅ Handle form submission and format departure date
document.getElementById('itineraryForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  let startDate = document.getElementById('startDate').value;
  let endDate = document.getElementById('endDate').value;
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
    // ✅ Convert dates to YYYY-MM-DD format
    startDate = formatDateToYYYYMMDD(startDate);
    endDate = formatDateToYYYYMMDD(endDate);

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