import request from 'supertest';
import app from '../../../../src/app.js';
import 'should';

// import qs from 'qs';
import config from '../../../../src/tools/config.js';

async function test() {
  describe('Internal Slack-Notif', () => {
    describe('Slack-Notif', () => {
      it('[/] send slack-notif', function(done) {
        request(app)
          .post('/v1/internal/slack-notif')
          .send({
            appName: 'tiktok-research',
            eventName: 'test-internal-event',
            data: {
              email: 'henry@aiple.co',
              tiktokAccountId: '@monodaily',
              keywords: ['travel', 'fashion', ''],
              countryCode: 'US',
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
    });
  });
}

export default await test();
