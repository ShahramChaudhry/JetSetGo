document.addEventListener('DOMContentLoaded', () => {
    const destinationList = document.getElementById('destinationList');
    const visaFreeCountries = JSON.parse(sessionStorage.getItem('visaFreeCountries')) || [];
  
    if (visaFreeCountries.length === 0) {
      destinationList.innerHTML = '<li class="col-span-full text-center text-gray-500">No destinations found.</li>';
      return;
    }
  
    visaFreeCountries.forEach((country) => {
      const listItem = document.createElement('li');
      listItem.className = 'bg-white shadow-md rounded-lg p-6 border border-gray-200';
  
      listItem.innerHTML = `
        <h2 class="text-lg font-bold text-gray-700">${country['To']}</h2>
        <p class="text-gray-600">Country Code: <span class="font-medium">${country['To Code']}</span></p>
        <p class="text-gray-600">Visa Category: <span class="font-medium">${country['Visa Category']}</span></p>
      `;
  
      destinationList.appendChild(listItem);
    });
  });


// async function getAccessToken() {
//   const clientId = "YA9jSWjsZjrkfj5fog0nAPANZ00BYF8w";  
//   const clientSecret = "tu4D6l7tx2mB54ZU";  

//   const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
//   });

//   const data = await response.json();
//   return data.access_token;
// }



// // ✅ Fetch Cheapest Destinations Using Flight Inspiration Search API
// async function getCheapestDestinations(departureCity, departureDate) {
//   const token = await getAccessToken();
//   const url = `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${departureCity}&departureDate=${departureDate}&oneWay=false&nonStop=false&viewBy=COUNTRY`;

//   console.log(`🔍 Sending API Request: ${url}`); // ✅ Log API request before sending

//   try {
//       const response = await fetch(url, {
//           method: "GET",
//           headers: { "Authorization": `Bearer ${token}` }
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//           console.warn(`⚠️ API Request Failed: ${url}`);
//           console.warn(`❌ Status: ${response.status}, Response:`, responseData);

//           // ✅ If "ORIGIN AND DESTINATION NOT SUPPORTED", log & skip it
//           if (responseData.errors?.some(err => err.code === "141")) {
//               console.warn(`⛔ Skipping unsupported route from ${departureCity}`);
//               return [];
//           }

//           return [];
//       }

//       return responseData.data || [];
//   } catch (error) {
//       console.error("🚨 Error fetching cheapest destinations:", error);
//       return [];
//   }
// }

// // ✅ Load airport data to map IATA codes to cities
// async function loadAirportData() {
//     try {
//         const response = await fetch('/cleaned_airports.json');
//         return await response.json();
//     } catch (error) {
//         console.error('❌ Error loading airport data:', error);
//         return [];
//     }
// }

// // ✅ Filter Cheapest Destinations Matching Visa-Free Countries & Add City Names
// async function getVisaFreeFlights(departureCity, departureDate, visaFreeCountries, airportsData) {
//   const cheapestDestinations = await getCheapestDestinations(departureCity, departureDate);

//   return cheapestDestinations
//       .filter(dest => visaFreeCountries.some(visa => visa["To Code"] === dest.destination))
//       .map(dest => {
//           const matchingAirport = airportsData.find(airport => airport.iata_code === dest.destination);

//           return {
//               destinationCity: matchingAirport ? matchingAirport.city : "Unknown City",
//               destinationCountry: matchingAirport ? matchingAirport.country : "Unknown Country",
//               price: parseFloat(dest.price.total),
//               flightLink: dest.links?.flightOffers || "#",
//               departureDate: dest.departureDate,
//               visaCategory: visaFreeCountries.find(visa => visa["To Code"] === dest.destination)?.["Visa Category"]
//           };
//       })
//       .sort((a, b) => a.price - b.price);  // ✅ Sort by cheapest first
// }

// // ✅ Load Data & Fetch Flights
// document.addEventListener("DOMContentLoaded", async () => {
//   const departure = JSON.parse(sessionStorage.getItem("departure"));
//   const visaFreeCountries = JSON.parse(sessionStorage.getItem("visaFreeCountries"));
//   const dates = JSON.parse(sessionStorage.getItem("dates"));

//   if (!departure || !visaFreeCountries || !dates) {
//       alert("Missing necessary details. Please go back and enter the information.");
//       return;
//   }

//   const departureCity = departure.iata_code;
//   const startDate = dates.startDate;

//   console.log(`🌍 Departure City: ${departureCity}, Start Date: ${startDate}`);
//   console.log("📜 Visa-Free Countries List:", visaFreeCountries);

//   const resultsContainer = document.getElementById("destinationList");
//   resultsContainer.innerHTML = "<p>Loading cheapest flights...</p>";

//   // ✅ Load cleaned airports data
//   const airportsData = await loadAirportData();

//   const flights = await getVisaFreeFlights(departureCity, startDate, visaFreeCountries, airportsData);

//   resultsContainer.innerHTML = "";

//   if (flights.length === 0) {
//       resultsContainer.innerHTML = "<li class='col-span-full text-center text-gray-500'>No cheap flights found.</li>";
//       return;
//   }

//   flights.forEach((flight) => {
//       const listItem = document.createElement("li");
//       listItem.className = "bg-white shadow-md rounded-lg p-6 border border-gray-200";

//       listItem.innerHTML = `
//           <h2 class="text-lg font-bold text-gray-700">${flight.destinationCity}, ${flight.destinationCountry}</h2>
//           <p class="text-gray-600">Visa Category: <span class="font-medium">${flight.visaCategory}</span></p>
//           <p class="text-gray-600">Price: <span class="font-medium text-orange-500">$${flight.price}</span></p>
//           <p class="text-gray-600">Departure Date: <span class="font-medium">${flight.departureDate}</span></p>
//           <a href="${flight.flightLink}" target="_blank" class="book-button">Book Now</a>
//       `;

//       resultsContainer.appendChild(listItem);
//   });
// });