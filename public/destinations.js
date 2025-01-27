document.addEventListener('DOMContentLoaded', () => {
    const destinationList = document.getElementById('destinationList');
    const visaFreeCountries = JSON.parse(sessionStorage.getItem('visaFreeCountries')) || [];
    const departure = JSON.parse(sessionStorage.getItem('departure')) || {};
    const dates = JSON.parse(sessionStorage.getItem('dates')) || {};
  
    if (visaFreeCountries.length === 0) {
      destinationList.innerHTML = '<li>No destinations found.</li>';
      return;
    }
  
    visaFreeCountries.forEach((country) => {
      const listItem = document.createElement('li');
      listItem.className = 'bg-white shadow-md rounded px-6 py-4';
  
      listItem.innerHTML = `
        <h2 class="text-lg font-bold">${country['To']}</h2>
        <p>Country Code: ${country['To Code']}</p>
        <p>Visa Category: ${country['Visa Category']}</p>
      `;
  
      destinationList.appendChild(listItem);
    });
  });