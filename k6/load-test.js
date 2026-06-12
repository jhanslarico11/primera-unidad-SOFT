import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  duration: '5s',
};

export default function () {
  let res = http.get('http://127.0.0.1:8000/login');

  check(res, {
    'status es 200': (r) => r.status === 200,
  });
}
