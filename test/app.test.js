var request = require('supertest');
var server = require('../app');

describe('GET /', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /posts', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/posts')
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
