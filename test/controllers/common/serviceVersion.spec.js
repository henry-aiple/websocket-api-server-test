/* eslint-disable max-len */
import request from 'supertest';
import app from '../../../src/app.js';
import 'should';
import qs from 'qs';

async function test() {
  describe('controllers/common/service-version', () => {
    describe('[/] get service-version', () => {
      it('iphone', (done) => {
        request(app)
          .get('/service-version')
          .query(
            qs.stringify({
              platform: 'ios',
            }),
          )
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
            res.body.should.have.property('version');
            // res.body.should.have.property('minVersion');
            // res.body.should.have.property('latestVersion');
            // res.body.platform.should.be.equal('ios');
            done();
          })
          .catch((err) => done(err));
      });

      it('android', (done) => {
        request(app)
          .get('/service-version')
          .query(
            qs.stringify({
              platform: 'android',
            }),
          )
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
            res.body.should.have.property('version');
            // res.body.should.have.property('minVersion');
            // res.body.should.have.property('latestVersion');
            // res.body.platform.should.be.equal('android');
            done();
          })
          .catch((err) => done(err));
      });

      // it('weird user-agent => linux', (done) => {
      //   request(app)
      //     .get('/service-version')
      //     .set({'User-Agent': 'curl 0.1.0'})
      //     .expect('Content-Type', /json/)
      //     .expect(400, done);
      // });

      // it('iphone - trolley', (done) => {
      //   request(app)
      //     .get('/service-version')
      //     .set({'user-agent': 'trolley/0.5.0 (com.aiple.trolley; build:109; iOS 16.0.3) Alamofire/5.6.2'})
      //     .expect('Content-Type', /json/)
      //     .expect(200)
      //     .then((res) => {
      //       console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
      //       res.body.should.have.property('minVersion');
      //       res.body.should.have.property('latestVersion');
      //       res.body.platform.should.be.equal('ios');
      //       done();
      //     })
      //     .catch((err) => done(err));
      // });
    });
  });
}

export default await test();
