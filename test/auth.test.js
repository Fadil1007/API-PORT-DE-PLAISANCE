// tests/auth.test.js

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

describe('Auth API', function() {
  this.timeout(10000); // Augmente le délai d'attente à 10 secondes

  before(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }, JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password' }));

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.email, 'test@example.com');
  });

  it('should login an existing user', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }, JSON.stringify({ email: 'test@example.com', password: 'password' }));

    assert.strictEqual(res.status, 200);
    assert(res.body.token);
  });
});
