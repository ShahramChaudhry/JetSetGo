fetch('/nationalities.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Fetched data:', data); 
    const dropdown = document.getElementById('nationalitydropdown');
    data.nationalities.forEach(nationality => {
      const option = document.createElement('option');
      option.value = nationality;
      option.textContent = nationality;
      dropdown.appendChild(option);
    });
  })
  .catch(error => console.error('Error fetching nationalities:', error));
