const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/';
}

document.getElementById('logout-button').addEventListener('click', () => {
  logout();
});

async function loadUsers() {
  try {
    const response = await fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error('Failed to load users');
      return;
    }

    const data = await response.json();
    const list = document.getElementById('users-list');
    list.innerHTML = '';
    data.forEach(user => {
      const item = document.createElement('li');
      item.textContent = `ID: ${user._id}, Nom: ${user.name}, Email: ${user.email}`;
      list.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

loadUsers();