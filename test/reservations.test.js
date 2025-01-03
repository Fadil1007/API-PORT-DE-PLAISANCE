const assert = require('assert');
const http = require('http');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

function httpRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

describe('Reservation API', () => {
  let token;

  before(async () => {
    await User.deleteMany({});
    await Reservation.deleteMany({});

    // Créer un utilisateur et obtenir le token pour les tests
    await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }, JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password' }));

    const loginRes = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }, JSON.stringify({ email: 'test@example.com', password: 'password' }));

    token = loginRes.body.token;
  });

  it('should create a new reservation', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/reservations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }, JSON.stringify({
      catwayNumber: 1,
      clientName: 'John Doe',
      boatName: 'Sea Breeze',
      checkIn: '2023-06-01T00:00:00Z',
      checkOut: '2023-06-10T00:00:00Z',
    }));

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.clientName, 'John Doe');
  });

  it('should get all reservations', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/reservations',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(res.body));
  });

  it('should get a reservation by ID', async () => {
    const reservation = await Reservation.findOne({});
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/reservations/${reservation._id}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.clientName, 'John Doe');
  });

  it('should delete a reservation by ID', async () => {
    const reservation = await Reservation.findOne({});
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/reservations/${reservation._id}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 204);
  });
});