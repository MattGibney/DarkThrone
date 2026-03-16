import request from 'supertest';
import makeApplication from './helpers/makeApplication';

describe('GET_healthcheck', () => {
  it('returns the deployed release tag when it is configured', async () => {
    const { application } = makeApplication({
      config: {
        releaseTag: 'v1.2.3',
      },
    });

    const response = await request(application).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'OK',
      releaseTag: 'v1.2.3',
    });
  });

  it('returns a null release tag when the deployment tag is not set', async () => {
    const { application } = makeApplication({
      config: {
        releaseTag: null,
      },
    });

    const response = await request(application).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'OK',
      releaseTag: null,
    });
  });
});
