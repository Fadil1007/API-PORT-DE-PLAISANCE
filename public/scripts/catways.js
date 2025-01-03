const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/';
}

document.getElementById('logout-button').addEventListener('click', () => {
  logout();
});

async function loadCatways() {
  try {
    const response = await fetch('/api/catways', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error('Failed to load catways');
      return;
    }

    const data = await response.json();
    const list = document.getElementById('catways-list');
    list.innerHTML = '';
    data.forEach(catway => {
      const item = document.createElement('li');
      item.textContent = `ID: ${catway._id}, Numéro: ${catway.catwayNumber}`;
      list.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading catways:', error);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

// Load catways when the page loads
loadCatways();