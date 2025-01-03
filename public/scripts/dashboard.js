const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/';
}

document.getElementById('logout-button').addEventListener('click', () => {
  logout();
});

// Catways
document.getElementById('catway-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const catwayNumber = document.getElementById('catwayNumber').value;
  const type = document.getElementById('type').value;
  const catwayState = document.getElementById('catwayState').value;

  const response = await fetch('/api/catways', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ catwayNumber, type, catwayState })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Catway ajouté avec succès !');
    loadCatways();
  } else {
    alert(data.error);
  }
});

document.getElementById('modify-catway-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('modifyCatwayId').value;
  const newCatwayState = document.getElementById('newCatwayState').value;

  const response = await fetch(`/api/catways/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ catwayState: newCatwayState })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Catway modifié avec succès !');
    loadCatways();
  } else {
    alert(data.error);
  }
});

document.getElementById('delete-catway-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('deleteCatwayId').value;

  const response = await fetch(`/api/catways/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    alert('Catway supprimé avec succès !');
    loadCatways();
  } else {
    const data = await response.json();
    alert(data.error);
  }
});

async function loadCatways() {
  const response = await fetch('/api/catways', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  const list = document.getElementById('catways-list');
  list.innerHTML = '';
  data.forEach(catway => {
    const item = document.createElement('li');
    item.textContent = `ID: ${catway._id}, Numéro: ${catway.catwayNumber}, Type: ${catway.type}, État: ${catway.catwayState}`;
    list.appendChild(item);
  });
}

// User
async function loadUser() {
  const response = await fetch('/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.ok) {
    const user = await response.json();
    document.getElementById('user-name').textContent = user.name;
  } else {
    console.error('Failed to load user data');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

// Reservations
document.getElementById('reservation-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const catwayNumber = document.getElementById('reservationCatwayNumber').value;
  const clientName = document.getElementById('reservationClientName').value;
  const boatName = document.getElementById('reservationBoatName').value;
  const checkIn = document.getElementById('reservationCheckIn').value;
  const checkOut = document.getElementById('reservationCheckOut').value;

  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ catwayNumber, clientName, boatName, checkIn, checkOut })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Réservation ajoutée avec succès !');
      loadReservations(); // Recharger la liste des réservations
    } else {
      alert(data.error || 'Une erreur est survenue lors de l\'ajout de la réservation.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réservation:', error);
    alert('Erreur lors de l\'ajout de la réservation. Vérifiez la console pour plus de détails.');
  }
});

document.getElementById('delete-reservation-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('deleteReservationId').value;

  try {
    const response = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert('Réservation supprimée avec succès !');
      loadReservations(); // Recharger la liste des réservations
    } else {
      const data = await response.json();
      alert(data.error || 'Une erreur est survenue lors de la suppression de la réservation.');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    alert('Erreur lors de la suppression de la réservation. Vérifiez la console pour plus de détails.');
  }
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
      item.textContent = `ID: ${reservation._id}, Catway: ${reservation.catwayNumber}, Client: ${reservation.clientName}, Boat: ${reservation.boatName}, Check-In: ${new Date(reservation.checkIn).toLocaleString()}, Check-Out: ${new Date(reservation.checkOut).toLocaleString()}`;
      list.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading reservations:', error);
  }
}

document.getElementById('create-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPassword').value;

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Utilisateur créé avec succès !');
    } else {
      alert(data.error || 'Une erreur est survenue lors de la création de l\'utilisateur.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    alert('Erreur lors de la création de l\'utilisateur. Vérifiez la console pour plus de détails.');
  }
});

document.getElementById('modify-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userId = document.getElementById('modifyUserId').value;
  const newUsername = document.getElementById('newUsername').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newUsername, password: newPassword })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Utilisateur modifié avec succès !');
    } else {
      alert(data.error || 'Une erreur est survenue lors de la modification de l\'utilisateur.');
    }
  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    alert('Erreur lors de la modification de l\'utilisateur. Vérifiez la console pour plus de détails.');
  }
});

document.getElementById('delete-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userId = document.getElementById('deleteUserId').value;

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      alert('Utilisateur supprimé avec succès !');
    } else {
      alert(data.error || 'Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    alert('Erreur lors de la suppression de l\'utilisateur. Vérifiez la console pour plus de détails.');
  }
});


loadCatways();
loadReservations();
loadUser();