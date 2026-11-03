import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = (__ENV.BASE_URL || 'https://load-test-500.metho-lite.pages.dev').replace(/\/$/, '');

export const options = {
  stages: [
    { duration: '45s', target: 100 },
    { duration: '45s', target: 250 },
    { duration: '60s', target: 500 },
    { duration: '60s', target: 600 },
    { duration: '90s', target: 600 },
    { duration: '45s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<10000'],
    checks: ['rate>0.98'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export default function () {
  const home = http.get(`${BASE_URL}/`, { tags: { endpoint: 'homepage' } });
  check(home, {
    'homepage HTTP 200': (r) => r.status === 200,
    'homepage HTML': (r) => String(r.headers['Content-Type'] || '').includes('text/html'),
  });

  const path = (__ITER + __VU) % 2 === 0 ? '/api/config' : '/api/products';
  const api = http.get(`${BASE_URL}${path}`, { tags: { endpoint: path.slice(5) } });
  check(api, {
    'public API HTTP 200': (r) => r.status === 200,
    'public API returns JSON': (r) => String(r.headers['Content-Type'] || '').includes('application/json'),
  });

  // Keep a realistic pause between storefront visits; this is a read-only test.
  sleep(5);
}
