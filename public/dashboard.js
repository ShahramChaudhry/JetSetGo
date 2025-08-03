document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('itineraries-container');
  container.innerHTML = '<p>Loading itineraries...</p>';

  try {
    const response = await fetch('/api/itineraries', { credentials: 'include' });

    if (response.ok) {
      const itineraries = await response.json();
      console.log('Fetched itineraries:', itineraries);

      container.innerHTML = '';

      for (const itinerary of itineraries) {
        console.log('Processing itinerary:', itinerary);

        const card = document.createElement('div');
        card.className = 'itinerary-card';
        card.setAttribute('data-id', itinerary._id);

        let visaInfoHTML = '';
        if (itinerary.destinations && itinerary.destinations.length > 0) {
          for (const destination of itinerary.destinations) {
            const city = destination?.city || 'Unknown City';
            const country = destination?.country || 'Unknown Country';
            const visaInfo = destination?.visa_info;

            if (visaInfo?.error) {
              visaInfoHTML += `<p><strong>${city}, ${country}:</strong> <span style="color: red;">Error: ${visaInfo.error}</span></p>`;
            } else {
              visaInfoHTML += `<p><strong>${city}, ${country}:</strong> <span style="color: green;">${visaInfo?.category?.name || 'Visa Info Not Available'}</span></p>`;
            }
          }
        } else {
          visaInfoHTML = '<p>No visa requirements or destinations available.</p>';
        }

        card.innerHTML = `
          <h3>${itinerary.title}</h3>
          <p><strong>Start Date:</strong> ${new Date(itinerary.start_date).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${new Date(itinerary.end_date).toLocaleDateString()}</p>
          <h4>Visa Requirements:</h4>
          ${visaInfoHTML}
          <button onclick="viewItinerary('${itinerary._id}')">View</button>
          <button onclick="deleteItinerary('${itinerary._id}')">Delete</button>
        `;

        container.appendChild(card);
      }

      if (itineraries.length === 0) {
        container.innerHTML = '<p>No itineraries found. Create one to get started!</p>';
      }
    } else {
      const error = await response.text();
      console.error('Failed to fetch itineraries:', error);
      container.innerHTML = `<p>Failed to load itineraries. Error: ${error}</p>`;
    }
  } catch (error) {
    console.error('Error loading itineraries:', error);
    container.innerHTML = '<p>Error loading itineraries. Please try again later.</p>';
  }
});

async function viewItinerary(itineraryId) {
  const modal = document.getElementById('itinerary-modal');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = '<p>Loading itinerary details...</p>';
  modal.style.display = 'block';

  try {
    const response = await fetch(`/api/itineraries/${itineraryId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const itinerary = await response.json();
      console.log('Viewing itinerary:', itinerary);

      let destinationsHTML = '';
      if (itinerary.visaRequirements && itinerary.destinations) {
        for (let i = 0; i < itinerary.visaRequirements.length; i++) {
          const visaReq = itinerary.visaRequirements[i];
          const destination = itinerary.destinations[i];
          const city = destination?.city || 'Unknown City';
          const country = destination?.country || 'Unknown Country';

          const visaInfo = visaReq.visa_info;

          if (visaInfo?.error) {
            destinationsHTML += `<li>${city}, ${country} - <span style="color: red;">${visaInfo.error}</span></li>`;
          } else {
            destinationsHTML += `<li>${city}, ${country} - <span style="color: green;">${visaInfo?.category?.name || 'Visa Info Not Available'}</span></li>`;
          }
        }
      } else {
        destinationsHTML = '<p>No visa requirements or destinations available.</p>';
      }

      modalBody.innerHTML = `
        <h2>${itinerary.title}</h2>
        <p><strong>Start Date:</strong> ${new Date(itinerary.start_date).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(itinerary.end_date).toLocaleDateString()}</p>
        <div>
          <h4>Visa Requirements:</h4>
          <ul>${destinationsHTML}</ul>
        </div>
      `;
    } else {
      const error = await response.json();
      console.error('Error loading itinerary details:', error);
      modalBody.innerHTML = `<p>Error loading itinerary details: ${error.message || 'Unknown error'}</p>`;
    }
  } catch (error) {
    console.error('Error fetching itinerary details:', error);
    modalBody.innerHTML = '<p>Error loading itinerary details. Please try again later.</p>';
  }
}

function closeModal() {
  const modal = document.getElementById('itinerary-modal');
  modal.style.display = 'none';
}


async function deleteItinerary(itineraryId) {
  if (!confirm('Are you sure you want to delete this itinerary?')) return;

  try {
    const response = await fetch(`/api/itineraries/${itineraryId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      alert('Itinerary deleted successfully.');
      const card = document.querySelector(`.itinerary-card[data-id="${itineraryId}"]`);
      if (card) card.remove();
    } else {
      const error = await response.text();
      alert(`Failed to delete itinerary. Error: ${error}`);
    }
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    alert('An error occurred while deleting the itinerary. Please try again.');
  }
}


