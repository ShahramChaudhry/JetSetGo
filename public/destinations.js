
// === destinations.js ===
document.addEventListener('DOMContentLoaded', async () => {
  const destinationList = document.getElementById('destinationList');
  const spinner = document.getElementById('loadingSpinner');
  let destinationItems = [];

  try {
    const departure = JSON.parse(sessionStorage.getItem('departure'));
    const dates = JSON.parse(sessionStorage.getItem('dates'));
    const visaData = JSON.parse(sessionStorage.getItem('visaFreeCountries')) || [];

    const iata = departure?.iata_code;
    const { startDate, endDate } = dates || {};

    if (!iata || !startDate || !endDate) {
      spinner.innerHTML = '<p class="text-red-500">Missing departure or dates. Please try again.</p>';
      return;
    }

    const rawRes = await fetch(`/api/amadeus/destinations?origin=${iata}&startDate=${startDate}&endDate=${endDate}`);
    console.log('[Amadeus Destinations Response]', rawRes.status);
    const amadeusData = await rawRes.json();
    console.log('[Amadeus Data]', amadeusData);
    const airportData = await fetch('/cleaned_airports.json').then(r => r.json());

    const iataToAirport = {};
    airportData.forEach(airport => {
      iataToAirport[airport.iata_code] = airport;
    });

    const visaMap = {};
    visaData.forEach(entry => {
      visaMap[entry['To']] = entry;
    });

    const validDestinations = amadeusData.data.filter(dest => {
      const airport = iataToAirport[dest.destination];
      return airport && visaMap[airport.country];
    });

    const seen = new Set();
    const uniqueDestinations = [];
    for (const dest of validDestinations) {
      const airport = iataToAirport[dest.destination];
      const key = `${airport.city}-${airport.country}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueDestinations.push(dest);
      }
    }

    for (let dest of uniqueDestinations) {
      const airport = iataToAirport[dest.destination];
      const visaEntry = visaMap[airport.country];
      let confirmedPrice = parseFloat(dest.price.total);

      try {
        const offersRes = await fetch(`/api/amadeus/offers?origin=${iata}&destination=${dest.destination}&departureDate=${startDate}`);
        const offersData = await offersRes.json();
        const cheapestOffer = offersData?.data?.[0];

        if (cheapestOffer) {
          const confirmRes = await fetch('/api/amadeus/price', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flightOffer: cheapestOffer })
          });
          const confirmedData = await confirmRes.json();
          const newPrice = confirmedData?.data?.flightOffers?.[0]?.price?.total;
          confirmedPrice = newPrice ? parseFloat(newPrice) : confirmedPrice;
        }
      } catch (err) {
        console.warn('❌ Price confirmation failed', err);
      }

      const itinerary = {
        city: airport.city,
        country: airport.country,
        visaType: visaEntry?.['Visa Category'] || 'Unknown',
        confirmedPrice,
        departureDate: dest.departureDate,
        returnDate: dest.returnDate || 'N/A',
        skyscannerLink: `https://www.skyscanner.com/transport/flights/${iata.toLowerCase()}/${dest.destination.toLowerCase()}/${dest.departureDate.replaceAll('-', '')}/`
      };

      const listItem = document.createElement('li');
      listItem.className = 'bg-white shadow-md rounded-xl p-5 border border-gray-200 transition hover:shadow-lg hover:border-orange-300';
      listItem.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-lg font-bold text-gray-700">${itinerary.city}, ${itinerary.country}</h2>
            <p class="text-gray-600">Visa Type: <span class="font-medium">${itinerary.visaType}</span></p>
            <p class="text-gray-600">Confirmed Flight Price: <span class="font-medium">€${itinerary.confirmedPrice.toFixed(2)}</span></p>
            <p class="text-gray-600">Departure Date: ${itinerary.departureDate}</p>
            <p class="text-gray-600">Return Date: ${itinerary.returnDate}</p>
            <a href="${itinerary.skyscannerLink}" target="_blank" class="text-orange-600 font-semibold underline mt-2 inline-block hover:text-orange-800 transition">
              Compare on Skyscanner
            </a>
          </div>
          <button class="save-itinerary ml-4 text-orange-500 hover:text-orange-700 text-2xl">&#x1F5A4;</button>
        </div>
      `;

      listItem.querySelector('.save-itinerary').addEventListener('click', async () => {
        try {
          const response = await fetch('/api/itineraries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title: `${itinerary.city}, ${itinerary.country}`,
              start_date: itinerary.departureDate,
              end_date: itinerary.returnDate,
              destinations: [{
                city: itinerary.city,
                country: itinerary.country,
                visa_info: { category: { name: itinerary.visaType } }
              }]
            })
          });
      
          if (response.ok) {
            alert(`Saved ${itinerary.city}, ${itinerary.country} to your itineraries!`);
          } else {
            const error = await response.text();
            alert(`Failed to save itinerary. Error: ${error}`);
          }
        } catch (err) {
          console.error('❌ Error saving itinerary:', err);
          alert('An error occurred while saving. Please try again.');
        }
      });

      destinationItems.push({ el: listItem, price: confirmedPrice });
    }

    destinationItems.sort((a, b) => a.price - b.price);
    destinationItems.forEach(({ el }) => destinationList.appendChild(el));
  } catch (err) {
    console.error('❌ Error loading destinations:', err);
    spinner.innerHTML = '<p class="text-red-500">An error occurred while loading destinations.</p>';
  } finally {
    spinner.classList.add('hidden');
    destinationList.classList.remove('hidden');
  }
});