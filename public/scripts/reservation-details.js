document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('id');
  
    fetch(`/api/reservations/${reservationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (!data || data.error) {
          console.error('Error fetching reservation details:', data.error || 'No data');
          return;
        }
  
        const reservationDetails = document.getElementById('reservation-details');
        reservationDetails.innerHTML = `
          <p>ID: ${data._id}</p>
          <p>Numéro de Catway: ${data.catwayNumber}</p>
          <p>Nom du Client: ${data.clientName}</p>
          <p>Nom du Bateau: ${data.boatName}</p>
          <p>Date d'Arrivée: ${new Date(data.checkIn).toLocaleString()}</p>
          <p>Date de Départ: ${new Date(data.checkOut).toLocaleString()}</p>
        `;
      })
      .catch(error => console.error('Error fetching reservation details:', error));
  });  