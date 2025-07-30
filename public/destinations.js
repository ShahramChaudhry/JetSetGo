
document.addEventListener('DOMContentLoaded', async () => {
  const destinationList = document.getElementById('destinationList');

  try {
    const departure = JSON.parse(sessionStorage.getItem('departure'));
    const dates = JSON.parse(sessionStorage.getItem('dates'));
    const iata = departure?.iata_code;
    const { startDate, endDate } = dates || {};

    if (!iata || !startDate || !endDate) {
      destinationList.innerHTML = '<li class="col-span-full text-center text-red-500">Missing departure or dates. Please try again.</li>';
      return;
    }

    const res = await fetch(`/api/amadeus/destinations?origin=${iata}&startDate=${startDate}&endDate=${endDate}`);
    const amadeusData = await res.json();

    if (!amadeusData?.data || amadeusData.data.length === 0) {
      destinationList.innerHTML = '<li class="col-span-full text-center text-gray-500">No cheap destinations found.</li>';
      return;
    }

    const visaData = JSON.parse(sessionStorage.getItem('visaFreeCountries')) || [];
    const airportData = await fetch('/cleaned_airports.json').then(r => r.json());

    const iataToAirport = {};
    airportData.forEach((airport) => {
      iataToAirport[airport.iata_code] = airport;
    });

    const visaMap = {};
    visaData.forEach((entry) => {
      visaMap[entry['To']] = entry;
    });

    const validDestinations = amadeusData.data.filter((dest) => {
      const airport = iataToAirport[dest.destination];
      return airport && visaMap[airport.country];
    });

    if (validDestinations.length === 0) {
      destinationList.innerHTML = '<li class="col-span-full text-center text-gray-500">No matching visa-free destinations found with cheap flights.</li>';
      return;
    }

    validDestinations.forEach((dest) => {
      const airport = iataToAirport[dest.destination];
      const visaEntry = visaMap[airport.country];

      const listItem = document.createElement('li');
      listItem.className = 'bg-white shadow-md rounded-lg p-6 border border-gray-200';

      listItem.innerHTML = `
        <h2 class="text-lg font-bold text-gray-700">${airport.city}, ${airport.country}</h2>
        <p class="text-gray-600">Visa Type: <span class="font-medium">${visaEntry?.['Visa Category'] || 'Unknown'}</span></p>
        <p class="text-gray-600">Flight Price: <span class="font-medium">€${dest.price.total}</span></p>
        <p class="text-gray-600">Departure Date: ${dest.departureDate}</p>
        <p class="text-gray-600">Return Date: ${dest.returnDate || 'N/A'}</p>
        <a href="/booking.html?origin=${iata}&destination=${dest.destination}&departureDate=${dest.departureDate}" 
          class="text-blue-600 underline mt-2 inline-block">
          View Flight Options
        </a>
      `;

      destinationList.appendChild(listItem);
    });
  } catch (err) {
    console.error('❌ Error loading destinations:', err);
    destinationList.innerHTML = '<li class="col-span-full text-center text-red-500">An error occurred while loading destinations.</li>';
  }
});