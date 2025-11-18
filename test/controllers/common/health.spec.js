import request from 'supertest';
import app from '../../../src/app.js';
import 'should';

async function test() {
  describe('controllers/common/health', () => {
    describe('[/health] health check', () => {
      it('backend healthCheck', (done) => {
        request(app)
          .get('/health')
          .expect(200)
          .then((res) => {
            console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
            res.body.should.have.property('result', 'success');
            done();
          })
          .catch((err) => done(err));
      });
    });
  });
}

export default await test();
