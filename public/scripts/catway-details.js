const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/';
}

document.getElementById('logout-button').addEventListener('click', () => {
  logout();
});

function getCatwayIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

async function loadCatwayDetails() {
  const catwayId = getCatwayIdFromUrl();
  if (!catwayId) {
    console.error('Catway ID not found in URL');
    return;
  }

  try {
    const response = await fetch(`/api/catways/${catwayId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error('Failed to load catway details');
      return;
    }

    const catway = await response.json();
    const detailsDiv = document.getElementById('catway-details');
    detailsDiv.innerHTML = `
      <p>ID: ${catway._id}</p>
      <p>Numéro de Catway: ${catway.catwayNumber}</p>
      <p>Type: ${catway.type}</p>
      <p>État: ${catway.catwayState}</p>
    `;
  } catch (error) {
    console.error('Error loading catway details:', error);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

// Load catway details when the page loads
loadCatwayDetails();