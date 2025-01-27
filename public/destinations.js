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