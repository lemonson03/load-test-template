import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '10s', target: 300 },
    { duration: '1m', target: 300 },
    { duration: '20s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(99)<800'],
    http_req_failed: ['rate<0.02']
  }
};

const BASE = __ENV.TARGET_URL;

export default function () {
  http.get(`${BASE}/api/v1/products`);
  sleep(Math.random());
}
