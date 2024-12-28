async function logoutUser(event) {
    event.preventDefault(); 
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      if (response.ok) {
        window.location.href = '/index.html'; 
      } else {
        alert("Logout failed: " + result.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred during logout.');
    }
  }
  