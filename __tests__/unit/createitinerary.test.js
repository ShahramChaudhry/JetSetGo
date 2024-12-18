const { JSDOM } = require('jsdom');

let destinations = [];
const countryCodes = [{ name: 'USA', code: 'US' }, { name: 'Canada', code: 'CA' }];

function renderDestinations() {
  const container = document.getElementById('destinationsContainer');
  container.innerHTML = ''; 
  destinations.forEach((dest, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${dest.city}, ${dest.country} <span data-index="${index}">×</span>`;
    container.appendChild(div);
  });
}

function addDestination() {
  const input = document.getElementById('destinationInput');
  const destination = input.value.trim();
  if (!destination) return;

  const [city, countryName] = destination.split(', ');
  const country = countryCodes.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
  if (country) {
    destinations.push({ city, country: country.code });
    renderDestinations();
  }
}

beforeEach(() => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <body></body>
    </html>
  `);
  global.document = dom.window.document;
  global.window = dom.window;
  destinations = []; 

  const input = document.createElement('input');
  input.id = 'destinationInput';
  document.body.appendChild(input);

  const container = document.createElement('div');
  container.id = 'destinationsContainer';
  document.body.appendChild(container);

});

test('Adds a destination and renders it correctly', () => {
  const input = document.getElementById('destinationInput');
  input.value = 'New York, USA';
  addDestination();
  expect(destinations).toHaveLength(1);
  expect(destinations[0]).toEqual({ city: 'New York', country: 'US' });
  const container = document.getElementById('destinationsContainer');
  expect(container.innerHTML).toContain('New York, US');
});

