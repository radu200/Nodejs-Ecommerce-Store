var request = require('supertest');
var server = require('../app');

describe('GET /', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /products', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/products')
      .expect(200, done);
  });
});

describe('GET /admin', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/admin')
      .expect(200, done);
  });
});
