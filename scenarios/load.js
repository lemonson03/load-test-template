import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: Number(__ENV.K6_VUS || 50),
  duration: __ENV.K6_DURATION || '2m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01']
  }
};

const BASE = __ENV.TARGET_URL;

export default function () {
  http.get(`${BASE}/api/v1/health`);
  sleep(Math.random() * 2);
}
