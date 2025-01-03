const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/';
}

document.getElementById('logout-button').addEventListener('click', () => {
  logout();
});

async function loadReservations() {
  try {
    const response = await fetch('/api/reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error('Failed to load reservations');
      return;
    }

    const data = await response.json();
    const list = document.getElementById('reservations-list');
    list.innerHTML = '';
    data.forEach(reservation => {
      const item = document.createElement('li');
      item.textContent = `ID: ${reservation._id}, Catway: ${reservation.catwayNumber}`;
      list.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading reservations:', error);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

loadReservations();
