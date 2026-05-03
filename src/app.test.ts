import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { Application } from './app';

describe('App', () => {
  const application = new Application();
  const app = application.build();

  it('should return Hello, World!', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello, World!');
  });
});
