const assert = require('assert');
const http = require('http');
const Catway = require('../models/Catway');
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

describe('Catway API', () => {
  let token;

  before(async () => {
    await User.deleteMany({});
    await Catway.deleteMany({});

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

  it('should create a new catway', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/catways',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }, JSON.stringify({ catwayNumber: 1, type: 'long', catwayState: 'active' }));

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.catwayNumber, 1);
  });

  it('should get all catways', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/catways',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(res.body));
  });

  it('should get a catway by ID', async () => {
    const catway = await Catway.findOne({});
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/catways/${catway._id}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.catwayNumber, 1);
  });

  it('should update a catway by ID', async () => {
    const catway = await Catway.findOne({});
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/catways/${catway._id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }, JSON.stringify({ catwayState: 'inactive' }));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.catwayState, 'inactive');
  });

  it('should delete a catway by ID', async () => {
    const catway = await Catway.findOne({});
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/catways/${catway._id}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, 'Catway deleted');
  });
});