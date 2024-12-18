const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  document.body.innerHTML = `
    <input type="text" id="username" />
    <input type="password" id="password" />
  `;
});

test('Login works correctly with valid credentials', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: 'Login successful' }), 
      { status: 200 }
    );
  
    const mockEvent = { preventDefault: jest.fn() };
    document.getElementById('username').value = 'testuser123';
    document.getElementById('password').value = 'password123';
  
    const loginUser = async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
  
        if (response.ok) {
          alert(result.message);
          window.location.href = '/dashboard'; 
        } else {
          alert(result.message); 
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    global.alert = jest.fn();
    delete window.location;
    window.location = { href: '' }; 
  
    await loginUser(mockEvent);
  
    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser123', password: 'password123' }),
    });
  
    expect(alert).toHaveBeenCalledWith('Login successful');
    expect(window.location.href).toBe('/dashboard'); 
  });
  

test('Login handles incorrect credentials', async () => {
  fetch.mockResponseOnce(
    JSON.stringify({ message: 'Invalid credentials' }), 
    { status: 401 }
  );

  const mockEvent = { preventDefault: jest.fn() };
  document.getElementById('username').value = 'wronguser';
  document.getElementById('password').value = 'wrongpassword';

  global.alert = jest.fn();

  const loginUser = async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        window.location.href = '/dashboard'; 
      } else {
        alert(result.message); 
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  await loginUser(mockEvent);

  expect(fetch).toHaveBeenCalledWith('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'wronguser', password: 'wrongpassword' }),
  });

  expect(alert).toHaveBeenCalledWith('Invalid credentials');
});
