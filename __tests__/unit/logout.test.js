const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  delete window.location;
  window.location = { href: '' }; 
});

test('Logs out successfully and redirects to index.html', async () => {
  fetch.mockResponseOnce(JSON.stringify({ message: 'Logout successful' }));

  const logoutUser = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      window.location.href = '/index.html';
    }
  };

  await logoutUser();

  expect(fetch).toHaveBeenCalledWith('/api/logout', expect.anything());
  expect(window.location.href).toBe('/index.html'); 
});
