// k6/scenarios/all-controllers-test.js
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = 'http://127.0.0.1:8000';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.01'],
  },
  stages: [
    { duration: '30s', target: 5 },
    { duration: '3m', target: 10 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  group('01_Categories', () => {
    check(http.get(BASE_URL + '/categories'), { 'GET /categories': r => r.status === 200 });
    check(http.get(BASE_URL + '/categories/create'), { 'GET /categories/create': r => r.status === 200 });
    sleep(0.3);
  });

  group('02_Products', () => {
    check(http.get(BASE_URL + '/products'), { 'GET /products': r => r.status === 200 });
    check(http.get(BASE_URL + '/products/create'), { 'GET /products/create': r => r.status === 200 });
    sleep(0.3);
  });

  group('03_Clients', () => {
    check(http.get(BASE_URL + '/clients'), { 'GET /clients': r => r.status === 200 });
    check(http.get(BASE_URL + '/clients/create'), { 'GET /clients/create': r => r.status === 200 });
    sleep(0.3);
  });

  group('04_Providers', () => {
    check(http.get(BASE_URL + '/providers'), { 'GET /providers': r => r.status === 200 });
    check(http.get(BASE_URL + '/providers/create'), { 'GET /providers/create': r => r.status === 200 });
    sleep(0.3);
  });

  group('05_Buys', () => {
    check(http.get(BASE_URL + '/buys'), { 'GET /buys': r => r.status === 200 });
    check(http.get(BASE_URL + '/buys/create'), { 'GET /buys/create': r => r.status === 200 });
    sleep(0.3);
  });

  group('06_Users_Roles', () => {
    check(http.get(BASE_URL + '/users'), { 'GET /users': r => r.status === 200 });
    check(http.get(BASE_URL + '/roles'), { 'GET /roles': r => r.status === 200 });
    sleep(0.3);
  });

  group('07_Reports', () => {
    check(http.get(BASE_URL + '/reports/sales'), { 'GET /reports/sales': r => r.status === 200 });
    check(http.get(BASE_URL + '/reports/stock/products'), { 'GET /reports/stock': r => r.status === 200 });
    check(http.get(BASE_URL + '/reports/stock/products/excel'), { 'GET /reports/excel': r => r.status === 200 });
    check(http.get(BASE_URL + '/reports/stock/products/pdf'), { 'GET /reports/pdf': r => r.status === 200 });
    sleep(0.3);
  });

  group('08_Profile_Dashboard', () => {
    check(http.get(BASE_URL + '/profile'), { 'GET /profile': r => r.status === 200 });
    check(http.get(BASE_URL + '/dashboard'), { 'GET /dashboard': r => r.status === 200 });
    sleep(0.3);
  });

  group('09_API', () => {
    check(http.get(BASE_URL + '/api/categories'), { 'GET /api/categories': r => r.status === 200 });
    check(http.get(BASE_URL + '/api/reports/stockProducts'), { 'GET /api/stock': r => r.status === 200 });
    check(http.get(BASE_URL + '/api/reports/clients'), { 'GET /api/clients': r => r.status === 200 });
    sleep(0.3);
  });

  console.log('VU ' + __VU + ': OK');
}

export function handleSummary(data) {
  console.log('=============================================');
  console.log('Requests: ' + data.metrics.http_reqs.values.count);
  console.log('Failed: ' + (data.metrics.http_req_failed.values.rate * 100).toFixed(2) + '%');
  console.log('Avg: ' + data.metrics.http_req_duration.values.avg.toFixed(2) + 'ms');
  console.log('Controllers: Category, Product, Client, Provider, Buy, User, Role, Reports, Profile, Dashboard, API');
  console.log('=============================================');

  return {
    'results/summary.json': JSON.stringify(data, null, 2),
    'results/report.html': htmlReport(data, { title: 'Ventas Web - Performance Test' }),
  };
}
