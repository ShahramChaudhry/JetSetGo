const { JSDOM } = require('jsdom');
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

beforeEach(() => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <body>
    </body>
    </html>
  `);
  global.document = dom.window.document;
  global.window = dom.window;
  const container = document.createElement('div');
  container.id = 'itineraries-container';
  document.body.appendChild(container);
  fetch.resetMocks();
});

test('Fetches itineraries and renders them', async () => {
  fetch.mockResponseOnce(
    JSON.stringify([
      { _id: '1', title: 'Trip to USA', start_date: '2023-12-01', end_date: '2023-12-15', destinations: [] },
    ])
  );

  const container = document.getElementById('itineraries-container');
  const loadItineraries = async () => {
    const response = await fetch('/api/itineraries');
    const itineraries = await response.json();
    container.innerHTML = itineraries
      .map((itinerary) => `<div>${itinerary.title}</div>`)
      .join('');
  };
  await loadItineraries();
  expect(container.innerHTML).toContain('Trip to USA');
  expect(fetch).toHaveBeenCalledWith('/api/itineraries'); 
});
