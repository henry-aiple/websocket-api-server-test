import request from 'supertest';
import app from '../../../../src/app.js';
import 'should';

// import qs from 'qs';
import config from '../../../../src/tools/config.js';
import {DATA_CACHE_TYPE} from '../../../../src/constants/dataCache.js';

async function test() {
  describe('Internal Cache', () => {
    describe('Cache', () => {
      it('[/] add cache', function(done) {
        request(app)
          .post('/v1/internal/cache')
          .send({
            countryCode: 'US',
            type: DATA_CACHE_TYPE.TRENDING_HASHTAGS,
            data: {
              test: 'test',
            },
          })
          .set({
            'Authorization': `Basic ${config.internal.auth}`,
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
            res.body.should.have.property('result', 'success');
            done();
          })
          .catch((err) => done(err));
      });

      it('[/] get cache', function(done) {
        request(app)
          .get('/v1/internal/cache')
          .query({
            countryCode: 'US',
            type: DATA_CACHE_TYPE.TRENDING_CONTENTS,
          })
          .set({
            'Authorization': `Basic ${config.internal.auth}`,
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
            res.body.should.have.property('result', 'success');
            done();
          })
          .catch((err) => done(err));
      });

      it('[/] get cache', function(done) {
        request(app)
          .post('/v1/internal/cache')
          .send({
            countryCode: 'US',
            type: DATA_CACHE_TYPE.TRENDING_HASHTAGS,
            data: [
              {
                test1: 'test1',
              },
              {
                test: 'test2',
              },
            ],
          })
          .set({
            'Authorization': `Basic ${config.internal.auth}`,
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then(() => request(app)
            .get('/v1/internal/cache')
            .query({
              countryCode: 'US',
              type: DATA_CACHE_TYPE.TRENDING_HASHTAGS,
            })
            .set({
              'Authorization': `Basic ${config.internal.auth}`,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
              res.body.should.have.property('result', 'success');
              done();
            })
            .catch((err) => done(err)),
          )
          .catch((err) => done(err));
      });

      it('[/] get country codes to create data cache', function(done) {
        request(app)
          .post('/v1/research')
          .send({
            email: 'henry@aiple.co',
            tiktokAccountId: '@monodaily',
            keywords: ['travel', 'fashion', ''],
            countryCode: 'US',
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then(() => request(app)
            .get('/v1/internal/cache/country-code-to-create-data-cache')
            .set({
              'Authorization': `Basic ${config.internal.auth}`,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              console.log(`Response => ${JSON.stringify(res.body, null, 2)}`);
              res.body.should.have.property('result', 'success');
              done();
            })
            .catch((err) => done(err)),
          )
          .catch((err) => done(err));
      });
    });
  });
}

export default await test();
