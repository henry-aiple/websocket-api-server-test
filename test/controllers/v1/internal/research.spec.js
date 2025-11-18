import request from 'supertest';
import app from '../../../../src/app.js';
import 'should';

// import qs from 'qs';
import config from '../../../../src/tools/config.js';

import {fileURLToPath} from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
import {readFileSync} from 'fs';
const {researchOutputs} = JSON.parse(readFileSync(`${__dirname}/../../../data/research.json`));

async function test() {
  describe('Internal Research', () => {
    describe('Research', () => {
      it('[/] add research output', function(done) {
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
          .then((res) => request(app)
            .post('/v1/internal/research')
            .send({
              researchId: res.body.research.researchId,
              output: researchOutputs[0].output,
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
    });
  });
}

export default await test();
