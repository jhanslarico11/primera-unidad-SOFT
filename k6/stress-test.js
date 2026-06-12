import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 30 },
    { duration: '10s', target: 60 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  http.get('http://127.0.0.1:8000/login');
  sleep(1);
}
