document.addEventListener('DOMContentLoaded', async () => {
    const usernameElement = document.getElementById('username');
    const nationalityElement = document.getElementById('nationality');
  
    try {
      const response = await fetch('/api/profile', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const userData = await response.json();
      usernameElement.textContent = userData.username || 'N/A';
      nationalityElement.textContent = userData.nationality || 'N/A';
    } catch (error) {
      console.error('Error loading profile:', error);
      usernameElement.textContent = 'Error fetching username';
      nationalityElement.textContent = 'Error fetching nationality';
    }
  });
  