import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 20,
  duration: '20s',
};

export default function () {
  let res = http.get('http://127.0.0.1:8000/login');

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}
