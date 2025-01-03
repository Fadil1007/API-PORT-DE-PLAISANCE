const assert = require('assert');
const http = require('http');
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

describe('User API', () => {
  let token;

  before(async () => {
    await User.deleteMany({});

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

  it('should get user profile', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.email, 'test@example.com');
  });

  it('should update a user by ID', async () => {
    const user = await User.findOne({});
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/users/${user._id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }, JSON.stringify({ name: 'Updated User' }));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.name, 'Updated User');
  });

  it('should delete a user by ID', async () => {
    const user = await User.findOne({});
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/users/${user._id}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, 'User deleted successfully');
  });

  it('should get all users', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(res.body));
  });
});